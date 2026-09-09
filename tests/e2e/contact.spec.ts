/**
 * Formulario de contacto: validación accesible, composición mailto y envío pendiente en la app de correo.
 * No hay POST, ticket ni palabra mágica de error. Se cubre configuración ausente, offline y ausencia de JS.
 */
import { expect, test, type Page } from '@playwright/test';
import { collectConsoleErrors, content, focusedId, open } from './helpers';

const es = content('es');
const en = content('en');

const form = (page: Page) => page.locator('[data-contact-form]');
const field = (page: Page, name: string) => page.locator(`#contact-${name}`);

async function fillValid(page: Page, message = 'Estamos evaluando un piloto acotado para una línea de producto y queremos entender la plataforma.', keyboardConsent = false): Promise<void> {
  await field(page, 'name').fill('Persona de prueba');
  await field(page, 'email').fill('prueba@example.com');
  await field(page, 'org').fill('Organización de prueba');
  await field(page, 'sector').selectOption({ index: 1 });
  await field(page, 'message').fill(message);
  if (keyboardConsent) {
    await field(page, 'consent').focus();
    await field(page, 'consent').press('Space');
    await expect(field(page, 'consent')).toBeChecked();
  } else {
    await field(page, 'consent').check();
  }
}

test.describe('validación', () => {
  test('envío vacío → resumen de errores role=alert enfocado, con enlaces a cada campo y errores asociados', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/empresa/');
    await expect(form(page)).toHaveAttribute('novalidate', '');
    await page.locator('[data-submit]').click();
    const summary = page.locator('[data-summary]');
    await expect(summary).toBeVisible();
    await expect(summary).toHaveAttribute('role', 'alert');
    await expect(summary).toBeFocused();
    await expect(summary).toContainText(es.common.form.errorSummaryTitle);
    // Obligatorios: nombre, correo, mensaje y consentimiento.
    await expect(summary.locator('li')).toHaveCount(4);
    await expect(summary.locator('li a').first()).toHaveAttribute('href', '#contact-name');
    for (const name of ['name', 'email', 'message', 'consent']) {
      await expect(field(page, name)).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#contact-${name}-error`)).toBeVisible();
      await expect(page.locator(`#contact-${name}-error`)).toContainText(es.common.form.required);
      await expect(field(page, name)).toHaveAttribute('aria-describedby', `contact-${name}-error`);
    }
    await expect(field(page, 'org')).not.toHaveAttribute('aria-invalid', 'true');
    // El enlace del resumen lleva el foco al campo.
    await summary.locator('li a').first().click();
    expect(await focusedId(page)).toBe('contact-name');
    // Corregir un campo retira su error al vuelo.
    await field(page, 'name').fill('Ana');
    await expect(field(page, 'name')).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-name-error')).toBeHidden();
    expect(console.stop()).toEqual([]);
  });

  test('correo inválido y mensaje corto muestran mensajes específicos', async ({ page }) => {
    await open(page, '/empresa/');
    await fillValid(page, 'corto');
    await field(page, 'email').fill('no-es-correo');
    await page.locator('[data-submit]').click();
    await expect(page.locator('#contact-email-error')).toContainText(es.common.form.invalidEmail);
    await expect(page.locator('#contact-message-error')).toContainText(es.common.form.tooShort);
    await expect(page.locator('[data-summary] li')).toHaveCount(2);
    await expect(page.locator('[data-status="success"]')).toBeHidden();
  });
});

