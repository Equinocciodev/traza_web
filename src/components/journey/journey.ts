/**
 * Isla del recorrido del producto (demo B) — lógica de cliente.
 *
 * Se monta sobre el HTML renderizado en servidor (estado final de la unidad destacada) y añade:
 * reproducción etapa por etapa ("el trazo que se completa"), controles accesibles, lista de pasos
 * con teclado, cambio de unidad, estados (cargando / vacío / error simulado) y anuncios aria-live.
 *
 * Reglas de motion: solo stroke-dashoffset (línea), transform/opacity (pulso de nodo, revelado de
 * tarjetas, barra de progreso). Una única reproducción automática al entrar en el viewport, nunca en
 * bucle, pausa al salir. Con prefers-reduced-motion: estados finales y navegación por pasos.
 *
 * Ganchos e2e (data-testid): journey (contenedor, con data-stage-index y data-view), journey-play,
 * journey-prev, journey-next, journey-restart, journey-step (data-stage), journey-unit-select,
 * journey-progress, journey-status, journey-stage, journey-card, journey-story, journey-loading,
 * journey-empty, journey-error, journey-error-sim, journey-retry.
 */
import { UNIT_BY_CODE } from '@/fixtures/units';
import type { UnitEvent } from '@/fixtures/types';
import type { JourneyClientData, JourneyStoryKey } from '@/content/journey.types';
import { animateStroke, prefersReducedMotion, prepareStroke, setStrokeProgress, type StrokeAnimation } from '@/lib/motion';
import { track } from '@/lib/analytics';
import { KIND_INCIDENT } from './kinds';
import {
  buildJourney,
  buildStory,
  endAnnouncement,
  fill,
  formatEventTime,
  lineProgress,
  progressText,
  stageAnnouncement,
  stageState,
  summarize,
  type JourneyModel,
} from './model';

/** Tiempos (ms). Recorrido completo: 700 + 5 × (900 + 700) + 700 = 9,4 s ≤ 10 s. */
export const TIMING = {
  stroke: 900,
  strokeManual: 600,
  pause: 700,
  loading: 350,
  error: 550,
} as const;

type View = 'ready' | 'loading' | 'empty' | 'error';
type Playback = 'idle' | 'playing' | 'paused' | 'ended';
type Source = 'auto' | 'user' | 'keyboard' | 'step' | 'unit_change' | 'retry';
type PanelName = 'loading' | 'empty' | 'error';

const STORY_KEYS: JourneyStoryKey[] = ['issuer', 'product', 'origin', 'movements'];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function q<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}

function qa<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function setText(el: Element | null, text: string): void {
  if (el && el.textContent !== text) el.textContent = text;
}

function setDisabled(el: HTMLElement, disabled: boolean): void {
  if (disabled) el.setAttribute('aria-disabled', 'true');
  else el.removeAttribute('aria-disabled');
}

function isDisabled(el: HTMLElement): boolean {
  return el.getAttribute('aria-disabled') === 'true';
}

/** Reinicia una animación CSS quitando y volviendo a poner la clase (fuerza reflow entre medias). */
function replayClass(el: Element, className: string): void {
  el.classList.remove(className);
  void el.getBoundingClientRect();
  el.classList.add(className);
}

interface Elements {
  select: HTMLSelectElement;
  code: HTMLElement | null;
  tenant: HTMLElement | null;
  summaryWraps: HTMLElement[];
  trace: HTMLElement;
  diagram: HTMLElement;
  paths: SVGPathElement[];
  lengths: number[];
  progress: HTMLElement;
  progressBar: HTMLElement | null;
  progressText: HTMLElement | null;
  status: HTMLElement;
  play: HTMLButtonElement;
  playLabel: HTMLElement | null;
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  restart: HTMLButtonElement;
  stepsList: HTMLElement;
  content: HTMLElement;
  stages: HTMLElement;
  panels: Record<PanelName, HTMLElement | null>;
  retry: HTMLButtonElement | null;
  simulate: HTMLButtonElement | null;
  tplStage: HTMLTemplateElement;
  tplCard: HTMLTemplateElement;
  tplIcons: HTMLTemplateElement;
}

