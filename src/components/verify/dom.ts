/** Utilidades mínimas de DOM para la isla de verificación (sin dependencias). */

export function qs<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`[verify] Falta el elemento requerido: ${selector}`);
  return el;
}

export function qsa<T extends Element = HTMLElement>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function show(el: Element | null | undefined): void {
  if (el) el.removeAttribute('hidden');
}

export function hide(el: Element | null | undefined): void {
  if (el) el.setAttribute('hidden', '');
}

export function toggle(el: Element | null | undefined, visible: boolean): void {
  if (visible) show(el);
  else hide(el);
}

export function setText(el: Element | null | undefined, text: string): void {
  if (el) el.textContent = text;
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Crea un elemento con texto opcional y atributos (sin HTML inline). */
export function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { text?: string; className?: string; attrs?: Record<string, string> } = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text !== undefined) el.textContent = options.text;
  if (options.attrs) for (const [k, v] of Object.entries(options.attrs)) el.setAttribute(k, v);
  return el;
}

/** Foco programático que respeta el scroll-margin del elemento. */
export function focusHeading(el: HTMLElement | null | undefined): void {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  try {
    el.focus({ preventScroll: false });
  } catch {
    el.focus();
  }
}
