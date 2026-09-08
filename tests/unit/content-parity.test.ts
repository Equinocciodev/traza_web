/**
 * Paridad estructural ES ↔ EN de los diccionarios de contenido y contrato de metadatos.
 * Compara recursivamente getContent('es') con getContent('en'): mismas claves, mismas longitudes de
 * arrays, mismos tipos y mismos identificadores (`key`, `icon`, `id`, `status`, `code`, `state`, …).
 */
import { describe, expect, it } from 'vitest';
import { getContent } from '@/content';
import { CHAIN_STAGES } from '@/fixtures/types';
import { ROUTES, LOCALES } from '@/i18n';
import type { Cta } from '@/content/types';

const es = getContent('es');
const en = getContent('en');

/** Campos cuyo valor debe ser idéntico en ambos idiomas (identificadores, no texto). */
const IDENTITY_FIELDS = new Set(['key', 'icon', 'id', 'status', 'code', 'state', 'variant', 'external', 'suffix', 'href']);
/** Un valor cuenta como identificador solo si tiene forma de identificador (minúsculas ASCII o código TRZ, sin espacios); las etiquetas de columna ("Estado") empiezan por mayúscula. */
const IDENTIFIER_SHAPE = /^([a-z0-9][a-z0-9_-]*|TRZ-[A-Z0-9-]+|[?#][A-Za-z0-9=_-]+)$/;
/** Anclas de sección de la vista institucional: se traducen a propósito (#resumen ↔ #summary). */
const LOCALIZED_ANCHORS = /^content\.institutional\.(nav\.items\[\d+\]|summary|alerts|cases|inspections|audit)\.id$/;

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function diff(a: Json, b: Json, path: string, out: string[]): void {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      out.push(`${path}: tipo distinto (array vs no array)`);
      return;
    }
    if (a.length !== b.length) out.push(`${path}: longitud ${a.length} (es) ≠ ${b.length} (en)`);
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i += 1) diff(a[i] as Json, b[i] as Json, `${path}[${i}]`, out);
    return;
  }
  if (a !== null && typeof a === 'object' && b !== null && typeof b === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    const missingInEn = ka.filter((k) => !(k in b));
    const missingInEs = kb.filter((k) => !(k in a));
    if (missingInEn.length) out.push(`${path}: claves solo en es → ${missingInEn.join(', ')}`);
    if (missingInEs.length) out.push(`${path}: claves solo en en → ${missingInEs.join(', ')}`);
    for (const k of ka) {
      if (!(k in b)) continue;
      const va = (a as Record<string, Json>)[k] as Json;
      const vb = (b as Record<string, Json>)[k] as Json;
      const fullPath = `${path}.${k}`;
      const looksLikeId = typeof va === 'string' ? IDENTIFIER_SHAPE.test(va) : typeof va !== 'object' || va === null;
      if (IDENTITY_FIELDS.has(k) && looksLikeId && va !== vb && !LOCALIZED_ANCHORS.test(fullPath)) {
        out.push(`${fullPath}: identificador distinto ${JSON.stringify(va)} (es) ≠ ${JSON.stringify(vb)} (en)`);
      }
      diff(va, vb, `${path}.${k}`, out);
    }
    return;
  }
  if (typeof a !== typeof b) out.push(`${path}: tipo ${typeof a} (es) ≠ ${typeof b} (en)`);
}

function walkStrings(value: unknown, path: string, visit: (path: string, text: string) => void): void {
  if (typeof value === 'string') visit(path, value);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, `${path}[${i}]`, visit));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walkStrings(v, `${path}.${k}`, visit);
}

function collectCtas(value: unknown, path: string, out: { path: string; cta: Cta }[]): void {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectCtas(v, `${path}[${i}]`, out));
    return;
  }
  const obj = value as Record<string, unknown>;
  // Un CTA/enlace tiene `label` y `key`/`href`; los campos de historia y los KPI llevan `icon`/`description`/`hint` y no son enlaces.
  const isLink = typeof obj.label === 'string' && ('key' in obj || 'href' in obj) && !('icon' in obj) && !('description' in obj) && !('hint' in obj);
  if (isLink) out.push({ path, cta: obj as unknown as Cta });
  for (const [k, v] of Object.entries(obj)) collectCtas(v, `${path}.${k}`, out);
}