export class JourneyController {
  private readonly root: HTMLElement;
  private readonly data: JourneyClientData;
  private readonly els: Elements;
  private model: JourneyModel;
  private current = -1;
  private view: View = 'ready';
  private playback: Playback = 'idle';
  /** Invalida bucles de reproducción y cargas pendientes cuando el estado cambia. */
  private epoch = 0;
  private strokes: StrokeAnimation[] = [];
  private autoplayed = false;
  private autoPaused = false;
  private inViewport = true;

  constructor(root: HTMLElement, data: JourneyClientData, els: Elements) {
    this.root = root;
    this.data = data;
    this.els = els;
    this.model = buildJourney(UNIT_BY_CODE.get(root.dataset.unit ?? '') ?? null, data);
  }

  /** Crea el controlador si el marcado tiene los ganchos necesarios. */
  static mount(root: HTMLElement): JourneyController | null {
    let data: JourneyClientData;
    try {
      data = JSON.parse(root.dataset.i18n ?? '') as JourneyClientData;
    } catch {
      return null;
    }
    const select = q<HTMLSelectElement>(root, '[data-jr-unit]');
    const trace = q<HTMLElement>(root, '[data-trace]');
    const diagram = q<HTMLElement>(root, '[data-jr-diagram]');
    const progress = q<HTMLElement>(root, '[data-jr-progress]');
    const status = q<HTMLElement>(root, '[data-jr-status]');
    const play = q<HTMLButtonElement>(root, '[data-jr-play]');
    const prev = q<HTMLButtonElement>(root, '[data-jr-prev]');
    const next = q<HTMLButtonElement>(root, '[data-jr-next]');
    const restart = q<HTMLButtonElement>(root, '[data-jr-restart]');
    const stepsList = q<HTMLElement>(root, '[data-jr-steps]');
    const content = q<HTMLElement>(root, '[data-jr-content]');
    const stages = q<HTMLElement>(root, '[data-jr-stages]');
    const tplStage = q<HTMLTemplateElement>(root, 'template[data-jr-tpl="stage"]');
    const tplCard = q<HTMLTemplateElement>(root, 'template[data-jr-tpl="card"]');
    const tplIcons = q<HTMLTemplateElement>(root, 'template[data-jr-tpl="icons"]');
    if (!select || !trace || !diagram || !progress || !status || !play || !prev || !next || !restart || !stepsList || !content || !stages || !tplStage || !tplCard || !tplIcons) {
      return null;
    }
    const paths = qa<SVGPathElement>(trace, '[data-trace-path]');
    const lengths = paths.map((path) => {
      const declared = Number(path.dataset.length);
      return Number.isFinite(declared) && declared > 0 ? declared : prepareStroke(path);
    });
    const els: Elements = {
      select,
      code: q<HTMLElement>(root, '[data-jr-code]'),
      tenant: q<HTMLElement>(root, '[data-jr-tenant]'),
      summaryWraps: qa<HTMLElement>(root, '[data-jr-summary-kind]'),
      trace,
      diagram,
      paths,
      lengths,
      progress,
      progressBar: q<HTMLElement>(root, '[data-jr-progress-bar]'),
      progressText: q<HTMLElement>(root, '[data-jr-progress-text]'),
      status,
      play,
      playLabel: q<HTMLElement>(root, '[data-jr-play-label]'),
      prev,
      next,
      restart,
      stepsList,
      content,
      stages,
      panels: {
        loading: q<HTMLElement>(root, '[data-jr-panel="loading"]'),
        empty: q<HTMLElement>(root, '[data-jr-panel="empty"]'),
        error: q<HTMLElement>(root, '[data-jr-panel="error"]'),
      },
      retry: q<HTMLButtonElement>(root, '[data-jr-retry]'),
      simulate: q<HTMLButtonElement>(root, '[data-jr-simulate]'),
      tplStage,
      tplCard,
      tplIcons,
    };
    const controller = new JourneyController(root, data, els);
    controller.init();
    return controller;
  }

