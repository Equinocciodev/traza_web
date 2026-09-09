/**
 * Utilidades compartidas por las pruebas end-to-end (Playwright).
 * Importa los diccionarios y rutas reales del proyecto para no duplicar textos esperados.
 */
import { expect, type Page, type ConsoleMessage } from '@playwright/test';
import { LOCALES, ROUTES, type Locale, type RouteKey } from '@/i18n';
import { getContent } from '@/content';
import { V2_HOME } from '@/content/v2-home';

/** URL pública configurada en el build (PUBLIC_SITE_URL por defecto). */
export const SITE_URL = process.env.PW_SITE_URL ?? 'https://traza.technology';

export interface SitePage {
  locale: Locale;
  key: RouteKey;
  path: string;
}

/** Las 30 páginas construidas (15 por idioma, incluida la 404). */
export const PAGES: SitePage[] = LOCALES.flatMap((locale) =>
  (Object.keys(ROUTES[locale]) as RouteKey[]).map((key) => ({ locale, key, path: ROUTES[locale][key] })),
);

/** Las 28 páginas indexables (sin las 404). */
export const INDEXABLE_PAGES = PAGES.filter((p) => p.key !== 'notFound');

export const DEMO_KEYS: RouteKey[] = ['verify', 'journey', 'institutional'];

export function content(locale: Locale) {
  return getContent(locale);
}

export function pageMeta(locale: Locale, key: RouteKey): { title: string; description: string } {
  if (key === 'home') return V2_HOME[locale].meta;
  const c = getContent(locale) as unknown as Record<string, { meta: { title: string; description: string } }>;
  return c[key]!.meta;
}

/** Título completo de pestaña tal como lo compone Base.astro. */
export function expectedTitle(locale: Locale, key: RouteKey): string {
  const { common } = getContent(locale);
  if (key === 'home') return common.meta.homeTitle;
  return common.meta.titleTemplate.replace('%s', pageMeta(locale, key).title);
}

export interface ConsoleCollector {
  errors: string[];
  /** Detiene la captura y devuelve los errores reunidos (excluyendo los patrones tolerados). */
  stop(): string[];
}

/** Patrones tolerados globalmente: ninguno. La 404 se filtra de forma explícita en su propia prueba. */
const TOLERATED: RegExp[] = [];

/** Captura errores de consola y excepciones no controladas de la página. */
export function collectConsoleErrors(page: Page, ignore: RegExp[] = []): ConsoleCollector {
  const errors: string[] = [];
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() !== 'error') return;
    const text = `${msg.text()} (${msg.location().url})`;
    if ([...TOLERATED, ...ignore].some((re) => re.test(text))) return;
    errors.push(text);
  };
  const onError = (err: Error) => errors.push(`pageerror: ${err.message}`);
  page.on('console', onConsole);
  page.on('pageerror', onError);
  return {
    errors,
    stop() {
      page.off('console', onConsole);
      page.off('pageerror', onError);
      return errors;
    },
  };
}

/** Navega y espera a que la página esté cargada (islas montadas). */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
}

/** Texto visible de todo el documento. */
export async function visibleText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

/** Asegura que el texto visible no llama "auténtico" a nada. */
export async function expectNoAuthenticClaim(page: Page): Promise<void> {
  const text = await visibleText(page);
  const allowed = /nunca decimos|never say|no equivale a|not the same as|no certifican? autenticidad física|(?:does|do) not certify physical authenticity/i;
  const lines = text.split('\n').filter((l) => /aut[eé]ntic|authentic|genuin/i.test(l) && !allowed.test(l));
  expect(lines, 'texto visible con "auténtico" como veredicto').toEqual([]);
}

export function isMobileProject(projectName: string): boolean {
  return projectName === 'mobile';
}

/** Identificador del elemento con foco (data-testid, id o tagName). */
export async function focusedId(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return '';
    return el.dataset.testid || el.id || el.tagName.toLowerCase();
  });
}
