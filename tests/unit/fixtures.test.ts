/**
 * Integridad de los datos del registro: unidades, escenarios y vista institucional.
 * Comprueba formato de códigos, orden de eventos, referencias cruzadas y ausencia de datos reales o personales.
 */
import { describe, expect, it } from 'vitest';
import { UNITS, UNIT_BY_CODE, FEATURED_UNIT_CODE, ORGANIZATIONS, PLACE_INDEX } from '@/fixtures/units';
import { SCENARIOS, SCENARIO_BY_ID, TRANSPORT_CODES } from '@/fixtures/scenarios';
import { CHAIN_STAGES, type EventKind, type ScenarioId } from '@/fixtures/types';
import {
  ALERTS,
  ALERT_TYPES,
  AUDIT_LOG,
  CASES,
  INSPECTIONS,
  KPIS,
  KPI_BASE,
  PEOPLE,
  PERSON_BY_ID,
  INSPECTOR_ID,
  computeKpis,
  countAlertsByType,
  alertAssignedTo,
  CASE_BY_ID,
} from '@/fixtures/institutional';
import { TENANTS, isTenantId } from '@/config/tenants';
import { SECTORS } from '@/config/sectors';

const CODE_RE = /^TRZ-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const EVENT_KINDS: EventKind[] = [
  'import_declared',
  'identity_issued',
  'labeled',
  'sample_approved',
  'record_completed',
  'activated',
  'verified',
  'looked_up',
  'anomaly_flagged',
  'reported',
  'inspected',
  'reassigned',
  'range_voided',
  'revoked',
  'issuance_closed',
];
const SCENARIO_IDS: ScenarioId[] = [
  'valid',
  'duplicate',
  'partial_match',
  'signature_invalid',
  'not_registered',
  'revoked',
  'reported',
  'pending_activation',
  'suspended',
  'unreadable',
  'unknown_format',
  'offline',
  'server_error',
  'timeout',
  'camera_denied',
  'camera_unavailable',
];

/** Marcas reales de licores y términos vetados en fixtures (comparación sin distinguir mayúsculas, con límite de palabra). */
const REAL_SPIRITS_BRANDS = [
  'Diplomático',
  'Santa Teresa',
  'Cacique',
  'Pampero',
  'Carúpano',
  'Roble Viejo',
  'Ron Añejo Aniversario',
  'Johnnie Walker',
  'Chivas',
  'Buchanan',
  'Old Parr',
  'Black Label',
  'Red Label',
  'Bacardi',
  'Bacardí',
  'Havana Club',
  'Smirnoff',
  'Absolut',
  'Jack Daniel',
  'Jim Beam',
  'Ballantine',
  'Grant’s',
  "Grant's",
  'Dewar',
  'Jameson',
  'Glenfiddich',
  'Macallan',
  'Hennessy',
  'Moët',
  'Polar',
  'Zulia',
  'Solera',
  'Cocuy',
  'Ocumare',
];
const BANNED_FIXTURE_TERMS = ['auténtic', 'authentic', 'genuine', 'genuino', 'SENIAT', 'Venezuela', 'venezolan', 'blockchain', 'Caracas', 'Maracaibo', 'Valencia', 'Bolívar'];

