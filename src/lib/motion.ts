/**
 * Primitivas de motion — "El trazo que se completa".
 *
 * Principios: solo transform/opacity (y stroke-dashoffset en SVG); nada se oculta sin JavaScript;
 * con prefers-reduced-motion se muestran los estados finales; las animaciones ocurren una sola vez.
 * Todo estado "pendiente" (reveal-pending, chain--pending, dasharray/dashoffset) lo añade JS solo a
 * elementos fuera del viewport inicial (o antes del primer pintado) y termina siempre en el estado
 * final que ya renderiza el servidor. Ver docs/10-motion.md.
 *
 * Uso:
 *   import { initMotion } from '@/lib/motion';  initMotion();
 *   <section data-reveal> … </section>                → entrada de los hijos directos al hacerse visible
 *   <ul data-reveal data-reveal-stagger> … </ul>       → entrada escalonada (60 ms por hijo)
 *   <span data-count="1280" data-count-duration="1000">1280</span> → count-up al hacerse visible
 *   <div data-chain> <line data-chain-line/> … <span data-chain-node/> … </div>
 *       → la línea se dibuja al entrar en el viewport y los nodos se encienden en orden
 *   <svg data-trace-draw="load|view" data-trace-media="(min-width: 64em)"> <path data-trace-path/> … </svg>
 *       → trazos que se dibujan al cargar (load) o al entrar en el viewport (view)
 */

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/* ------------------------------------------------------------------ */
/* Easings                                                             */
/* ------------------------------------------------------------------ */

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Curva cubic-bezier(x1, y1, x2, y2) equivalente a la de CSS (Newton-Raphson + bisección). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const sample = (a1: number, a2: number, t: number) => ((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t * t + 3 * a1 * t;
  const slope = (a1: number, a2: number, t: number) => 3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1;
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const s = slope(x1, x2, t);
      if (s === 0) break;
      t -= (sample(x1, x2, t) - x) / s;
    }
    if (t < 0 || t > 1 || Math.abs(sample(x1, x2, t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24 && hi - lo > 1e-5; i++) {
        t = (lo + hi) / 2;
        if (sample(x1, x2, t) < x) lo = t;
        else hi = t;
      }
    }
    return t;
  };
  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sample(y1, y2, solve(x)));
}

/** Mismo easing que el token CSS `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`. */
export const easeStandard = cubicBezier(0.2, 0, 0, 1);

/* ------------------------------------------------------------------ */
/* Utilidades internas                                                 */
/* ------------------------------------------------------------------ */

const noop = (): void => {};

function qa<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function viewportBottom(): number {
  return window.innerHeight || document.documentElement.clientHeight;
}

/**
 * ¿Se ha pintado ya la página? Antes del primer pintado se puede preparar y animar de inmediato un
 * elemento visible sin parpadeo (el usuario nunca vio el estado final). Sin Paint Timing API se asume
 * que sí se pintó (opción segura: no se toca lo que ya se ve).
 */
function hasPainted(): boolean {
  if (typeof PerformanceObserver === 'undefined' || !PerformanceObserver.supportedEntryTypes?.includes('paint')) return true;
  return performance.getEntriesByType('paint').length > 0;
}

/** Si el IntersectionObserver no ha disparado nada en este tiempo, se muestra todo lo pendiente. */
const OBSERVER_FALLBACK_MS = 1500;
/**
 * Margen superior enorme: un elemento que el scroll dejó por encima del viewport sin llegar a
 * intersectar (salto al final de la página, Fin, enlace a un ancla) cuenta como visto y se muestra
 * sin animar. Así un scroll rápido nunca deja huecos.
 */
const ROOT_MARGIN = '100000px 0px -8% 0px';

interface ViewportWatcher {
  observe(el: Element): void;
  disconnect(): void;
}

/**
 * Observa elementos situados por debajo del viewport: `enter` cuando entran en pantalla (animar),
 * `skip` cuando ya quedaron por encima sin verse o cuando el observador no dispara (mostrar sin animar).
 */
