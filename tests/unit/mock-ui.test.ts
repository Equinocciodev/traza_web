import { describe, expect, it } from 'vitest';
import { MOCK_UI } from '../../src/content/mock-ui';
import { FEATURED_UNIT_CODE, UNIT_BY_CODE } from '../../src/fixtures/units';
import { ROUTES } from '../../src/i18n';

function leaves(value: unknown): (string | number)[] {
  if (typeof value === 'string' || typeof value === 'number') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  return value && typeof value === 'object' ? Object.values(value).flatMap(leaves) : [];
}
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
  return typeof value;
}

describe('contenido de los ejemplos de interfaz', () => {
  it('mantiene la estructura ES/EN y sus datos cuantitativos', () => {
    expect(shape(MOCK_UI.es)).toEqual(shape(MOCK_UI.en));
    expect(MOCK_UI.es.dashboard.kpis.map(kpi => kpi.value)).toEqual([8, 3, 42]);
    expect(MOCK_UI.en.dashboard.kpis.map(kpi => kpi.value)).toEqual([8, 3, 42]);
    expect(MOCK_UI.es.dashboard.chart.series.map(point => point.value)).toEqual(MOCK_UI.en.dashboard.chart.series.map(point => point.value));
    expect(MOCK_UI.es.dashboard.kpis[0]!.trend?.at(-1)).toBe(MOCK_UI.es.dashboard.kpis[0]!.value);
  });

  it('rotula los ejemplos, sin porcentajes, cifras de escala ni vocabulario vetado', () => {
    expect(MOCK_UI.es.exampleLabel).toBe('Ejemplo · Datos ilustrativos');
    expect(MOCK_UI.en.exampleLabel).toBe('Example · Illustrative data');
    for (const leaf of leaves(MOCK_UI)) {
      if (typeof leaf === 'number') { expect(leaf).toBeGreaterThanOrEqual(0); expect(leaf).toBeLessThan(1000); }
      else {
        expect(leaf).not.toMatch(/%|\bdemo\b|demostra(?:ción|tiv)|demonstration|simulad|simulated|fictici|fictitious/i);
        expect(leaf).not.toMatch(/\b\d{4,}\b|\b\d{1,3}(?:[.,]\d{3})+\b/);
      }
    }
  });

  it('apunta a la misma unidad y al mismo lote que el registro destacado', () => {
    const featured = UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!;
    for (const data of Object.values(MOCK_UI)) {
      expect(data.unit.code).toBe(featured.code);
      expect(data.unit.lot).toBe(featured.origin.lot);
      expect(data.phone.rows.some(row => row.value === featured.origin.lot)).toBe(true);
      expect(data.phone.rows.some(row => /120 ml/.test(row.value))).toBe(true);
      expect(data.phone.rows.some(row => /10 mg\/ml/.test(row.value))).toBe(true);
    }
    expect(MOCK_UI.es.unit.name).toBe(featured.product.name);
    expect(MOCK_UI.es.unit.presentation).toBe(featured.product.presentation);
  });

  it('tiene cinco destinos reales, acciones y siete días coherentes, sin prometer logística o envío', () => {
    for (const locale of ['es', 'en'] as const) {
      const data = MOCK_UI[locale];
      expect(data.dashboard.nav).toHaveLength(5);
      expect(new Set(data.dashboard.nav.map(item => item.key)).size).toBe(5);
      for (const item of [...data.dashboard.nav, ...data.dashboard.actions]) expect(ROUTES[locale][item.key]).toBeTruthy();
      expect(data.dashboard.chart.series).toHaveLength(7);
      expect(data.dashboard.chart.series.at(-1)?.value).toBe(data.dashboard.kpis[2]!.value);
      expect(data.mini.nodes).toHaveLength(3);
      expect(data.mini.lots).toHaveLength(3);
      expect(data.dashboard.actions.length).toBeGreaterThan(0);
      for (const leaf of leaves(data)) if (typeof leaf === 'string') expect(leaf).not.toMatch(/logística|logistics|transporte|transportation|distribución|distribution|reporte enviado|report sent|llega al registro|reaches the registry/i);
    }
  });
});
