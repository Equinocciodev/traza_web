/**
 * Motor de verificación por señales.
 *
 * Deriva un veredicto explicable a partir de cuatro señales separadas:
 *   1. Firma emitida      — ¿el identificador fue emitido por una clave conocida y no fue alterado?
 *   2. Estado en registro — ¿el registro del tenant lo reconoce y sigue vigente?
 *   3. Coincidencia de datos — ¿lo impreso/escaneado coincide con lo registrado?
 *   4. Anomalías          — duplicados, incoherencias geográficas, brechas de cadena, reportes, retiros.
 *
 * Prioridad del veredicto: unverifiable > invalid > warning > valid.
 * Una firma válida NUNCA equivale a "auténtico": solo indica emisión; las demás señales completan el cuadro.
 */
import type { Unit, TenantId, Severity } from '@/fixtures/types';
import type {
  CodeParse,
  NextStep,
  ReasonCode,
  VerificationResult,
  Verdict,
  SignatureCheck,
  RegistryCheck,
  DataMatchCheck,
  AnomaliesCheck,
  PublicUnit,
} from './types';

export type { VerificationResult, Verdict, ReasonCode, NextStep } from './types';

/** Formato público de los identificadores: TRZ-XXXX-XXXX-XXXX (alfanumérico, mayúsculas). */
const CODE_PATTERN = /^TRZ-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** Normaliza el código completo; en URLs HTTP(S) admite el parámetro c o el último segmento. */
export function normalizeCode(input: string): string {
  let value = input.trim();
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      const codes = url.searchParams.getAll('c');
      if (codes.length > 1) return value;
      // El QR de la etiqueta publicada usa esta URL corta con el ID sin prefijo.
      // Limitar la compatibilidad a ese host/ruta evita aceptar números arbitrarios.
      const labelCode = url.protocol === 'https:' && url.hostname === 't.example'
        && !url.port && !url.username && !url.password && !url.search && !url.hash
        ? /^\/v\/([a-z0-9]{12})\/?$/i.exec(url.pathname)
        : null;
      if (labelCode) return normalizeCode(`TRZ${labelCode[1]}`);
      value = codes.length === 1
        ? codes[0]!
        : decodeURIComponent(url.pathname.replace(/\/+$/, '').split('/').pop() ?? '');
    }
  } catch {
    // Una entrada manual se valida completa; nunca se extraen subcadenas de ella.
  }
  value = value.toUpperCase().replace(/[\s_]/g, '');
  const compact = value.replace(/-/g, '');
  if (/^TRZ[A-Z0-9]{12}$/.test(compact)) {
    return `TRZ-${compact.slice(3, 7)}-${compact.slice(7, 11)}-${compact.slice(11, 15)}`;
  }
  return value;
}

export function parseCode(input: string): CodeParse {
  if (!input || !input.trim()) return { ok: false, reason: 'empty' };
  const code = normalizeCode(input);
  if (!CODE_PATTERN.test(code)) return { ok: false, reason: 'unknown_format' };
  return { ok: true, code };
}

export function isKnownFormat(input: string): boolean {
  return parseCode(input).ok;
}

const SEVERITY_ORDER: Record<Severity, number> = { info: 0, warning: 1, critical: 2 };

function highestSeverity(items: Unit['anomalies']): Severity | null {
  return items.reduce<Severity | null>((acc, a) => {
    if (acc === null) return a.severity;
    return SEVERITY_ORDER[a.severity] > SEVERITY_ORDER[acc] ? a.severity : acc;
  }, null);
}

function signatureCheck(unit: Unit): SignatureCheck {
  const outcome =
    unit.signature.status === 'valid'
      ? 'pass'
      : unit.signature.status === 'not_checked'
        ? 'skipped'
        : unit.signature.status === 'unknown_key'
          ? 'warn'
          : 'fail';
  return {
    status: unit.signature.status,
    outcome,
    algorithm: unit.signature.algorithm,
    issuedAt: unit.signature.issuedAt,
    keyId: unit.signature.keyId,
  };
}

function registryCheck(unit: Unit, registryName: string): RegistryCheck {
  const s = unit.registry.status;
  const outcome = s === 'active' ? 'pass' : s === 'suspended' ? 'warn' : s === 'not_checked' || s === 'unavailable' ? 'skipped' : 'fail';
  return {
    status: s,
    outcome,
    registeredAt: unit.registry.registeredAt,
    revokedAt: unit.registry.revokedAt,
    revokedReason: unit.registry.revokedReason,
    registryName,
  };
}

function dataMatchCheck(unit: Unit): DataMatchCheck {
  const s = unit.dataMatch;
  const outcome = s === 'match' ? 'pass' : s === 'partial' ? 'warn' : s === 'not_checked' ? 'skipped' : 'fail';
  return { status: s, outcome, detail: unit.dataMatchDetail };
}

function anomaliesCheck(unit: Unit): AnomaliesCheck {
  const highest = highestSeverity(unit.anomalies);
  const outcome = highest === null ? 'pass' : highest === 'info' ? 'pass' : 'warn';
  return { outcome, items: unit.anomalies, highest };
}

