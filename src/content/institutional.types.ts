/**
 * Contenido de la demo C · Vista institucional (siempre rotulada como demo).
 * Propietario: especialista de la vista institucional.
 *
 * Reglas: todo texto visible vive aquí (ES/EN); la vista nunca afirma implementación, relación institucional
 * ni cifras reales. Los KPIs se rotulan "simulado". Los estados se comunican con icono + texto.
 */
import type { PageMeta, IconName } from './types';
import type { Severity, AnomalyCode, SignatureStatus, RegistryStatus, DataMatch } from '@/fixtures/types';
import type { AlertType, AlertStatus, CaseStatus, InspectionStatus, ActorRole, AuditAction } from '@/fixtures/institutional';
import type { Verdict, ReasonCode, CheckOutcome } from '@/lib/verify/types';
import type { CheckKey } from '@/lib/verify/engine';

export type InstitutionalRoleId = 'analyst' | 'inspector' | 'observer';
export type KpiKey = 'unitsRegistered' | 'verificationsPeriod' | 'alertsOpen' | 'casesInProgress';
export type AuditRoleFilter = 'all' | ActorRole;

/** Etiquetas de estados y catálogos (se usan en servidor y en la isla). */
export interface InstitutionalLabels {
  severity: Record<Severity, string>;
  alertStatus: Record<AlertStatus, string>;
  alertType: Record<AlertType, string>;
  caseStatus: Record<CaseStatus, string>;
  inspectionStatus: Record<InspectionStatus, string>;
  actorRole: Record<ActorRole, string>;
  auditAction: Record<AuditAction, string>;
  verdict: Record<Verdict, string>;
  outcome: Record<CheckOutcome, string>;
  checkName: Record<CheckKey, string>;
}

/**
 * Cadenas que la isla necesita en cliente (se serializan en un atributo `data-i18n`).
 * Los marcadores `%s`, `%n`, `%d` se sustituyen en tiempo de ejecución.
 */
export interface InstitutionalIslandStrings {
  roles: Record<InstitutionalRoleId, string>;
  /** Actor de las acciones ejecutadas por la sesión: "Sesión de demostración · %s". */
  sessionActor: string;
  live: {
    roleChanged: string;
    filtered: string;
    detailOpened: string;
    caseOpened: string;
    acknowledged: string;
    caseCreated: string;
    inspectionScheduled: string;
    caseClosed: string;
    accessRequested: string;
    loaded: string;
    error: string;
    offline: string;
    online: string;
  };
  verdictReason: Record<ReasonCode, string>;
  signatureStatus: Record<SignatureStatus, string>;
  registryStatus: Record<RegistryStatus, string>;
  dataMatch: Record<DataMatch, string>;
  anomalyCode: Record<AnomalyCode, string>;
  detail: {
    /** "%s · %u" con tipo y unidad. */
    titleTemplate: string;
    caseNone: string;
    inspectorNone: string;
    /** "%n %v · %r %g · última: %d" (v y g se rellenan con las palabras en singular/plural). */
    scansTemplate: string;
    verificationWord: { one: string; other: string };
    regionWord: { one: string; other: string };
    signalDataMatch: string;
    signalAnomaly: string;
    signalScans: string;
    signalNone: string;
    keyTemplate: string;
    registeredTemplate: string;
    revokedTemplate: string;
    verdictNote: string;
    anomaliesNone: string;
    caseNoOutcome: string;
  };
  hints: {
    acknowledged: string;
    alreadyAcknowledged: string;
    closed: string;
    hasCase: string;
    needsCase: string;
    inspectorCannotOpenCase: string;
    inspectionExists: string;
    caseAlreadyClosed: string;
    inspectorCannotCloseCase: string;
    offline: string;
    observer: string;
  };
  newCase: {
    /** "Caso abierto desde la alerta %s" */
    titleTemplate: string;
    openedDescription: string;
    closedDescription: string;
    closedOutcome: string;
    inspectionDescription: string;
  };
  audit: {
    acknowledgedResult: string;
    caseOpenedResult: string;
    inspectionResult: string;
    caseClosedResult: string;
    accessResult: string;
    acknowledgedDescription: string;
    caseOpenedDescription: string;
    inspectionDescription: string;
    caseClosedDescription: string;
    accessDescription: string;
  };
  access: {
    /** "Solicitud registrada (simulada): %s" */
    requestedTemplate: string;
  };
}

export interface InstitutionalContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  banner: { title: string; body: string; readOnly: string };
  context: {
    tenantLabel: string;
    tenantValue: string;
    registryLabel: string;
    periodLabel: string;
    periodValue: string;
  };
  roles: {
    legend: string;
    help: string;
    currentLabel: string;
    items: { id: InstitutionalRoleId; label: string; description: string; icon: IconName }[];
  };
  demoControls: { title: string; simulateError: string; simulateErrorHint: string };
  nav: { label: string; items: { id: string; label: string }[] };
  summary: {
    id: string;
    title: string;
    intro: string;
    simulatedTag: string;
    kpis: { key: KpiKey; label: string; hint: string; icon: IconName }[];
    byType: { title: string; intro: string; countLabel: string };
  };
  alerts: {
    id: string;
    title: string;
    intro: string;
    listTitle: string;
    countTemplate: string;
    filters: { severityLabel: string; statusLabel: string; all: string; clear: string };
    columns: { severity: string; type: string; unit: string; region: string; date: string; status: string };
    selectPrompt: string;
    empty: { title: string; body: string; clear: string };
    detail: {
      title: string;
      back: string;
      unit: string;
      product: string;
      region: string;
      detected: string;
      status: string;
      linkedCase: string;
      inspector: string;
      explanation: string;
      evidence: string;
      evidenceIntro: string;
      signals: string;
      actions: string;
      actionsIntro: string;
      viewCase: string;
    };
    actions: { acknowledge: string; openCase: string; scheduleInspection: string };
  };
  cases: {
    id: string;
    title: string;
    intro: string;
    listTitle: string;
    selectPrompt: string;
    columns: { id: string; title: string; status: string; inspector: string; alerts: string; opened: string };
    detail: {
      back: string;
      status: string;
      inspector: string;
      opened: string;
      linkedAlerts: string;
      timeline: string;
      outcome: string;
      actions: string;
      closeCase: string;
      openAlert: string;
    };
  };
  inspections: {
    id: string;
    title: string;
    intro: string;
    columns: { id: string; site: string; date: string; inspector: string; status: string; result: string; caseRef: string };
    noResult: string;
  };
  audit: {
    id: string;
    title: string;
    intro: string;
    caption: string;
    timezoneNote: string;
    filterLabel: string;
    all: string;
    inspectorNote: string;
    columns: { at: string; actor: string; role: string; action: string; object: string; result: string };
    empty: string;
  };
  permissions: { title: string; body: string; audit: string; request: string; requested: string };
  states: {
    loading: string;
    loadingHint: string;
    errorTitle: string;
    errorBody: string;
    retry: string;
    offlineTitle: string;
    offlineBody: string;
    onlineTitle: string;
    onlineBody: string;
  };
  labels: InstitutionalLabels;
  island: InstitutionalIslandStrings;
}
