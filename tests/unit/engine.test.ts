import { describe, expect, it } from 'vitest';
import { evaluateUnit, parseCode, normalizeCode, unknownIdentifierResult, unverifiableResult } from '@/lib/verify/engine';
import { UNITS, UNIT_BY_CODE } from '@/fixtures/units';
import { SCENARIOS } from '@/fixtures/scenarios';

const registryName = 'Registro de prueba';

describe('parseCode', () => {
  it('normaliza mayúsculas, espacios y guiones', () => {
    expect(normalizeCode('trz 7f2k 4k7q 92fa')).toBe('TRZ-7F2K-4K7Q-92FA');
    expect(normalizeCode('TRZ7F2K4K7Q92FA')).toBe('TRZ-7F2K-4K7Q-92FA');
    expect(normalizeCode('https://traza.technology/verificar?c=TRZ-7F2K-4K7Q-92FA')).toBe('TRZ-7F2K-4K7Q-92FA');
  });
  it('rechaza vacío y formatos desconocidos', () => {
    expect(parseCode('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseCode('ABC-123')).toEqual({ ok: false, reason: 'unknown_format' });
  });
  it.each([
    'TRZ-7F2K-4K7Q-92FAZ',
    'trz-7f2k-4k7q-92faz',
    'prefixTRZ-7F2K-4K7Q-92FA',
    'prefixtrz-7f2k-4k7q-92fa',
    'https://traza.technology/verificar?c=TRZ-7F2K-4K7Q-92FAZ',
    'https://traza.technology/verificar/prefixTRZ-7F2K-4K7Q-92FA',
    'https://traza.technology/verificar?c=TRZ-7F2K-4K7Q-92FA&c=TRZ-7F2K-7H2M-31LC',
  ])('rechaza la entrada completa sin recortar caracteres: %s', (input) => {
    expect(parseCode(input)).toEqual({ ok: false, reason: 'unknown_format' });
  });
  it.each([
    'https://traza.technology/verificar?c=trz%207f2k%204k7q%2092fa&t=licores',
    'https://traza.technology/verificar/trz-7f2k-4k7q-92fa/',
    'https://traza.technology/verificar/TRZ7F2K4K7Q92FA',
  ])('normaliza el código completo dentro de una URL: %s', (input) => {
    expect(parseCode(input)).toEqual({ ok: true, code: 'TRZ-7F2K-4K7Q-92FA' });
  });
});

describe('evaluateUnit', () => {
  const expected: Record<string, { verdict: string; reason: string }> = {
    'TRZ-7F2K-4K7Q-92FA': { verdict: 'valid', reason: 'all_checks_passed' },
    'TRZ-7F2K-7H2M-31LC': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-7F2K-9P4T-55RD': { verdict: 'warning', reason: 'data_partial' },
    'TRZ-7F2K-2B8X-40NE': { verdict: 'invalid', reason: 'signature_invalid' },
    'TRZ-7F2K-6W3S-18KV': { verdict: 'invalid', reason: 'not_registered' },
    'TRZ-7F2K-5R9C-77MQ': { verdict: 'invalid', reason: 'revoked' },
    'TRZ-7F2K-3N6D-09ZB': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-7F2K-8L1F-63HW': { verdict: 'warning', reason: 'anomalies_detected' },
    'TRZ-7F2K-1V5J-26PT': { verdict: 'warning', reason: 'registry_suspended' },
    'TRZ-7F2K-6C2A-84MZ': { verdict: 'valid', reason: 'all_checks_passed' },
  };

  for (const unit of UNITS) {
    it(`deriva el veredicto esperado para ${unit.code}`, () => {
      const result = evaluateUnit(unit, { registryName, now: new Date('2026-09-05T12:00:00Z') });
      expect(result.verdict).toBe(expected[unit.code]?.verdict);
      expect(result.reason).toBe(expected[unit.code]?.reason);
      expect(result.checks.signature.status).toBe(unit.signature.status);
    });
  }

  it('nunca expone la unidad cuando la firma es inválida o no está registrada', () => {
    expect(evaluateUnit(UNIT_BY_CODE.get('TRZ-7F2K-2B8X-40NE')!, { registryName }).unit).toBeUndefined();
    expect(evaluateUnit(UNIT_BY_CODE.get('TRZ-7F2K-6W3S-18KV')!, { registryName }).unit).toBeUndefined();
  });

  it('una firma válida no basta: revocado es inválido aunque la firma pase', () => {
    const r = evaluateUnit(UNIT_BY_CODE.get('TRZ-7F2K-5R9C-77MQ')!, { registryName });
    expect(r.checks.signature.outcome).toBe('pass');
    expect(r.verdict).toBe('invalid');
    expect(r.nextSteps).toContain('report');
  });
});

describe('resultados especiales', () => {
  it('identificador desconocido', () => {
    const r = unknownIdentifierResult('TRZ-7F2K-ZZZZ-0000', 'traza', registryName);
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
