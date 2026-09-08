/**
 * Demo A · Verificación pública: los 16 escenarios, estados de carga/error/recuperación, entrada manual,
 * deep link con tenant, reporte de discrepancia y versión en inglés. Los resultados esperados se derivan del
 * motor simulado (src/lib/verify/engine.ts) sobre los fixtures, no de valores escritos a mano.
 */
import { expect, test, type Page } from '@playwright/test';
import { SCENARIOS, SCENARIO_BY_ID, TRANSPORT_CODES } from '@/fixtures/scenarios';
import { UNIT_BY_CODE, FEATURED_UNIT_CODE } from '@/fixtures/units';
import { CHECK_ORDER, evaluateUnit } from '@/lib/verify/engine';
import { TENANTS } from '@/config/tenants';
import { collectConsoleErrors, content, expectNoAuthenticClaim, focusedId, open } from './helpers';

const es = content('es').verify;
const en = content('en').verify;
const VALID = SCENARIO_BY_ID.get('valid')!.code!;

const app = (page: Page) => page.locator('[data-verify-app]');
const result = (page: Page) => page.getByTestId('verify-result');
const errorView = (page: Page) => page.locator('[data-view="error"][data-testid="verify-error"]');

async function runScenario(page: Page, id: string): Promise<void> {
  const button = page.locator(`[data-testid="scenario-panel"] button[data-scenario="${id}"]`);
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

test.describe('escenarios por código (veredicto, motivo y comprobaciones según el motor)', () => {
  const codeScenarios = SCENARIOS.filter((s) => s.trigger === 'code' && s.id !== 'unknown_format');
  for (const s of codeScenarios) {
    test(`${s.id} → ${s.code}`, async ({ page }) => {
      const console = collectConsoleErrors(page);
      await open(page, '/verificar/');
      const unit = UNIT_BY_CODE.get(s.code!)!;
      const expected = evaluateUnit(unit, { registryName: TENANTS[unit.tenant].registryName.es });

      await runScenario(page, s.id);
      // Carga: la región de resultado queda ocupada (aria-busy) y el contenedor en estado loading.
      await expect(app(page)).toHaveAttribute('data-state', 'loading');
      await expect(page.locator('[data-result-region]')).toHaveAttribute('aria-busy', 'true');
      await expect(page.getByTestId('verify-loading')).toBeVisible();

      await expect(result(page)).toBeVisible({ timeout: 10_000 });
      await expect(app(page)).toHaveAttribute('data-state', 'result');
      await expect(page.locator('[data-result-region]')).toHaveAttribute('aria-busy', 'false');
      await expect(result(page)).toHaveAttribute('data-verdict', expected.verdict);
      await expect(result(page)).toHaveAttribute('data-reason', expected.reason);
      await expect(page.getByTestId('result-code')).toHaveText(s.code!);
      await expect(page.getByTestId('result-title')).toHaveText(es.reasons[expected.reason].title);
      await expect(page.getByTestId('result-confidence')).toHaveText(es.verdicts[expected.verdict].confidence);
      for (const key of CHECK_ORDER) {
        await expect(result(page).locator(`[data-check="${key}"]`)).toHaveAttribute('data-outcome', expected.checks[key].outcome);
      }
      const steps = page.getByTestId('result-steps').locator('li');
      await expect(steps).toHaveCount(expected.nextSteps.length);
      for (let i = 0; i < expected.nextSteps.length; i += 1) await expect(steps.nth(i)).toHaveText(es.meaning.steps[expected.nextSteps[i]!]);
      // Foco en el título del resultado y texto sin "auténtico".
      expect(await focusedId(page)).toBe('result-title');
      await expectNoAuthenticClaim(page);
      // Unidad oculta cuando la firma no es válida o la identidad no se reconoce.
      const unitSection = result(page).locator('[data-result-unit]');
      if (expected.unit) await expect(unitSection).toBeVisible();
      else {
        await expect(unitSection).toBeHidden();
        await expect(result(page).locator('[data-result-unit-hidden]')).toBeVisible();
      }
      // Anomalías listadas cuando existen.
      const anomalies = result(page).locator('[data-check="anomalies"] .anomaly');
      await expect(anomalies).toHaveCount(expected.checks.anomalies.items.length);
      // Pastilla del veredicto visible con icono + texto (no solo color).
      await expect(result(page).locator(`[data-verdict-pill="${expected.verdict}"]`)).toBeVisible();
      await expect(result(page).locator(`[data-verdict-pill="${expected.verdict}"]`)).toHaveText(es.verdicts[expected.verdict].label);
      expect(console.stop()).toEqual([]);
    });
  }

  test('unknown_format → no verificable sin consultar el registro', async ({ page }) => {
    await open(page, '/verificar/');
    await runScenario(page, 'unknown_format');
    await expect(result(page)).toBeVisible();
    await expect(result(page)).toHaveAttribute('data-verdict', 'unverifiable');
    await expect(result(page)).toHaveAttribute('data-reason', 'unknown_format');
    await expect(page.getByTestId('result-code')).toHaveText('ABC-123');
    for (const key of CHECK_ORDER) await expect(result(page).locator(`[data-check="${key}"]`)).toHaveAttribute('data-outcome', 'skipped');
    await expect(page.getByTestId('result-steps').locator('li')).toHaveText([es.meaning.steps.type_code]);
    await expect(result(page).locator('[data-result-unit-hidden]')).toBeHidden();
    await expectNoAuthenticClaim(page);
  });
});

test.describe('condiciones del dispositivo', () => {
  for (const [id, kind, text] of [
    ['unreadable', 'unreadable', es.scanner.unreadable],
    ['camera_denied', 'camera-denied', es.scanner.denied],
    ['camera_unavailable', 'camera-unavailable', es.scanner.unavailable],
  ] as const) {
    test(`${id} → aviso con alternativa de entrada manual`, async ({ page }) => {
      await open(page, '/verificar/');
      await runScenario(page, id);
      const box = page.locator(`[data-testid="verify-error"][data-kind="${kind}"]`);
      await expect(box).toBeVisible();
      await expect(box).toContainText(text.title);
      await expect(box).toContainText(text.body);
      await expect(box.locator('[role="alert"]')).toBeVisible();
      await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', kind === 'camera-denied' ? 'denied' : kind === 'camera-unavailable' ? 'unavailable' : 'unreadable');
      await expect(page.getByTestId('scanner-status')).toHaveText(text.title);
      // "Escribir el código" lleva el foco a la entrada manual y retira el aviso.
      await box.locator('[data-action="type"]').click();
      await expect(page.getByTestId('manual-input')).toBeFocused();
      await expect(box).toBeHidden();
      await expect(page.getByTestId('scanner-status')).toHaveText(es.scanner.idle);
    });
  }

  test('usar la cámara sin dispositivo disponible cae en "cámara no disponible" sin romper la página', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/verificar/');
    await page.getByTestId('use-camera').click();
    // Chromium headless sin dispositivo: la cámara falla como "no disponible" (o "denegada" según la política del navegador).
    await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', /^(unavailable|denied)$/, { timeout: 10_000 });
    const kind = (await page.locator('[data-scanner]').getAttribute('data-camera')) === 'denied' ? 'camera-denied' : 'camera-unavailable';
    await expect(page.locator(`[data-testid="verify-error"][data-kind="${kind}"]`)).toBeVisible();
    await expect(page.getByTestId('stop-camera')).toBeHidden();
    await expect(page.getByTestId('use-camera')).toBeVisible();
    expect(console.stop()).toEqual([]);
  });

  test('simular escaneo lee el código seleccionado y verifica', async ({ page }) => {
    await open(page, '/verificar/');
    await runScenario(page, 'revoked');
    await expect(result(page)).toBeVisible();
    await page.getByTestId('verify-again').click();
    await expect(app(page)).toHaveAttribute('data-state', 'idle');
    await page.getByTestId('simulate-scan').click();
    await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', 'simulating');
    await expect(page.getByTestId('scanner-status')).toHaveText(es.scanner.simulatingHint);
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('result-code')).toHaveText(SCENARIO_BY_ID.get('revoked')!.code!);
    await expect(page.getByTestId('manual-input')).toHaveValue(SCENARIO_BY_ID.get('revoked')!.code!);
  });
});