test.describe('preparación local del correo', () => {
  for (const [path, strings, pendingText] of [
    ['/empresa/', es, 'Revíselo y envíelo: hasta que lo haga, no nos ha llegado.'],
    ['/en/company/', en, 'Review it and send it: until you do, it has not reached us.'],
  ] as const) {
    test(`${path}: prepara mailto exacto y codificado sin transmitir el formulario`, async ({ page }) => {
      await open(page, path);
      const f = strings.company.contact.form;
      const values = {
        name: 'María & Equipo + QA',
        email: 'prueba+qr@example.com',
        organization: 'Salud & Control / Investigación',
        sector: f.sectorOptions[0]!,
        message: 'Consulta [error]: ¿cómo comparar A&B + C?\nLote #12; información para revisión.',
      };
      await fillValid(page, values.message);
      await field(page, 'name').fill(values.name);
      await field(page, 'email').fill(values.email);
      await field(page, 'org').fill(values.organization);
      const recipient = await page.locator('[data-contact]').getAttribute('data-contact-email');
      expect(recipient, 'el build debe configurar un destinatario para este idioma').toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const subject = f.mailSubject.replace('{name}', values.name);
      const body = [
        `${f.name}: ${values.name}`,
        `${f.email}: ${values.email}`,
        `${f.organization}: ${values.organization}`,
        `${f.sector}: ${values.sector}`,
        '',
        values.message,
      ].join('\n');
      const expectedHref = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const requests: { method: string; url: string }[] = [];
      page.on('request', (request) => requests.push({ method: request.method(), url: request.url() }));
      // Observa la navegación nativa: no sustituye location ni intercepta la lógica de la aplicación.
      const session = await page.context().newCDPSession(page);
      await session.send('Page.enable');
      const navigations: string[] = [];
      session.on('Page.frameRequestedNavigation', (event) => navigations.push(event.url));
      await page.locator('[data-submit]').click();
      const success = page.locator('[data-status="success"]');
      await expect(success).toBeVisible();
      await expect(success).toBeFocused();
      await expect(success).toContainText(f.success.title);
      await expect(success).toContainText(f.success.body);
      await expect(success).toContainText(pendingText);
      await expect(success.locator('[role="status"]')).toBeVisible();
      const mailto = page.locator('[data-contact-mailto]');
      await expect(mailto).toBeVisible();
      await expect(mailto).toHaveText(recipient!);
      await expect(mailto).toHaveAttribute('href', expectedHref);
      const parsed = new URL((await mailto.getAttribute('href'))!);
      expect(parsed.protocol).toBe('mailto:');
      expect(parsed.pathname).toBe(recipient);
      expect([...parsed.searchParams.keys()]).toEqual(['subject', 'body']);
      expect(parsed.searchParams.get('subject')).toBe(subject);
      expect(parsed.searchParams.get('body')).toBe(body);
      await expect.poll(() => navigations).toContain(expectedHref);
      await expect(form(page)).toBeHidden();
      await expect(form(page)).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('[data-submit]')).toBeEnabled();
      await expect(page.locator('[data-contact-ticket]')).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      expect(requests.filter((request) => request.method === 'POST')).toEqual([]);
      expect(requests.filter((request) => /^https?:/.test(request.url))).toEqual([]);
      await session.detach();
    });
  }

  test('sin destinatario configurado: error real, conserva valores y permite reintentar', async ({ page }) => {
    let recipient = '';
    // Fixture de respuesta equivalente al HTML de un build sin buzón, antes de ejecutar sus scripts.
    await page.route('**/empresa/', async (route) => {
      const response = await route.fetch();
      const html = await response.text();
      recipient = html.match(/data-contact-email="([^"]+)"/)?.[1] ?? '';
      await route.fulfill({ response, body: html.replace(/data-contact-email="[^"]*"/, 'data-contact-email=""') });
    });
    await open(page, '/empresa/');
    const root = page.locator('[data-contact]');
    expect(recipient).toBeTruthy();
    await expect(root).toHaveAttribute('data-contact-email', '');
    await fillValid(page);
    const requests: string[] = [];
    page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`));
    await page.locator('[data-submit]').click();
    const error = page.locator('[data-status="error"]');
    await expect(error).toBeVisible();
    await expect(error).toBeFocused();
    await expect(error.locator('[role="alert"]')).toBeVisible();
    await expect(error).toContainText(es.company.contact.form.error.title);
    await expect(form(page)).toBeVisible();
    await expect(field(page, 'email')).toHaveValue('prueba@example.com');
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await expect(page.locator('[data-status="success"]')).toBeHidden();
    await expect(page.locator('[data-contact-mailto]')).toBeHidden();
    await error.locator('[data-retry]').click();
    await expect(error).toBeVisible();
    await expect(error).toBeFocused();
    expect(requests).toEqual([]);
    // Reconfigura únicamente el dato de esta fixture para comprobar el reintento del mismo formulario.
    await root.evaluate((element, value) => element.setAttribute('data-contact-email', value), recipient);
    await error.locator('[data-retry]').click();
    await expect(error).toBeHidden();
    await expect(page.locator('[data-status="success"]')).toBeVisible();
    await expect(page.locator('[data-contact-mailto]')).toHaveText(recipient!);
    expect(requests.filter((request) => /^(POST|GET) https?:/.test(request))).toEqual([]);
  });

  // Un fallo del gestor mailto externo no es un error de servidor observable por esta web.
  // Location.href no ofrece un resultado de entrega: la cobertura verifica el intento nativo y el enlace
  // de respaldo. No fuerza artificialmente el panel error ni afirma que se abrió una app o se envió correo.

  test('sin conexión: aviso, recuperación y reintento que prepara el correo', async ({ page, context }) => {
    await open(page, '/empresa/');
    await fillValid(page);
    await context.setOffline(true);
    await page.locator('[data-submit]').click();
    const offline = page.locator('[data-status="offline"]');
    await expect(offline).toBeVisible();
    await expect(offline).toBeFocused();
    await expect(offline).toContainText(es.common.states.offlineTitle);
    // Sin conexión no se prepara el correo: el formulario no entra en estado ocupado.
    await expect(form(page)).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await context.setOffline(false);
    const recovered = page.locator('[data-status="recovered"]');
    await expect(recovered).toBeVisible();
    await expect(recovered).toContainText(es.common.states.recoveredTitle);
    await expect(offline).toBeHidden();
    await recovered.locator('[data-retry]').click();
    await expect(page.locator('[data-status="success"]')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [path, strings] of [['/empresa/', es], ['/en/company/', en]] as const) {
    test(`${path}: contacto no transmite los valores y explica el envío deshabilitado`, async ({ page }) => {
      await open(page, path);
      const requests: string[] = [];
      page.on('request', (req) => requests.push(`${req.method()} ${req.url()} ${req.postData() ?? ''}`));
      await fillValid(page, 'Mensaje ficticio confidencial de regresión que nunca debe enviarse.', true);
      await expect(page.locator('[data-contact-inactive]')).toBeVisible();
      await expect(page.locator('[data-contact-inactive]')).toHaveText(strings.common.form.noScript);
      const button = page.locator('[data-submit]');
      await expect(button).toBeDisabled();
      // El clic físico en un botón deshabilitado y el envío implícito por Enter no hacen POST.
      // Sin JS no se espera la estabilidad mediante requestAnimationFrame; el clic sigue siendo nativo.
      await button.click({ force: true });
      await field(page, 'email').press('Enter');
      await expect(field(page, 'email')).toHaveValue('prueba@example.com');
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      expect(requests).toEqual([]);
    });
  }
});

test('si falla el script de contacto, el envío permanece deshabilitado sin transmitir datos', async ({ page }) => {
  await page.route('**/*ContactForm*.js', (route) => route.abort());
  await open(page, '/empresa/');
  const requests: string[] = [];
  page.on('request', (req) => requests.push(`${req.method()} ${req.url()} ${req.postData() ?? ''}`));
  await fillValid(page);
  await expect(page.locator('[data-submit]')).toBeDisabled();
  await expect(page.locator('[data-contact-inactive]')).toBeVisible();
  await field(page, 'email').press('Enter');
  await expect(field(page, 'email')).toHaveValue('prueba@example.com');
  expect(requests).toEqual([]);
});

test.describe('inglés', () => {
  test('/en/company/: validación y éxito con textos en inglés', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/en/company/');
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-summary]')).toContainText(en.common.form.errorSummaryTitle);
    await expect(page.locator('#contact-name-error')).toContainText(en.common.form.required);
    await fillValid(page, 'We are evaluating a small pilot for one product line and want to understand the platform.');
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-status="success"]')).toContainText(en.company.contact.form.success.title, { timeout: 10_000 });
    expect(console.stop()).toEqual([]);
  });
});
