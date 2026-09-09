/**
 * Seguridad: la CSP estricta y las demás cabeceras de public/_headers se aplican con cabeceras HTTP reales
 * (segundo servidor estático propio) y las tres vistas, el formulario y la cabecera siguen funcionando sin
 * ninguna violación (evento securitypolicyviolation) ni error de consola.
 */
import { expect, test, type Page } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SCENARIO_BY_ID } from '@/fixtures/scenarios';
import { ALERTS } from '@/fixtures/institutional';
import { collectConsoleErrors, content } from './helpers';

const PORT_BASE = Number(process.env.PW_CSP_PORT ?? 4328);
/** Un puerto por worker: los proyectos desktop y mobile ejecutan este archivo en paralelo. */
let ORIGIN = '';
const DIST = [process.env.PW_DIST_DIR ?? '.tmp/dist-qa', 'dist'].map((d) => resolve(d)).find((d) => existsSync(d));
const HEADERS_FILE = resolve('public/_headers');

const EXPECTED_CSP =
  "default-src 'none'; script-src 'self' https://www.googletagmanager.com; style-src 'self'; img-src 'self' data: blob: https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; media-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";

let server: ChildProcess | undefined;

test.beforeAll(async ({}, testInfo) => {
  test.skip(!DIST, 'no hay build disponible (.tmp/dist-qa o dist)');
  const port = PORT_BASE + testInfo.workerIndex;
  ORIGIN = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['scripts/serve-static.mjs', DIST!, String(port), '--headers', HEADERS_FILE], { stdio: 'ignore' });
  // Espera a que el servidor responda.
  const deadline = Date.now() + 10_000;
  for (;;) {
    try {
      const res = await fetch(`${ORIGIN}/robots.txt`);
      if (res.ok) break;
    } catch {
      /* aún no escucha */
    }
    if (Date.now() > deadline) throw new Error('el servidor con cabeceras no arrancó');
    await new Promise((r) => setTimeout(r, 150));
  }
});

test.afterAll(() => {
  server?.kill();
});

interface Violation {
  directive: string;
  blocked: string;
  source: string;
  line: number;
}

/** Registra las violaciones de CSP en la ventana (el script de inicialización se inyecta por CDP, fuera del alcance de la CSP). */
async function armViolationLog(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as Window & { __csp?: Violation[] };
    w.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      w.__csp!.push({ directive: e.violatedDirective, blocked: e.blockedURI, source: e.sourceFile, line: e.lineNumber });
    });
  });
}

async function violations(page: Page): Promise<Violation[]> {
  return page.evaluate(() => (window as Window & { __csp?: Violation[] }).__csp ?? []);
}

async function openStrict(page: Page, path: string): Promise<void> {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
}