test.describe('condiciones de red', () => {
  test('server_error → error de servidor, reintento (sigue fallando por ser código de transporte) y "escribir otro código"', async ({ page }) => {
    await open(page, '/verificar/');
    await runScenario(page, 'server_error');
    await expect(app(page)).toHaveAttribute('data-state', 'loading');
    await expect(errorView(page)).toBeVisible({ timeout: 10_000 });
    await expect(app(page)).toHaveAttribute('data-state', 'error');
    await expect(errorView(page)).toHaveAttribute('data-kind', 'server');
    await expect(errorView(page)).toHaveAttribute('data-reason', 'server_error');
    await expect(errorView(page)).toContainText(es.states.errors.server.title);
    await expect(errorView(page).locator('[data-error-code]')).toHaveText(TRANSPORT_CODES.serverError);
    await expect(errorView(page).locator('[data-error-note="transport"]')).toBeVisible();
    await expect(errorView(page).locator('[data-error-note="auto"]')).toBeHidden();
    expect(await focusedId(page)).toBe('h2');
    await expectNoAuthenticClaim(page);

    await page.getByTestId('retry-button').click();
    await expect(app(page)).toHaveAttribute('data-state', 'loading');
    await expect(errorView(page)).toBeVisible({ timeout: 10_000 });
    await expect(errorView(page)).toHaveAttribute('data-kind', 'server');

    await page.getByTestId('type-another').click();
    await expect(app(page)).toHaveAttribute('data-state', 'idle');
    await expect(page.getByTestId('verify-idle')).toBeVisible();
    await expect(page.getByTestId('manual-input')).toHaveValue('');
    await expect(page.getByTestId('manual-input')).toBeFocused();
  });

  test('timeout → tiempo de espera agotado con reintento', async ({ page }) => {
    await open(page, '/verificar/');
    await runScenario(page, 'timeout');
    await expect(page.getByTestId('verify-loading')).toBeVisible();
    await expect(errorView(page)).toBeVisible({ timeout: 15_000 });
    await expect(errorView(page)).toHaveAttribute('data-kind', 'timeout');
    await expect(errorView(page)).toContainText(es.states.errors.timeout.title);
    await expect(errorView(page).locator('[data-error-code]')).toHaveText(TRANSPORT_CODES.timeout);
    await expect(page.getByTestId('retry-button')).toBeVisible();
  });

  test('offline simulado → error sin conexión con código pendiente; al recuperar la red se reintenta solo', async ({ page }) => {
    await open(page, '/verificar/');
    await runScenario(page, 'offline');
    await expect(page.getByTestId('network-toggle')).toBeChecked();
    await expect(page.getByTestId('net-offline')).toBeVisible();
    await expect(errorView(page)).toBeVisible({ timeout: 10_000 });
    await expect(errorView(page)).toHaveAttribute('data-kind', 'offline');
    await expect(errorView(page).locator('[data-error-code]')).toHaveText(FEATURED_UNIT_CODE);
    await expect(errorView(page).locator('[data-error-note="auto"]')).toBeVisible();
    await expect(errorView(page)).toContainText(es.states.nothingChecked);
    await expectNoAuthenticClaim(page);

    // Recuperación: se desactiva la red simulada → aviso de conexión restablecida y reintento automático.
    await page.getByTestId('network-toggle').uncheck();
    await expect(page.getByTestId('net-offline')).toBeHidden();
    await expect(page.getByTestId('net-recovered')).toBeVisible();
    await expect(page.getByTestId('net-recovered')).toContainText(es.states.recovered.title);
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
    await expect(page.getByTestId('result-code')).toHaveText(FEATURED_UNIT_CODE);
  });

  test('red simulada activada manualmente bloquea cualquier código y el reintento manual funciona al desactivarla', async ({ page }) => {
    await open(page, '/verificar/');
    await page.getByTestId('network-toggle').check();
    await expect(page.getByTestId('net-offline')).toBeVisible();
    await page.getByTestId('manual-input').fill(SCENARIO_BY_ID.get('duplicate')!.code!);
    await page.getByTestId('verify-button').click();
    await expect(errorView(page)).toBeVisible({ timeout: 10_000 });
    await expect(errorView(page)).toHaveAttribute('data-kind', 'offline');
    await page.getByTestId('network-toggle').uncheck();
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'warning');
    await expect(result(page)).toHaveAttribute('data-reason', 'anomalies_detected');
  });

  test('sin conexión real del navegador (context.setOffline) se muestra el aviso y la verificación queda pendiente', async ({ page, context }) => {
    await open(page, '/verificar/');
    await context.setOffline(true);
    await expect(page.getByTestId('net-offline')).toBeVisible();
    await page.getByTestId('manual-input').fill(VALID);
    await page.getByTestId('verify-button').click();
    await expect(errorView(page)).toBeVisible({ timeout: 10_000 });
    await expect(errorView(page)).toHaveAttribute('data-kind', 'offline');
    await context.setOffline(false);
    await expect(page.getByTestId('net-recovered')).toBeVisible();
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
  });
});

