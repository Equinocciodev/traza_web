/**
 * Formato de fechas de la vista institucional. Todas las horas se muestran en UTC para que el HTML
 * renderizado en servidor y el que genera la isla coincidan en cualquier zona horaria del visitante.
 */
import { formatDate, type Locale } from '@/i18n';

export function fmtDateTime(iso: string, locale: Locale): string {
  return formatDate(iso, locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
}

export function fmtDate(iso: string, locale: Locale): string {
  return formatDate(iso, locale, { timeZone: 'UTC' });
}

/** Sustituye marcadores (%s, %n, %u, …) en una plantilla de texto. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/%([a-z])/g, (match, key: string) => {
    const v = values[key];
    return v === undefined ? match : String(v);
  });
}
