/**
 * Privacidad: lo que afirma el aviso se cumple en tiempo de ejecución — sin cookies, sin almacenamiento local,
 * sin peticiones a terceros y sin envío de datos al usar las tres vistas y el formulario.
 */
import { expect, test, type Page } from '@playwright/test';
import { SCENARIO_BY_ID } from '@/fixtures/scenarios';
import { ALERTS } from '@/fixtures/institutional';
import { SITE_URL, open } from './helpers';

async function storageState(page: Page): Promise<{ cookie: string; local: number; session: number }> {
  return page.evaluate(() => ({ cookie: document.cookie, local: localStorage.length, session: sessionStorage.length }));
}

test('usar las vistas y el formulario no crea cookies, almacenamiento ni peticiones salientes', async ({ page, context }) => {
  const outgoing: string[] = [];
  const origin = new URL(test.info().project.use.baseURL as string).origin;
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith(origin)) outgoing.push(url);
    // Ninguna petición de envío de datos (POST/PUT) debe salir del navegador en modo mock.
    if (req.method() !== 'GET') outgoing.push(`${req.method()} ${url}`);
  });

  await open(page, `/verificar/?c=${SCENARIO_BY_ID.get('valid')!.code}`);
  await expect(page.getByTestId('verify-result')).toBeVisible({ timeout: 10_000 });
  await page.getByTestId('report-button').click();
  await page.getByTestId('report-kind').selectOption('other');
  await page.getByTestId('report-description').fill('Prueba de privacidad: nada de esto debe salir del navegador.');
  await page.getByTestId('report-email').fill('nadie@example.com');
  await page.getByTestId('report-submit').click();
  await expect(page.getByTestId('report-success')).toBeVisible({ timeout: 10_000 });

  await open(page, '/recorrido/');
  await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-3N6D-09ZB');
  await expect(page.getByTestId('journey')).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });

  await open(page, '/institucional/');
  await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
  await page.locator(`button[data-alert-open="${ALERTS.find((a) => a.status === 'open')!.id}"]`).click();
  await page.getByTestId('alert-detail').locator('[data-action="acknowledge"]').click();

  await open(page, '/empresa/');
  await page.locator('#contact-name').fill('Persona de prueba');
  await page.locator('#contact-email').fill('prueba@example.com');
  await page.locator('#contact-message').fill('Mensaje de prueba de privacidad que no debe transmitirse a ningún servidor.');
  await page.locator('#contact-consent').check();
  await page.locator('[data-submit]').click();
  await expect(page.locator('[data-status="success"]')).toBeVisible({ timeout: 10_000 });

  expect(await storageState(page)).toEqual({ cookie: '', local: 0, session: 0 });
  expect(await context.cookies()).toEqual([]);
  expect(outgoing).toEqual([]);
});

test('las páginas no envían cabecera Set-Cookie ni cargan recursos de terceros', async ({ request }) => {
  for (const path of ['/', '/verificar/', '/recorrido/', '/institucional/', '/empresa/', '/privacidad/']) {
    const res = await request.get(path);
    expect(res.headers()['set-cookie'], path).toBeUndefined();
    const html = await res.text();
    const refs = [...html.matchAll(/\s(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]!);
    // Solo canonical/hreflang/og apuntan a la URL pública configurada; nada se carga desde otros orígenes.
    for (const ref of refs) expect(ref.startsWith(`${SITE_URL}/`), `${path} referencia externa: ${ref}`).toBe(true);
  }
});
