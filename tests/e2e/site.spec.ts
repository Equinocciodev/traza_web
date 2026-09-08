/**
 * Sitio: rutas, metadatos SEO, selector de idioma, menú móvil, skip link, 404, robots/sitemap,
 * consola limpia, enlaces internos y controles sin efecto.
 */
import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROUTES, LOCALE_LABELS, otherLocale } from '@/i18n';
import {
  PAGES,
  INDEXABLE_PAGES,
  SITE_URL,
  collectConsoleErrors,
  content,
  expectedTitle,
  open,
  pageMeta,
  visibleText,
  focusedId,
} from './helpers';

const DIST_DIR = process.env.PW_DIST_DIR ?? '.tmp/dist-qa';

test.describe('metadatos y estructura de cada página', () => {
  for (const p of INDEXABLE_PAGES) {
    test(`${p.path} responde 200 con title, description, canonical y hreflang correctos`, async ({ page, request }) => {
      const console = collectConsoleErrors(page);
      // Ninguna petición sale del propio origen (sin CDN, analítica ni fuentes externas).
      const external: string[] = [];
      const origin = new URL(page.url() === 'about:blank' ? (test.info().project.use.baseURL as string) : page.url()).origin;
      page.on('request', (req) => {
        if (!req.url().startsWith(origin)) external.push(req.url());
      });
      const response = await page.goto(p.path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');
      expect(external, 'peticiones a otros orígenes').toEqual([]);

      await expect(page).toHaveTitle(expectedTitle(p.locale, p.key));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', pageMeta(p.locale, p.key).description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${p.path}`);
      await expect(page.locator('html')).toHaveAttribute('lang', LOCALE_LABELS[p.locale].htmlLang);

      const other = otherLocale(p.locale);
      await expect(page.locator(`link[rel="alternate"][hreflang="${p.locale}"]`)).toHaveAttribute('href', `${SITE_URL}${p.path}`);
      await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveAttribute('href', `${SITE_URL}${ROUTES[other][p.key]}`);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${SITE_URL}${ROUTES.es[p.key]}`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}${p.path}`);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', LOCALE_LABELS[p.locale].ogLocale);

      // Estructura: un solo h1, landmark principal, indicador de demostración persistente.
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
      const badge = content(p.locale).common.demoBadge;
      await expect(page.locator('aside.demo-strip')).toHaveAttribute('aria-label', badge.long);
      const text = await visibleText(page);
      expect(text.includes(badge.long) || text.includes(badge.short)).toBe(true);

      // Sin scripts inline ejecutables (CSP estricta): solo bloques de datos.
      const inlineScripts = await page.$$eval('script:not([src])', (nodes) => nodes.map((n) => n.getAttribute('type') ?? 'text/javascript'));
      for (const type of inlineScripts) expect(['application/ld+json', 'application/json']).toContain(type);
      // El HTML servido no lleva atributos style ni manejadores on*; los estilos que la isla escribe vía CSSOM no cuentan para la CSP.
      const html = await (await request.get(p.path)).text();
      expect(html, 'atributos style inline en el HTML servido').not.toMatch(/\sstyle="/);
      expect(html, 'manejadores de eventos inline').not.toMatch(/\son[a-z]+="/);

      expect(console.stop()).toEqual([]);
    });
  }
});

test.describe('SENIAT solo en el caso de uso y en el tenant de ejemplo', () => {
  /**
   * Desviación conocida del brief §1 (informe QA, defecto D-02): HomePage.astro:138 y PlatformPage.astro:111 renderizan
   * CobrandExample fuera del caso de uso. Se lista aquí para que cualquier página NUEVA con el lockup haga fallar la prueba.
   */
  const KNOWN_LOCKUP_PAGES = new Set(['home', 'platform']);
  for (const p of INDEXABLE_PAGES) {
    test(`${p.path}: el lockup solo es visible donde se admite y siempre con su aviso`, async ({ page }) => {
      await open(page, p.path);
      const text = await visibleText(page);
      if (p.key === 'caseSpirits' || KNOWN_LOCKUP_PAGES.has(p.key)) {
        expect(text).toContain('SENIAT');
        // Siempre acompañado de su aviso condicional (propuesta de piloto, sin relación oficial).
        expect(text).toMatch(/propuesta de piloto|pilot proposal/i);
        expect(text).toMatch(/no implica|does not imply/i);
        expect(await page.locator('.lockup__notice:visible').count()).toBeGreaterThan(0);
      } else {
        expect(text, `SENIAT visible en ${p.path}`).not.toContain('SENIAT');
      }
    });
  }

  test('en la verificación el lockup solo aparece con el tenant de ejemplo (?t=licores) y con su aviso', async ({ page }) => {
    await open(page, '/verificar/');
    expect(await visibleText(page)).not.toContain('SENIAT');
    await open(page, '/verificar/?t=licores');
    const lockup = page.locator('[data-tenant-lockup="licores"]');
    await expect(lockup).toBeVisible();
    await expect(lockup.locator('.lockup__mark')).toHaveAccessibleName(/SENIAT \| TRAZA/);
    await expect(lockup.locator('.lockup__notice')).toContainText(/no implica relación oficial/i);
    await expect(lockup).toContainText(/propuesta de piloto/i);
  });
});

test.describe('selector de idioma', () => {
  for (const p of INDEXABLE_PAGES.filter((x) => x.locale === 'es')) {
    test(`${p.path} ↔ ${ROUTES.en[p.key]}`, async ({ page }, testInfo) => {
      await open(page, p.path);
      const toggle = page.locator('[data-nav-toggle]');
      const openMenu = async () => {
        if (testInfo.project.name === 'mobile') await toggle.click();
      };
      await openMenu();
      const sw = page.locator('[data-lang-switch]');
      await expect(sw).toHaveAttribute('hreflang', 'en');
      // El texto visible del enlace lleva su propio `lang` (idioma de la parte, WCAG 3.1.2); el nombre accesible queda en el idioma de la página.
      await expect(sw.locator('[lang]').first()).toHaveAttribute('lang', 'en');
      await sw.click();
      await expect(page).toHaveURL(new RegExp(`${ROUTES.en[p.key].replace(/\//g, '\\/')}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await openMenu();
      await page.locator('[data-lang-switch]').click();
      await expect(page).toHaveURL(new RegExp(`${p.path.replace(/\//g, '\\/')}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    });
  }
});

test.describe('cabecera', () => {
  test('menú móvil: abre y cierra con aria-expanded, Escape devuelve el foco', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'solo en el proyecto móvil');
    await open(page, '/');
    const toggle = page.locator('[data-nav-toggle]');
    const nav = page.locator('[data-nav]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'site-nav');
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAccessibleName(content('es').common.nav.menuOpen);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
    await expect(toggle).toHaveAccessibleName(content('es').common.nav.menuClose);
    await expect(nav.locator('a[href="/plataforma/"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();
    expect(await focusedId(page)).toBe('button');
    await expect(toggle).toBeFocused();
    // Segunda apertura y cierre con el propio botón.
    await toggle.click();
    await expect(nav).toBeVisible();
    await toggle.click();
    await expect(nav).toBeHidden();
  });

  test('escritorio: el conmutador está oculto y la navegación es visible', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'solo en escritorio');
    await open(page, '/');
    await expect(page.locator('[data-nav-toggle]')).toBeHidden();
    await expect(page.locator('[data-nav] a[href="/plataforma/"]')).toBeVisible();
    await expect(page.locator('[data-nav] a[aria-current="page"]')).toHaveCount(0);
    await open(page, '/plataforma/');
    await expect(page.locator('[data-nav] a[aria-current="page"]')).toHaveAttribute('href', '/plataforma/');
  });

  test('skip link: es el primer elemento enfocable y lleva el foco al contenido principal', async ({ page }) => {
    await open(page, '/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveText(content('es').common.skipLink);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    expect(await focusedId(page)).toBe('main');
  });
});

test.describe('404, robots y sitemap', () => {
  test('una ruta inexistente devuelve 404 con la página personalizada', async ({ page }) => {
    const console = collectConsoleErrors(page, [/404 \(Not Found\)|status of 404/]);
    const response = await page.goto('/esta-pagina-no-existe/');
    expect(response?.status()).toBe(404);
    const nf = content('es').notFound;
    await expect(page.locator('h1')).toHaveText(nf.title);
    await expect(page.getByRole('link', { name: nf.primaryCta.label })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: nf.secondaryCta.label })).toHaveAttribute('href', '/verificar/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/`);
    expect(console.stop()).toEqual([]);
  });

  test('la página 404 en inglés existe y enlaza a su inicio', async ({ page }) => {
    await page.goto('/en/404/');
    const nf = content('en').notFound;
    await expect(page.locator('h1')).toHaveText(nf.title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: nf.primaryCta.label })).toHaveAttribute('href', '/en/');
  });

  test('robots.txt permite el rastreo, excluye /404 y apunta al sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/text\/plain/);
    const body = await res.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /404');
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
  });

  test('sitemap-index.xml enlaza un sitemap con las 28 URL indexables (30 páginas menos las dos 404)', async ({ request }) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.status()).toBe(200);
    const indexBody = await index.text();
    const children = [...indexBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(children.length).toBeGreaterThan(0);
    const urls = new Set<string>();
    for (const child of children) {
      expect(child.startsWith(SITE_URL)).toBe(true);
      const res = await request.get(child.slice(SITE_URL.length));
      expect(res.status()).toBe(200);
      for (const m of (await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]!);
    }
    const expected = new Set(INDEXABLE_PAGES.map((p) => `${SITE_URL}${p.path}`));
    expect([...urls].sort()).toEqual([...expected].sort());
    expect(urls.size).toBe(28);
    for (const p of PAGES.filter((x) => x.key === 'notFound')) expect(urls.has(`${SITE_URL}${p.path}`)).toBe(false);
  });
});

test.describe('enlaces internos y controles', () => {
  test('ningún enlace interno de las 30 páginas está roto (HTTP y archivo en dist)', async ({ page, request }) => {
    const links = new Map<string, Set<string>>();
    for (const p of PAGES) {
      await page.goto(p.path);
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href') ?? ''));
      for (const href of hrefs) {
        if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/.test(href)) continue;
        if (/^https?:\/\//.test(href) && !href.startsWith(SITE_URL)) {
          expect.soft(href, `enlace externo en ${p.path}`).toBe('');
          continue;
        }
        const clean = href.replace(SITE_URL, '').split('#')[0]!.split('?')[0]!;
        if (!links.has(clean)) links.set(clean, new Set());
        links.get(clean)!.add(p.path);
      }
    }
    expect(links.size).toBeGreaterThan(15);
    const broken: string[] = [];
    for (const [href, sources] of links) {
      const res = await request.get(href, { maxRedirects: 0 });
      if (res.status() !== 200) broken.push(`${href} → ${res.status()} (desde ${[...sources].join(', ')})`);
      if (existsSync(resolve(DIST_DIR))) {
        const file = resolve(DIST_DIR, `.${href}${href.endsWith('/') ? 'index.html' : ''}`);
        if (!existsSync(file)) broken.push(`${href} no existe en ${DIST_DIR}`);
      }
    }
    expect(broken).toEqual([]);
  });

  test('los CTA de contenido apuntan a rutas del sitio (con o sin tenant/ancla)', async ({ page }) => {
    const valid = new Set(PAGES.map((p) => p.path));
    for (const p of PAGES) {
      await page.goto(p.path);
      const hrefs = await page.$$eval('main a.btn[href], main a[class*="cta"][href]', (as) => as.map((a) => a.getAttribute('href') ?? ''));
      for (const href of hrefs) {
        const path = href.split('?')[0]!.split('#')[0]!;
        expect(valid.has(path), `CTA ${href} en ${p.path}`).toBe(true);
        const query = href.includes('?') ? href.split('?')[1]!.split('#')[0] : '';
        if (query) expect(query).toMatch(/^t=(traza|licores)$/);
      }
    }
  });

  for (const p of PAGES) {
    test(`${p.path}: ningún botón visible está muerto`, async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await open(page, p.path);
      const buttons = page.locator('button');
      const total = await buttons.count();
      const dead: string[] = [];
      const disabledWithoutName: string[] = [];
      let clicked = 0;
      let disabledCount = 0;
      for (let i = 0; i < total; i += 1) {
        const btn = buttons.nth(i);
        if (!(await btn.isVisible())) continue;
        const info = await btn.evaluate((el) => {
          const b = el as HTMLButtonElement;
          const name = (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().replace(/\s+/g, ' ');
          return {
            name,
            id: b.dataset.testid ?? b.dataset.action ?? b.dataset.scenario ?? b.dataset.alertOpen ?? b.dataset.caseOpen ?? b.className,
            disabled: b.disabled || b.getAttribute('aria-disabled') === 'true',
            navToggle: b.hasAttribute('data-nav-toggle'),
          };
        });
        if (info.disabled) {
          // Deshabilitado con motivo: debe tener nombre accesible y, si es del recorrido, un estado que lo explique.
          disabledCount += 1;
          if (!info.name) disabledWithoutName.push(info.id);
          continue;
        }
        if (info.navToggle && testInfo.project.name !== 'mobile') continue;
        // Un botón que abre un elemento ya abierto (detalle de alerta/caso ya en pantalla) es idempotente, no muerto.
        const alreadyOpen = await btn.evaluate((el) => {
          const b = el as HTMLButtonElement;
          const id = b.dataset.alertOpen ?? b.dataset.caseOpen;
          if (!id) return false;
          const detail = document.querySelector('[data-testid="alert-detail"], [data-testid="case-detail"]');
          return !!detail && (detail.textContent ?? '').includes(id);
        });
        if (alreadyOpen) continue;
        // Espera a que las islas estén en reposo (sin consulta simulada ni haz de escaneo) antes de medir el efecto del clic.
        await page
          .waitForFunction(
            () => !document.querySelector('[data-verify-app][data-state="loading"], [data-scanner][data-camera="simulating"], [data-journey][data-view="loading"], .inst[data-load="loading"]'),
            null,
            { timeout: 8_000 },
          )
          .catch(() => undefined);
        const before = await page.evaluate(() => ({
          url: location.href,
          focus: document.activeElement?.outerHTML.slice(0, 80) ?? '',
          html: document.documentElement.outerHTML.length,
          attrs: Array.from(document.querySelectorAll('[aria-expanded],[aria-pressed],[aria-current],[data-state],[data-view],[data-load],[hidden]'))
            .map((n) => `${n.tagName}:${n.getAttribute('aria-expanded')}${n.getAttribute('aria-pressed')}${n.getAttribute('aria-current')}${n.getAttribute('data-state')}${n.getAttribute('data-view')}${n.getAttribute('data-load')}${n.hasAttribute('hidden')}`)
            .join('|'),
        }));
        let clickError = '';
        await btn.click({ timeout: 5_000 }).catch((e: Error) => {
          clickError = e.message.split('\n')[0] ?? 'click failed';
        });
        clicked += 1;
        await page.waitForTimeout(350);
        const after = await page.evaluate(() => ({
          url: location.href,
          focus: document.activeElement?.outerHTML.slice(0, 80) ?? '',
          html: document.documentElement.outerHTML.length,
          attrs: Array.from(document.querySelectorAll('[aria-expanded],[aria-pressed],[aria-current],[data-state],[data-view],[data-load],[hidden]'))
            .map((n) => `${n.tagName}:${n.getAttribute('aria-expanded')}${n.getAttribute('aria-pressed')}${n.getAttribute('aria-current')}${n.getAttribute('data-state')}${n.getAttribute('data-view')}${n.getAttribute('data-load')}${n.hasAttribute('hidden')}`)
            .join('|'),
        }));
        const changed = before.url !== after.url || before.html !== after.html || before.attrs !== after.attrs || before.focus !== after.focus;
        if (!changed) dead.push(`${info.id} («${info.name}»)${clickError ? ` — clic fallido: ${clickError}` : ''}`);
        // Si el botón navegó a otra página, volvemos para seguir con los demás.
        if (before.url !== after.url && new URL(after.url).pathname !== new URL(before.url).pathname) await open(page, p.path);
      }
      testInfo.annotations.push({ type: 'buttons', description: `${clicked} pulsados, ${disabledCount} deshabilitados, ${total} en total` });
      expect(disabledWithoutName, 'botones deshabilitados sin nombre accesible').toEqual([]);
      expect(dead, 'botones sin efecto observable').toEqual([]);
    });
  }
});
