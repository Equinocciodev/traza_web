/**
 * Utilidades de internacionalización.
 * Español (es) es el idioma por defecto y vive en la raíz; inglés (en) vive bajo /en/.
 * Las rutas tienen slugs traducidos (mejor SEO y coherencia internacional).
 */
export type Locale = 'es' | 'en';

export const LOCALES: readonly Locale[] = ['es', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_LABELS: Record<Locale, { native: string; short: string; htmlLang: string; ogLocale: string }> = {
  es: { native: 'Español', short: 'ES', htmlLang: 'es', ogLocale: 'es_ES' },
  en: { native: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
};

/** Claves de ruta del sitio. Cada página declara la suya para que el selector de idioma funcione. */
export type RouteKey =
  | 'home'
  | 'platform'
  | 'solutions'
  | 'solutionsGovernment'
  | 'solutionsIndustry'
  | 'solutionsCitizens'
  | 'howItWorks'
  | 'caseMedicines'
  | 'codeSpec'
  | 'integration'
  | 'rationale'
  | 'verify'
  | 'journey'
  | 'institutional'
  | 'security'
  | 'company'
  | 'privacy'
  | 'notFound';

export const ROUTES: Record<Locale, Record<RouteKey, string>> = {
  es: {
    home: '/',
    platform: '/plataforma/',
    solutions: '/soluciones/',
    solutionsGovernment: '/soluciones/gobierno/',
    solutionsIndustry: '/soluciones/industria/',
    solutionsCitizens: '/soluciones/ciudadanos/',
    howItWorks: '/como-funciona/',
    caseMedicines: '/casos/medicamentos/',
    codeSpec: '/etiqueta/',
    integration: '/integracion/',
    rationale: '/por-que-asi/',
    verify: '/verificar/',
    journey: '/recorrido/',
    institutional: '/institucional/',
    security: '/seguridad/',
    company: '/empresa/',
    privacy: '/privacidad/',
    notFound: '/404/',
  },
  en: {
    home: '/en/',
    platform: '/en/platform/',
    solutions: '/en/solutions/',
    solutionsGovernment: '/en/solutions/government/',
    solutionsIndustry: '/en/solutions/industry/',
    solutionsCitizens: '/en/solutions/citizens/',
    howItWorks: '/en/how-it-works/',
    caseMedicines: '/en/cases/medicines/',
    codeSpec: '/en/label/',
    integration: '/en/integration/',
    rationale: '/en/why-this-design/',
    verify: '/en/verify/',
    journey: '/en/journey/',
    institutional: '/en/institutional/',
    security: '/en/security/',
    company: '/en/company/',
    privacy: '/en/privacy/',
    notFound: '/en/404/',
  },
};

/** Devuelve la ruta (con base URL aplicada) para una clave y un idioma. */
export function route(locale: Locale, key: RouteKey, base: string = import.meta.env.BASE_URL ?? '/'): string {
  return withBase(ROUTES[locale][key], base);
}

/** Antepone la base URL configurada (PUBLIC_BASE_PATH) a una ruta absoluta del sitio. */
export function withBase(path: string, base: string = import.meta.env.BASE_URL ?? '/'): string {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  if (!cleanBase || cleanBase === '/') return path;
  return `${cleanBase}${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** Deduce el idioma a partir de un pathname (útil en islas cliente). */
export function localeFromPath(pathname: string): Locale {
  const cleaned = pathname.replace(/^\/+/, '');
  return cleaned === 'en' || cleaned.startsWith('en/') ? 'en' : 'es';
}

/** Formatea fechas ISO de forma legible y estable por idioma. */
export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-VE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(date);
}

export function formatDateTime(iso: string, locale: Locale): string {
  return formatDate(iso, locale, { hour: '2-digit', minute: '2-digit' });
}

export function formatNumber(value: number, locale: Locale, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-VE' : 'en-US', opts).format(value);
}
