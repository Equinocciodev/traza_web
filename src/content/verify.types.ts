/**
 * Contenido de la verificación pública.
 * Propietario: especialista de UX de verificación.
 *
 * Todo el texto visible de la isla vive aquí (ES/EN). El cliente recibe un subconjunto tipado
 * (`VerifyClientStrings`) mediante un bloque de datos JSON no ejecutable; el resto se renderiza en servidor.
 * Regla: nunca "auténtico". Cada resultado explica qué se comprobó, qué confianza aporta y el siguiente paso.
 */
import type { PageMeta } from './types';
import type { TenantId } from '@/config/tenants';
import type {
  AnomalyCode,
  ChainStage,
  DataMatch,
  DiscrepancyKind,
  EventKind,
  RegistryStatus,
  Severity,
  SignatureStatus,
} from '@/fixtures/types';
import type { CheckOutcome, NextStep, ReasonCode, Verdict } from '@/lib/verify/types';

/** Par título/cuerpo reutilizado en estados y avisos. */
export interface TitledText {
  title: string;
  body: string;
}

/** Errores de transporte que la UI distingue (coinciden con `ApiErrorKind`). */
export type TransportErrorKind = 'offline' | 'server' | 'timeout' | 'network' | 'aborted';

export interface VerifyContent {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** "Escanea. Verifica. Confía." */
    mantra: string;
    /** Frase corta que aclara que no hace falta instalar nada ni tener cuenta. */
    requirement: string;
  };

  /** Bloque de contexto del tenant (co-brand condicional). */
  tenant: {
    regionLabel: string;
    contextLabel: string;
    registryLabel: string;
    statusLabel: string;
    switchLabel: string;
    options: { id: TenantId; label: string }[];
    /** Aviso que acompaña al lockup cuando el tenant lo tiene (además del cobrandNotice del tenant). */
    lockupCaption: string;
  };

  scanner: {
    title: string;
    intro: string;
    viewerLabel: string;
    simulate: string;
    simulating: string;
    useCamera: string;
    stopCamera: string;
    typeInstead: string;
    retryCamera: string;
    /** Texto del estado inicial del visor. */
    idle: string;
    /** Texto mientras el haz recorre el código de ejemplo. */
    simulatingHint: string;
    /** Cámara activa con decodificador. */
    activeHint: string;
    /** Cámara activa sin BarcodeDetector. */
    noDetectorHint: string;
    denied: TitledText;
    unavailable: TitledText;
    unreadable: TitledText;
    privacyNote: string;
  };

  manual: {
    title: string;
    label: string;
    placeholder: string;
    hint: string;
    submit: string;
    errors: { empty: string; format: string };
    /** Se anuncia cuando el código escrito se normaliza al salir del campo. */
    normalized: string;
    noscript: string;
  };

  scenarios: {
    title: string;
    intro: string;
    groups: { code: string; transport: string; device: string };
    codeLabel: string;
    selected: string;
    network: {
      title: string;
      toggle: string;
      hint: string;
    };
  };

  states: {
    idle: TitledText;
    loading: TitledText;
    verifiedAtLabel: string;
    codeLabel: string;
    registryLabel: string;
    otherTenantNote: string;
    offlineBanner: TitledText;
    recovered: TitledText;
    retryingPending: string;
    errors: Record<TransportErrorKind, TitledText>;
    pendingCodeLabel: string;
    autoRetryNote: string;
    transportCodeNote: string;
    retry: string;
    typeAnother: string;
    nothingChecked: string;
    statusLabel: string;
  };

  verdicts: Record<Verdict, { label: string; confidence: string }>;
  reasons: Record<ReasonCode, TitledText>;

  checks: {
    title: string;
    intro: string;
    outcomes: Record<CheckOutcome, string>;
    signature: {
      title: string;
      help: string;
      status: Record<SignatureStatus, string>;
      algorithmLabel: string;
      issuedAtLabel: string;
      keyIdLabel: string;
    };
    registry: {
      title: string;
      help: string;
      status: Record<RegistryStatus, string>;
      registryLabel: string;
      registeredAtLabel: string;
      revokedAtLabel: string;
      reasonLabel: string;
    };
    dataMatch: {
      title: string;
      help: string;
      status: Record<DataMatch, string>;
    };
    anomalies: {
      title: string;
      help: string;
      none: string;
      skipped: string;
      detectedAtLabel: string;
      severity: Record<Severity, string>;
      codes: Record<AnomalyCode, string>;
    };
  };

  unit: {
    title: string;
    product: string;
    presentation: string;
    brand: string;
    category: string;
    issuer: string;
    issuerRoles: Record<'manufacturer' | 'importer', string>;
    lot: string;
    origin: string;
    producedAt: string;
    stage: string;
    stages: Record<ChainStage, string>;
    destination: string;
    lastEvent: string;
    eventKinds: Record<EventKind, string>;
    scans: string;
    /** Plantilla con {total} y {regions}. */
    scansValue: string;
    lastScan: string;
    noScans: string;
    hiddenNote: string;
  };

  meaning: {
    title: string;
    confidenceLabel: string;
    nextStepTitle: string;
    steps: Record<NextStep, string>;
    tenantHintLabel: string;
  };

  actions: {
    report: string;
    another: string;
    backToResult: string;
  };

  report: {
    title: string;
    intro: string;
    codeLabel: string;
    kindLabel: string;
    kindPlaceholder: string;
    kinds: Record<DiscrepancyKind, string>;
    descriptionLabel: string;
    descriptionHint: string;
    /** Plantilla con {count} y {max}. */
    counter: string;
    locationLabel: string;
    locationHint: string;
    emailLabel: string;
    emailHint: string;
    dataNote: string;
    submit: string;
    sending: string;
    cancel: string;
    errors: { kind: string; descriptionShort: string; descriptionLong: string; email: string };
    success: {
      title: string;
      folioLabel: string;
      receivedAtLabel: string;
      body: string;
      nextTitle: string;
      next: string[];
      proposalNote: string;
      done: string;
    };
    failure: Record<TransportErrorKind, TitledText>;
    retry: string;
  };

  a11y: {
    toolRegion: string;
    scannerRegion: string;
    resultRegion: string;
    reportRegion: string;
    skeleton: string;
    verdictIconLabels: Record<Verdict, string>;
    outcomeIconLabels: Record<CheckOutcome, string>;
  };
}

/** Subconjunto que la isla necesita en cliente (se serializa como bloque JSON no ejecutable). */
export type VerifyClientStrings = Pick<
  VerifyContent,
  'scanner' | 'manual' | 'scenarios' | 'states' | 'verdicts' | 'reasons' | 'checks' | 'unit' | 'meaning' | 'actions' | 'report' | 'a11y'
>;