  /* ---------------------------------------------------------------- */
  /* Inicialización                                                    */
  /* ---------------------------------------------------------------- */

  private init(): void {
    const { els } = this;
    this.root.dataset.enhanced = '';
    // La línea pasa a controlarse por CSSOM (dasharray/dashoffset) a partir de aquí.
    els.paths.forEach((path, i) => {
      path.style.strokeDasharray = `${els.lengths[i]}`;
    });
    // Las fechas renderizadas en servidor se reformatean con el huso horario del navegador para que
    // coincidan con las tarjetas que la isla construye al cambiar de unidad.
    for (const time of qa<HTMLTimeElement>(els.stages, 'time[datetime]')) {
      if (time.dateTime) setText(time, formatEventTime(time.dateTime, this.data));
    }

    if (this.model.lastRecorded < 0) {
      this.current = -1;
      this.setView('empty');
      this.render({ reveal: false });
      void this.setLine(0, false);
    } else {
      this.setView('ready');
      // Con reduced motion se mantiene el estado final renderizado en servidor; si no, se parte del
      // inicio y la reproducción automática arranca cuando el diagrama entra en el viewport.
      this.current = prefersReducedMotion() ? this.model.lastRecorded : 0;
      this.render({ reveal: false });
      void this.setLine(lineProgress(this.current, this.model.total), false);
      setText(els.status, stageAnnouncement(this.model, this.current, this.data));
    }
    this.updatePlayButton();
    this.bind();
    this.observe();
  }

