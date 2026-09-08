/**
 * Adaptador de API del demo.
 *
 * - Modo `mock` (por defecto): resuelve con fixtures locales y latencias simuladas; no hace red.
 *   Reproduce las condiciones de transporte (offline, error de servidor, tiempo de espera) con códigos especiales
 *   y también detecta el estado real de conexión del navegador.
 * - Modo `remote`: esqueleto para endpoints futuros (ver src/config/env.ts → ENDPOINTS). No se usa en el demo.
 *
 * La interfaz `TrazaApi` es el contrato que las islas consumen; cambiar de modo no cambia la UI.
 */
import type { DiscrepancyReport, ReportReceipt, TenantId } from '@/fixtures/types';
import { UNIT_BY_CODE } from '@/fixtures/units';
import { TRANSPORT_CODES } from '@/fixtures/scenarios';
import { TENANTS } from '@/config/tenants';
import type { Locale } from '@/i18n';
import { evaluateUnit, parseCode, unknownIdentifierResult, unverifiableResult, type VerificationResult } from '@/lib/verify/engine';

export type ApiErrorKind = 'offline' | 'server' | 'timeout' | 'network' | 'aborted';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  constructor(kind: ApiErrorKind, message?: string, status?: number) {
    super(message ?? kind);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export interface VerifyOptions {
  tenant: TenantId;
  locale: Locale;
  signal?: AbortSignal;
  /** Latencia simulada en ms (solo mock). Por defecto 450–900 ms. */
  latency?: number;
}

export interface ContactForm {
  name: string;
  email: string;
  organization?: string;
  sector?: string;
  message: string;
}

export interface ContactReceipt {
  ticket: string;
  receivedAt: string;
}

export interface TrazaApi {
  readonly mode: 'mock' | 'remote';
  verify(input: string, opts: VerifyOptions): Promise<VerificationResult>;
  submitReport(report: DiscrepancyReport, opts?: { signal?: AbortSignal; latency?: number }): Promise<ReportReceipt>;
  submitContact(form: ContactForm, opts?: { signal?: AbortSignal; latency?: number }): Promise<ContactReceipt>;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/** Espera simulada, cancelable con AbortSignal. */
export function simulateLatency(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new ApiError('aborted'));
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new ApiError('aborted'));
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function randomLatency(min = 450, max = 900): number {
  return Math.round(min + Math.random() * (max - min));
}

let reportCounter = 418;
let contactCounter = 27;

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

/* ------------------------------------------------------------------ */
/* Implementación simulada                                             */
/* ------------------------------------------------------------------ */

export function createMockApi(): TrazaApi {
  return {
    mode: 'mock',

    async verify(input, opts) {
      const parsed = parseCode(input);
      const tenant = opts.tenant;
      if (!parsed.ok) {
        await simulateLatency(opts.latency ?? 150, opts.signal);
        return unverifiableResult(input.trim().toUpperCase(), tenant, 'unknown_format');
      }
      const code = parsed.code;

      // Estado real del navegador: sin red, no se consulta nada.
      if (isBrowserOffline() || code === TRANSPORT_CODES.offline) {
        await simulateLatency(opts.latency ?? 120, opts.signal);
        throw new ApiError('offline');
      }
      if (code === TRANSPORT_CODES.timeout) {
        await simulateLatency(opts.latency ?? 2600, opts.signal);
        throw new ApiError('timeout');
      }
      if (code === TRANSPORT_CODES.serverError) {
        await simulateLatency(opts.latency ?? 700, opts.signal);
        throw new ApiError('server', 'registry_error', 503);
      }

      await simulateLatency(opts.latency ?? randomLatency(), opts.signal);

      const unit = UNIT_BY_CODE.get(code);
      const registryName = TENANTS[unit?.tenant ?? tenant].registryName[opts.locale];
      if (!unit) return unknownIdentifierResult(code, tenant, registryName);
      return evaluateUnit(unit, { registryName });
    },

    async submitReport(report, opts = {}) {
      if (isBrowserOffline()) {
        await simulateLatency(opts.latency ?? 120, opts.signal);
        throw new ApiError('offline');
      }
      if (report.description.toLowerCase().includes('[error]')) {
        await simulateLatency(opts.latency ?? 600, opts.signal);
        throw new ApiError('server', 'report_error', 500);
      }
      await simulateLatency(opts.latency ?? randomLatency(500, 1100), opts.signal);
      reportCounter += 1;
      return { folio: `RPT-2026-${pad(reportCounter, 6)}`, receivedAt: new Date().toISOString() };
    },

    async submitContact(form, opts = {}) {
      if (isBrowserOffline()) {
        await simulateLatency(opts.latency ?? 120, opts.signal);
        throw new ApiError('offline');
      }
      if (form.message.toLowerCase().includes('[error]')) {
        await simulateLatency(opts.latency ?? 600, opts.signal);
        throw new ApiError('server', 'contact_error', 500);
      }
      await simulateLatency(opts.latency ?? randomLatency(500, 1100), opts.signal);
      contactCounter += 1;
      return { ticket: `CT-2026-${pad(contactCounter, 5)}`, receivedAt: new Date().toISOString() };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Esqueleto remoto (endpoints futuros)                                */
/* ------------------------------------------------------------------ */

export function createRemoteApi(baseUrl: string): TrazaApi {
  async function request<T>(url: string, init: RequestInit & { signal?: AbortSignal }): Promise<T> {
    if (isBrowserOffline()) throw new ApiError('offline');
    let res: Response;
    try {
      res = await fetch(url, { ...init, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw new ApiError('aborted');
      throw new ApiError('network', (err as Error).message);
    }
    if (res.status === 504 || res.status === 408) throw new ApiError('timeout', undefined, res.status);
    if (!res.ok) throw new ApiError('server', res.statusText, res.status);
    return (await res.json()) as T;
  }

  return {
    mode: 'remote',
    verify(input, opts) {
      const parsed = parseCode(input);
      if (!parsed.ok) return Promise.resolve(unverifiableResult(input.trim().toUpperCase(), opts.tenant, 'unknown_format'));
      const url = `${baseUrl}/v1/verify?code=${encodeURIComponent(parsed.code)}&tenant=${encodeURIComponent(opts.tenant)}&locale=${opts.locale}`;
      return request<VerificationResult>(url, { method: 'GET', signal: opts.signal });
    },
    submitReport(report, opts = {}) {
      return request<ReportReceipt>(`${baseUrl}/v1/reports`, { method: 'POST', body: JSON.stringify(report), signal: opts.signal });
    },
    submitContact(form, opts = {}) {
      return request<ContactReceipt>(`${baseUrl}/v1/contact`, { method: 'POST', body: JSON.stringify(form), signal: opts.signal });
    },
  };
}

/** Fábrica según entorno. Las islas importan `getApi()` y no conocen el modo. */
export function createApi(config: { mode: 'mock' | 'remote'; baseUrl: string }): TrazaApi {
  if (config.mode === 'remote' && config.baseUrl) return createRemoteApi(config.baseUrl);
  return createMockApi();
}
