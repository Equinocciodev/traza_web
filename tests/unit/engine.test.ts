import { describe, expect, it } from 'vitest';
import { evaluateUnit, parseCode, normalizeCode, unknownIdentifierResult, unverifiableResult } from '@/lib/verify/engine';
import { UNITS, UNIT_BY_CODE } from '@/fixtures/units';
import { SCENARIOS } from '@/fixtures/scenarios';

const registryName = 'Registro de prueba';

describe('parseCode', () => {
  it('normaliza mayúsculas, espacios y guiones', () => {
    expect(normalizeCode('trz demo 4k7q 92fa')).toBe('TRZ-DEMO-4K7Q-92FA');
    expect(normalizeCode('TRZDEMO4K7Q92FA')).toBe('TRZ-DEMO-4K7Q-92FA');
    expect(normalizeCode('https://traza-demo.example/verificar?c=TRZ-DEMO-4K7Q-92FA')).toBe('TRZ-DEMO-4K7Q-92FA');
  });
  it('rechaza vacío y formatos desconocidos', () => {
    expect(parseCode('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseCode('ABC-123')).toEqual({ ok: false, reason: 'unknown_format' });
  });
  it.each([
    'TRZ-DEMO-4K7Q-92FAZ',
    'trz-demo-4k7q-92faz',
    'prefixTRZ-DEMO-4K7Q-92FA',
    'prefixtrz-demo-4k7q-92fa',
    'https://traza-demo.example/verificar?c=TRZ-DEMO-4K7Q-92FAZ',
    'https://traza-demo.example/verificar/prefixTRZ-DEMO-4K7Q-92FA',
    'https://traza-demo.example/verificar?c=TRZ-DEMO-4K7Q-92FA&c=TRZ-DEMO-7H2M-31LC',
  ])('rechaza la entrada completa sin recortar caracteres: %s', (input) => {
    expect(parseCode(input)).toEqual({ ok: false, reason: 'unknown_format' });
  });
  it.each([
    'https://traza-demo.example/verificar?c=trz%20demo%204k7q%2092fa&t=licores',
    'https://traza-demo.example/verificar/trz-demo-4k7q-92fa/',
    'https://traza-demo.example/verificar/TRZDEMO4K7Q92FA',
  ])('normaliza el código completo dentro de una URL: %s', (input) => {
    expect(parseCode(input)).toEqual({ ok: true, code: 'TRZ-DEMO-4K7Q-92FA' });
  });
});

describe('evaluateUnit', () => {
  const expected: Record<string, { verdict: string; reason: string }> = {
    'TRZ-DEMO-4K7Q-92FA': { verdict: 'valid', reason: 'all_checks_passed' },
    'TRZ-DEMO-7H2M-31LC': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-DEMO-9P4T-55RD': { verdict: 'warning', reason: 'data_partial' },
    'TRZ-DEMO-2B8X-40NE': { verdict: 'invalid', reason: 'signature_invalid' },
    'TRZ-DEMO-6W3S-18KV': { verdict: 'invalid', reason: 'not_registered' },
    'TRZ-DEMO-5R9C-77MQ': { verdict: 'invalid', reason: 'revoked' },
    'TRZ-DEMO-3N6D-09ZB': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-DEMO-8L1F-63HW': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-DEMO-1V5J-26PT': { verdict: 'warning', reason: 'registry_suspended' },
    'TRZ-DEMO-6C2A-84MZ': { verdict: 'valid', reason: 'all_checks_passed' },
  };

  for (const unit of UNITS) {
    it(`deriva el veredicto esperado para ${unit.code}`, () => {
      const result = evaluateUnit(unit, { registryName, now: new Date('2026-09-05T12:00:00Z') });
      expect(result.verdict).toBe(expected[unit.code]?.verdict);
      expect(result.reason).toBe(expected[unit.code]?.reason);
      expect(result.simulated).toBe(true);
      expect(result.checks.signature.status).toBe(unit.signature.status);
    });
  }

  it('nunca expone la unidad cuando la firma es inválida o no está registrada', () => {
    expect(evaluateUnit(UNIT_BY_CODE.get('TRZ-DEMO-2B8X-40NE')!, { registryName }).unit).toBeUndefined();
    expect(evaluateUnit(UNIT_BY_CODE.get('TRZ-DEMO-6W3S-18KV')!, { registryName }).unit).toBeUndefined();
  });

  it('una firma válida no basta: revocado es inválido aunque la firma pase', () => {
    const r = evaluateUnit(UNIT_BY_CODE.get('TRZ-DEMO-5R9C-77MQ')!, { registryName });
    expect(r.checks.signature.outcome).toBe('pass');
    expect(r.verdict).toBe('invalid');
    expect(r.nextSteps).toContain('report');
  });
});

describe('resultados especiales', () => {
  it('identificador desconocido', () => {
    const r = unknownIdentifierResult('TRZ-DEMO-ZZZZ-0000', 'traza', registryName);
    expect(r.verdict).toBe('invalid');
    expect(r.reason).toBe('not_registered');
  });
  it('no verificable por transporte', () => {
    for (const reason of ['offline', 'server_error', 'timeout', 'registry_unavailable', 'unknown_format'] as const) {
      expect(unverifiableResult('X', 'traza', reason).verdict).toBe('unverifiable');
    }
  });
});

describe('escenarios', () => {
  it('cada escenario por código apunta a una unidad conocida o a un código de transporte/formato', () => {
    for (const s of SCENARIOS.filter((s) => s.trigger === 'code')) {
      if (s.id === 'unknown_format') continue;
      expect(UNIT_BY_CODE.has(s.code!)).toBe(true);
    }
  });
});