  private bind(): void {
    const { els } = this;
    els.play.addEventListener('click', () => {
      if (isDisabled(els.play)) return;
      if (this.playback === 'playing') this.pause(true);
      else this.play('user');
    });
    els.prev.addEventListener('click', () => {
      if (isDisabled(els.prev)) return;
      this.pause(false);
      void this.goTo(this.current - 1, { animate: true, reveal: false, source: 'user' });
    });
    els.next.addEventListener('click', () => {
      if (isDisabled(els.next)) return;
      this.pause(false);
      void this.goTo(this.current + 1, { animate: true, reveal: true, source: 'user' });
    });
    els.restart.addEventListener('click', () => {
      if (isDisabled(els.restart)) return;
      this.restart();
    });
    els.stepsList.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-jr-step]');
      if (!button) return;
      this.activateStep(button, 'step');
    });
    els.stepsList.addEventListener('keydown', (event) => this.onStepsKeydown(event));
    els.select.addEventListener('change', () => {
      void this.selectUnit(els.select.value, { autoplay: true, source: 'unit_change' });
    });
    els.simulate?.addEventListener('click', () => void this.simulateError());
    els.retry?.addEventListener('click', () => {
      void this.selectUnit(els.select.value, { autoplay: true, source: 'retry' });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.playback === 'playing') {
        this.pause(false);
        this.autoPaused = true;
      } else if (!document.hidden && this.autoPaused && this.inViewport) {
        this.autoPaused = false;
        this.resume();
      }
    });
  }

  /** Reproducción automática una sola vez al entrar en el viewport; pausa al salir y reanuda al volver. */
  private observe(): void {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.inViewport = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (this.autoPaused && !document.hidden) {
              this.autoPaused = false;
              this.resume();
            } else if (!this.autoplayed) {
              this.autoplayed = true;
              if (!prefersReducedMotion() && this.view === 'ready' && this.playback === 'idle') this.play('auto');
            }
          } else if (this.playback === 'playing') {
            this.pause(false);
            this.autoPaused = true;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(this.els.diagram);
  }

  /* ---------------------------------------------------------------- */
  /* Reproducción                                                      */
  /* ---------------------------------------------------------------- */

  play(source: Source, opts: { silent?: boolean } = {}): void {
    if (this.view !== 'ready' || this.model.lastRecorded < 0 || this.playback === 'playing') return;
    if (this.current >= this.model.lastRecorded) {
      // Al final del recorrido, "Reproducir de nuevo" vuelve al inicio (nunca en bucle automático).
      void this.goTo(0, { animate: false, reveal: true, source, announce: false });
    }
    this.playback = 'playing';
    this.autoPaused = false;
    this.updatePlayButton();
    this.updateControls();
    if (!opts.silent) this.announce(this.data.live.playing);
    track('journey_play', { source });
    void this.runLoop(++this.epoch);
  }

  private resume(): void {
    if (this.view !== 'ready' || this.playback !== 'paused' || this.current >= this.model.lastRecorded) return;
    this.playback = 'playing';
    this.updatePlayButton();
    this.updateControls();
    void this.runLoop(++this.epoch);
  }

  pause(announce: boolean): void {
    if (this.playback !== 'playing') return;
    this.epoch += 1;
    this.playback = 'paused';
    this.updatePlayButton();
    this.updateControls();
    if (announce) this.announce(fill(this.data.live.paused, { stage: this.model.stages[this.current]?.label ?? '' }));
  }

  private async runLoop(epoch: number): Promise<void> {
    while (this.epoch === epoch && this.playback === 'playing') {
      const reduced = prefersReducedMotion();
      await wait(reduced ? TIMING.pause + TIMING.stroke : TIMING.pause);
      if (this.epoch !== epoch || this.playback !== 'playing') return;
      if (this.current >= this.model.lastRecorded) {
        this.finish();
        return;
      }
      await this.goTo(this.current + 1, { animate: !reduced, reveal: true, source: 'auto', duration: TIMING.stroke });
    }
  }

  private finish(): void {
    this.playback = 'ended';
    this.autoPaused = false;
    this.updatePlayButton();
    this.updateControls();
    this.announce(endAnnouncement(this.model, this.data));
  }

  restart(): void {
    if (this.view !== 'ready' || this.model.lastRecorded < 0) return;
    this.pause(false);
    this.playback = 'idle';
    this.updatePlayButton();
    void this.goTo(0, { animate: false, reveal: true, source: 'user', announce: false });
    this.announce(fill(this.data.live.restarted, { stage: this.model.stages[0]?.label ?? '' }));
  }

  /* ---------------------------------------------------------------- */
  /* Navegación por etapas                                             */
  /* ---------------------------------------------------------------- */

  goTo(
    index: number,
    opts: { animate: boolean; reveal: boolean; source: Source; announce?: boolean; duration?: number },
  ): Promise<void> {
    if (this.view !== 'ready' || this.model.lastRecorded < 0) return Promise.resolve();
    const target = Math.max(0, Math.min(this.model.lastRecorded, index));
    const changed = target !== this.current;
    const forward = target > this.current;
    this.current = target;
    this.render({ reveal: opts.reveal && changed && forward });
    const done = this.setLine(lineProgress(target, this.model.total), opts.animate && changed, opts.duration ?? TIMING.strokeManual);
    if (changed) {
      if (opts.announce !== false) this.announce(stageAnnouncement(this.model, target, this.data));
      const stage = this.model.stages[target];
      if (stage) track('journey_step', { stage: stage.id, source: opts.source });
    }
    return done;
  }

  private activateStep(button: HTMLButtonElement, source: Source): void {
    const index = Number(button.dataset.index);
    if (!Number.isFinite(index)) return;
    if (isDisabled(button) || index > this.model.lastRecorded) {
      const stage = this.model.stages[index];
      if (stage) this.announce(fill(this.data.live.unrecorded, { stage: stage.label }));
      return;
    }
    this.pause(false);
    void this.goTo(index, { animate: true, reveal: index > this.current, source });
  }

  private onStepsKeydown(event: KeyboardEvent): void {
    const deltas: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const delta = Object.prototype.hasOwnProperty.call(deltas, event.key) ? deltas[event.key] : undefined;
    let target: number | null = null;
    if (delta !== undefined) target = this.current + delta;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = this.model.lastRecorded;
    if (target === null || this.view !== 'ready' || this.model.lastRecorded < 0) return;
    event.preventDefault();
    this.pause(false);
    const clamped = Math.max(0, Math.min(this.model.lastRecorded, target));
    void this.goTo(clamped, { animate: true, reveal: clamped > this.current, source: 'keyboard' });
    this.focusStep(clamped);
  }

  private focusStep(index: number): void {
    const button = this.stepButtons()[index];
    button?.focus();
  }

  private stepButtons(): HTMLButtonElement[] {
    return qa<HTMLButtonElement>(this.els.stepsList, '[data-jr-step]');
  }

  /* ---------------------------------------------------------------- */
  /* Unidad, estados y errores                                         */
  /* ---------------------------------------------------------------- */

  async selectUnit(code: string, opts: { autoplay: boolean; source: Source }): Promise<void> {
    const epoch = ++this.epoch;
    this.playback = 'idle';
    this.autoPaused = false;
    this.cancelStrokes();
    this.setView('loading');
    this.updatePlayButton();
    this.announce(this.data.live.loading);
    await wait(TIMING.loading);
    if (epoch !== this.epoch) return;

    const unit = UNIT_BY_CODE.get(code) ?? null;
    this.model = buildJourney(unit, this.data);
    this.root.dataset.unit = code;
    this.renderHeader();
    this.renderStory();
    this.renderStages();

    if (this.model.lastRecorded < 0) {
      this.current = -1;
      this.setView('empty');
      this.render({ reveal: false });
      void this.setLine(0, false);
      this.updatePlayButton();
      this.announce(this.data.live.empty);
      return;
    }

    this.setView('ready');
    const reduced = prefersReducedMotion();
    this.current = reduced ? this.model.lastRecorded : 0;
    this.render({ reveal: true });
    void this.setLine(lineProgress(this.current, this.model.total), false);
    this.updatePlayButton();
    const loaded = fill(this.data.live.loaded, { unit: this.data.unitLabels[code] ?? code });
    const autoplay = opts.autoplay && !reduced;
    this.announce(`${loaded} ${autoplay ? this.data.live.playing : stageAnnouncement(this.model, this.current, this.data)}`);
    if (autoplay) this.play(opts.source, { silent: true });
  }

  async simulateError(): Promise<void> {
    const epoch = ++this.epoch;
    this.playback = 'idle';
    this.cancelStrokes();
    this.setView('loading');
    this.updatePlayButton();
    this.announce(this.data.live.loading);
    await wait(TIMING.error);
    if (epoch !== this.epoch) return;
    this.current = -1;
    this.setView('error');
    void this.setLine(0, false);
    this.renderNodes(false);
    this.renderSteps();
    this.renderProgress();
    this.updatePlayButton();
    this.announce(this.data.live.error);
    this.els.retry?.focus();
  }

  private setView(view: View): void {
    this.view = view;
    this.root.dataset.view = view;
    (Object.keys(this.els.panels) as PanelName[]).forEach((name) => {
      const panel = this.els.panels[name];
      if (panel) panel.hidden = name !== view;
    });
    this.els.content.setAttribute('aria-busy', view === 'loading' ? 'true' : 'false');
    this.els.content.hidden = view === 'error';
    this.els.stages.hidden = view === 'empty';
    this.updateControls();
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  private render(opts: { reveal: boolean }): void {
    this.root.dataset.stageIndex = String(this.current);
    this.renderNodes(opts.reveal);
    this.renderStageStates(opts.reveal);
    this.renderSteps();
    this.renderProgress();
    this.updateControls();
  }

  private renderNodes(reveal: boolean): void {
    const reduced = prefersReducedMotion();
    for (const node of qa<SVGGElement>(this.els.trace, '[data-trace-node]')) {
      const index = Number(node.dataset.index);
      const state = this.view === 'error' ? 'unrecorded' : stageState(index, this.current, this.model.lastRecorded);
      node.dataset.state = state;
      const ring = q<SVGCircleElement>(node, '[data-trace-ring]');
      if (!ring) continue;
      if (state === 'active' && reveal && !reduced) replayClass(ring, 'node-pulse');
      else ring.classList.remove('node-pulse');
    }
    this.els.trace.dataset.originIcon = this.model.originIcon;
  }

  private renderStageStates(reveal: boolean): void {
    for (const section of qa<HTMLElement>(this.els.stages, '[data-jr-stage]')) {
      const index = Number(section.dataset.index);
      const state = stageState(index, this.current, this.model.lastRecorded);
      section.dataset.state = state;
      setText(q(section, '[data-jr-field="state"]'), this.data.stageStates[state]);
      setText(q(section, '[data-jr-field="empty"]'), state === 'unrecorded' ? this.data.stageUnrecorded : this.data.stageEmpty);
      const cards = qa<HTMLElement>(section, '[data-jr-card]');
      if (state === 'active' && reveal) cards.forEach((card) => replayClass(card, 'reveal-up'));
      else if (state !== 'active' && state !== 'done') cards.forEach((card) => card.classList.remove('reveal-up'));
    }
  }

  private renderSteps(): void {
    this.stepButtons().forEach((button) => {
      const index = Number(button.dataset.index);
      const state = this.view === 'ready' ? stageState(index, this.current, this.model.lastRecorded) : 'unrecorded';
      button.dataset.state = state;
      if (index === this.current && this.view === 'ready') button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      setDisabled(button, state === 'unrecorded');
    });
  }

  private renderProgress(): void {
    const { progress, progressBar, progressText: textEl } = this.els;
    const now = Math.max(0, this.current + 1);
    const text = progressText(this.current, this.model.total, this.data);
    progress.setAttribute('aria-valuemax', String(this.model.total));
    progress.setAttribute('aria-valuenow', String(now));
    progress.setAttribute('aria-valuetext', text);
    if (progressBar) progressBar.dataset.value = String(now);
    setText(textEl, text);
  }

  private renderHeader(): void {
    const { unit } = this.model;
    setText(this.els.code, unit?.code ?? this.model.code);
    setText(this.els.tenant, unit ? (this.data.tenantLabels[unit.tenant] ?? unit.tenant) : '');
    const summary = summarize(this.model, this.data);
    for (const wrap of this.els.summaryWraps) {
      const matches = wrap.dataset.jrSummaryKind === summary.kind;
      wrap.hidden = !matches;
      if (matches) setText(q(wrap, '[data-jr-summary-text]'), summary.text);
    }
  }

  private renderStory(): void {
    const entries = buildStory(this.model, this.data);
    for (const key of STORY_KEYS) {
      const entry = entries.find((e) => e.key === key);
      const item = q<HTMLElement>(this.root, `[data-jr-story="${key}"]`);
      if (!entry || !item) continue;
      setText(q(item, '[data-jr-field="primary"]'), entry.primary);
      setText(q(item, '[data-jr-field="secondary"]'), entry.secondary);
    }
  }

  private renderStages(): void {
    const { stages, tplStage } = this.els;
    stages.replaceChildren();
    for (const stage of this.model.stages) {
      const fragment = tplStage.content.cloneNode(true) as DocumentFragment;
      const section = q<HTMLElement>(fragment, '[data-jr-stage]');
      if (!section) continue;
      section.dataset.stage = stage.id;
      section.dataset.index = String(stage.index);
      const titleId = `jr-stage-title-${stage.id}`;
      const title = q<HTMLElement>(section, '[data-jr-field="title"]');
      if (title) {
        title.id = titleId;
        title.textContent = stage.label;
      }
      section.setAttribute('aria-labelledby', titleId);
      setText(q(section, '[data-jr-field="num"]'), String(stage.index + 1).padStart(2, '0'));
      const list = q<HTMLElement>(section, '[data-jr-list]');
      const empty = q<HTMLElement>(section, '[data-jr-field="empty"]');
      if (list) {
        list.replaceChildren(...stage.events.map((event) => this.buildCard(event)));
        list.hidden = stage.events.length === 0;
      }
      if (empty) empty.hidden = stage.events.length > 0;
      stages.append(fragment);
    }
  }

  private buildCard(event: UnitEvent): HTMLElement {
    const fragment = this.els.tplCard.content.cloneNode(true) as DocumentFragment;
    const card = q<HTMLElement>(fragment, '[data-jr-card]');
    if (!card) return document.createElement('li');
    card.dataset.kind = event.kind;
    card.dataset.eventId = event.id;
    if (KIND_INCIDENT.has(event.kind)) card.setAttribute('data-incident', '');
    else card.removeAttribute('data-incident');
    const iconWrap = q<HTMLElement>(card, '[data-jr-icon]');
    const iconSource = q<SVGElement>(this.els.tplIcons.content, `[data-kind="${event.kind}"] svg`);
    if (iconWrap && iconSource) iconWrap.replaceChildren(iconSource.cloneNode(true));
    setText(q(card, '[data-jr-field="kind"]'), this.data.eventKinds[event.kind]);
    setText(q(card, '[data-jr-field="actor"]'), event.actor);
    setText(q(card, '[data-jr-field="place"]'), `${event.place.site} · ${event.place.region}`);
    const time = q<HTMLTimeElement>(card, '[data-jr-field="time"]');
    if (time) {
      time.dateTime = event.at;
      time.textContent = formatEventTime(event.at, this.data);
    }
    const ref = q<HTMLElement>(card, '[data-jr-field="ref"]');
    if (ref) {
      ref.hidden = !event.ref;
      setText(q(ref, '[data-jr-field="ref-value"]'), event.ref ?? '');
    }
    const note = q<HTMLElement>(card, '[data-jr-field="note"]');
    if (note) {
      const text = event.note?.[this.data.locale] ?? '';
      note.hidden = !text;
      note.textContent = text;
    }
    return card;
  }

  private updatePlayButton(): void {
    const { play, playLabel } = this.els;
    const atEnd = this.model.lastRecorded >= 0 && this.current >= this.model.lastRecorded && this.playback !== 'playing';
    const state = this.playback === 'playing' ? 'playing' : atEnd ? 'ended' : 'paused';
    play.dataset.state = state;
    const label = state === 'playing' ? this.data.playLabels.pause : state === 'ended' ? this.data.playLabels.replay : this.data.playLabels.play;
    setText(playLabel, label);
    play.setAttribute('aria-label', label);
  }

  private updateControls(): void {
    const ready = this.view === 'ready' && this.model.lastRecorded >= 0;
    const { play, prev, next, restart, simulate } = this.els;
    setDisabled(play, !ready);
    setDisabled(prev, !ready || this.current <= 0);
    setDisabled(next, !ready || this.current >= this.model.lastRecorded);
    setDisabled(restart, !ready || (this.current <= 0 && this.playback !== 'playing'));
    if (simulate) setDisabled(simulate, this.view === 'loading');
  }

  /* ---------------------------------------------------------------- */
  /* Línea de trazabilidad                                             */
  /* ---------------------------------------------------------------- */

  /** Progreso visible actual de la línea (0–1), leído del trazo para animar desde donde esté. */
  private readLineProgress(): number {
    const path = this.els.paths[0];
    const length = this.els.lengths[0];
    if (!path || !length) return 0;
    const offset = parseFloat(path.style.strokeDashoffset || `${length}`);
    if (!Number.isFinite(offset)) return 0;
    return Math.max(0, Math.min(1, 1 - offset / length));
  }

  private cancelStrokes(): void {
    this.strokes.forEach((s) => s.cancel());
    this.strokes = [];
  }

  private async setLine(progress: number, animate: boolean, duration: number = TIMING.stroke): Promise<void> {
    const from = this.readLineProgress();
    this.cancelStrokes();
    if (!animate || prefersReducedMotion() || from === progress) {
      this.els.paths.forEach((path, i) => setStrokeProgress(path, progress, this.els.lengths[i]));
      return;
    }
    this.strokes = this.els.paths.map((path, i) => animateStroke(path, { from, to: progress, duration, length: this.els.lengths[i] }));
    await Promise.all(this.strokes.map((s) => s.done));
  }

  private announce(text: string): void {
    setText(this.els.status, text);
  }
}

/** Monta todas las islas del documento. Idempotente por contenedor. */
export function initJourneys(root: ParentNode = document): JourneyController[] {
  return qa<HTMLElement>(root, '[data-journey]')
    .filter((el) => !el.dataset.enhanced)
    .map((el) => JourneyController.mount(el))
    .filter((c): c is JourneyController => c !== null);
}
