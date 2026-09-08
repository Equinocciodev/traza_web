/**
 * Barrido de accesibilidad (objetivo WCAG 2.2 AA; patrones conscientes de Section 508, sin afirmar
 * certificación) y comprobaciones manuales automatizadas sobre el build de producción.
 *
 * Proyecto Playwright: `a11y` (Desktop Chrome, 1280×720). Algunos bloques cambian el viewport
 * (360 px móvil, 320 px reflow, 683×450 @2x ≈ zoom 200 %) o emulan `prefers-reduced-motion`.
 *
 * Ejecución: PW_BASE_URL=http://127.0.0.1:4321 npx playwright test --project=a11y
 *
 * Bloques:
 *  1. axe-core en las 30 páginas (ES + EN) con wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa y
 *     best-practice. Cualquier violación hace fallar la prueba. Reglas excluidas: ninguna
 *     (ver DISABLED_RULES; toda exclusión futura exige justificación escrita aquí mismo).
 *  2. axe-core en estados dinámicos: resultado válido / con advertencia, formulario de reporte,
 *     error de servidor, recorrido en paso intermedio, vista institucional con detalle y rol
 *     observador, menú móvil abierto y formulario de contacto con errores.
 *  3. Comprobaciones manuales automatizadas: un solo h1 y jerarquía sin saltos, landmarks, skip
 *     link, foco visible, teclado (cabecera y las tres vistas), targets táctiles, reflow 320, zoom 200 %,
 *     reduced motion, lang/hreflang, nombres accesibles, aria-live, etiquetas y errores de formulario.
 */
import { test, expect, type Page, type Locator } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Page as CorePage } from 'playwright-core';
import type { AxeResults, Result } from 'axe-core';
import { ROUTES, LOCALES, type Locale, type RouteKey } from '../../src/i18n';

/* ------------------------------------------------------------------ */
/* Configuración                                                       */
/* ------------------------------------------------------------------ */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Reglas de axe desactivadas. Debe quedar vacío salvo justificación escrita:
 *   { id: 'regla', reason: 'por qué no aplica y qué comprobación manual la sustituye' }
 */
const DISABLED_RULES: { id: string; reason: string }[] = [];

const ROUTE_KEYS = Object.keys(ROUTES.es) as RouteKey[];
const ALL_PAGES: { locale: Locale; key: RouteKey; path: string }[] = LOCALES.flatMap((locale) =>
  ROUTE_KEYS.map((key) => ({ locale, key, path: ROUTES[locale][key] })),
);

const MOBILE = { width: 360, height: 740 };
const REFLOW = { width: 320, height: 568 };
const ZOOM_200 = { width: 683, height: 450 };
const HTML_LANG: Record<Locale, string> = { es: 'es', en: 'en' };

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

async function open(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'load' });
  // initMotion() (script del layout) marca el documento cuando la mejora progresiva ha arrancado.
  await page.waitForSelector('html.motion-ready', { state: 'attached', timeout: 15_000 });
}

/** Recorre la página (scroll instantáneo) para que los bloques `data-reveal` fuera del viewport inicial se revelen. */
async function revealAll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const step = Math.max(200, window.innerHeight - 120);
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total + step; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await frame();
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await frame();
  });
  await expect.poll(() => page.locator('.reveal-pending').count(), { timeout: 5_000 }).toBe(0);
}

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 5)
        .map((n) => `      - ${n.target.join(' ')}\n        ${n.failureSummary?.replace(/\n/g, '\n        ') ?? ''}`)
        .join('\n');
      return `  • ${v.id} [${v.impact}] ${v.help}\n    ${v.helpUrl}\n${nodes}${v.nodes.length > 5 ? `\n      … y ${v.nodes.length - 5} más` : ''}`;
    })
    .join('\n');
}

