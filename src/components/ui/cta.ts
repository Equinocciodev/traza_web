/**
 * Utilidades para resolver los CTA del contenido (`Cta`) a atributos de enlace.
 * Todo enlace interno pasa por `route()`; `suffix` permite `?t=medicamentos` o `#ancla`.
 */
import { route, type Locale } from '@/i18n';
import type { Cta } from '@/content/types';

export function ctaHref(locale: Locale, cta: Cta): string {
  if (cta.key) return route(locale, cta.key) + (cta.suffix ?? '');
  if (cta.href) return cta.href + (cta.suffix ?? '');
  return '#';
}

export type ButtonVariant = NonNullable<Cta['variant']>;

/** Variante del botón con valor por defecto. */
export function ctaVariant(cta: Cta, fallback: ButtonVariant = 'primary'): ButtonVariant {
  return cta.variant ?? fallback;
}