function watchViewport(handlers: { enter: (el: Element) => void; skip: (el: Element) => void }, threshold: number): ViewportWatcher {
  const pending = new Set<Element>();
  let fired = false;
  const observer = new IntersectionObserver(
    (entries) => {
      fired = true;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        observer.unobserve(el);
        pending.delete(el);
        if (entry.boundingClientRect.bottom <= 0) handlers.skip(el);
        else handlers.enter(el);
      }
    },
    { rootMargin: ROOT_MARGIN, threshold },
  );
  const timer = window.setTimeout(() => {
    if (fired) return;
    observer.disconnect();
    pending.forEach((el) => handlers.skip(el));
    pending.clear();
  }, OBSERVER_FALLBACK_MS);
  return {
    observe(el) {
      pending.add(el);
      observer.observe(el);
    },
    disconnect() {
      window.clearTimeout(timer);
      observer.disconnect();
      pending.clear();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Revelado de secciones                                               */
/* ------------------------------------------------------------------ */

const REVEAL_PENDING = 'reveal-pending';
const REVEAL_VISIBLE = 'is-visible';
const REVEAL_ANIMATING = 'is-animating';
/** Duración (400 ms) + escalonado máximo (420 ms) + margen: tras esto se retira `is-animating` (y su will-change). */
const REVEAL_SETTLE_MS = 1000;

/**
 * Marca como pendientes solo los elementos que están fuera del viewport inicial (nunca se oculta
 * lo que ya se ve: sin impacto en LCP ni parpadeos) y los revela al intersectar. La clase
 * `reveal-pending` oculta los hijos directos, no el contenedor (los fondos de sección siguen
 * pintados). `is-animating` activa la transición y `will-change` solo mientras dura la entrada.
 */
export function observeReveal(root: ParentNode = document, selector = '[data-reveal]'): () => void {
  const elements = qa<HTMLElement>(root, selector);
  if (elements.length === 0) return noop;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add(REVEAL_VISIBLE));
    return noop;
  }

  const timers = new Set<number>();
  const show = (el: HTMLElement, animate: boolean) => {
    if (!el.classList.contains(REVEAL_PENDING)) return;
    el.classList.remove(REVEAL_PENDING);
    el.classList.add(REVEAL_VISIBLE);
    if (!animate) return;
    const delay = Number(el.dataset.revealDelay ?? 0);
    if (delay > 0) el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.classList.add(REVEAL_ANIMATING);
    const timer = window.setTimeout(() => {
      el.classList.remove(REVEAL_ANIMATING);
      timers.delete(timer);
    }, REVEAL_SETTLE_MS + (delay > 0 ? delay : 0));
    timers.add(timer);
  };

  const watcher = watchViewport({ enter: (el) => show(el as HTMLElement, true), skip: (el) => show(el as HTMLElement, false) }, 0.1);

  // Primero todas las lecturas de layout y después las escrituras (sin thrashing).
  const bottom = viewportBottom();
  const below = elements.map((el) => el.getBoundingClientRect().top > bottom);
  let pendingCount = 0;
  elements.forEach((el, i) => {
    if (below[i]) {
      el.classList.add(REVEAL_PENDING);
      watcher.observe(el);
      pendingCount += 1;
    } else {
      el.classList.add(REVEAL_VISIBLE);
    }
  });
  if (pendingCount === 0) {
    watcher.disconnect();
    return noop;
  }
  return () => {
    watcher.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
    elements.forEach((el) => {
      show(el, false);
      el.classList.remove(REVEAL_ANIMATING);
    });
  };
}

/* ------------------------------------------------------------------ */
/* Count-up                                                            */
/* ------------------------------------------------------------------ */

export interface CountUpOptions {
  from?: number;
  to: number;
  /** ≤ 1200 ms por concepto de motion. */
  duration?: number;
  format?: (value: number) => string;
  easing?: (t: number) => number;
}

export function countUp(el: HTMLElement, opts: CountUpOptions): Promise<void> {
  const { from = 0, to, duration = 1000, format = (v) => String(Math.round(v)), easing = easeOutCubic } = opts;
  if (prefersReducedMotion() || duration <= 0) {
    el.textContent = format(to);
    return Promise.resolve();
  }
  const clamped = Math.min(duration, 1200);
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / clamped);
      el.textContent = format(from + (to - from) * easing(t));
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