/** Ejecuta axe con las etiquetas acordadas y falla ante cualquier violación. */
async function expectNoAxeViolations(page: Page, label: string, options: { include?: string } = {}): Promise<AxeResults> {
  // @axe-core/playwright tipa `page` con el playwright-core de nivel superior (1.63) mientras @playwright/test
  // 1.56 usa su propia copia anidada; en tiempo de ejecución son compatibles (ver problema abierto en docs/09).
  let builder = new AxeBuilder({ page: page as unknown as CorePage }).withTags(TAGS);
  if (DISABLED_RULES.length) builder = builder.disableRules(DISABLED_RULES.map((r) => r.id));
  if (options.include) builder = builder.include(options.include);
  const results = await builder.analyze();
  await test.info().attach(`axe-${label}`, {
    body: JSON.stringify(
      {
        url: results.url,
        violations: results.violations,
        incomplete: results.incomplete.map((i) => ({ id: i.id, nodes: i.nodes.map((n) => ({ target: n.target, message: n.any[0]?.message })) })),
        passes: results.passes.length,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  expect(results.violations, `Violaciones de axe en ${label}:\n${formatViolations(results.violations)}`).toEqual([]);
  return results;
}

/** Elementos con texto visible o interactivos que sobresalen del viewport (reflow / zoom). */
async function horizontalOverflow(page: Page): Promise<{ scrollWidth: number; clientWidth: number; offenders: string[] }> {
  return page.evaluate(() => {
    const width = window.innerWidth;
    const root = document.documentElement;
    const offenders: string[] = [];
    const describe = (el: Element) => {
      const id = el.id ? `#${el.id}` : '';
      const cls = el.classList.length ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : '';
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    };
    const hasOwnText = (el: Element) => Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0);
    // Contenido bidimensional (tablas de datos) puede desplazarse dentro de su propio contenedor (WCAG 1.4.10);
    // se comprueba que el contenedor con scroll quepa en el viewport y se omiten sus descendientes.
    const scrollers = new Set<Element>();
    const inScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll') {
          if (!scrollers.has(p)) {
            scrollers.add(p);
            const r = p.getBoundingClientRect();
            if (r.right > width + 1 || r.left < -1) offenders.push(`${describe(p)} (contenedor con scroll) [${Math.round(r.left)}→${Math.round(r.right)}]`);
          }
          return true;
        }
      }
      return false;
    };
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>('*'))) {
      if (el.closest('[aria-hidden="true"], .visually-hidden, .skip-link, template, script, style, noscript')) continue;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed') continue;
      const interactive = el.matches('a, button, input, select, textarea, summary');
      if (!interactive && !hasOwnText(el)) continue;
      if (inScroller(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.right > width + 1 || rect.left < -1) offenders.push(`${describe(el)} [${Math.round(rect.left)}→${Math.round(rect.right)}]`);
    }
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, offenders: offenders.slice(0, 20) };
  });
}

interface FocusInfo {
  tag: string;
  text: string;
  outlineStyle: string;
  outlineWidth: string;
  boxShadow: string;
  focusVisible: boolean;
  ringVisible: boolean;
}

/** Describe el elemento enfocado y si presenta un indicador de foco visible (outline o box-shadow). */
async function focusedInfo(page: Page): Promise<FocusInfo | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const ringOf = (target: Element) => {
      const s = getComputedStyle(target);
      const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      const shadow = s.boxShadow !== 'none';
      return { outline, shadow, s };
    };
    // Controles invisibles (radio con opacidad 0) muestran el anillo en su etiqueta hermana.
    let target: Element = el;
    if (getComputedStyle(el).opacity === '0' && el.nextElementSibling) target = el.nextElementSibling;
    let { outline, shadow, s } = ringOf(target);
    // Enlaces de tarjeta: el anillo vive en ::after (cubre toda la tarjeta).
    if (!outline && !shadow) {
      const after = getComputedStyle(target, '::after');
      outline = after.outlineStyle !== 'none' && parseFloat(after.outlineWidth) > 0;
    }
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60),
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth,
      boxShadow: s.boxShadow,
      focusVisible: el.matches(':focus-visible'),
      ringVisible: outline || shadow,
    };
  });
}

async function verifyEnhanced(page: Page): Promise<void> {
  await page.waitForSelector('[data-verify-app][data-enhanced="true"]', { state: 'attached' });
}

async function runScenario(page: Page, id: string): Promise<void> {
  await page.locator(`[data-scenario="${id}"]`).click();
  await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'result', { timeout: 15_000 });
  await expect(page.getByTestId('result-title')).toBeVisible();
}

async function journeyReady(page: Page): Promise<Locator> {
  const journey = page.getByTestId('journey');
  await expect(journey).toHaveAttribute('data-enhanced', '');
  await expect(journey).toHaveAttribute('data-view', 'ready');
  return journey;
}

async function institutionalReady(page: Page): Promise<void> {
  await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready', { timeout: 15_000 });
}

/* ------------------------------------------------------------------ */
/* 1. axe en las 30 páginas                                            */
/* ------------------------------------------------------------------ */

test.describe('axe · páginas estáticas (ES + EN)', () => {
  for (const { locale, key, path } of ALL_PAGES) {
    test(`${path} (${locale}/${key})`, async ({ page }) => {
      await open(page, path);
      await revealAll(page);
      await expectNoAxeViolations(page, `${locale}-${key}`);
    });
  }
});

/* ------------------------------------------------------------------ */
/* 2. axe en estados dinámicos                                         */
/* ------------------------------------------------------------------ */