function isoValid(value: string): boolean {
  return !Number.isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/.test(value);
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

const FIXTURE_STRINGS = collectStrings([UNITS, SCENARIOS, ALERTS, CASES, INSPECTIONS, AUDIT_LOG, PEOPLE, ORGANIZATIONS, PLACE_INDEX]);

describe('unidades', () => {
  it('hay unidades y sus códigos son únicos y con formato TRZ-XXXX-XXXX-XXXX', () => {
    expect(UNITS.length).toBeGreaterThanOrEqual(10);
    const codes = UNITS.map((u) => u.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(CODE_RE);
    expect(UNIT_BY_CODE.size).toBe(codes.length);
    expect(UNIT_BY_CODE.has(FEATURED_UNIT_CODE)).toBe(true);
  });

  it('los códigos de transporte tienen el mismo formato y no chocan con ninguna unidad', () => {
    for (const code of Object.values(TRANSPORT_CODES)) {
      expect(code).toMatch(CODE_RE);
      expect(UNIT_BY_CODE.has(code)).toBe(false);
    }
  });

  for (const unit of UNITS) {
    describe(unit.code, () => {
      it('pertenece a un tenant conocido y tiene etapa actual válida', () => {
        expect(isTenantId(unit.tenant)).toBe(true);
        expect(TENANTS[unit.tenant]).toBeDefined();
        expect(CHAIN_STAGES).toContain(unit.currentStage);
        expect(['manufacturer', 'importer']).toContain(unit.issuer.role);
      });

      it('sus eventos están ordenados por fecha, con ids únicos, etapas y tipos válidos y fechas ISO', () => {
        const ids = unit.events.map((e) => e.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (let i = 1; i < unit.events.length; i += 1) {
          expect(unit.events[i]!.at >= unit.events[i - 1]!.at, `${unit.code}: evento ${ids[i]} anterior a ${ids[i - 1]}`).toBe(true);
        }
        for (const e of unit.events) {
          expect(CHAIN_STAGES).toContain(e.stage);
          expect(EVENT_KINDS).toContain(e.kind);
          expect(isoValid(e.at)).toBe(true);
          expect(e.actor.trim().length).toBeGreaterThan(0);
          expect(e.place.site.trim().length).toBeGreaterThan(0);
          expect(e.place.region).toMatch(/^Región /);
          if (e.note) {
            expect(e.note.es.trim().length).toBeGreaterThan(0);
            expect(e.note.en.trim().length).toBeGreaterThan(0);
          }
        }
      });

      it('las fechas de firma, registro, origen y anomalías son ISO válidas y coherentes', () => {
        expect(isoValid(unit.signature.issuedAt)).toBe(true);
        expect(isoValid(unit.origin.producedAt)).toBe(true);
        if (unit.registry.registeredAt) {
          expect(isoValid(unit.registry.registeredAt)).toBe(true);
          expect(unit.registry.registeredAt >= unit.signature.issuedAt).toBe(true);
        }
        if (unit.registry.revokedAt) expect(isoValid(unit.registry.revokedAt)).toBe(true);
        for (const a of unit.anomalies) {
          expect(isoValid(a.detectedAt)).toBe(true);
          expect(['info', 'warning', 'critical']).toContain(a.severity);
        }
        expect(unit.scans.total).toBeGreaterThanOrEqual(0);
        expect(unit.scans.distinctRegions).toBeLessThanOrEqual(Math.max(1, unit.scans.total));
        if (unit.scans.lastAt) expect(isoValid(unit.scans.lastAt)).toBe(true);
      });

      it('la etapa actual coincide con la última etapa registrada cuando hay eventos', () => {
        if (unit.events.length === 0) return;
        const last = unit.events.reduce((acc, e) => (e.at > acc.at ? e : acc));
        expect(last.stage).toBe(unit.currentStage);
      });

      it('el algoritmo de firma se nombra sin rótulos de demostración', () => {
        expect(unit.signature.algorithm).toMatch(/ECDSA|Ed25519|RSA/i);
        for (const value of [unit.signature.algorithm, unit.issuer.name, unit.product.brand]) {
          expect(value).not.toMatch(/\(demo\)|\(simulad|demostraci[oó]n/i);
        }
      });
    });
  }

  it('los identificadores de eventos son únicos en todo el conjunto', () => {
    const ids = UNITS.flatMap((u) => u.events.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('escenarios', () => {
  it('cubre los 16 escenarios obligatorios con ids únicos', () => {
    expect(SCENARIOS.map((s) => s.id).sort()).toEqual([...SCENARIO_IDS].sort());
    expect(SCENARIO_BY_ID.size).toBe(SCENARIOS.length);
  });

  it('cada escenario por código apunta a una unidad existente, a un código de transporte o al formato desconocido', () => {
    for (const s of SCENARIOS) {
      expect(['code', 'transport', 'device']).toContain(s.trigger);
      expect(s.label.es.trim()).not.toBe('');
      expect(s.label.en.trim()).not.toBe('');
      if (s.trigger === 'device') {
        expect(s.code).toBeUndefined();
        continue;
      }
      expect(s.code).toBeDefined();
      if (s.id === 'unknown_format') {
        expect(s.code).not.toMatch(CODE_RE);
        continue;
      }
      if (s.trigger === 'transport') {
        expect(Object.values(TRANSPORT_CODES)).toContain(s.code);
        continue;
      }
      expect(UNIT_BY_CODE.has(s.code!), `${s.id} → ${s.code}`).toBe(true);
    }
  });

  it('los escenarios de código de la demo cubren todos los veredictos y ninguno repite código', () => {
    const codes = SCENARIOS.filter((s) => s.trigger === 'code').map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('vista institucional', () => {
  it('ids únicos en alertas, casos, inspecciones, cronología y personas', () => {
    for (const list of [ALERTS, CASES, INSPECTIONS, AUDIT_LOG, PEOPLE]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    expect(PERSON_BY_ID.has(INSPECTOR_ID)).toBe(true);
    expect(PERSON_BY_ID.get(INSPECTOR_ID)?.role).toBe('inspector');
  });

  it('las alertas referencian unidades, casos e inspectores existentes y tipos válidos', () => {
    for (const a of ALERTS) {
      expect(UNIT_BY_CODE.has(a.unitCode), `${a.id} → ${a.unitCode}`).toBe(true);
      expect(ALERT_TYPES).toContain(a.type);
      expect(['open', 'acknowledged', 'closed']).toContain(a.status);
      expect(isoValid(a.detectedAt)).toBe(true);
      if (a.caseId) expect(CASE_BY_ID.has(a.caseId), `${a.id} → ${a.caseId}`).toBe(true);
      if (a.assignedTo) expect(PERSON_BY_ID.get(a.assignedTo)?.role).toBe('inspector');
      expect(a.explanation.es.length).toBeGreaterThan(40);
      expect(a.explanation.en.length).toBeGreaterThan(40);
    }
  });

  it('la cronología está ordenada de más reciente a más antigua', () => {
    // Las alertas NO se comprueban aquí: ALR-2026-029 (30 ago) figura tras ALR-2026-030 (28 ago) en el array, pero
    // AlertsPanel.astro ordena por fecha al renderizar, así que no afecta a la UI (observación en docs/08-informe-qa.md).
    for (let i = 1; i < AUDIT_LOG.length; i += 1) expect(AUDIT_LOG[i]!.at <= AUDIT_LOG[i - 1]!.at, `${AUDIT_LOG[i]!.id}`).toBe(true);
  });

  it('los casos enlazan alertas existentes, inspectores válidos y acciones ordenadas', () => {
    for (const c of CASES) {
      expect(PERSON_BY_ID.get(c.inspectorId)?.role).toBe('inspector');
      expect(c.alertIds.length).toBeGreaterThan(0);
      for (const id of c.alertIds) {
        const alert = ALERTS.find((a) => a.id === id);
        expect(alert, `${c.id} → ${id}`).toBeDefined();
        expect(alert?.caseId).toBe(c.id);
      }
      for (let i = 1; i < c.actions.length; i += 1) expect(c.actions[i]!.at >= c.actions[i - 1]!.at).toBe(true);
      for (const action of c.actions) expect(PERSON_BY_ID.has(action.actorId), `${c.id} → ${action.actorId}`).toBe(true);
      if (c.status === 'closed') expect(c.outcome).toBeDefined();
    }
  });

  it('las inspecciones pertenecen a casos existentes y las realizadas tienen resultado', () => {
    for (const i of INSPECTIONS) {
      expect(CASE_BY_ID.has(i.caseId)).toBe(true);
      expect(PERSON_BY_ID.get(i.inspectorId)?.role).toBe('inspector');
      expect(isoValid(i.at)).toBe(true);
      if (i.status === 'done') expect(i.result).toBeDefined();
      else expect(i.result).toBeUndefined();
    }
  });

  it('la cronología referencia actores conocidos', () => {
    for (const e of AUDIT_LOG) {
      expect(PERSON_BY_ID.has(e.actorId), `${e.id} → ${e.actorId}`).toBe(true);
      expect(isoValid(e.at)).toBe(true);
      expect(e.object.trim()).not.toBe('');
    }
  });

  it('los KPIs derivados coinciden con los fixtures y el conteo por tipo suma todas las alertas', () => {
    expect(KPIS).toEqual(computeKpis(ALERTS, CASES));
    expect(KPIS.alertsOpen).toBe(ALERTS.filter((a) => a.status === 'open').length);
    expect(KPIS.casesInProgress).toBe(CASES.filter((c) => c.status !== 'closed').length);
    expect(KPIS.unitsRegistered).toBe(KPI_BASE.unitsRegistered);
    const byType = countAlertsByType(ALERTS);
    expect(Object.values(byType).reduce((a, b) => a + b, 0)).toBe(ALERTS.length);
  });

  it('alertAssignedTo resuelve por asignación directa o por el inspector del caso', () => {
    expect(alertAssignedTo({ assignedTo: 'insp-ibarra' }, () => undefined)).toBe('insp-ibarra');
    expect(alertAssignedTo({ caseId: 'CASO-2026-0143' }, (id) => CASE_BY_ID.get(id))).toBe('insp-salcedo');
    expect(alertAssignedTo({}, () => undefined)).toBeUndefined();
  });

  it('el inspector de demostración tiene al menos una alerta, un caso y una inspección visibles', () => {
    expect(ALERTS.some((a) => alertAssignedTo(a, (id) => CASE_BY_ID.get(id)) === INSPECTOR_ID)).toBe(true);
    expect(CASES.some((c) => c.inspectorId === INSPECTOR_ID)).toBe(true);
    expect(INSPECTIONS.some((i) => i.inspectorId === INSPECTOR_ID)).toBe(true);
  });

  it('los nombres de las personas no llevan rótulos de demostración', () => {
    for (const p of PEOPLE) expect(p.name).not.toMatch(/\(demo\)|\(simulad/i);
  });
});

describe('guardarraíles de los fixtures', () => {
  it('ninguna cadena usa "auténtico"/"authentic"/"genuine" ni menciona SENIAT, Venezuela, blockchain o ciudades reales', () => {
    const hits: string[] = [];
    for (const text of FIXTURE_STRINGS) {
      for (const term of BANNED_FIXTURE_TERMS) if (text.toLowerCase().includes(term.toLowerCase())) hits.push(`${term}: ${text.slice(0, 80)}`);
    }
    expect(hits).toEqual([]);
  });

  it('ningún fixture menciona marcas reales de licores', () => {
    const hits: string[] = [];
    for (const text of FIXTURE_STRINGS) {
      for (const brand of REAL_SPIRITS_BRANDS) {
        const re = new RegExp(`(^|[^\\p{L}])${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'iu');
        if (re.test(text)) hits.push(`${brand}: ${text.slice(0, 80)}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('no hay datos personales: correos, teléfonos, cédulas o RIF', () => {
    const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const phone = /(\+\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]\d{3}[\s-]?\d{4}\b/;
    const idDoc = /\b[VEJGP]-?\d{6,9}\b|\bRIF\b|c[eé]dula/i;
    const hits = FIXTURE_STRINGS.filter((t) => email.test(t) || phone.test(t) || idDoc.test(t));
    expect(hits).toEqual([]);
  });

  it('las regiones son ficticias ("Región …") y los sitios no son direcciones reales', () => {
    for (const place of Object.values(PLACE_INDEX)) {
      expect(place.region).toMatch(/^Región \p{Lu}\p{Ll}+$/u);
      expect(place.site).not.toMatch(/\d{3,}/);
    }
  });

  it('los sectores de ejemplo no afirman capacidades ni certificaciones', () => {
    for (const s of SECTORS) {
      expect(s.name.es.trim()).not.toBe('');
      expect(s.configurable.es.length).toBeGreaterThan(0);
      // "Reglas de garantía" (warranty) es una regla configurable de producto, no una garantía de seguridad.
      for (const text of [...s.configurable.es, ...s.configurable.en]) expect(text).not.toMatch(/certific|cumplimiento|compliance/i);
    }
  });
});