test.describe('cabeceras de seguridad', () => {
  test('el HTML lleva la CSP estricta, Permissions-Policy, Referrer-Policy, nosniff y sin caché larga', async ({ request }) => {
    const res = await request.get(`${ORIGIN}/verificar/`);
    expect(res.status()).toBe(200);
    const h = res.headers();
    expect(h['content-security-policy']).toBe(EXPECTED_CSP);
    expect(h['permissions-policy']).toContain('camera=(self)');
    expect(h['permissions-policy']).toContain('geolocation=()');
    expect(h['permissions-policy']).toContain('microphone=()');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
    expect(h['cross-origin-opener-policy']).toBe('same-origin');
    expect(h['strict-transport-security']).toMatch(/max-age=\d+/);
    expect(h['cache-control']).toBe('public, max-age=0, must-revalidate');
  });

  test('los recursos con hash son inmutables y los estáticos sin hash tienen caché corta', async ({ request }) => {
    const html = await (await request.get(`${ORIGIN}/`)).text();
    const asset = html.match(/\/_astro\/[^"']+\.(css|js)/)?.[0];
    expect(asset).toBeDefined();
    const res = await request.get(`${ORIGIN}${asset}`);
    expect(res.status()).toBe(200);
    expect(res.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
    expect(res.headers()['content-security-policy']).toBe(EXPECTED_CSP);
    for (const path of ['/favicon.svg', '/site.webmanifest', '/apple-touch-icon.png', '/og/default.png']) {
      const r = await request.get(`${ORIGIN}${path}`);
      expect(r.status(), path).toBe(200);
      expect(r.headers()['cache-control'], path).toBe('public, max-age=86400');
    }
    expect((await request.get(`${ORIGIN}/robots.txt`)).headers()['cache-control']).toBe('public, max-age=3600');
  });

  test('la 404 personalizada también recibe las cabeceras', async ({ request }) => {
    const res = await request.get(`${ORIGIN}/no-existe/`);
    expect(res.status()).toBe(404);
    expect(res.headers()['content-security-policy']).toBe(EXPECTED_CSP);
  });
});

test.describe('las páginas funcionan bajo la CSP estricta', () => {
  for (const path of ['/', '/plataforma/', '/casos/medicamentos/', '/seguridad/', '/privacidad/', '/en/', '/no-existe/']) {
    test(`${path}: carga sin violaciones ni errores`, async ({ page }, testInfo) => {
      const console = collectConsoleErrors(page, path === '/no-existe/' ? [/status of 404/] : []);
      await armViolationLog(page);
      await openStrict(page, path);
      await expect(page.locator('h1')).toHaveCount(1);
      // Estilos aplicados (hoja externa cargada) y fuentes propias resueltas.
      const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
      expect(font).toMatch(/Roboto/);
      await expect(page.locator('aside.demo-strip')).toHaveCount(0);
      if ((path === '/' || path === '/en/') && testInfo.project.name === 'mobile') {
        const trigger = page.locator('[data-nav-toggle]');
        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
      }
      expect(await violations(page)).toEqual([]);
      expect(console.stop()).toEqual([]);
    });
  }

  test('verificación: escenarios, cámara denegada y reporte', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await armViolationLog(page);
    await openStrict(page, `/verificar/?t=medicamentos&c=${SCENARIO_BY_ID.get('valid')!.code}`);
    await expect(page.getByTestId('verify-result')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid');
    await expect(page.locator('[data-tenant-lockup="medicamentos"]')).toBeVisible();
    await page.locator('button[data-scenario="duplicate"]').click();
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'warning', { timeout: 10_000 });
    await page.locator('button[data-scenario="camera_denied"]').click();
    await expect(page.locator('[data-testid="verify-error"][data-kind="camera-denied"]')).toBeVisible();
    await page.getByTestId('simulate-scan').click();
    await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', 'simulating');
    // El haz dura 1,2 s y después se consulta el registro: esperar a la nueva carga antes de seguir.
    await page.waitForFunction(() => document.querySelector('[data-verify-app]')?.getAttribute('data-state') === 'loading', null, { polling: 'raf', timeout: 10_000 });
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'result', { timeout: 10_000 });
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'warning');
    await page.getByTestId('report-button').click();
    await page.getByTestId('report-kind').selectOption('suspected_copy');
    await page.getByTestId('report-description').fill('Prueba bajo CSP estricta con cabeceras reales.');
    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-success')).toBeVisible({ timeout: 10_000 });
    // La cámara real (getUserMedia) falla de forma controlada en headless y no viola media-src.
    await page.getByTestId('report-done').click();
    await page.getByTestId('use-camera').click();
    await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', /^(unavailable|denied)$/, { timeout: 10_000 });
    expect(await violations(page)).toEqual([]);
    expect(console.stop()).toEqual([]);
  });

  test('recorrido: reproducción completa (stroke-dashoffset vía CSSOM) y cambio de unidad', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await armViolationLog(page);
    await openStrict(page, '/recorrido/');
    await page.locator('[data-jr-diagram]').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('journey-play')).toHaveAttribute('data-state', 'ended', { timeout: 15_000 });
    await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-2B8X-40NE');
    await expect(page.getByTestId('journey-empty')).toBeVisible({ timeout: 5_000 });
    await page.getByTestId('journey-error-sim').click();
    await expect(page.getByTestId('journey-error')).toBeVisible({ timeout: 5_000 });
    expect(await violations(page)).toEqual([]);
    expect(console.stop()).toEqual([]);
  });

  test('vista institucional: carga, detalle y acción simulada (count-up incluido)', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await armViolationLog(page);
    await openStrict(page, '/institucional/');
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
    const alert = ALERTS.find((a) => a.status === 'open')!;
    await page.locator(`button[data-alert-open="${alert.id}"]`).click();
    await page.getByTestId('alert-detail').locator('[data-action="acknowledge"]').click();
    await expect(page.locator(`li[data-alert-id="${alert.id}"]`)).toHaveAttribute('data-status', 'acknowledged');
    await page.locator('[data-testid="role-select"] input[data-role="observer"]').check();
    await expect(page.locator('[data-section="audit"] [data-testid="permission-denied"]')).toBeVisible();
    expect(await violations(page)).toEqual([]);
    expect(console.stop()).toEqual([]);
  });

  test('formulario de contacto: validación y envío; menú y selector de idioma', async ({ page }, testInfo) => {
    const console = collectConsoleErrors(page);
    await armViolationLog(page);
    await openStrict(page, '/empresa/');
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-summary]')).toBeVisible();
    await page.locator('#contact-name').fill('Persona de prueba');
    await page.locator('#contact-email').fill('prueba@example.com');
    await page.locator('#contact-message').fill('Mensaje de prueba bajo una política de seguridad de contenido estricta.');
    await page.locator('#contact-consent').check();
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-status="success"]')).toBeVisible({ timeout: 10_000 });
    if (testInfo.project.name === 'mobile') {
      await page.locator('[data-nav-toggle]').click();
      await expect(page.locator('[data-nav-toggle]')).toHaveAttribute('aria-expanded', 'true');
    }
    await page.locator('[data-lang-switch]').click();
    await expect(page).toHaveURL(`${ORIGIN}/en/company/`);
    await expect(page.locator('h1')).toHaveText(content('en').company.hero.title);
    expect(await violations(page)).toEqual([]);
    expect(console.stop()).toEqual([]);
  });

  test('un script inline sí sería bloqueado (la política se aplica de verdad)', async ({ page }) => {
    await armViolationLog(page);
    await openStrict(page, '/');
    const blocked = await page.evaluate(() => {
      const s = document.createElement('script');
      s.textContent = 'window.__inlineRan = true';
      document.body.appendChild(s);
      return (window as Window & { __inlineRan?: boolean }).__inlineRan !== true;
    });
    expect(blocked).toBe(true);
    const v = await violations(page);
    expect(v.some((x) => x.directive.startsWith('script-src'))).toBe(true);
  });
});