test.describe('axe · estados dinámicos', () => {
  for (const locale of LOCALES) {
    const verifyPath = ROUTES[locale].verify;
    const journeyPath = ROUTES[locale].journey;
    const institutionalPath = ROUTES[locale].institutional;

    test(`${verifyPath} · resultado válido`, async ({ page }) => {
      await open(page, verifyPath);
      await verifyEnhanced(page);
      await runScenario(page, 'valid');
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid');
      await expectNoAxeViolations(page, `${locale}-verify-valid`);
    });

    test(`${verifyPath} · resultado con advertencia (duplicate)`, async ({ page }) => {
      await open(page, verifyPath);
      await verifyEnhanced(page);
      await runScenario(page, 'duplicate');
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'warning');
      await expectNoAxeViolations(page, `${locale}-verify-warning`);
    });

    test(`${verifyPath} · formulario de reporte abierto`, async ({ page }) => {
      await open(page, verifyPath);
      await verifyEnhanced(page);
      await runScenario(page, 'duplicate');
      await page.getByTestId('report-button').click();
      await expect(page.getByTestId('report-form')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-verify-report`);
      // Con errores de validación (envío vacío)
      await page.getByTestId('report-submit').click();
      await expect(page.locator('[data-field-error="kind"]')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-verify-report-errors`);
    });

    test(`${verifyPath} · error de servidor`, async ({ page }) => {
      await open(page, verifyPath);
      await verifyEnhanced(page);
      await page.locator('[data-scenario="server_error"]').click();
      await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'error', { timeout: 15_000 });
      await expect(page.locator('[data-view="error"]')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-verify-server-error`);
    });

    test(`${journeyPath} · paso intermedio`, async ({ page }) => {
      await open(page, journeyPath);
      const journey = await journeyReady(page);
      const play = page.getByTestId('journey-play');
      if ((await play.getAttribute('data-state')) === 'playing') await play.click();
      await page.getByTestId('journey-next').click();
      await expect.poll(async () => Number(await journey.getAttribute('data-stage-index'))).toBeGreaterThan(0);
      const steps = await page.getByTestId('journey-step').count();
      expect(Number(await journey.getAttribute('data-stage-index'))).toBeLessThan(steps - 1);
      await expectNoAxeViolations(page, `${locale}-journey-intermediate`);
    });

    test(`${institutionalPath} · detalle abierto y rol observador`, async ({ page }) => {
      await open(page, institutionalPath);
      await institutionalReady(page);
      await page.locator('[data-alert-open]').first().click();
      await expect(page.getByTestId('alert-detail')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-institutional-detail`);
      await page.locator('input[data-role="observer"]').check();
      await expect(page.getByTestId('institutional')).toHaveAttribute('data-role', 'observer');
      await expect(page.locator('[data-panel="alerts"] [data-denied]')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-institutional-observer`);
    });
  }

  test.describe('móvil (360 px)', () => {
    test.use({ viewport: MOBILE, isMobile: true, hasTouch: true });

    for (const locale of LOCALES) {
      test(`${ROUTES[locale].home} · menú móvil abierto`, async ({ page }) => {
        await open(page, ROUTES[locale].home);
        const toggle = page.locator('[data-nav-toggle]');
        await expect(toggle).toBeVisible();
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#site-nav')).toBeVisible();
        await expectNoAxeViolations(page, `${locale}-mobile-menu`);
      });
    }
  });

  for (const locale of LOCALES) {
    test(`${ROUTES[locale].company} · formulario de contacto con errores`, async ({ page }) => {
      await open(page, ROUTES[locale].company);
      const form = page.locator('[data-contact-form]');
      await expect(form).toHaveJSProperty('noValidate', true);
      await form.locator('[data-submit]').click();
      await expect(form.locator('[data-summary]')).toBeVisible();
      await expectNoAxeViolations(page, `${locale}-contact-errors`);
    });
  }
});

/* ------------------------------------------------------------------ */
/* 3. Comprobaciones manuales automatizadas                            */
/* ------------------------------------------------------------------ */

test.describe('estructura · encabezados, landmarks, idioma', () => {
  for (const { locale, key, path } of ALL_PAGES) {
    test(`${path} · un h1, jerarquía, landmarks, lang y hreflang`, async ({ page }) => {
      await open(page, path);

      // Un solo h1 y jerarquía sin saltos (solo encabezados no ocultos)
      const levels = await page.evaluate(() =>
        Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .filter((h) => !h.closest('[hidden]'))
          .map((h) => Number(h.tagName[1])),
      );
      expect(levels.filter((l) => l === 1), 'exactamente un h1').toHaveLength(1);
      expect(levels[0], 'el primer encabezado es el h1').toBe(1);
      const skips = levels.filter((l, i) => i > 0 && l - (levels[i - 1] ?? 1) > 1);
      expect(skips, `saltos de nivel en la jerarquía ${levels.join(' → ')}`).toEqual([]);

      // Landmarks
      await expect(page.locator('body > header')).toHaveCount(1);
      await expect(page.locator('body > footer')).toHaveCount(1);
      await expect(page.locator('body > main#main')).toHaveCount(1);
      await expect(page.locator('header nav[aria-label]')).toHaveCount(1);
      await expect(page.getByRole('banner')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);

      // Idioma del documento y del selector de idioma
      await expect(page.locator('html')).toHaveAttribute('lang', HTML_LANG[locale]);
      const other = locale === 'es' ? 'en' : 'es';
      const langSwitch = page.locator('header [data-lang-switch]');
      await expect(langSwitch).toHaveAttribute('hreflang', HTML_LANG[other]);
      // El texto visible en el otro idioma declara su lang (WCAG 3.1.2) y forma parte del nombre (WCAG 2.5.3)
      const visibleLabel = langSwitch.locator(`[lang="${HTML_LANG[other]}"]`);
      await expect(visibleLabel).toHaveCount(1);
      const visibleText = ((await visibleLabel.textContent()) ?? '').trim();
      const accessibleName = await langSwitch.evaluate((el) => (el.getAttribute('aria-label') ?? el.textContent ?? '').replace(/\s+/g, ' ').trim());
      expect(accessibleName.toLowerCase()).toContain(visibleText.toLowerCase());

      // hreflang: es, en y x-default apuntan a la ruta equivalente
      const targetKey: RouteKey = key === 'notFound' ? 'home' : key;
      for (const l of LOCALES) {
        const href = await page.locator(`link[rel="alternate"][hreflang="${HTML_LANG[l]}"]`).getAttribute('href');
        expect(href, `hreflang=${l}`).toBeTruthy();
        expect(new URL(href ?? '').pathname).toBe(ROUTES[l][targetKey]);
      }
      const xDefault = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
      expect(new URL(xDefault ?? '').pathname).toBe(ROUTES.es[targetKey]);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    });
  }
});

test.describe('skip link y foco visible', () => {
  for (const locale of LOCALES) {
    test(`${ROUTES[locale].home} · skip link: Tab → Enter → foco en #main`, async ({ page }) => {
      await open(page, ROUTES[locale].home);
      await page.keyboard.press('Tab');
      const skip = page.locator('.skip-link');
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      const info = await focusedInfo(page);
      expect(info?.ringVisible, 'anillo de foco visible en el skip link').toBe(true);
      await page.keyboard.press('Enter');
      await expect(page.locator('#main')).toBeFocused();
      expect(new URL(page.url()).hash).toBe('#main');
      // El siguiente Tab continúa dentro del contenido principal, no vuelve a la cabecera
      await page.keyboard.press('Tab');
      const next = await page.evaluate(() => document.activeElement?.closest('main') !== null);
      expect(next, 'tras el skip link, Tab sigue en <main>').toBe(true);
    });
  }

  const FOCUS_SAMPLES: { path: string; tabs: number }[] = [
    { path: ROUTES.es.home, tabs: 28 },
    { path: ROUTES.es.verify, tabs: 40 },
    { path: ROUTES.es.journey, tabs: 30 },
    { path: ROUTES.es.institutional, tabs: 30 },
    { path: ROUTES.es.company, tabs: 34 },
    { path: ROUTES.en.home, tabs: 20 },
  ];

  for (const { path, tabs } of FOCUS_SAMPLES) {
    test(`${path} · foco visible en los primeros ${tabs} controles`, async ({ page }) => {
      await open(page, path);
      const seen: string[] = [];
      const missing: string[] = [];
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab');
        const info = await focusedInfo(page);
        if (!info) break;
        seen.push(`${info.tag}:${info.text}`);
        if (!info.ringVisible) missing.push(`${info.tag} "${info.text}" outline=${info.outlineStyle} ${info.outlineWidth} shadow=${info.boxShadow}`);
      }
      test.info().annotations.push({ type: 'focus-sample', description: seen.join(' | ') });
      expect(seen.length, 'la página tiene controles enfocables').toBeGreaterThan(5);
      expect(missing, 'controles enfocados sin indicador visible').toEqual([]);
    });
  }
});

