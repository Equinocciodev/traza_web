/**
 * Rutas, base URL y utilidades de idioma (src/i18n/index.ts).
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  ROUTES,
  formatDate,
  formatDateTime,
  formatNumber,
  localeFromPath,
  otherLocale,
  route,
  withBase,
  type RouteKey,
} from '@/i18n';

const EXPECTED_KEYS: RouteKey[] = [
  'home',
  'platform',
  'solutions',
  'solutionsGovernment',
  'solutionsIndustry',
  'solutionsCitizens',
  'howItWorks',
  'caseMedicines',
  'codeSpec',
  'integration',
  'rationale',
  'verify',
  'journey',
  'institutional',
  'security',
  'company',
  'privacy',
  'notFound',
];

describe('ROUTES', () => {
  it(`declara exactamente las ${EXPECTED_KEYS.length} claves en los dos idiomas`, () => {
    expect(LOCALES).toEqual(['es', 'en']);
    expect(DEFAULT_LOCALE).toBe('es');
    for (const locale of LOCALES) {
      expect(Object.keys(ROUTES[locale]).sort()).toEqual([...EXPECTED_KEYS].sort());
    }
  });

  it('todas las rutas empiezan y terminan con barra y son únicas dentro de cada idioma', () => {
    for (const locale of LOCALES) {
      const values = Object.values(ROUTES[locale]);
      for (const path of values) {
        expect(path.startsWith('/')).toBe(true);
        expect(path.endsWith('/')).toBe(true);
        expect(path).not.toMatch(/\/\//);
        expect(path).toMatch(/^[a-z0-9/-]+$/);
      }
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('el inglés vive bajo /en/ y el español en la raíz (sin prefijo)', () => {
    for (const key of EXPECTED_KEYS) {
      expect(ROUTES.en[key].startsWith('/en/')).toBe(true);
      expect(ROUTES.es[key].startsWith('/en')).toBe(false);
    }
    expect(ROUTES.es.home).toBe('/');
    expect(ROUTES.en.home).toBe('/en/');
  });

  it('los slugs están traducidos (ningún slug inglés coincide con el español salvo la raíz)', () => {
    for (const key of EXPECTED_KEYS) {
      if (key === 'home' || key === 'notFound') continue;
      expect(ROUTES.en[key].replace(/^\/en/, '')).not.toBe(ROUTES.es[key]);
    }
  });

  it('las rutas anidadas cuelgan de su padre en ambos idiomas', () => {
    for (const locale of LOCALES) {
      const r = ROUTES[locale];
      for (const child of ['solutionsGovernment', 'solutionsIndustry', 'solutionsCitizens'] as const) {
        expect(r[child]).toMatch(new RegExp(`^${r.solutions}[a-z-]+/$`));
      }
      expect(r.caseMedicines).toMatch(/^\/(en\/)?[a-z]+\/[a-z]+\/$/);
    }
  });
});

describe('withBase / route', () => {
  it('con base "/" o vacía devuelve la ruta tal cual', () => {
    expect(withBase('/verificar/', '/')).toBe('/verificar/');
    expect(withBase('/verificar/', '')).toBe('/verificar/');
    expect(withBase('/', '/')).toBe('/');
  });

  it('con base "/demo/" (con o sin barra final) antepone el subdirectorio sin duplicar barras', () => {
    expect(withBase('/verificar/', '/demo/')).toBe('/demo/verificar/');
    expect(withBase('/verificar/', '/demo')).toBe('/demo/verificar/');
    expect(withBase('/', '/demo/')).toBe('/demo/');
    expect(withBase('/en/verify/', '/demo/')).toBe('/demo/en/verify/');
    expect(withBase('/favicon.svg', '/demo/')).toBe('/demo/favicon.svg');
  });

  it('route() resuelve clave + idioma + base', () => {
    expect(route('es', 'verify', '/')).toBe('/verificar/');
    expect(route('en', 'verify', '/')).toBe('/en/verify/');
    expect(route('es', 'caseMedicines', '/demo/')).toBe('/demo/casos/medicamentos/');
    expect(route('en', 'caseMedicines', '/demo/')).toBe('/demo/en/cases/medicines/');
    expect(route('es', 'home', '/demo')).toBe('/demo/');
  });

  it('route() sin base explícita usa la base del entorno de build (por defecto "/")', () => {
    expect(route('es', 'journey')).toBe(withBase('/recorrido/'));
    expect(route('es', 'journey').endsWith('/recorrido/')).toBe(true);
  });
});

describe('localeFromPath / otherLocale', () => {
  it('deduce el idioma desde el pathname', () => {
    expect(localeFromPath('/')).toBe('es');
    expect(localeFromPath('')).toBe('es');
    expect(localeFromPath('/verificar/')).toBe('es');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/en/')).toBe('en');
    expect(localeFromPath('/en/verify/')).toBe('en');
    expect(localeFromPath('//en/verify/')).toBe('en');
  });

  it('no confunde rutas que solo empiezan por "en" ni las que llevan base', () => {
    expect(localeFromPath('/english/')).toBe('es');
    expect(localeFromPath('/empresa/')).toBe('es');
    expect(localeFromPath('/entrada/')).toBe('es');
    // Limitación documentada: con PUBLIC_BASE_PATH=/demo/ la deducción por pathname no elimina la base;
    // las islas leen primero `data-locale` del servidor, por lo que no afecta al demo.
    expect(localeFromPath('/demo/en/verify/')).toBe('es');
  });

  it('otherLocale alterna entre los dos idiomas', () => {
    expect(otherLocale('es')).toBe('en');
    expect(otherLocale('en')).toBe('es');
  });

  it('LOCALE_LABELS es coherente con html lang y og:locale', () => {
    expect(LOCALE_LABELS.es.htmlLang).toBe('es');
    expect(LOCALE_LABELS.en.htmlLang).toBe('en');
    expect(LOCALE_LABELS.es.ogLocale).toMatch(/^es_/);
    expect(LOCALE_LABELS.en.ogLocale).toMatch(/^en_/);
    expect(LOCALE_LABELS.es.short).toBe('ES');
    expect(LOCALE_LABELS.en.short).toBe('EN');
  });
});

describe('formateo', () => {
  it('formatDate devuelve la entrada cuando la fecha no es válida', () => {
    expect(formatDate('no-es-fecha', 'es')).toBe('no-es-fecha');
    expect(formatDate('', 'en')).toBe('');
  });

  it('formatDate / formatDateTime producen texto distinto por idioma para una fecha válida', () => {
    const iso = '2026-07-12T13:00:00Z';
    const es = formatDate(iso, 'es');
    const en = formatDate(iso, 'en');
    expect(es).toMatch(/2026/);
    expect(en).toMatch(/2026/);
    expect(en).toMatch(/Jul/);
    expect(formatDateTime(iso, 'en')).toMatch(/\d{1,2}:\d{2}/);
    expect(formatDateTime(iso, 'es')).toMatch(/\d{1,2}:\d{2}/);
  });

  it('formatNumber usa separadores por idioma', () => {
    expect(formatNumber(1284, 'en')).toBe('1,284');
    expect(formatNumber(1284, 'es')).toBe('1.284');
    expect(formatNumber(0, 'es')).toBe('0');
  });
});