/** Activa el count-up de todos los `[data-count]` cuando se hacen visibles (una sola vez). */
export function observeCountUp(root: ParentNode = document, selector = '[data-count]'): () => void {
  const elements = qa<HTMLElement>(root, selector);
  if (elements.length === 0) return noop;
  const locale = document.documentElement.lang || 'es';
  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    if (!Number.isFinite(to)) return;
    const decimals = Number(el.dataset.countDecimals ?? 0);
    const duration = Number(el.dataset.countDuration ?? 1000);
    const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    void countUp(el, { to, duration, format: (v) => fmt.format(v) });
  };
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    return noop;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );
  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

/* ------------------------------------------------------------------ */
/* Trazo progresivo en SVG                                             */
/* ------------------------------------------------------------------ */

/**
 * Longitud del trazo en el espacio en que el navegador aplica los guiones. Con
 * `vector-effect: non-scaling-stroke` los guiones se miden en píxeles de pantalla (comprobado en
 * Chromium), así que se muestrea el trazo transformado por la CTM; en el resto de casos vale la
 * longitud en unidades de usuario. `data-length` (p. ej. "1" junto a `pathLength="1"`) tiene prioridad.
 */
export function strokeLength(path: SVGGeometryElement): number {
  const declared = Number(path.dataset.length);
  if (Number.isFinite(declared) && declared > 0) return declared;
  const total = path.getTotalLength();
  if (total === 0 || getComputedStyle(path).getPropertyValue('vector-effect') !== 'non-scaling-stroke') return total;
  const ctm = path.getScreenCTM();
  if (!ctm) return total;
  const samples = 48;
  let length = 0;
  let prev = path.getPointAtLength(0).matrixTransform(ctm);
  for (let i = 1; i <= samples; i++) {
    const point = path.getPointAtLength((total * i) / samples).matrixTransform(ctm);
    length += Math.hypot(point.x - prev.x, point.y - prev.y);
    prev = point;
  }
  // Ligero sobreestimado: las esquinas entre muestras acortan la poligonal; un guion algo más largo
  // que el trazo es inocuo (lo cubre entero) y uno más corto dejaría la cola sin pintar.
  return length * 1.03;
}

/** Oculta el trazo (dasharray/dashoffset = longitud) y devuelve la longitud usada. */
export function prepareStroke(path: SVGGeometryElement, length?: number): number {
  const total = length ?? path.getTotalLength();
  path.style.strokeDasharray = `${total}`;
  path.style.strokeDashoffset = `${total}`;
  return total;
}

/** Fija el progreso (0–1) de un trazo preparado con prepareStroke. */
export function setStrokeProgress(path: SVGGeometryElement, progress: number, length?: number): void {
  const total = length ?? path.getTotalLength();
  const p = Math.max(0, Math.min(1, progress));
  path.style.strokeDashoffset = `${total * (1 - p)}`;
}

/** Retira los estilos de guion: el trazo vuelve exactamente al estado renderizado en servidor. */
export function clearStroke(path: SVGGeometryElement): void {
  path.style.removeProperty('stroke-dasharray');
  path.style.removeProperty('stroke-dashoffset');
}

export interface StrokeAnimation {
  /** Promesa que se resuelve al terminar (o inmediatamente con reduced motion). */
  done: Promise<void>;
  cancel: () => void;
}

export interface StrokeAnimationOptions {
  from?: number;
  to?: number;
  duration?: number;
  /** Espera antes de empezar (el trazo se mantiene en `from`). */
  delay?: number;
  easing?: (t: number) => number;
  length?: number;
  /** Progreso (0–1) en cada fotograma; permite sincronizar otros elementos (p. ej. encender nodos). */
  onProgress?: (progress: number) => void;
}