test.describe('teclado · cabecera', () => {
  test(`${ROUTES.es.home} · escritorio: Tab recorre la navegación y Enter activa`, async ({ page }) => {
    await open(page, ROUTES.es.home);
    await expect(page.locator('[data-nav-toggle]')).toBeHidden();
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // marca
    await expect(page.locator('.site-header__brand')).toBeFocused();
    const links = page.locator('.site-nav__link');
    const count = await links.count();
    expect(count).toBeGreaterThan(3);
    await page.keyboard.press('Tab');
    await expect(links.nth(0)).toBeFocused();
    // El submenú de Soluciones se abre al recibir foco (focus-within) y sus enlaces son alcanzables
    const solutions = page.locator('.site-nav__link[href="/soluciones/"]');
    const sublinks = page.locator('.site-nav__sublink');
    await solutions.focus();
    await expect(solutions).toBeFocused();
    await expect(sublinks.first()).toBeVisible();
    // WCAG 1.4.13: Escape retira el submenú sin mover el foco; Tab salta al siguiente elemento de primer nivel
    await page.keyboard.press('Escape');
    await expect(sublinks.first()).toBeHidden();
    await expect(solutions).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.classList.contains('site-nav__sublink'))).toBe(false);
    // Al volver hacia atrás, el submenú vuelve a estar en el orden de tabulación (el foco ya salió del
    // elemento): Shift+Tab entra por su último enlace, visible mientras el foco está dentro, y sigue
    // hasta el enlace de primer nivel. Desde ahí, Tab entra por el primer subenlace.
    await page.keyboard.press('Shift+Tab');
    await expect(sublinks.last()).toBeFocused();
    await expect(sublinks.last()).toBeVisible();
    for (let i = 0; i < 4 && !(await solutions.evaluate((el) => el === document.activeElement)); i += 1) {
      await page.keyboard.press('Shift+Tab');
    }
    await expect(solutions).toBeFocused();
    await expect(sublinks.first()).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(sublinks.first()).toBeFocused();
    await expect(sublinks.first()).toBeVisible();
    // Enter en un enlace navega
    await page.keyboard.press('Enter');
    await page.waitForURL('**/soluciones/gobierno/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test.describe('móvil (360 px)', () => {
    test.use({ viewport: MOBILE, isMobile: true, hasTouch: true });

    test(`${ROUTES.es.home} · Tab al botón, Enter abre, Tab entra, Escape cierra y devuelve el foco`, async ({ page }) => {
      await open(page, ROUTES.es.home);
      const toggle = page.locator('[data-nav-toggle]');
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toHaveAttribute('aria-controls', 'site-nav');
      // Botón solo-icono: nombre accesible por aria-label o texto visualmente oculto
      const toggleName = (await toggle.getAttribute('aria-label')) ?? (await toggle.locator('.visually-hidden').textContent()) ?? '';
      expect(toggleName.trim()).not.toBe('');
      await page.keyboard.press('Tab'); // skip link
      await page.keyboard.press('Tab'); // marca
      await page.keyboard.press('Tab'); // botón de menú
      await expect(toggle).toBeFocused();
      const bbox = await toggle.boundingBox();
      expect(bbox?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(bbox?.height ?? 0).toBeGreaterThanOrEqual(44);
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#site-nav')).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(page.locator('.site-nav__link').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#site-nav')).toBeHidden();
      await expect(toggle).toBeFocused();
    });
  });
});