test.describe('entrada manual', () => {
  test('un intento mal formado retira el resultado válido anterior', async ({ page }) => {
    await open(page, `/verificar/?c=${VALID}`);
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
    await expect(result(page)).toBeVisible();
    await page.getByTestId('manual-input').fill('ABC-123');
    await page.getByTestId('verify-button').click();
    await expect(page.getByTestId('manual-error')).toHaveText(es.manual.errors.format);
    await expect(page.getByTestId('manual-input')).toHaveValue('ABC-123');
    await expect(app(page)).toHaveAttribute('data-state', 'idle');
    await expect(result(page)).toBeHidden();
    await expect(page.getByTestId('report-button')).toBeHidden();
  });

  test('vacío → error asociado al campo; formato inválido → error de formato; normalización al salir del campo', async ({ page }) => {
    await open(page, '/verificar/');
    const input = page.getByTestId('manual-input');
    const error = page.getByTestId('manual-error');
    await page.getByTestId('verify-button').click();
    await expect(error).toBeVisible();
    await expect(error).toHaveText(es.manual.errors.empty);
    await expect(error).toHaveAttribute('role', 'alert');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', /verify-code-error/);
    await expect(input).toBeFocused();
    await expect(app(page)).toHaveAttribute('data-state', 'idle');

    await input.fill('ABC-123');
    await expect(error).toBeHidden();
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await page.getByTestId('verify-button').click();
    await expect(error).toBeVisible();
    await expect(error).toHaveText(es.manual.errors.format);
    await expect(app(page)).toHaveAttribute('data-state', 'idle');

    await input.fill('trz 7f2k 4k7q 92fa');
    await input.blur();
    await expect(input).toHaveValue(VALID);
    await expect(page.locator('[data-manual-normalized]')).toHaveText(es.manual.normalized);
    await input.press('Enter');
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
  });

  test('un código con formato correcto pero desconocido → identidad no reconocida', async ({ page }) => {
    await open(page, '/verificar/');
    await page.getByTestId('manual-input').fill('TRZ-ZZZZ-1111-2222');
    await page.getByTestId('verify-button').click();
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'invalid');
    await expect(result(page)).toHaveAttribute('data-reason', 'not_registered');
    await expect(result(page).locator('[data-check="registry"]')).toHaveAttribute('data-outcome', 'fail');
    await expect(result(page).locator('[data-check="signature"]')).toHaveAttribute('data-outcome', 'warn');
  });

  test('sin JavaScript el formulario envía el código por GET a la propia página', async ({ page }) => {
    await open(page, '/verificar/');
    await expect(page.locator('[data-verify-form]')).toHaveAttribute('method', 'get');
    await expect(page.locator('[data-verify-form]')).toHaveAttribute('action', '/verificar/');
    await expect(page.getByTestId('manual-input')).toHaveAttribute('name', 'c');
  });
});

