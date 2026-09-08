/**
 * Icono por tipo de evento del recorrido (compartido por el render en servidor y la isla).
 */
import type { EventKind } from '@/fixtures/types';
import type { IconName } from '@/content/types';

export const KIND_ICONS: Record<EventKind, IconName> = {
  import_declared: 'customs',
  identity_issued: 'fingerprint',
  labeled: 'label',
  sample_approved: 'compare',
  record_completed: 'document',
  activated: 'check',
  verified: 'scan',
  looked_up: 'history',
  anomaly_flagged: 'warning',
  reported: 'flag',
  inspected: 'search',
  reassigned: 'refresh',
  range_voided: 'x',
  revoked: 'alert',
  issuance_closed: 'lock',
};

/** Tipos de evento que señalan una incidencia (se rotulan también con texto, nunca solo con color). */
export const KIND_INCIDENT: ReadonlySet<EventKind> = new Set<EventKind>([
  'reported',
  'revoked',
  'inspected',
  'anomaly_flagged',
  'range_voided',
]);

export const EVENT_KINDS: readonly EventKind[] = Object.keys(KIND_ICONS) as EventKind[];