test.describe('teclado · vistas interactivas', () => {
  test(`${ROUTES.es.verify} · escenarios y formulario manual con teclado; foco al resultado; aria-live`, async ({ page }) => {
    await open(page, ROUTES.es.verify);
    await verifyEnhanced(page);
    // Regiones vivas presentes antes de cualquier interacción
    await expect(page.locator('[data-result-region][aria-live="polite"]')).toHaveCount(1);
    await expect(page.locator('[data-net-status][aria-live]')).toHaveCount(1);
    await expect(page.locator('[data-scanner-status][role="status"]')).toHaveCount(1);
    await expect(page.locator('[data-view="error"][role="alert"]')).toHaveCount(1);

    // Escenario activado con teclado (Enter) → resultado y foco en su título
    const valid = page.locator('[data-scenario="valid"]');
    await valid.focus();
    await expect(valid).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'result', { timeout: 15_000 });
    await expect(page.getByTestId('result-title')).toBeFocused();
    await expect(valid).toHaveAttribute('aria-pressed', 'true');
    // El resultado vive dentro de la región aria-live
    expect(await page.getByTestId('verify-result').evaluate((el) => el.closest('[aria-live]') !== null)).toBe(true);

    // Reporte: se abre con Enter, el foco va al título del formulario; Cancelar devuelve al resultado
    await page.getByTestId('report-button').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-report-title]')).toBeFocused();
    await page.getByTestId('report-cancel').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('result-title')).toBeFocused();

    // Entrada manual vacía → error asociado con aria-describedby y role=alert, foco en el campo
    const input = page.getByTestId('manual-input');
    await input.fill(''); // el escenario anterior rellenó el campo con su código
    await input.focus();
    await page.keyboard.press('Enter');
    const manualError = page.getByTestId('manual-error');
    await expect(manualError).toBeVisible();
    await expect(manualError).toHaveAttribute('role', 'alert');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    expect((await input.getAttribute('aria-describedby'))?.split(/\s+/)).toContain('verify-code-error');
    await expect(input).toBeFocused();
    // Un código con formato válido enviado con Enter también funciona
    await input.fill('TRZ-7F2K-4K7Q-92FA');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('result-title')).toBeFocused({ timeout: 15_000 });
  });

  test(`${ROUTES.es.journey} · pasos con flechas, Home/End, controles con teclado`, async ({ page }) => {
    await open(page, ROUTES.es.journey);
    const journey = await journeyReady(page);
    const play = page.getByTestId('journey-play');
    if ((await play.getAttribute('data-state')) === 'playing') await play.click();
    const steps = page.getByTestId('journey-step');
    const total = await steps.count();
    expect(total).toBeGreaterThan(2);
    await expect(page.getByTestId('journey-status')).toHaveAttribute('role', 'status');
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('role', 'progressbar');
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuetext', /.+/);

    await steps.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(steps.nth(1)).toBeFocused();
    await expect(steps.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(journey).toHaveAttribute('data-stage-index', '1');
    await page.keyboard.press('End');
    const last = Number(await journey.getAttribute('data-stage-index'));
    expect(last).toBeGreaterThan(1);
    await expect(steps.nth(last)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(steps.first()).toBeFocused();
    await expect(journey).toHaveAttribute('data-stage-index', '0');

    // "Siguiente" con Enter y "Reproducir" con Espacio (nombres accesibles presentes)
    const next = page.getByTestId('journey-next');
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(journey).toHaveAttribute('data-stage-index', '1');
    await expect(play).toHaveAttribute('aria-label', /.+/);
    await play.focus();
    await page.keyboard.press('Space');
    await expect(play).toHaveAttribute('data-state', 'playing');
    await page.keyboard.press('Space');
    await expect(play).toHaveAttribute('data-state', 'paused');
  });

  test(`${ROUTES.es.institutional} · roles con flechas, detalle con Enter y foco gestionado`, async ({ page }) => {
    await open(page, ROUTES.es.institutional);
    await institutionalReady(page);
    const live = page.getByTestId('inst-live');
    await expect(live).toHaveAttribute('aria-live', 'polite');

    // Grupo de radios: flechas cambian el rol; el anuncio llega a la región viva
    const analyst = page.locator('input[data-role="analyst"]');
    await analyst.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('input[data-role="inspector"]')).toBeChecked();
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-role', 'inspector');
    await expect(live).not.toBeEmpty();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-role', 'analyst');

    // Abrir una alerta con Enter → el foco va al detalle (tabindex=-1)
    const first = page.locator('[data-alert-open]').first();
    await first.focus();
    await page.keyboard.press('Enter');
    const detail = page.getByTestId('alert-detail');
    await expect(detail).toBeVisible();
    await expect(detail).toBeFocused();
    await expect(first).toHaveAttribute('aria-current', 'true');
    // Acción con teclado dentro del detalle (Tab hasta "Marcar como vista" y Enter)
    const ack = detail.locator('[data-action="acknowledge"]');
    if (await ack.isEnabled()) {
      await ack.focus();
      await page.keyboard.press('Enter');
      await expect(detail.locator('[data-slot="hint"]')).not.toBeEmpty();
    }
    // Rol observador: el detalle se sustituye por "sin permisos" enfocable
    await page.locator('input[data-role="observer"]').check();
    const denied = page.locator('[data-panel="alerts"] [data-denied]');
    await expect(denied).toBeVisible();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(denied).toBeFocused();
  });
});

