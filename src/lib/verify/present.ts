/**
 * Helpers de presentación del resultado de verificación (puros, sin DOM).
 * Traducen veredictos, comprobaciones y severidades a tonos semánticos e iconos del sistema UI.
 * Amplía el motor sin tocar su API.
 */
import type { IconName } from '@/content/types';
import type { Severity } from '@/fixtures/types';
import { TRANSPORT_CODES } from '@/fixtures/scenarios';
import type { CheckOutcome, Verdict, VerificationResult } from './types';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const VERDICT_TONE: Record<Verdict, Tone> = {
  valid: 'success',
  warning: 'warning',
  invalid: 'danger',
  unverifiable: 'neutral',
};

export const VERDICT_ICON: Record<Verdict, IconName> = {
  valid: 'shield-check',
  warning: 'warning',
  invalid: 'x',
  unverifiable: 'info',
};

export const OUTCOME_TONE: Record<CheckOutcome, Tone> = {
  pass: 'success',
  warn: 'warning',
  fail: 'danger',
  skipped: 'neutral',
};

export const OUTCOME_ICON: Record<CheckOutcome, IconName> = {
  pass: 'check',
  warn: 'warning',
  fail: 'x',
  skipped: 'clock',
};

export const SEVERITY_TONE: Record<Severity, Tone> = {
  info: 'info',
  warning: 'warning',
  critical: 'danger',
};

/** ¿Es uno de los códigos especiales que el adaptador interpreta como condición de transporte? */
export function isTransportCode(code: string): boolean {
  return (Object.values(TRANSPORT_CODES) as string[]).includes(code);
}

/** Propiedades de analítica de un resultado: NUNCA incluye el código completo. */
export function analyticsPropsFor(result: Pick<VerificationResult, 'verdict' | 'reason'>, extra: Record<string, string> = {}): Record<string, string> {
  return { verdict: result.verdict, reason: result.reason, ...extra };
}

/** Rellena marcadores {nombre} en plantillas de contenido. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Validación ligera de correo (opcional en el reporte). */
export function isPlausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export const REPORT_DESCRIPTION_MIN = 10;
export const REPORT_DESCRIPTION_MAX = 600;