test.describe('deep link y tenant', () => {
  test('/verificar/?t=licores&c=… aplica el tenant, muestra el lockup con su aviso y verifica el código', async ({ page }) => {
    await open(page, `/verificar/?t=licores&c=${VALID}`);
    await expect(app(page)).toHaveAttribute('data-tenant', 'licores');
    await expect(page.locator('body')).toHaveAttribute('data-tenant', 'licores');
    const lockup = page.locator('[data-tenant-lockup="licores"]');
    await expect(lockup).toBeVisible();
    await expect(lockup.locator('.lockup__mark')).toHaveAccessibleName(TENANTS.licores.lockup!.alt.es);
    await expect(lockup).toContainText(TENANTS.licores.cobrandNotice!.es);
    await expect(lockup).toContainText(es.tenant.lockupCaption);
    await expect(page.locator('[data-tenant-text="name"]')).toHaveText(TENANTS.licores.name.es);
    await expect(page.locator('[data-tenant-text="registryName"]')).toHaveText(TENANTS.licores.registryName.es);
    await expect(page.getByTestId('tenant-licores')).toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('tenant-traza')).not.toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('manual-input')).toHaveValue(VALID);
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
    await expect(result(page).locator('[data-result-registry]')).toHaveText(TENANTS.licores.registryName.es);
    await expect(result(page).locator('[data-result-tenant-hint]')).toHaveText(TENANTS.licores.nextStepHint.es);

    // Cambiar al tenant maestro retira el lockup y el parámetro de la URL sin recargar.
    await page.getByTestId('tenant-traza').click();
    await expect(app(page)).not.toHaveAttribute('data-tenant', 'licores');
    await expect(lockup).toBeHidden();
    await expect(page).not.toHaveURL(/t=licores/);
    await expect(page.getByTestId('tenant-traza')).toHaveAttribute('aria-current', 'true');
    await expect(result(page).locator('[data-result-tenant-hint]')).toHaveText(TENANTS.traza.nextStepHint.es);
  });

  test('un tenant desconocido en la URL cae al tenant por defecto', async ({ page }) => {
    await open(page, '/verificar/?t=otro');
    await expect(app(page)).not.toHaveAttribute('data-tenant', /.+/);
    await expect(page.locator('[data-tenant-text="name"]')).toHaveText(TENANTS.traza.name.es);
    await expect(page.locator('[data-tenant-lockup="licores"]')).toBeHidden();
  });

  test('una unidad de otro despliegue se rotula con su registro', async ({ page }) => {
    await open(page, '/verificar/?t=licores');
    await page.getByTestId('manual-input').fill('TRZ-7F2K-6C2A-84MZ');
    await page.getByTestId('verify-button').click();
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
    await expect(result(page).locator('[data-result-other-tenant]')).toBeVisible();
    await expect(result(page).locator('[data-result-other-tenant]')).toContainText(TENANTS.traza.registryName.es);
  });
});

