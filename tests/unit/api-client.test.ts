/**
 * Adaptador de API (modo simulado y esqueleto remoto), importado desde ./client para no depender de astro:env.
 * Todas las esperas usan `latency: 0`.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createApi, createMockApi, createRemoteApi, isBrowserOffline, simulateLatency } from '@/lib/api/client';
import { TRANSPORT_CODES, SCENARIO_BY_ID } from '@/fixtures/scenarios';
import { UNITS } from '@/fixtures/units';
import { TENANTS } from '@/config/tenants';
import type { DiscrepancyReport } from '@/fixtures/types';

const VALID = 'TRZ-DEMO-4K7Q-92FA';
const SIGNATURE_INVALID = 'TRZ-DEMO-2B8X-40NE';
const REVOKED = 'TRZ-DEMO-5R9C-77MQ';
const UNKNOWN_KNOWN_FORMAT = 'TRZ-ZZZZ-ZZZZ-ZZZZ';
const CAFE_TRAZA_TENANT = 'TRZ-DEMO-6C2A-84MZ';

const baseReport: DiscrepancyReport = {
  code: VALID,
  tenant: 'licores',
  kind: 'seal_damaged',
  description: 'El sello de la botella está roto.',
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function expectApiError(promise: Promise<unknown>, kind: ApiError['kind'], status?: number): Promise<ApiError> {
  let caught: unknown;
  try {
    await promise;
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(ApiError);
  const err = caught as ApiError;
  expect(err.kind).toBe(kind);
  expect(err.name).toBe('ApiError');
  if (status !== undefined) expect(err.status).toBe(status);
  return err;
}

describe('createMockApi().verify', () => {
  const api = createMockApi();

  it('está en modo mock', () => {
    expect(api.mode).toBe('mock');
  });

  it('código válido → verificación superada, con la unidad pública y marca simulated', async () => {
    const r = await api.verify(VALID, { tenant: 'licores', locale: 'es', latency: 0 });
    expect(r.verdict).toBe('valid');
    expect(r.reason).toBe('all_checks_passed');
    expect(r.code).toBe(VALID);
    expect(r.simulated).toBe(true);
    expect(r.unit?.code).toBe(VALID);
    expect(r.checks.registry.registryName).toBe(TENANTS.licores.registryName.es);
    // La unidad pública nunca expone las señales internas de la unidad.
    expect(r.unit).not.toHaveProperty('signature');
    expect(r.unit).not.toHaveProperty('registry');
    expect(r.unit).not.toHaveProperty('anomalies');
  });

  it('normaliza la entrada (minúsculas, espacios, sin guiones, URL) antes de resolver', async () => {
    for (const input of ['trz demo 4k7q 92fa', 'TRZDEMO4K7Q92FA', ` https://traza-demo.example/verificar/?c=${VALID} `]) {
      const r = await api.verify(input, { tenant: 'licores', locale: 'es', latency: 0 });
      expect(r.code).toBe(VALID);
      expect(r.verdict).toBe('valid');
    }
  });

  it('firma no válida → no válido, sin unidad', async () => {
    const r = await api.verify(SIGNATURE_INVALID, { tenant: 'licores', locale: 'es', latency: 0 });
    expect(r.verdict).toBe('invalid');
    expect(r.reason).toBe('signature_invalid');
    expect(r.unit).toBeUndefined();
  });

  it('revocado → no válido aunque la firma pase', async () => {
    const r = await api.verify(REVOKED, { tenant: 'licores', locale: 'es', latency: 0 });
    expect(r.verdict).toBe('invalid');
    expect(r.reason).toBe('revoked');
    expect(r.checks.signature.outcome).toBe('pass');
    expect(r.nextSteps).toEqual(['do_not_purchase', 'report', 'contact_seller']);
  });

  it('formato correcto pero desconocido → no reconocido en el registro del tenant solicitado', async () => {
    const r = await api.verify(UNKNOWN_KNOWN_FORMAT, { tenant: 'traza', locale: 'en', latency: 0 });
    expect(r.verdict).toBe('invalid');
    expect(r.reason).toBe('not_registered');
    expect(r.tenant).toBe('traza');
    expect(r.checks.registry.registryName).toBe(TENANTS.traza.registryName.en);
    expect(r.unit).toBeUndefined();
  });

  it('formato desconocido → no verificable con el texto en mayúsculas, sin consultar', async () => {
    const r = await api.verify('  abc-123 ', { tenant: 'licores', locale: 'es', latency: 0 });
    expect(r.verdict).toBe('unverifiable');
    expect(r.reason).toBe('unknown_format');
    expect(r.code).toBe('ABC-123');
    expect(r.nextSteps).toEqual(['type_code']);
    expect(Object.values(r.checks).every((c) => c.outcome === 'skipped')).toBe(true);
  });

  it('la unidad de otro despliegue conserva su tenant y el nombre de su registro', async () => {
    const r = await api.verify(CAFE_TRAZA_TENANT, { tenant: 'licores', locale: 'es', latency: 0 });
    expect(r.verdict).toBe('valid');
    expect(r.tenant).toBe('traza');
    expect(r.checks.registry.registryName).toBe(TENANTS.traza.registryName.es);
  });

  it('todas las unidades de los fixtures resuelven con el mismo veredicto que el motor', async () => {
    for (const unit of UNITS) {
      const r = await api.verify(unit.code, { tenant: unit.tenant, locale: 'es', latency: 0 });
      expect(r.code).toBe(unit.code);
      expect(['valid', 'warning', 'invalid']).toContain(r.verdict);
      expect(r.simulated).toBe(true);
    }
  });

  it('códigos de transporte → ApiError con el kind correspondiente', async () => {
    await expectApiError(api.verify(TRANSPORT_CODES.offline, { tenant: 'licores', locale: 'es', latency: 0 }), 'offline');
    await expectApiError(api.verify(TRANSPORT_CODES.timeout, { tenant: 'licores', locale: 'es', latency: 0 }), 'timeout');
    const err = await expectApiError(api.verify(TRANSPORT_CODES.serverError, { tenant: 'licores', locale: 'es', latency: 0 }), 'server', 503);
    expect(err.message).toBe('registry_error');
  });

  it('los escenarios de transporte apuntan a los códigos especiales', () => {
    expect(SCENARIO_BY_ID.get('offline')?.code).toBe(TRANSPORT_CODES.offline);
    expect(SCENARIO_BY_ID.get('timeout')?.code).toBe(TRANSPORT_CODES.timeout);
    expect(SCENARIO_BY_ID.get('server_error')?.code).toBe(TRANSPORT_CODES.serverError);
  });

  it('navegador sin conexión → ApiError offline aunque el código sea válido', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    expect(isBrowserOffline()).toBe(true);
    await expectApiError(api.verify(VALID, { tenant: 'licores', locale: 'es', latency: 0 }), 'offline');
    await expectApiError(api.submitReport(baseReport, { latency: 0 }), 'offline');
    await expectApiError(api.submitContact({ name: 'A', email: 'a@b.co', message: 'hola' }, { latency: 0 }), 'offline');
  });

  it('en Node (sin navigator.onLine) no se considera sin conexión', () => {
    expect(isBrowserOffline()).toBe(false);
  });

  it('AbortSignal ya abortado → ApiError aborted sin esperar', async () => {
    const controller = new AbortController();
    controller.abort();
    await expectApiError(api.verify(VALID, { tenant: 'licores', locale: 'es', latency: 0, signal: controller.signal }), 'aborted');
  });

  it('AbortSignal abortado durante la latencia → ApiError aborted y el temporizador se limpia', async () => {
    vi.useFakeTimers();
    try {
      const controller = new AbortController();
      const pending = api.verify(VALID, { tenant: 'licores', locale: 'es', latency: 5000, signal: controller.signal });
      const assertion = expectApiError(pending, 'aborted');
      controller.abort();
      await assertion;
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('simulateLatency resuelve tras el tiempo indicado y respeta la señal', async () => {
    await expect(simulateLatency(0)).resolves.toBeUndefined();
    const controller = new AbortController();
    controller.abort();
    await expectApiError(simulateLatency(10, controller.signal), 'aborted');
  });
});

describe('createMockApi().submitReport', () => {
  const api = createMockApi();

  it('devuelve un folio RPT-2026-XXXXXX creciente y una fecha ISO', async () => {
    const a = await api.submitReport(baseReport, { latency: 0 });
    const b = await api.submitReport(baseReport, { latency: 0 });
    expect(a.folio).toMatch(/^RPT-2026-\d{6}$/);
    expect(b.folio).toMatch(/^RPT-2026-\d{6}$/);
    expect(Number(b.folio.slice(-6))).toBe(Number(a.folio.slice(-6)) + 1);
    expect(Number.isNaN(Date.parse(a.receivedAt))).toBe(false);
  });

  it('"[error]" en la descripción → ApiError server 500 (sin distinguir mayúsculas)', async () => {
    const err = await expectApiError(api.submitReport({ ...baseReport, description: 'Prueba [ERROR] de servidor' }, { latency: 0 }), 'server', 500);
    expect(err.message).toBe('report_error');
  });

  it('respeta la señal de aborto', async () => {
    const controller = new AbortController();
    controller.abort();
    await expectApiError(api.submitReport(baseReport, { latency: 0, signal: controller.signal }), 'aborted');
  });
});

describe('createMockApi().submitContact', () => {
  const api = createMockApi();
  const form = { name: 'Persona de prueba', email: 'prueba@example.com', message: 'Mensaje de prueba suficientemente largo.' };

  it('devuelve un ticket CT-2026-XXXXX creciente', async () => {
    const a = await api.submitContact(form, { latency: 0 });
    const b = await api.submitContact(form, { latency: 0 });
    expect(a.ticket).toMatch(/^CT-2026-\d{5}$/);
    expect(Number(b.ticket.slice(-5))).toBe(Number(a.ticket.slice(-5)) + 1);
    expect(Number.isNaN(Date.parse(a.receivedAt))).toBe(false);
  });

  it('"[error]" en el mensaje → ApiError server 500', async () => {
    const err = await expectApiError(api.submitContact({ ...form, message: 'Forzar [error] del servidor' }, { latency: 0 }), 'server', 500);
    expect(err.message).toBe('contact_error');
  });
});

describe('createApi / createRemoteApi', () => {
  it('modo remote sin baseUrl cae al modo mock (seguro por defecto)', () => {
    expect(createApi({ mode: 'remote', baseUrl: '' }).mode).toBe('mock');
    expect(createApi({ mode: 'mock', baseUrl: 'https://api.example' }).mode).toBe('mock');
    expect(createApi({ mode: 'remote', baseUrl: 'https://api.example' }).mode).toBe('remote');
  });

  it('remote: formato desconocido se resuelve localmente sin red', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const api = createRemoteApi('https://api.example');
    const r = await api.verify('abc', { tenant: 'traza', locale: 'es' });
    expect(r.reason).toBe('unknown_format');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('remote: construye la URL del contrato /v1/verify y devuelve el JSON', async () => {
    const payload = { verdict: 'valid', reason: 'all_checks_passed', code: VALID, simulated: true };
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const api = createRemoteApi('https://api.example');
    const r = await api.verify(VALID, { tenant: 'licores', locale: 'en' });
    expect(r).toEqual(payload);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`https://api.example/v1/verify?code=${VALID}&tenant=licores&locale=en`);
    expect(init.method).toBe('GET');
    expect((init.headers as Record<string, string>).Accept).toBe('application/json');
  });

  it('remote: 504/408 → timeout, 5xx → server, fallo de red → network, AbortError → aborted', async () => {
    const api = createRemoteApi('https://api.example');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 504 })));
    await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'timeout', 504);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 408 })));
    await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'timeout', 408);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503, statusText: 'Service Unavailable' })));
    const server = await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'server', 503);
    expect(server.message).toBe('Service Unavailable');
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))));
    await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'network');
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(abortError)));
    await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'aborted');
  });

  it('remote: sin conexión no llama a fetch', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const api = createRemoteApi('https://api.example');
    await expectApiError(api.verify(VALID, { tenant: 'traza', locale: 'es' }), 'offline');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('remote: reportes y contacto van por POST a /v1/reports y /v1/contact', async () => {
    const fetchMock = vi.fn(async (url: string) =>
      new Response(JSON.stringify(url.endsWith('/v1/reports') ? { folio: 'RPT-1', receivedAt: 'x' } : { ticket: 'CT-1', receivedAt: 'x' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    // env.ts elimina la barra final de PUBLIC_API_BASE_URL antes de llegar aquí.
    const api = createRemoteApi('https://api.example');
    const receipt = await api.submitReport(baseReport);
    expect(receipt.folio).toBe('RPT-1');
    const contact = await api.submitContact({ name: 'A', email: 'a@b.co', message: 'hola' });
    expect(contact.ticket).toBe('CT-1');
    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(calls[0]?.[0]).toBe('https://api.example/v1/reports');
    expect(calls[0]?.[1]?.method).toBe('POST');
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toEqual(baseReport);
    expect(calls[1]?.[0]).toBe('https://api.example/v1/contact');
  });
});
