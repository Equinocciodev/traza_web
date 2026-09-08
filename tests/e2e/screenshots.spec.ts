/**
 * Capturas finales de entrega (proyecto `screenshots`): las 15 páginas ES, las 3 vistas EN y los estados clave
 * de cada demo, a 1366 y 360 px de ancho, en docs/capturas/final/<ruta>-<ancho>.png.
 */
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROUTES } from '@/i18n';
import { SCENARIO_BY_ID } from '@/fixtures/scenarios';
import { ALERTS } from '@/fixtures/institutional';

const OUT = resolve(process.env.PW_SHOTS_DIR ?? 'docs/capturas/final');
const WIDTHS = [
  { width: 1366, height: 900 },
  { width: 360, height: 740 },
] as const;

mkdirSync(OUT, { recursive: true });

async function shoot(page: Page, name: string, width: number): Promise<void> {
  await page.waitForLoadState('networkidle');
  // Captura de página completa: la cabecera sticky y la insignia fija quedarían pegadas a la posición de
  // scroll del momento; se vuelven estáticas solo para la captura (no afecta al sitio).
  await page.addStyleTag({ content: '.site-header{position:static !important}.demo-badge{display:none !important}' });
  // La captura no hace scroll: los bloques pendientes de revelado y los trazos sin dibujar se llevan a su
  // estado final (el mismo que verá quien recorra la página) antes de capturar.
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-pending').forEach((el) => {
      el.classList.remove('reveal-pending');
      el.classList.add('is-visible');
    });
    document.querySelectorAll('.chain--pending').forEach((el) => el.classList.remove('chain--pending'));
    document.querySelectorAll<SVGGeometryElement>('[data-chain-line], [data-trace-path]').forEach((path) => {
      path.style.strokeDashoffset = '0';
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);
  await page.screenshot({ path: resolve(OUT, `${name}-${width}.png`), fullPage: true, animations: 'disabled' });
}