/** Anima el trazo de `from` a `to` (0–1) en `duration` ms usando requestAnimationFrame. */
export function animateStroke(path: SVGGeometryElement, opts: StrokeAnimationOptions = {}): StrokeAnimation {
  const { from = 0, to = 1, duration = 700, delay = 0, easing = easeInOutCubic, onProgress } = opts;
  const length = opts.length ?? prepareStroke(path);
  if (prefersReducedMotion() || duration <= 0) {
    setStrokeProgress(path, to, length);
    onProgress?.(to);
    return { done: Promise.resolve(), cancel: noop };
  }
  let raf = 0;
  let cancelled = false;
  const done = new Promise<void>((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      if (cancelled) return resolve();
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      const progress = from + (to - from) * easing(t);
      setStrokeProgress(path, progress, length);
      onProgress?.(progress);
      if (t < 1) raf = requestAnimationFrame(frame);
      else resolve();
    };
    raf = requestAnimationFrame(frame);
  });
  return {
    done,
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Trazos que se completan en las páginas corporativas                 */
/* ------------------------------------------------------------------ */

/** Línea de la cadena (700–1100 ms). */
const CHAIN_DURATION = 900;
/** Tras completar la línea se espera a que termine la transición de opacidad del último nodo (250 ms) antes de retirar el estado. */
const CHAIN_SETTLE_MS = 300;
/** Acento de circuito: 720 ms + 20 ms de escalonado por trazo (9 trazos → 880 ms ≤ 900 ms). */
const TRACE_DURATION = 720;
const TRACE_STAGGER = 20;
const CHAIN_PENDING = 'chain--pending';
const NODE_LIT = 'is-lit';
const DRAWING = 'is-drawing';

type TraceHost = HTMLElement | SVGElement;

interface TraceGroup {
  el: TraceHost;
  kind: 'chain' | 'trace';
  mode: 'load' | 'view';
  paths: SVGGeometryElement[];
  lengths: number[];
  nodes: TraceHost[];
  animations: StrokeAnimation[];
  finished: boolean;
}

function isGeometry(el: Element): el is SVGGeometryElement {
  return typeof (el as SVGGeometryElement).getTotalLength === 'function';
}

/**
 * Inicializa los trazos que se dibujan:
 *  - `[data-chain]` (ChainDiagram): la línea `[data-chain-line]` se dibuja al entrar en el viewport y
 *    los nodos `[data-chain-node]` se encienden en orden (clase `is-lit`) cuando la cabeza del trazo
 *    pasa por su posición. Durante la animación el contenedor lleva `chain--pending`.
 *  - `[data-trace-draw="load"|"view"]` (CircuitAccent): sus `[data-trace-path]` se dibujan al cargar
 *    (si están en pantalla) o al entrar en el viewport; `data-trace-media` limita por media query.
 *
 * Sin JavaScript, con reduced motion o sin IntersectionObserver no se toca nada: el HTML ya muestra
 * los trazos completos. Los guiones solo se preparan si el elemento está fuera del viewport inicial
 * (o si la página aún no se ha pintado), y al terminar se retiran: el estado final es el del servidor.
 * Los trazos de la isla del recorrido (`[data-trace]`) no se tocan: los gobierna su propio módulo.
 */
export function observeTraceLines(root: ParentNode = document): () => void {
  const groups: TraceGroup[] = [];
  for (const el of qa<TraceHost>(root, '[data-chain]')) {
    const paths = qa<Element>(el, '[data-chain-line]').filter(isGeometry);
    if (paths.length === 0) continue;
    groups.push({ el, kind: 'chain', mode: 'view', paths, lengths: [], nodes: qa<TraceHost>(el, '[data-chain-node]'), animations: [], finished: false });
  }
  for (const el of qa<TraceHost>(root, '[data-trace-draw]')) {
    const media = el.dataset.traceMedia;
    if (media && !window.matchMedia(media).matches) continue;
    const paths = qa<Element>(el, '[data-trace-path]').filter(isGeometry);
    if (paths.length === 0) continue;
    groups.push({ el, kind: 'trace', mode: el.dataset.traceDraw === 'load' ? 'load' : 'view', paths, lengths: [], nodes: [], animations: [], finished: false });
  }
  if (groups.length === 0 || prefersReducedMotion() || !('IntersectionObserver' in window)) return noop;

  const byEl = new Map<Element, TraceGroup>(groups.map((g) => [g.el, g]));
  const timers = new Set<number>();

  const finish = (g: TraceGroup) => {
    if (g.finished) return;
    g.finished = true;
    g.animations.forEach((a) => a.cancel());
    g.animations = [];
    g.paths.forEach(clearStroke);
    g.nodes.forEach((n) => n.classList.remove(NODE_LIT));
    g.el.classList.remove(CHAIN_PENDING, DRAWING);
  };

  const prepare = (g: TraceGroup) => {
    g.lengths = g.paths.map(strokeLength);
    g.paths.forEach((path, i) => prepareStroke(path, g.lengths[i]));
    if (g.kind === 'chain') g.el.classList.add(CHAIN_PENDING);
  };

  const drawChain = (g: TraceGroup) => {
    // Posición (0–1) de cada nodo a lo largo de la línea visible, medida una sola vez antes de animar.
    const box = (g.paths[0]?.ownerSVGElement ?? g.el).getBoundingClientRect();
    const horizontal = box.width >= box.height;
    const stops = g.nodes.map((node) => {
      const r = node.getBoundingClientRect();
      const p = horizontal ? (r.left + r.width / 2 - box.left) / (box.width || 1) : (r.top + r.height / 2 - box.top) / (box.height || 1);
      return Math.max(0, Math.min(1, p));
    });
    let lit = 0;
    const light = (progress: number) => {
      while (lit < g.nodes.length && progress >= (stops[lit] ?? 1) - 0.001) {
        g.nodes[lit]?.classList.add(NODE_LIT);
        lit += 1;
      }
    };
    g.el.classList.add(DRAWING);
    g.animations = g.paths.map((path, i) =>
      animateStroke(path, { duration: CHAIN_DURATION, easing: easeStandard, length: g.lengths[i], onProgress: i === 0 ? light : undefined }),
    );
    void Promise.all(g.animations.map((a) => a.done)).then(() => {
      light(1);
      // El estado "pendiente + todos encendidos" es visualmente el estado final: se retira cuando
      // termina la transición del último nodo para que no haya salto de color.
      const timer = window.setTimeout(() => finish(g), CHAIN_SETTLE_MS);
      timers.add(timer);
    });
  };

  const drawTrace = (g: TraceGroup) => {
    g.el.classList.add(DRAWING);
    g.animations = g.paths.map((path, i) => animateStroke(path, { duration: TRACE_DURATION, delay: i * TRACE_STAGGER, easing: easeOutCubic, length: g.lengths[i] }));
    void Promise.all(g.animations.map((a) => a.done)).then(() => finish(g));
  };

  const draw = (g: TraceGroup) => {
    if (g.finished) return;
    if (g.kind === 'chain') drawChain(g);
    else drawTrace(g);
  };

  const watcher = watchViewport(
    {
      enter: (el) => {
        const g = byEl.get(el);
        if (g) draw(g);
      },
      skip: (el) => {
        const g = byEl.get(el);
        if (g) finish(g);
      },
    },
    0.15,
  );

  // Lecturas de layout primero; después preparación (escrituras).
  const bottom = viewportBottom();
  const rects = groups.map((g) => g.el.getBoundingClientRect());
  const painted = hasPainted();
  let observed = 0;
  groups.forEach((g, i) => {
    const rect = rects[i]!;
    if (g.mode === 'load') {
      // Al cargar: solo si está (al menos en parte) en pantalla; el hero ya se pintó completo y el
      // trazo solo añade la animación de stroke (nunca retrasa el LCP).
      if (rect.bottom <= 0 || rect.top >= bottom || rect.width === 0) {
        g.finished = true;
        return;
      }
      prepare(g);
      draw(g);
    } else if (rect.top > bottom) {
      prepare(g);
      watcher.observe(g.el);
      observed += 1;
    } else if (!painted) {
      prepare(g);
      draw(g);
    } else {
      // Ya visible y pintado: nunca se oculta lo que el usuario ya ve.
      g.finished = true;
    }
  });
  if (observed === 0) watcher.disconnect();

  return () => {
    watcher.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
    groups.forEach(finish);
  };
}

/* ------------------------------------------------------------------ */
/* Inicialización global                                               */
/* ------------------------------------------------------------------ */

let initialised = false;

/** Inicializa revelados, count-ups y trazos de la página. Idempotente. */
export function initMotion(root: ParentNode = document): void {
  if (initialised) return;
  initialised = true;
  document.documentElement.classList.add('motion-ready');
  observeReveal(root);
  observeCountUp(root);
  observeTraceLines(root);
}