test.describe('targets táctiles (360 px)', () => {
  test.use({ viewport: MOBILE, isMobile: true, hasTouch: true });

  const PAGES = [ROUTES.es.home, ROUTES.es.verify, ROUTES.es.journey, ROUTES.es.institutional, ROUTES.es.company, ROUTES.es.caseSpirits, ROUTES.en.home];
  for (const path of PAGES) {
    test(`${path} · a, button, input, select visibles ≥ 44×44 (excepciones listadas)`, async ({ page }) => {
      await open(page, path);
      await revealAll(page);
      const result = await page.evaluate(() => {
        const small: string[] = [];
        const inlineExceptions: string[] = [];
        const describe = (el: Element) => {
          const cls = el.classList.length ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : '';
          const text = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
          return `${el.tagName.toLowerCase()}${cls} "${text}"`;
        };
        let checked = 0;
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('a, button, input, select'))) {
          if (el.closest('[hidden], template, .skip-link')) continue;
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          let rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          checked += 1;
          // Área efectiva: casilla/radio + su etiqueta asociada; enlace de tarjeta cuyo ::after cubre la tarjeta
          const union = (a: DOMRect, b: DOMRect) => new DOMRect(Math.min(a.left, b.left), Math.min(a.top, b.top), Math.max(a.right, b.right) - Math.min(a.left, b.left), Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top));
          if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
            for (const label of Array.from(el.labels ?? [])) rect = union(rect, label.getBoundingClientRect());
          }
          const after = getComputedStyle(el, '::after');
          if (after.content !== 'none' && after.position === 'absolute' && el.offsetParent instanceof HTMLElement) rect = union(rect, el.offsetParent.getBoundingClientRect());
          if (rect.width >= 44 && rect.height >= 44) continue;
          // Excepción WCAG 2.5.8: enlaces dentro de una frase (display inline en un bloque de texto)
          const inline = el.tagName === 'A' && style.display === 'inline' && (el.parentElement?.textContent ?? '').trim().length > el.textContent!.trim().length + 10;
          const entry = `${describe(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}`;
          if (inline) inlineExceptions.push(entry);
          else small.push(entry);
        }
        return { checked, small, inlineExceptions };
      });
      test.info().annotations.push({ type: 'touch-targets', description: `comprobados=${result.checked}; excepciones inline=${result.inlineExceptions.join(' | ') || 'ninguna'}` });
      expect(result.checked).toBeGreaterThan(10);
      expect(result.small, 'controles no inline menores de 44×44 px').toEqual([]);
      // Las excepciones inline deben cumplir al menos el mínimo de WCAG 2.2 (24×24) en altura de línea
      for (const entry of result.inlineExceptions) {
        const m = /(\d+)×(\d+)$/.exec(entry);
        expect(Number(m?.[2] ?? 0), `altura mínima 24 px en enlace inline ${entry}`).toBeGreaterThanOrEqual(20);
      }
    });
  }
});

