/**
 * Modelo puro del recorrido (sin DOM). Lo usan el render en servidor (JourneyApp.astro) y la isla
 * (journey.ts) para que ambos produzcan exactamente la misma información.
 */
import { CHAIN_STAGES, type ChainStage, type Unit, type UnitEvent } from '@/fixtures/types';
import type { JourneyClientData, JourneyStageState, JourneyStoryKey } from '@/content/journey.types';
import { formatDate, formatDateTime } from '@/i18n';

export interface StageGroup {
  id: ChainStage;
  index: number;
  label: string;
  events: UnitEvent[];
}

export interface JourneyModel {
  code: string;
  unit: Unit | null;
  stages: StageGroup[];
  /** Índice de la última etapa con eventos; -1 si no hay recorrido. */
  lastRecorded: number;
  /** Número de etapas de la cadena (6). */
  total: number;
  /** Icono del nodo de origen según quién emite la identidad. */
  originIcon: 'factory' | 'customs';
}

export interface StoryEntry {
  key: JourneyStoryKey;
  primary: string;
  secondary: string;
}

export type SummaryKind = 'complete' | 'inProgress' | 'none';

/** Sustituye marcadores `{clave}` por valores. Los marcadores sin valor se dejan tal cual. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export function buildJourney(unit: Unit | null, data: JourneyClientData): JourneyModel {
  const stages: StageGroup[] = CHAIN_STAGES.map((id, index) => ({
    id,
    index,
    label: data.stages[id],
    events: unit ? unit.events.filter((e) => e.stage === id).sort((a, b) => a.at.localeCompare(b.at)) : [],
  }));
  const lastRecorded = stages.reduce((acc, s) => (s.events.length > 0 ? s.index : acc), -1);
  return {
    code: unit?.code ?? '',
    unit,
    stages,
    lastRecorded,
    total: stages.length,
    originIcon: unit?.issuer.role === 'importer' ? 'customs' : 'factory',
  };
}

/** Estado de una etapa dada la etapa actual de la reproducción y la última registrada. */
export function stageState(index: number, current: number, lastRecorded: number): JourneyStageState {
  if (index > lastRecorded) return 'unrecorded';
  if (index === current) return 'active';
  if (index < current) return 'done';
  return 'pending';
}

/** Progreso 0–1 de la línea para una etapa (los nodos equidistan; la línea es recta). */
export function lineProgress(index: number, total: number): number {
  if (index < 0 || total <= 1) return 0;
  return Math.min(1, index / (total - 1));
}

export function eventsSummary(events: UnitEvent[], data: JourneyClientData): string {
  if (events.length === 0) return data.events.none;
  const list = events.map((e) => data.eventKinds[e.kind]).join(', ');
  if (events.length === 1) return fill(data.events.one, { list });
  return fill(data.events.many, { count: events.length, list });
}

export function stageAnnouncement(model: JourneyModel, index: number, data: JourneyClientData): string {
  const stage = model.stages[index];
  if (!stage) return '';
  return fill(data.live.stage, {
    n: index + 1,
    total: model.total,
    stage: stage.label,
    events: eventsSummary(stage.events, data),
  });
}

export function progressText(index: number, total: number, data: JourneyClientData): string {
  return fill(data.progress, { n: Math.max(0, index + 1), total });
}

export function summarize(model: JourneyModel, data: JourneyClientData): { kind: SummaryKind; text: string } {
  if (model.lastRecorded < 0) return { kind: 'none', text: data.summary.none };
  const stage = model.stages[model.lastRecorded]?.label ?? '';
  if (model.lastRecorded === model.total - 1) return { kind: 'complete', text: fill(data.summary.complete, { stage }) };
  return { kind: 'inProgress', text: fill(data.summary.inProgress, { stage }) };
}

export function endAnnouncement(model: JourneyModel, data: JourneyClientData): string {
  const stage = model.stages[model.lastRecorded]?.label ?? '';
  return model.lastRecorded === model.total - 1 ? fill(data.live.ended, { stage }) : fill(data.live.endedPartial, { stage });
}

export function formatEventTime(iso: string, data: JourneyClientData): string {
  return formatDateTime(iso, data.locale);
}

/** Historia de la unidad: fabricante/importador · producto/presentación · origen/lote · movimientos/destino. */
export function buildStory(model: JourneyModel, data: JourneyClientData): StoryEntry[] {
  const { unit } = model;
  const empty = data.story.empty;
  if (!unit) {
    return (['issuer', 'product', 'origin', 'movements'] as JourneyStoryKey[]).map((key) => ({ key, primary: empty, secondary: empty }));
  }
  const recordedStages = model.stages.filter((s) => s.events.length > 0).length;
  const movementsPrimary =
    unit.events.length > 0
      ? fill(data.story.movements, { events: unit.events.length, stages: recordedStages, total: model.total })
      : data.story.noMovements;
  const movementsSecondary = unit.destination
    ? fill(data.story.destination, { site: unit.destination.site, region: unit.destination.region })
    : data.story.noDestination;
  return [
    { key: 'issuer', primary: unit.issuer.name, secondary: data.issuerRoles[unit.issuer.role] },
    {
      key: 'product',
      primary: unit.product.name,
      secondary: fill(data.story.product, { presentation: unit.product.presentation, category: unit.product.category[data.locale] }),
    },
    {
      key: 'origin',
      primary: fill(data.story.origin, { site: unit.origin.place.site, region: unit.origin.place.region }),
      secondary: `${fill(data.story.lot, { lot: unit.origin.lot })} · ${fill(data.story.produced, {
        // Fechas sin hora: se formatean en UTC para no retroceder un día en husos negativos.
        date: formatDate(unit.origin.producedAt, data.locale, { timeZone: 'UTC' }),
      })}`,
    },
    { key: 'movements', primary: movementsPrimary, secondary: movementsSecondary },
  ];
}
