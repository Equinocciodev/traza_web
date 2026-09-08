/**
 * Tipos del motor de verificación.
 * El motor no ejecuta criptografía: deriva un veredicto explicable a partir de cuatro señales
 * separadas (firma emitida, estado en registro, coincidencia de datos y anomalías) que vienen de fixtures.
 */
import type { Anomaly, DataMatch, RegistryStatus, Severity, SignatureStatus, TenantId, Unit } from '@/fixtures/types';

/** Veredicto global. Nunca "auténtico": la verificación describe lo comprobado. */
export type Verdict = 'valid' | 'warning' | 'invalid' | 'unverifiable';

/** Motivo principal que explica el veredicto (una sola causa dominante para el titular). */
export type ReasonCode =
  | 'all_checks_passed'
  | 'anomalies_detected'
  | 'data_partial'
  | 'registry_suspended'
  | 'signature_invalid'
  | 'signature_malformed'
  | 'not_registered'
  | 'revoked'
  | 'data_mismatch'
  | 'registry_unavailable'
  | 'offline'
  | 'server_error'
  | 'timeout'
  | 'unknown_format';

export type CheckOutcome = 'pass' | 'warn' | 'fail' | 'skipped';

export interface SignatureCheck {
  status: SignatureStatus;
  outcome: CheckOutcome;
  algorithm?: string;
  issuedAt?: string;
  keyId?: string;
}

export interface RegistryCheck {
  status: RegistryStatus;
  outcome: CheckOutcome;
  registeredAt?: string;
  revokedAt?: string;
  revokedReason?: { es: string; en: string };
  registryName?: string;
}

export interface DataMatchCheck {
  status: DataMatch;
  outcome: CheckOutcome;
  detail?: { es: string; en: string };
}

export interface AnomaliesCheck {
  outcome: CheckOutcome;
  items: Anomaly[];
  highest: Severity | null;
}

export type NextStep = 'keep_receipt' | 'compare_physical' | 'report' | 'do_not_purchase' | 'contact_seller' | 'retry' | 'type_code' | 'check_connection';

/** Subconjunto público de la unidad que la verificación devuelve (sin datos internos). */
export interface PublicUnit {
  code: string;
  tenant: TenantId;
  product: Unit['product'];
  issuer: Unit['issuer'];
  origin: { lot: string; producedAt: string; place: Unit['origin']['place'] };
  currentStage: Unit['currentStage'];
  lastLookupPlace?: Unit['lastLookupPlace'];
  events: Unit['events'];
  scans: Unit['scans'];
}

export interface VerificationResult {
  verdict: Verdict;
  reason: ReasonCode;
  code: string;
  tenant: TenantId;
  verifiedAt: string;
  checks: {
    signature: SignatureCheck;
    registry: RegistryCheck;
    dataMatch: DataMatchCheck;
    anomalies: AnomaliesCheck;
  };
  nextSteps: NextStep[];
  unit?: PublicUnit;
}

export type CodeParse =
  | { ok: true; code: string }
  | { ok: false; reason: 'empty' | 'unknown_format' };