function toPublicUnit(unit: Unit): PublicUnit {
  return {
    code: unit.code,
    tenant: unit.tenant,
    product: unit.product,
    issuer: unit.issuer,
    origin: { lot: unit.origin.lot, producedAt: unit.origin.producedAt, place: unit.origin.place },
    currentStage: unit.currentStage,
    lastLookupPlace: unit.lastLookupPlace,
    events: unit.events,
    scans: unit.scans,
  };
}

function decide(unit: Unit): { verdict: Verdict; reason: ReasonCode } {
  // 1. Firma
  if (unit.signature.status === 'malformed') return { verdict: 'invalid', reason: 'signature_malformed' };
  if (unit.signature.status === 'invalid') return { verdict: 'invalid', reason: 'signature_invalid' };
  // 2. Registro
  if (unit.registry.status === 'unavailable') return { verdict: 'unverifiable', reason: 'registry_unavailable' };
  if (unit.registry.status === 'not_found' || unit.signature.status === 'unknown_key') return { verdict: 'invalid', reason: 'not_registered' };
  if (unit.registry.status === 'revoked') return { verdict: 'invalid', reason: 'revoked' };
  // 3. Datos
  if (unit.dataMatch === 'mismatch') return { verdict: 'invalid', reason: 'data_mismatch' };
  // 4. Advertencias
  if (unit.registry.status === 'suspended') return { verdict: 'warning', reason: 'registry_suspended' };
  const highest = highestSeverity(unit.anomalies);
  if (highest === 'warning' || highest === 'critical') return { verdict: 'warning', reason: 'anomalies_detected' };
  if (unit.dataMatch === 'partial') return { verdict: 'warning', reason: 'data_partial' };
  if (highest === 'info') return { verdict: 'warning', reason: 'anomalies_detected' };
  return { verdict: 'valid', reason: 'all_checks_passed' };
}

function nextStepsFor(verdict: Verdict, reason: ReasonCode): NextStep[] {
  switch (verdict) {
    case 'valid':
      return ['compare_physical', 'keep_receipt'];
    case 'warning':
      return reason === 'registry_suspended'
        ? ['compare_physical', 'contact_seller', 'report']
        : ['compare_physical', 'report', 'contact_seller'];
    case 'invalid':
      return reason === 'revoked' ? ['do_not_purchase', 'report', 'contact_seller'] : ['do_not_purchase', 'report'];
    case 'unverifiable':
      return reason === 'offline' ? ['check_connection', 'retry', 'type_code'] : ['retry', 'type_code'];
  }
}

/** Evalúa una unidad conocida y devuelve el resultado explicable. */
export function evaluateUnit(unit: Unit, opts: { registryName: string; now?: Date }): VerificationResult {
  const { verdict, reason } = decide(unit);
  return {
    verdict,
    reason,
    code: unit.code,
    tenant: unit.tenant,
    verifiedAt: (opts.now ?? new Date()).toISOString(),
    checks: {
      signature: signatureCheck(unit),
      registry: registryCheck(unit, opts.registryName),
      dataMatch: dataMatchCheck(unit),
      anomalies: anomaliesCheck(unit),
    },
    nextSteps: nextStepsFor(verdict, reason),
    unit: verdict === 'invalid' && (reason === 'signature_invalid' || reason === 'signature_malformed' || reason === 'not_registered') ? undefined : toPublicUnit(unit),
  };
}

/** Resultado para un código con formato correcto que el registro no conoce. */
export function unknownIdentifierResult(code: string, tenant: TenantId, registryName: string, now = new Date()): VerificationResult {
  return {
    verdict: 'invalid',
    reason: 'not_registered',
    code,
    tenant,
    verifiedAt: now.toISOString(),
    checks: {
      signature: { status: 'unknown_key', outcome: 'warn' },
      registry: { status: 'not_found', outcome: 'fail', registryName },
      dataMatch: { status: 'not_checked', outcome: 'skipped' },
      anomalies: { outcome: 'skipped', items: [], highest: null },
    },
    nextSteps: nextStepsFor('invalid', 'not_registered'),
  };
}

/** Resultado "no verificable" por condiciones de transporte o de formato. */
export function unverifiableResult(
  code: string,
  tenant: TenantId,
  reason: Extract<ReasonCode, 'offline' | 'server_error' | 'timeout' | 'registry_unavailable' | 'unknown_format'>,
  now = new Date(),
): VerificationResult {
  return {
    verdict: 'unverifiable',
    reason,
    code,
    tenant,
    verifiedAt: now.toISOString(),
    checks: {
      signature: { status: 'not_checked', outcome: 'skipped' },
      registry: { status: reason === 'unknown_format' ? 'not_checked' : 'unavailable', outcome: 'skipped' },
      dataMatch: { status: 'not_checked', outcome: 'skipped' },
      anomalies: { outcome: 'skipped', items: [], highest: null },
    },
    nextSteps: reason === 'unknown_format' ? ['type_code'] : nextStepsFor('unverifiable', reason),
  };
}

/** Lista de comprobaciones en orden de presentación. */
export const CHECK_ORDER = ['signature', 'registry', 'dataMatch', 'anomalies'] as const;
export type CheckKey = (typeof CHECK_ORDER)[number];