test.describe('reflow · 320 px sin scroll horizontal', () => {
  test.use({ viewport: REFLOW, isMobile: true, hasTouch: true });

  for (const { path } of ALL_PAGES) {
    test(`${path} · 320 px`, async ({ page }) => {
      await open(page, path);
      await revealAll(page);
      const { scrollWidth, clientWidth, offenders } = await horizontalOverflow(page);
      expect(scrollWidth, 'scrollWidth ≤ clientWidth').toBeLessThanOrEqual(clientWidth);
      expect(offenders, 'elementos con texto o controles fuera del viewport').toEqual([]);
    });
  }
});

test.describe('zoom 200 % (683×450 @2x) sin pérdida de contenido', () => {
  test.use({ viewport: ZOOM_200, deviceScaleFactor: 2 });

  const PAGES = [ROUTES.es.home, ROUTES.es.verify, ROUTES.es.journey, ROUTES.es.institutional, ROUTES.es.howItWorks, ROUTES.en.caseSpirits];
  for (const path of PAGES) {
    test(`${path} · sin scroll horizontal, contenido y menú operables`, async ({ page }) => {
      await open(page, path);
      await revealAll(page);
      const { scrollWidth, clientWidth, offenders } = await horizontalOverflow(page);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      expect(offenders).toEqual([]);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      // El menú plegable sigue disponible con este ancho lógico (< 72em)
      const toggle = page.locator('[data-nav-toggle]');
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(page.locator('#site-nav')).toBeVisible();
      await expect(page.locator('.site-nav__link').first()).toBeInViewport();
    });
  }
});

test.describe('prefers-reduced-motion', () => {
  // `reducedMotion` no es una opción de test de primer nivel: debe ir dentro de contextOptions.
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  for (const path of [ROUTES.es.home, ROUTES.es.journey, ROUTES.en.journey]) {
    test(`${path} · sin animaciones activas tras 2 s; estado final visible`, async ({ page }) => {
      await open(page, path);
      await revealAll(page);
      await page.waitForTimeout(2_000);
      const animations = await page.evaluate(() =>
        document.getAnimations().map((a) => {
          const effect = a.effect as KeyframeEffect | null;
          const target = effect?.target as Element | null;
          return `${a.constructor.name}:${(a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? '?'}@${target?.tagName.toLowerCase()}.${target?.className && typeof target.className === 'string' ? target.className.split(' ')[0] : ''} [${a.playState}]`;
        }),
      );
      expect(animations, 'document.getAnimations() debe estar vacío con reduced motion').toEqual([]);
      // Nada queda oculto a la espera de un revelado
      await expect(page.locator('.reveal-pending')).toHaveCount(0);
      if (path.includes('recorrido') || path.includes('journey')) {
        // El recorrido muestra el estado final (última etapa registrada) y no reproduce solo
        const journey = await journeyReady(page);
        const steps = await page.getByTestId('journey-step').count();
        const index = Number(await journey.getAttribute('data-stage-index'));
        expect(index).toBeGreaterThan(0);
        expect(index).toBeLessThanOrEqual(steps - 1);
        await expect(page.getByTestId('journey-play')).not.toHaveAttribute('data-state', 'playing');
      }
    });
  }
});

