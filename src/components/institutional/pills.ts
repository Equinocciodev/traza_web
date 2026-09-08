/**
 * Mapa de pastillas de estado de la vista institucional: tono + icono por estado.
 * Los estados nunca dependen solo del color (icono + texto). Se usa en servidor (Astro) y como
 * catálogo de plantillas clonables en la isla.
 */
import type { IconName } from '@/content/types';
import type { Severity } from '@/fixtures/types';
import type { AlertStatus, CaseStatus, InspectionStatus } from '@/fixtures/institutional';
import type { Verdict, CheckOutcome } from '@/lib/verify/types';

export type PillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface PillSpec {
  tone: PillTone;
  icon: IconName;
}

export const SEVERITY_PILL: Record<Severity, PillSpec> = {
  info: { tone: 'info', icon: 'info' },
  warning: { tone: 'warning', icon: 'warning' },
  critical: { tone: 'danger', icon: 'alert' },
};

export const ALERT_STATUS_PILL: Record<AlertStatus, PillSpec> = {
  open: { tone: 'info', icon: 'flag' },
  acknowledged: { tone: 'neutral', icon: 'eye' },
  closed: { tone: 'success', icon: 'check' },
};

export const CASE_STATUS_PILL: Record<CaseStatus, PillSpec> = {
  open: { tone: 'info', icon: 'flag' },
  in_review: { tone: 'warning', icon: 'clock' },
  closed: { tone: 'success', icon: 'check' },
};

export const INSPECTION_STATUS_PILL: Record<InspectionStatus, PillSpec> = {
  scheduled: { tone: 'neutral', icon: 'clock' },
  done: { tone: 'success', icon: 'check' },
};

export const VERDICT_PILL: Record<Verdict, PillSpec> = {
  valid: { tone: 'success', icon: 'shield-check' },
  warning: { tone: 'warning', icon: 'warning' },
  invalid: { tone: 'danger', icon: 'x' },
  unverifiable: { tone: 'neutral', icon: 'info' },
};

export const OUTCOME_PILL: Record<CheckOutcome, PillSpec> = {
  pass: { tone: 'success', icon: 'check' },
  warn: { tone: 'warning', icon: 'warning' },
  fail: { tone: 'danger', icon: 'x' },
  skipped: { tone: 'neutral', icon: 'clock' },
};

/** Nombre de plantilla clonable: `data-pill="severity:critical"`, `data-pill="alert:open"`, … */
export type PillGroup = 'severity' | 'alert' | 'case' | 'inspection' | 'verdict' | 'outcome';

export function pillKey(group: PillGroup, value: string): string {
  return `${group}:${value}`;
}