type PageWithMeta = { meta: { title: string; description: string } };
const PAGE_KEYS = [
  'home',
  'platform',
  'solutions',
  'solutionsGovernment',
  'solutionsIndustry',
  'solutionsCitizens',
  'howItWorks',
  'caseSpirits',
  'security',
  'company',
  'privacy',
  'notFound',
  'verify',
  'journey',
  'institutional',
] as const;

/**
 * Defectos conocidos (fuera del contrato 120–160): se listan aquí para que la suite siga en verde y
 * avise cuando el propietario los corrija (ver docs/08-informe-qa.md). Formato: `locale:página`.
 */
/**
 * Rango objetivo de la meta description: 150–220 caracteres.
 * Por debajo de 150 el fragmento desaprovecha el espacio disponible; por encima de 220
 * los buscadores lo recortan. La lista de defectos conocidos quedó vacía: si una página
 * vuelve a salirse del rango, corrija el texto en lugar de añadirla aquí.
 */
const DESCRIPTION_MIN = 150;
const DESCRIPTION_MAX = 220;
const KNOWN_DESCRIPTION_LENGTH_DEFECTS = new Set<string>([]);

describe('paridad ES ↔ EN', () => {
  it('la estructura de ambos diccionarios es idéntica (claves, arrays, tipos, identificadores)', () => {
    const problems: string[] = [];
    diff(es as unknown as Json, en as unknown as Json, 'content', problems);
    expect(problems).toEqual([]);
  });

  it('ningún texto queda vacío', () => {
    for (const [locale, dict] of [
      ['es', es],
      ['en', en],
    ] as const) {
      const empty: string[] = [];
      walkStrings(dict, locale, (path, text) => {
        if (text.trim() === '' && !/story\.empty$/.test(path)) empty.push(path);
      });
      expect(empty).toEqual([]);
    }
  });

  it('las cadenas con marcadores {x} / %s conservan los mismos marcadores en ambos idiomas', () => {
    const markers = (s: string) => (s.match(/\{\w+\}|%[a-z]/g) ?? []).sort().join(' ');
    const esMap = new Map<string, string>();
    walkStrings(es, '', (p, t) => esMap.set(p, t));
    const mismatches: string[] = [];
    walkStrings(en, '', (p, t) => {
      const other = esMap.get(p);
      if (other !== undefined && markers(other) !== markers(t)) mismatches.push(`${p}: ${markers(other)} ≠ ${markers(t)}`);
    });
    expect(mismatches).toEqual([]);
  });
});