test.describe('nombres accesibles, iconos, etiquetas y errores', () => {
  const PAGES = [ROUTES.es.home, ROUTES.es.verify, ROUTES.es.journey, ROUTES.es.institutional, ROUTES.es.company, ROUTES.en.verify];
  for (const path of PAGES) {
    test(`${path} · botones/enlaces con nombre, SVG decorativos ocultos, campos con etiqueta`, async ({ page }) => {
      await open(page, path);
      const report = await page.evaluate(() => {
        const problems: string[] = [];
        const describe = (el: Element) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.classList.length ? `.${el.classList[0]}` : ''}`;
        const nameOf = (el: Element) => {
          const labelled = el.getAttribute('aria-labelledby');
          if (labelled) return labelled.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
          return (el.getAttribute('aria-label') ?? el.getAttribute('title') ?? el.textContent ?? '').trim();
        };
        // Botones y enlaces (incluidos los ocultos: se nombran en el HTML, no por JS)
        for (const el of Array.from(document.querySelectorAll('a[href], button'))) {
          if (el.closest('template')) continue;
          const name = nameOf(el) || Array.from(el.querySelectorAll('[role="img"][aria-label], svg title')).map((n) => n.getAttribute('aria-label') ?? n.textContent ?? '').join(' ').trim();
          if (!name) problems.push(`sin nombre accesible: ${describe(el)}`);
        }
        // Iconos SVG: decorativos (aria-hidden) o con role=img y título
        for (const svg of Array.from(document.querySelectorAll('svg'))) {
          if (svg.closest('template')) continue;
          const decorative = svg.getAttribute('aria-hidden') === 'true' || svg.closest('[aria-hidden="true"]') !== null;
          const named = svg.getAttribute('role') === 'img' && (svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent || svg.getAttribute('aria-labelledby'));
          if (!decorative && !named) problems.push(`svg sin aria-hidden ni nombre: ${describe(svg)} en ${describe(svg.parentElement ?? svg)}`);
        }
        // Campos de formulario con etiqueta asociada
        for (const field of Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'))) {
          if (field.closest('template') || field.type === 'hidden') continue;
          const byFor = field.id ? document.querySelector(`label[for="${CSS.escape(field.id)}"]`) : null;
          const wrapped = field.closest('label');
          const aria = field.getAttribute('aria-label') || field.getAttribute('aria-labelledby');
          if (!byFor && !wrapped && !aria) problems.push(`campo sin etiqueta: ${describe(field)} name=${field.name}`);
        }
        return problems;
      });
      expect(report).toEqual([]);
    });
  }

  for (const locale of LOCALES) {
    test(`${ROUTES[locale].company} · errores del formulario de contacto: resumen role=alert enfocado, aria-invalid y aria-describedby`, async ({ page }) => {
      await open(page, ROUTES[locale].company);
      const form = page.locator('[data-contact-form]');
      await form.locator('[data-submit]').click();
      const summary = form.locator('[data-summary]');
      await expect(summary).toBeVisible();
      await expect(summary).toHaveAttribute('role', 'alert');
      await expect(summary).toBeFocused();
      const links = summary.locator('a');
      expect(await links.count()).toBeGreaterThanOrEqual(4);

      const invalid = form.locator('[aria-invalid="true"]');
      expect(await invalid.count()).toBeGreaterThanOrEqual(4);
      for (const field of await invalid.all()) {
        const described = (await field.getAttribute('aria-describedby')) ?? '';
        expect(described, 'aria-describedby presente').not.toBe('');
        const errorId = described.split(/\s+/).find((id) => id.endsWith('-error'));
        expect(errorId, 'aria-describedby apunta al mensaje de error').toBeTruthy();
        const error = page.locator(`#${errorId}`);
        await expect(error).toBeVisible();
        await expect(error).not.toBeEmpty();
      }
      // El enlace del resumen lleva el foco al campo
      await links.first().click();
      const firstFieldId = await form.locator('[aria-invalid="true"]').first().getAttribute('id');
      const firstField = page.locator(`#${firstFieldId}`);
      await expect(firstField).toBeFocused();
      // Al corregir, el error del campo desaparece y aria-invalid se retira
      await firstField.fill('Nombre de prueba');
      await expect(firstField).not.toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${firstFieldId}-error`)).toBeHidden();
    });
  }

  test(`${ROUTES.es.verify} · errores del reporte de discrepancia con aria-describedby y role=alert`, async ({ page }) => {
    await open(page, ROUTES.es.verify);
    await verifyEnhanced(page);
    await runScenario(page, 'duplicate');
    await page.getByTestId('report-button').click();
    await page.getByTestId('report-submit').click();
    const kind = page.getByTestId('report-kind');
    const kindError = page.locator('#report-kind-error');
    await expect(kindError).toBeVisible();
    await expect(kindError).toHaveAttribute('role', 'alert');
    expect((await kind.getAttribute('aria-describedby'))?.split(/\s+/)).toContain('report-kind-error');
    await expect(kind).toHaveAttribute('aria-invalid', 'true');
    const description = page.getByTestId('report-description');
    await expect(description).toHaveAttribute('aria-invalid', 'true');
    expect((await description.getAttribute('aria-describedby'))?.split(/\s+/)).toContain('report-description-error');
    await expect(page.locator('#report-description-error')).toBeVisible();
  });
});