async function settle(page: Page, path: string, width: (typeof WIDTHS)[number]): Promise<void> {
  await page.setViewportSize(width);
  await page.goto(path, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
}

/** Páginas estáticas: 15 ES (incluida la 404) + 3 vistas EN. */
const STATIC: { name: string; path: string }[] = [
  { name: 'inicio', path: ROUTES.es.home },
  { name: 'plataforma', path: ROUTES.es.platform },
  { name: 'soluciones', path: ROUTES.es.solutions },
  { name: 'soluciones-gobierno', path: ROUTES.es.solutionsGovernment },
  { name: 'soluciones-industria', path: ROUTES.es.solutionsIndustry },
  { name: 'soluciones-ciudadanos', path: ROUTES.es.solutionsCitizens },
  { name: 'como-funciona', path: ROUTES.es.howItWorks },
  { name: 'casos-licores', path: ROUTES.es.caseSpirits },
  { name: 'verificar', path: ROUTES.es.verify },
  { name: 'recorrido', path: ROUTES.es.journey },
  { name: 'institucional', path: ROUTES.es.institutional },
  { name: 'seguridad', path: ROUTES.es.security },
  { name: 'empresa', path: ROUTES.es.company },
  { name: 'privacidad', path: ROUTES.es.privacy },
  { name: '404', path: '/pagina-inexistente/' },
  { name: 'en-verify', path: ROUTES.en.verify },
  { name: 'en-journey', path: ROUTES.en.journey },
  { name: 'en-institutional', path: ROUTES.en.institutional },
];

for (const w of WIDTHS) {
  test.describe(`${w.width} px`, () => {
    for (const s of STATIC) {
      test(`${s.name}-${w.width}`, async ({ page }) => {
        await settle(page, s.path, w);
        if (s.path === ROUTES.es.journey || s.path === ROUTES.en.journey) {
          // Estado final del recorrido (reproducción terminada) para la captura de página.
          await page.locator('[data-jr-diagram]').scrollIntoViewIfNeeded();
          await expect(page.getByTestId('journey-play')).toHaveAttribute('data-state', 'ended', { timeout: 15_000 });
          await page.evaluate(() => window.scrollTo(0, 0));
        }
        if (s.path === ROUTES.es.institutional || s.path === ROUTES.en.institutional) {
          await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
        }
        await shoot(page, s.name, w.width);
      });
    }

    test.describe('verificación · estados', () => {
      const run = async (page: Page, scenario: string) => {
        await page.locator(`button[data-scenario="${scenario}"]`).click();
      };
      test(`verificar-valid-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'valid');
        await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid', { timeout: 10_000 });
        await shoot(page, 'verificar-valid', w.width);
      });
      test(`verificar-warning-duplicate-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'duplicate');
        await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'warning', { timeout: 10_000 });
        await shoot(page, 'verificar-warning-duplicate', w.width);
      });
      test(`verificar-invalid-revoked-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'revoked');
        await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'revoked', { timeout: 10_000 });
        await shoot(page, 'verificar-invalid-revoked', w.width);
      });
      test(`verificar-unverifiable-offline-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'offline');
        await expect(page.locator('[data-view="error"][data-testid="verify-error"]')).toHaveAttribute('data-kind', 'offline', { timeout: 10_000 });
        await shoot(page, 'verificar-unverifiable-offline', w.width);
      });
      test(`verificar-error-server-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'server_error');
        await expect(page.locator('[data-view="error"][data-testid="verify-error"]')).toHaveAttribute('data-kind', 'server', { timeout: 10_000 });
        await shoot(page, 'verificar-error-server', w.width);
      });
      test(`verificar-camera-denied-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'camera_denied');
        await expect(page.locator('[data-testid="verify-error"][data-kind="camera-denied"]')).toBeVisible();
        await shoot(page, 'verificar-camera-denied', w.width);
      });
      test(`verificar-tenant-licores-${w.width}`, async ({ page }) => {
        await settle(page, `${ROUTES.es.verify}?t=licores&c=${SCENARIO_BY_ID.get('valid')!.code}`, w);
        await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid', { timeout: 10_000 });
        await shoot(page, 'verificar-tenant-licores', w.width);
      });
      test(`verificar-report-success-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.verify, w);
        await run(page, 'partial_match');
        await expect(page.getByTestId('verify-result')).toBeVisible({ timeout: 10_000 });
        await page.getByTestId('report-button').click();
        await page.getByTestId('report-kind').selectOption('label_mismatch');
        await page.getByTestId('report-description').fill('La etiqueta indica 1 L y el registro 750 ml.');
        await shoot(page, 'verificar-report-form', w.width);
        await page.getByTestId('report-submit').click();
        await expect(page.getByTestId('report-success')).toBeVisible({ timeout: 10_000 });
        await shoot(page, 'verificar-report-success', w.width);
      });
    });

    test.describe('recorrido · estados', () => {
      test(`recorrido-intermedio-${w.width}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await settle(page, ROUTES.es.journey, w);
        await page.getByTestId('journey-restart').click();
        await page.getByTestId('journey-next').click();
        await page.getByTestId('journey-next').click();
        await expect(page.getByTestId('journey')).toHaveAttribute('data-stage-index', '2');
        await shoot(page, 'recorrido-intermedio', w.width);
      });
      test(`recorrido-en-curso-${w.width}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await settle(page, ROUTES.es.journey, w);
        await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-8L1F-63HW');
        await expect(page.getByTestId('journey')).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });
        await expect(page.getByTestId('journey')).toHaveAttribute('data-stage-index', '3');
        await shoot(page, 'recorrido-en-curso', w.width);
      });
      test(`recorrido-vacio-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.journey, w);
        await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-2B8X-40NE');
        await expect(page.getByTestId('journey-empty')).toBeVisible({ timeout: 5_000 });
        await shoot(page, 'recorrido-vacio', w.width);
      });
      test(`recorrido-error-${w.width}`, async ({ page }) => {
        await settle(page, ROUTES.es.journey, w);
        await page.getByTestId('journey-error-sim').click();
        await expect(page.getByTestId('journey-error')).toBeVisible({ timeout: 5_000 });
        await shoot(page, 'recorrido-error', w.width);
      });
    });

    test.describe('vista institucional · estados', () => {
      const ready = async (page: Page) => {
        await settle(page, ROUTES.es.institutional, w);
        await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
      };
      test(`institucional-detalle-${w.width}`, async ({ page }) => {
        await ready(page);
        const alert = ALERTS.find((a) => a.status === 'open')!;
        await page.locator(`button[data-alert-open="${alert.id}"]`).click();
        await expect(page.getByTestId('alert-detail')).toBeVisible();
        await shoot(page, 'institucional-detalle', w.width);
      });
      test(`institucional-inspector-${w.width}`, async ({ page }) => {
        await ready(page);
        await page.locator('[data-testid="role-select"] input[data-role="inspector"]').check();
        await expect(page.getByTestId('institutional')).toHaveAttribute('data-role', 'inspector');
        await shoot(page, 'institucional-inspector', w.width);
      });
      test(`institucional-observador-${w.width}`, async ({ page }) => {
        await ready(page);
        await page.locator('[data-testid="role-select"] input[data-role="observer"]').check();
        await page.locator(`button[data-alert-open="${ALERTS[0]!.id}"]`).click();
        await expect(page.locator('[data-panel="alerts"] [data-testid="permission-denied"]')).toBeVisible();
        await shoot(page, 'institucional-observador', w.width);
      });
      test(`institucional-vacio-${w.width}`, async ({ page }) => {
        await ready(page);
        await page.locator('[data-filter-severity="critical"]').click();
        await page.locator('[data-filter-status="open"]').click();
        await expect(page.getByTestId('alert-empty')).toBeVisible();
        await shoot(page, 'institucional-vacio', w.width);
      });
      test(`institucional-error-${w.width}`, async ({ page }) => {
        await ready(page);
        await page.locator('[data-action="simulate-error"]').click();
        await expect(page.getByTestId('inst-error')).toBeVisible({ timeout: 10_000 });
        await shoot(page, 'institucional-error', w.width);
      });
    });

    test(`empresa-form-errores-${w.width}`, async ({ page }) => {
      await settle(page, ROUTES.es.company, w);
      await page.locator('[data-submit]').click();
      await expect(page.locator('[data-summary]')).toBeVisible();
      await shoot(page, 'empresa-form-errores', w.width);
    });
  });
}
