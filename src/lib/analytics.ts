/**
 * Interfaz de analítica SIN cookies.
 *
 * - Proveedor `none` (por defecto): no hace nada.
 * - `console`: registra en consola (solo desarrollo).
 * - `beacon`: envía un POST anónimo (navigator.sendBeacon) a PUBLIC_ANALYTICS_ENDPOINT con
 *   { event, props, path, locale, ts }. Sin identificadores de usuario, sin cookies, sin almacenamiento,
 *   y respeta la señal Do Not Track del navegador.
 *
 * Nunca pasar datos personales ni códigos completos como propiedades.
 */
import { env } from '@/config/env';

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'language_switch'
  | 'verify_start'
  | 'verify_result'
  | 'verify_retry'
  | 'report_submitted'
  | 'journey_play'
  | 'journey_step'
  | 'institutional_role_change'
  | 'contact_submitted';

export type AnalyticsProps = Record<string, string | number | boolean>;

function dntEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { msDoNotTrack?: string };
  return navigator.doNotTrack === '1' || nav.msDoNotTrack === '1' || (window as Window & { doNotTrack?: string }).doNotTrack === '1';
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;
  if (env.analyticsProvider === 'none' || dntEnabled()) return;
  const payload = {
    event,
    props,
    path: window.location.pathname,
    locale: document.documentElement.lang,
    ts: new Date().toISOString(),
  };
  if (env.analyticsProvider === 'console') {
    console.debug('[analytics]', payload);
    return;
  }
  if (env.analyticsProvider === 'beacon' && env.analyticsEndpoint && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(env.analyticsEndpoint, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    } catch {
      /* silencioso: la analítica nunca rompe la experiencia */
    }
  }
}
