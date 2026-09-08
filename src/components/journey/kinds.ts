/**
 * Icono por tipo de evento del recorrido (compartido por el render en servidor y la isla).
 */
import type { EventKind } from '@/fixtures/types';
import type { IconName } from '@/content/types';

export const KIND_ICONS: Record<EventKind, IconName> = {
  identity_issued: 'fingerprint',
  customs_cleared: 'customs',
  labeled: 'label',
  shipped: 'truck',
  in_transit: 'truck',
  received: 'warehouse',
  dispatched: 'box',
  received_commerce: 'store',
  sold: 'store',
  verified: 'scan',
  inspected: 'search',
  reported: 'flag',
  revoked: 'alert',
};

/** Tipos de evento que señalan una incidencia (se rotulan también con texto, nunca solo con color). */
export const KIND_INCIDENT: ReadonlySet<EventKind> = new Set<EventKind>(['reported', 'revoked', 'inspected']);

export const EVENT_KINDS: readonly EventKind[] = Object.keys(KIND_ICONS) as EventKind[];
