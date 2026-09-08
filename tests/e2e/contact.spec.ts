/**
 * Formulario de contacto (/empresa/, /en/company/): validación accesible, éxito simulado, error de servidor
 * ("[error]" en el mensaje), sin conexión real y recuperación.
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

test.describe('envío simulado', () => {
  test('éxito: estado enviando, panel de éxito con ticket y formulario oculto', async ({ page }) => {
    await open(page, '/empresa/');
    await fillValid(page);
    await page.locator('[data-submit]').click();
    await expect(form(page)).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('[data-submit]')).toBeDisabled();
    await expect(page.locator('[data-submit]')).toContainText(es.common.form.sending);
    const success = page.locator('[data-status="success"]');
    await expect(success).toBeVisible({ timeout: 10_000 });
    await expect(success).toBeFocused();
    await expect(success).toContainText(es.company.contact.form.success.title);
    await expect(success).toContainText(es.company.contact.form.success.body);
    await expect(page.locator('[data-contact-ticket]')).toHaveText(/^CT-2026-\d{5}$/);
    await expect(form(page)).toBeHidden();
    await expect(success.locator('[role="status"]')).toBeVisible();
  });

  test('"[error]" en el mensaje → error de servidor con reintento que vuelve a fallar', async ({ page }) => {
    await open(page, '/empresa/');
    await fillValid(page, 'Mensaje de prueba con [error] para forzar el fallo del servicio simulado.');
    await page.locator('[data-submit]').click();
    const error = page.locator('[data-status="error"]');
    await expect(error).toBeVisible({ timeout: 10_000 });
    await expect(error).toBeFocused();
    await expect(error.locator('[role="alert"]')).toBeVisible();
    await expect(error).toContainText(es.company.contact.form.error.title);
    await expect(form(page)).toBeVisible();
    await expect(field(page, 'message')).toHaveValue(/\[error\]/);
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await error.locator('[data-retry]').click();
    await expect(error).toBeHidden();
    await expect(error).toBeVisible({ timeout: 10_000 });
    // Corregir el mensaje y reintentar → éxito.
    await field(page, 'message').fill('Mensaje corregido, sin la palabra clave que fuerza el fallo del servicio.');
    await error.locator('[data-retry]').click();
    await expect(page.locator('[data-status="success"]')).toBeVisible({ timeout: 10_000 });
  });

  test('sin conexión real: aviso sin enviar, recuperación y reintento con éxito', async ({ page, context }) => {
    await open(page, '/empresa/');
    await fillValid(page);
    await context.setOffline(true);
    await page.locator('[data-submit]').click();
    const offline = page.locator('[data-status="offline"]');
    await expect(offline).toBeVisible();
    await expect(offline).toBeFocused();
    await expect(offline).toContainText(es.common.states.offlineTitle);
    // Sin conexión no se intenta el envío: el formulario no entra en estado ocupado.
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
