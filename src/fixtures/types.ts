/**
 * Tipos de los datos simulados del demo (fixtures).
 * TODO lo que describen estos tipos es ficticio: organizaciones, personas, lugares, lotes y eventos.
 * Ningún dato personal ni tributario real. Las verificaciones se simulan; no hay criptografía real.
 */
import type { TenantId } from '@/config/tenants';

export type { TenantId };

/** Texto localizado embebido en fixtures (la UI elige según el idioma). */
export interface LocalizedText {
  es: string;
  en: string;
}

/** Etapas de la cadena (coinciden con `ChainNodeId` del contenido). */
export type ChainStage = 'origin' | 'labeling' | 'transport' | 'distribution' | 'commerce' | 'verification';

export const CHAIN_STAGES: readonly ChainStage[] = [
  'origin',
  'labeling',
  'transport',
  'distribution',
  'commerce',
  'verification',
] as const;

export type EventKind =
  | 'identity_issued'
  | 'customs_cleared'
  | 'labeled'
  | 'shipped'
  | 'in_transit'
  | 'received'
  | 'dispatched'
  | 'received_commerce'
  | 'sold'
  | 'verified'
  | 'inspected'
  | 'reported'
  | 'revoked';

export interface Place {
  /** Nombre del sitio ficticio (planta, aduana, centro de distribución, comercio). */
  site: string;
  /** Región ficticia ("Región Centro"). Sin países reales. */
  region: string;
}

export interface UnitEvent {
  id: string;
  kind: EventKind;
  stage: ChainStage;
  /** Fecha-hora ISO 8601 (UTC). */
  at: string;
  /** Organización ficticia que registra el evento. */
  actor: string;
  place: Place;
  /** Referencia documental ficticia (guía, acta, orden). */
  ref?: string;
  note?: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* Señales de verificación                                             */
/* ------------------------------------------------------------------ */

/** Firma emitida: resultado SIMULADO de comprobar la firma del identificador. */
export type SignatureStatus = 'valid' | 'invalid' | 'malformed' | 'unknown_key' | 'not_checked';

/** Estado en registro: resultado SIMULADO de consultar el registro del tenant. */
export type RegistryStatus = 'active' | 'not_found' | 'revoked' | 'suspended' | 'unavailable' | 'not_checked';

/** Coincidencia de datos: lo impreso/escaneado frente a lo registrado. */
export type DataMatch = 'match' | 'partial' | 'mismatch' | 'not_checked';

export type AnomalyCode =
  | 'duplicate_scans'
  | 'geo_inconsistent'
  | 'chain_gap'
  | 'lot_withdrawn'
  | 'reported'
  | 'expired';

export type Severity = 'info' | 'warning' | 'critical';

export interface Anomaly {
  code: AnomalyCode;
  severity: Severity;
  detectedAt: string;
  detail: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* Unidad                                                              */
/* ------------------------------------------------------------------ */

export interface UnitProduct {
  /** Nombre comercial ficticio. */
  name: string;
  /** Presentación: "Botella 750 ml · 40 % vol." */
  presentation: string;
  /** Categoría genérica. */
  category: LocalizedText;
  /** Marca ficticia. */
  brand: string;
}

export interface UnitIssuer {
  name: string;
  role: 'manufacturer' | 'importer';
}

export interface UnitOrigin {
  /** Descripción del origen: planta o aduana de entrada (ficticia). */
  place: Place;
  lot: string;
  producedAt: string;
}

export interface Unit {
  /** Identificador público: TRZ-DEMO-XXXX-XXXX. */
  code: string;
  tenant: TenantId;
  product: UnitProduct;
  issuer: UnitIssuer;
  origin: UnitOrigin;
  signature: {
    status: SignatureStatus;
    /** Etiqueta del algoritmo objetivo; el demo no ejecuta criptografía. */
    algorithm: string;
    issuedAt: string;
    keyId: string;
  };
  registry: {
    status: RegistryStatus;
    registeredAt?: string;
    revokedAt?: string;
    revokedReason?: LocalizedText;
  };
  /** Comparación simulada entre los datos impresos y el registro. */
  dataMatch: DataMatch;
  /** Detalle de la comparación cuando no es 'match'. */
  dataMatchDetail?: LocalizedText;
  anomalies: Anomaly[];
  scans: {
    total: number;
    distinctRegions: number;
    lastAt?: string;
  };
  currentStage: ChainStage;
  destination?: Place;
  events: UnitEvent[];
}

/* ------------------------------------------------------------------ */
/* Escenarios de la demo de verificación                               */
/* ------------------------------------------------------------------ */

/** Escenarios que la UI ofrece para reproducir cada estado obligatorio. */
export type ScenarioId =
  | 'valid'
  | 'duplicate'
  | 'partial_match'
  | 'signature_invalid'
  | 'not_registered'
  | 'revoked'
  | 'reported'
  | 'chain_gap'
  | 'suspended'
  | 'unreadable'
  | 'unknown_format'
  | 'offline'
  | 'server_error'
  | 'timeout'
  | 'camera_denied'
  | 'camera_unavailable';

export interface Scenario {
  id: ScenarioId;
  /** Código de unidad asociado, si el escenario se dispara con un código. */
  code?: string;
  /** Cómo se reproduce: por código, por condición de transporte o por permiso del dispositivo. */
  trigger: 'code' | 'transport' | 'device';
  label: LocalizedText;
  description: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* Reporte de discrepancia                                             */
/* ------------------------------------------------------------------ */

export type DiscrepancyKind =
  | 'label_mismatch'
  | 'seal_damaged'
  | 'suspected_copy'
  | 'wrong_location'
  | 'already_scanned'
  | 'other';

export interface DiscrepancyReport {
  code: string;
  tenant: TenantId;
  kind: DiscrepancyKind;
  description: string;
  /** Opcionales: nunca obligatorios; no se piden datos tributarios. */
  location?: string;
  contactEmail?: string;
  verdictAtReport?: string;
}

export interface ReportReceipt {
  folio: string;
  receivedAt: string;
}