describe('metadatos de página', () => {
  for (const locale of LOCALES) {
    const dict = locale === 'es' ? es : en;

    it(`[${locale}] títulos no vacíos, únicos y sin sufijo de marca`, () => {
      const titles = PAGE_KEYS.map((k) => (dict[k] as PageWithMeta).meta.title);
      for (const t of titles) {
        expect(t.trim().length).toBeGreaterThan(0);
        expect(t).not.toMatch(/traza/i);
      }
      expect(new Set(titles).size).toBe(titles.length);
    });

    it(`[${locale}] descripciones únicas y dentro de ${DESCRIPTION_MIN}–${DESCRIPTION_MAX} caracteres`, () => {
      const descriptions = PAGE_KEYS.map((k) => (dict[k] as PageWithMeta).meta.description);
      expect(new Set(descriptions).size).toBe(descriptions.length);
      const outOfRange = PAGE_KEYS.filter((k) => {
        const len = (dict[k] as PageWithMeta).meta.description.length;
        return len < DESCRIPTION_MIN || len > DESCRIPTION_MAX;
      }).map((k) => `${locale}:${k}`);
      const unexpected = outOfRange.filter((k) => !KNOWN_DESCRIPTION_LENGTH_DEFECTS.has(k));
      expect(unexpected).toEqual([]);
    });

    it(`[${locale}] los defectos conocidos de longitud siguen vigentes (si esto falla, quítelos de la lista)`, () => {
      for (const known of KNOWN_DESCRIPTION_LENGTH_DEFECTS) {
        const [l, k] = known.split(':') as [string, (typeof PAGE_KEYS)[number]];
        if (l !== locale) continue;
        const len = (dict[k] as PageWithMeta).meta.description.length;
        expect(len < DESCRIPTION_MIN || len > DESCRIPTION_MAX, `${known} tiene ${len} caracteres: ya cumple el contrato`).toBe(true);
      }
    });

    it(`[${locale}] la descripción por defecto y la de OG están dentro de rango`, () => {
      expect(dict.common.meta.defaultDescription.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(dict.common.meta.defaultDescription.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(dict.common.meta.titleTemplate).toContain('%s');
    });
  }
});

describe('coherencia interna del contenido', () => {
  it('los nodos de la cadena (inicio, cómo funciona y recorrido) siguen el orden de CHAIN_STAGES', () => {
    for (const dict of [es, en]) {
      expect(dict.home.chain.nodes.map((n) => n.id)).toEqual([...CHAIN_STAGES]);
      expect(dict.howItWorks.chain.nodes.map((n) => n.id)).toEqual([...CHAIN_STAGES]);
      expect(dict.journey.stages.map((n) => n.id)).toEqual([...CHAIN_STAGES]);
    }
  });

  it('las cuatro señales de verificación aparecen en el orden del motor', () => {
    for (const dict of [es, en]) {
      expect(dict.platform.verificationModel.signals.map((s) => s.key)).toEqual(['signature', 'registry', 'match', 'anomalies']);
      expect(dict.howItWorks.verification.signals.map((s) => s.key)).toEqual(['signature', 'registry', 'match', 'anomalies']);
      expect(dict.howItWorks.verification.outcomes.map((o) => o.status)).toEqual(['valid', 'warning', 'invalid', 'unverifiable']);
    }
  });

  it('todos los CTA apuntan a claves de ruta válidas y los sufijos son query o ancla', () => {
    for (const [locale, dict] of [
      ['es', es],
      ['en', en],
    ] as const) {
      const ctas: { path: string; cta: Cta }[] = [];
      collectCtas(dict, locale, ctas);
      expect(ctas.length).toBeGreaterThan(20);
      for (const { path, cta } of ctas) {
        if (cta.key) expect(cta.key in ROUTES[locale], `${path}: clave de ruta desconocida ${cta.key}`).toBe(true);
        else expect(typeof cta.href, `${path}: CTA sin key ni href`).toBe('string');
        if (cta.suffix) expect(cta.suffix, `${path}: sufijo inválido`).toMatch(/^[?#]/);
        expect(cta.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('la navegación y el pie enlazan todas las rutas del sitio (sin 404 ni enlaces externos)', () => {
    for (const dict of [es, en]) {
      const navKeys = new Set<string>();
      for (const item of dict.common.nav.items) {
        navKeys.add(item.key);
        item.children?.forEach((c) => navKeys.add(c.key));
      }
      navKeys.add(dict.common.nav.cta.key ?? '');
      for (const col of dict.common.footer.columns) for (const link of col.links) if (link.key) navKeys.add(link.key);
      for (const key of Object.keys(ROUTES.es)) if (key !== 'notFound') expect(navKeys.has(key), `ruta ${key} sin enlace en nav/pie`).toBe(true);
      expect(navKeys.has('notFound')).toBe(false);
    }
  });

  it('el aviso de co-brand existe en ambos idiomas', () => {
    expect(es.common.cobrandNotice).toMatch(/propuesta de piloto/i);
    expect(en.common.cobrandNotice).toMatch(/pilot proposal/i);
  });

  it('las anclas de la vista institucional coinciden con los ids de sus secciones en cada idioma', () => {
    for (const dict of [es, en]) {
      const i = dict.institutional;
      expect(i.nav.items.map((n) => n.id)).toEqual([i.summary.id, i.alerts.id, i.cases.id, i.inspections.id, i.audit.id]);
      for (const id of i.nav.items.map((n) => n.id)) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('las opciones del selector de unidad del recorrido y los tenants coinciden entre idiomas', () => {
    expect(es.journey.unitSelector.options.map((o) => o.code)).toEqual(en.journey.unitSelector.options.map((o) => o.code));
    expect(es.verify.tenant.options.map((o) => o.id)).toEqual(en.verify.tenant.options.map((o) => o.id));
    expect(es.institutional.roles.items.map((r) => r.id)).toEqual(['analyst', 'inspector', 'observer']);
    expect(en.institutional.roles.items.map((r) => r.id)).toEqual(['analyst', 'inspector', 'observer']);
  });
});
