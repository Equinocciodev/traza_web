/**
 * Contenido del recorrido del producto.
 * Propietario: especialista del recorrido.
 *
 * Todo texto visible de la página y de la isla vive aquí (ES/EN). La isla recibe en tiempo de
 * ejecución un subconjunto serializado (`JourneyClientData`) a través de `data-i18n`, de modo que
 * el cliente no necesita importar los diccionarios completos.
 */
import type { PageMeta, ChainNode, Cta, IconName } from './types';
import type { ChainStage, EventKind } from '@/fixtures/types';
import type { Locale } from '@/i18n';

/** Estado de una etapa respecto a la reproducción y al registro de la unidad. */
export type JourneyStageState = 'done' | 'active' | 'pending' | 'unrecorded';

/** Campos de la historia de la unidad (narrativa verificada). */
export type JourneyStoryKey = 'issuer' | 'product' | 'origin' | 'movements';

export interface JourneyUnitOption {
  /** Código de una unidad existente en `src/fixtures/units.ts`; las que no existan se omiten. */
  code: string;
  /** Etiqueta humana del selector, sin repetir el código. */
  label: string;
}

export interface JourneyStoryField {
  key: JourneyStoryKey;
  label: string;
  icon: IconName;
}

export interface JourneyExplainField extends JourneyStoryField {
  description: string;
}

/**
 * Cadenas que la isla necesita para reconstruir un recorrido en el cliente.
 * Los marcadores entre llaves (`{n}`, `{stage}`, …) se sustituyen con `fill()` de `model.ts`.
 */
export interface JourneyRuntimeStrings {
  /** Texto de cada tipo de evento (EventKind → texto). */
  eventKinds: Record<EventKind, string>;
  issuerRoles: Record<'manufacturer' | 'importer', string>;
  /** Rótulo textual del estado de cada etapa (los estados nunca dependen solo del color). */
  stageStates: Record<JourneyStageState, string>;
  /** Etapa alcanzada por el registro pero sin eventos propios. */
  stageEmpty: string;
  /** Etapa a la que la unidad no ha llegado según el registro. */
  stageUnrecorded: string;
  /** Resumen de eventos de una etapa: `{count}` y `{list}`. */
  events: { none: string; one: string; many: string };
  /** Estado global del recorrido: `{stage}`. */
  summary: { complete: string; inProgress: string; none: string };
  /** Texto de la barra de progreso: `{n}` y `{total}`. */
  progress: string;
  /** Mensajes de la región aria-live. */
  live: {
    stage: string;
    playing: string;
    paused: string;
    ended: string;
    endedPartial: string;
    loaded: string;
    loading: string;
    empty: string;
    error: string;
    unrecorded: string;
    restarted: string;
  };
  /** Formatos de la historia de la unidad. */
  story: {
    product: string;
    origin: string;
    lot: string;
    produced: string;
    movements: string;
    destination: string;
    noDestination: string;
    noMovements: string;
    empty: string;
  };
  /** Prefijo accesible de la referencia documental ("Referencia"). */
  refLabel: string;
}

/** Datos serializados en `data-i18n` para la isla: runtime + etiquetas de etapas + rótulos. */
export interface JourneyClientData extends JourneyRuntimeStrings {
  locale: Locale;
  stages: Record<ChainStage, string>;
  unitLabels: Record<string, string>;
  playLabels: { play: string; pause: string; replay: string };
  tenantLabels: Record<string, string>;
}

export interface JourneyContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  explorer: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Nombre accesible de la región interactiva. */
    regionLabel: string;
    keyboardHint: string;
    /** Aviso para navegadores sin JavaScript (dentro de <noscript>). */
    noScript: string;
  };
  /** Seis etapas con la misma nomenclatura que `home.chain.nodes`. */
  stages: ChainNode[];
  unitSelector: {
    label: string;
    help: string;
    codeLabel: string;
    registryLabel: string;
    options: JourneyUnitOption[];
  };
  controls: {
    play: string;
    pause: string;
    replay: string;
    prev: string;
    next: string;
    restart: string;
    stepsLabel: string;
    progressLabel: string;
    simulateError: string;
  };
  legend: { title: string; items: { state: JourneyStageState; label: string }[] };
  eventsSection: { title: string; intro: string };
  story: { title: string; fields: JourneyStoryField[] };
  states: {
    loading: string;
    empty: { title: string; body: string };
    error: { title: string; body: string; retry: string };
  };
  explain: {
    eyebrow: string;
    title: string;
    intro: string;
    quote: string;
    fields: JourneyExplainField[];
    note: string;
  };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
  runtime: JourneyRuntimeStrings;
}