test.describe('reporte de discrepancia', () => {
  async function toResult(page: Page): Promise<void> {
    await open(page, '/verificar/');
    await runScenario(page, 'partial_match');
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
  }

  for (const previousOutcome of ['success', 'error'] as const) {
    test(`cancelar y reabrir ignora la respuesta ${previousOutcome} del reporte anterior`, async ({ page }) => {
      await page.clock.install({ time: new Date('2026-09-06T12:00:00Z') });
      await toResult(page);
      await page.clock.pauseAt(new Date('2026-09-06T13:00:00Z'));
      await page.getByTestId('report-button').click();
      await page.getByTestId('report-kind').selectOption('other');
      await page.getByTestId('report-description').fill(`Primer reporte suficientemente largo ${previousOutcome === 'error' ? '[error]' : ''}.`);
      await page.getByTestId('report-submit').click();
      await expect(page.getByTestId('report-form')).toHaveAttribute('aria-busy', 'true');
      await page.getByTestId('report-cancel').click();
      await page.getByTestId('report-button').click();
      await page.getByTestId('report-kind').selectOption('seal_damaged');
      const nextDescription = 'Segundo reporte que permanece abierto hasta su propio envío.';
      await page.getByTestId('report-description').fill(nextDescription);
      await page.clock.runFor(1500);
      await expect(page.getByTestId('report-form')).toBeVisible();
      await expect(page.getByTestId('report-description')).toHaveValue(nextDescription);
      await expect(page.getByTestId('report-success')).toBeHidden();
      await expect(page.getByTestId('report-error')).toBeHidden();
      await page.getByTestId('report-submit').click();
      await page.clock.runFor(1500);
      await expect(page.getByTestId('report-success')).toBeVisible();
      await expect(page.getByTestId('report-success').locator('[data-report-success-code]')).toHaveText(SCENARIO_BY_ID.get('partial_match')!.code!);
    });
  }

  test('validación, envío con folio y vuelta al resultado', async ({ page }) => {
    await toResult(page);
    const code = SCENARIO_BY_ID.get('partial_match')!.code!;
    await page.getByTestId('report-button').click();
    await expect(app(page)).toHaveAttribute('data-state', 'report');
    await expect(page.getByTestId('report-form')).toBeVisible();
    await expect(result(page)).toBeHidden();
    await expect(page.getByTestId('report-code')).toHaveText(code);
    expect(await focusedId(page)).toBe('h2');

    // Vacío: error en el tipo y foco en el primer campo inválido.
    await page.getByTestId('report-submit').click();
    await expect(page.locator('[data-field-error="kind"]')).toBeVisible();
    await expect(page.locator('[data-field-error="description"]')).toBeVisible();
    await expect(page.locator('[data-field-error="description"]')).toHaveText(es.report.errors.descriptionShort);
    await expect(page.getByTestId('report-kind')).toBeFocused();
    await expect(page.getByTestId('report-kind')).toHaveAttribute('aria-invalid', 'true');

    // Correo inválido opcional.
    await page.getByTestId('report-kind').selectOption('label_mismatch');
    await page.getByTestId('report-description').fill('La etiqueta dice 1 L y el registro 750 ml.');
    await page.getByTestId('report-email').fill('no-es-un-correo');
    await page.getByTestId('report-submit').click();
    await expect(page.locator('[data-field-error="email"]')).toBeVisible();
    await expect(page.getByTestId('report-email')).toBeFocused();
    await page.getByTestId('report-email').fill('');

    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-form')).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByTestId('report-success')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('report-success')).toHaveAttribute('data-folio', /^RPT-2026-\d{6}$/);
    const folio = await page.getByTestId('report-folio').textContent();
    expect(folio).toMatch(/^RPT-2026-\d{6}$/);
    await expect(page.getByTestId('report-success')).toContainText(es.report.success.proposalNote);
    await expect(page.getByTestId('report-success').locator('[data-report-success-code]')).toHaveText(code);
    expect(await focusedId(page)).toBe('h2');
    await expectNoAuthenticClaim(page);

    await page.getByTestId('report-done').click();
    await expect(page.getByTestId('report-success')).toBeHidden();
    await expect(result(page)).toBeVisible();
    await expect(app(page)).toHaveAttribute('data-state', 'result');
    expect(await focusedId(page)).toBe('result-title');
  });

  test('"[error]" en la descripción → error de servidor con reintento; cancelar vuelve al resultado', async ({ page }) => {
    await toResult(page);
    await page.getByTestId('report-button').click();
    await page.getByTestId('report-kind').selectOption('seal_damaged');
    await page.getByTestId('report-description').fill('Prueba de fallo [error] del servicio.');
    await page.getByTestId('report-submit').click();
    const err = page.getByTestId('report-error');
    await expect(err).toBeVisible({ timeout: 10_000 });
    await expect(err).toHaveAttribute('data-kind', 'server');
    await expect(err).toContainText(es.report.failure.server.title);
    await expect(page.getByTestId('report-form')).toBeVisible();
    await expect(page.getByTestId('report-description')).toHaveValue('Prueba de fallo [error] del servicio.');
    await expect(page.getByTestId('report-submit')).not.toHaveAttribute('aria-disabled', 'true');

    await page.getByTestId('report-cancel').click();
    await expect(page.getByTestId('report-form')).toBeHidden();
    await expect(result(page)).toBeVisible();
    await expect(app(page)).toHaveAttribute('data-state', 'result');
  });

  test('con la red simulada sin conexión el reporte no se envía y conserva lo escrito', async ({ page }) => {
    await toResult(page);
    await page.getByTestId('report-button').click();
    await page.getByTestId('report-kind').selectOption('other');
    await page.getByTestId('report-description').fill('Descripción suficientemente larga.');
    await page.getByTestId('network-toggle').check();
    await page.getByTestId('report-submit').click();
    const err = page.getByTestId('report-error');
    await expect(err).toBeVisible({ timeout: 10_000 });
    await expect(err).toHaveAttribute('data-kind', 'offline');
    await expect(page.getByTestId('report-description')).toHaveValue('Descripción suficientemente larga.');
    await page.getByTestId('network-toggle').uncheck();
    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-success')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('inglés', () => {
  test('/en/verify/ reproduce el escenario revocado con textos en inglés', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/en/verify/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await runScenario(page, 'revoked');
    await expect(result(page)).toBeVisible({ timeout: 10_000 });
    await expect(result(page)).toHaveAttribute('data-verdict', 'invalid');
    await expect(result(page)).toHaveAttribute('data-reason', 'revoked');
    await expect(page.getByTestId('result-title')).toHaveText(en.reasons.revoked.title);
    await expect(page.getByTestId('result-confidence')).toHaveText(en.verdicts.invalid.confidence);
    await expect(result(page).locator('[data-result-registry]')).toHaveText(TENANTS.licores.registryName.en);
    await expect(result(page).locator('[data-check="registry"] [data-check-note]')).toContainText(UNIT_BY_CODE.get(SCENARIO_BY_ID.get('revoked')!.code!)!.registry.revokedReason!.en);
    await expectNoAuthenticClaim(page);
    expect(console.stop()).toEqual([]);
  });

  test('/en/verify/?t=licores muestra el contexto del tenant en inglés', async ({ page }) => {
    await open(page, '/en/verify/?t=licores');
    await expect(page.locator('[data-tenant-text="name"]')).toHaveText(TENANTS.licores.name.en);
    await expect(page.locator('[data-tenant-lockup="licores"]')).toContainText(TENANTS.licores.cobrandNotice!.en);
  });
});
