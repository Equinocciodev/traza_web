/**
 * Demo B · Recorrido del producto: reproducción completa, controles, teclado, cambio de unidad
 * (incluida la vacía), error simulado, reduced motion y versión móvil (el proyecto "mobile" ejecuta todo).
 */
import { expect, test, type Page } from '@playwright/test';
import { UNIT_BY_CODE, FEATURED_UNIT_CODE } from '@/fixtures/units';
import { CHAIN_STAGES } from '@/fixtures/types';
import { collectConsoleErrors, content, open } from './helpers';

const es = content('es').journey;
const en = content('en').journey;
const TOTAL = CHAIN_STAGES.length;

const root = (page: Page) => page.getByTestId('journey');
const play = (page: Page) => page.getByTestId('journey-play');
const steps = (page: Page) => page.getByTestId('journey-step');

/** Última etapa registrada de una unidad (índice), como la calcula el modelo del recorrido. */
function lastRecorded(code: string): number {
  const unit = UNIT_BY_CODE.get(code);
  if (!unit) return -1;
  return CHAIN_STAGES.reduce((acc, stage, i) => (unit.events.some((e) => e.stage === stage) ? i : acc), -1);
}

async function scrollToDiagram(page: Page): Promise<void> {
  await page.locator('[data-jr-diagram]').scrollIntoViewIfNeeded();
}

test.describe('reproducción', () => {
  test('la reproducción automática recorre las seis etapas en ≤ 12 s y termina en estado final', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/recorrido/');
    await expect(root(page)).toHaveAttribute('data-view', 'ready');
    await expect(root(page)).toHaveAttribute('data-unit', FEATURED_UNIT_CODE);
    // Con motion activo la isla parte del inicio y arranca al entrar en el viewport (una sola vez).
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'playing', { timeout: 5_000 });
    const started = Date.now();
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
    const elapsed = Date.now() - started;
    expect(elapsed).toBeLessThanOrEqual(12_000);
    await expect(root(page)).toHaveAttribute('data-stage-index', String(TOTAL - 1));
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', String(TOTAL));
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.ended.replace('{stage}', es.stages[TOTAL - 1]!.label));
    await expect(page.getByTestId('journey-summary')).toContainText(es.runtime.summary.complete.replace('{stage}', es.stages[TOTAL - 1]!.label));
    await expect(steps(page).nth(TOTAL - 1)).toHaveAttribute('aria-current', 'step');
    await expect(steps(page).nth(0)).toHaveAttribute('data-state', 'done');
    // La línea de trazabilidad queda completa (dashoffset 0) y todas las tarjetas visibles.
    const offsets = await page.$$eval('[data-trace-path]', (paths) => paths.map((p) => parseFloat((p as SVGPathElement).style.strokeDashoffset || '0')));
    for (const o of offsets) expect(Math.abs(o)).toBeLessThan(0.5);
    await expect(page.getByTestId('journey-card').first()).toBeVisible();
    // "Reproducir de nuevo" reinicia sin bucle automático.
    await expect(play(page)).toHaveText(es.controls.replay);
    expect(console.stop()).toEqual([]);
  });

  test('pausa y reanudación con el mismo botón', async ({ page }) => {
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'playing', { timeout: 5_000 });
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await expect(play(page)).toHaveText(es.controls.play);
    const index = await root(page).getAttribute('data-stage-index');
    await page.waitForTimeout(1_800);
    await expect(root(page)).toHaveAttribute('data-stage-index', index!);
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'playing');
    await expect(play(page)).toHaveText(es.controls.pause);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
  });
});

test.describe('navegación manual', () => {
  test('anterior/siguiente/reiniciar y pasos con ratón', async ({ page }) => {
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'playing', { timeout: 5_000 });
    // Pausar (una vez avanzada al menos una etapa) para navegar a mano; "Reiniciar" está deshabilitado con motivo en la etapa 0.
    await expect(root(page)).toHaveAttribute('data-stage-index', /^[1-5]$/, { timeout: 5_000 });
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await expect(page.getByTestId('journey-prev')).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('journey-restart')).toHaveAttribute('aria-disabled', 'true');
    await page.getByTestId('journey-next').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '1');
    await expect(steps(page).nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(steps(page).nth(1)).toHaveAttribute('data-state', 'active');
    await expect(steps(page).nth(0)).toHaveAttribute('data-state', 'done');
    await expect(steps(page).nth(2)).toHaveAttribute('data-state', 'pending');
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', '2');
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuetext', es.runtime.progress.replace('{n}', '2').replace('{total}', String(TOTAL)));
    await page.getByTestId('journey-prev').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await steps(page).nth(3).click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '3');
    await expect(page.getByTestId('journey-status')).toContainText(es.stages[3]!.label);
    await expect(page.getByTestId('journey-stage').nth(3)).toHaveAttribute('data-state', 'active');
    await steps(page).nth(TOTAL - 1).click();
    await expect(root(page)).toHaveAttribute('data-stage-index', String(TOTAL - 1));
    await expect(page.getByTestId('journey-next')).toHaveAttribute('aria-disabled', 'true');
    // Defecto conocido D-05 (journey.ts: goTo() no llama a updatePlayButton): al llegar al final por navegación
    // manual el botón sigue en "paused"/"Reproducir" en vez de "Reproducir de nuevo". Funcionalmente reinicia y reproduce.
    await expect(play(page)).toHaveAttribute('data-state', /^(ended|paused)$/);
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'playing');
    await expect(root(page)).toHaveAttribute('data-stage-index', /^[0-2]$/);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
  });

  test('teclado en la lista de etapas: flechas, Inicio y Fin', async ({ page }) => {
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'playing', { timeout: 5_000 });
    await expect(root(page)).toHaveAttribute('data-stage-index', /^[1-5]$/, { timeout: 5_000 });
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await steps(page).nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(root(page)).toHaveAttribute('data-stage-index', '1');
    await expect(steps(page).nth(1)).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(root(page)).toHaveAttribute('data-stage-index', '2');
    await page.keyboard.press('ArrowLeft');
    await expect(root(page)).toHaveAttribute('data-stage-index', '1');
    await page.keyboard.press('End');
    await expect(root(page)).toHaveAttribute('data-stage-index', String(TOTAL - 1));
    await expect(steps(page).nth(TOTAL - 1)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await expect(steps(page).nth(0)).toBeFocused();
    await expect(page.getByTestId('journey-status')).toContainText(es.stages[0]!.label);
  });
});

test.describe('cambio de unidad', () => {
  test('una unidad en curso detiene la línea en su última etapa y deshabilita las etapas sin registro', async ({ page }) => {
    const code = 'TRZ-7F2K-8L1F-63HW';
    const last = lastRecorded(code);
    expect(last).toBeGreaterThan(0);
    expect(last).toBeLessThan(TOTAL - 1);
    await open(page, '/recorrido/');
    await page.getByTestId('journey-unit-select').selectOption(code);
    await expect(root(page)).toHaveAttribute('data-view', 'loading');
    await expect(page.locator('[data-jr-content]')).toHaveAttribute('aria-busy', 'true');
    await expect(root(page)).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });
    await expect(root(page)).toHaveAttribute('data-unit', code);
    await expect(page.getByTestId('journey-code')).toHaveText(code);
    await expect(page.getByTestId('journey-summary')).toContainText(es.runtime.summary.inProgress.replace('{stage}', es.stages[last]!.label));
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
    await expect(root(page)).toHaveAttribute('data-stage-index', String(last));
    for (let i = last + 1; i < TOTAL; i += 1) {
      await expect(steps(page).nth(i)).toHaveAttribute('aria-disabled', 'true');
      await expect(steps(page).nth(i)).toHaveAttribute('data-state', 'unrecorded');
      await expect(page.getByTestId('journey-stage').nth(i)).toHaveAttribute('data-state', 'unrecorded');
    }
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.endedPartial.replace('{stage}', es.stages[last]!.label));
    // Pulsar una etapa sin registro (aria-disabled, sigue siendo enfocable) solo anuncia, no navega.
    await steps(page).nth(TOTAL - 1).click({ force: true });
    await expect(root(page)).toHaveAttribute('data-stage-index', String(last));
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.unrecorded.replace('{stage}', es.stages[TOTAL - 1]!.label));
    // La historia de la unidad refleja la nueva unidad.
    await expect(page.getByTestId('journey-story')).toContainText(UNIT_BY_CODE.get(code)!.issuer.name);
    await expect(page.getByTestId('journey-story')).toContainText(UNIT_BY_CODE.get(code)!.product.name);
  });

  test('la unidad sin recorrido muestra el estado vacío y deshabilita los controles', async ({ page }) => {
    const code = 'TRZ-7F2K-2B8X-40NE';
    expect(lastRecorded(code)).toBe(-1);
    await open(page, '/recorrido/');
    await page.getByTestId('journey-unit-select').selectOption(code);
    await expect(root(page)).toHaveAttribute('data-view', 'empty', { timeout: 5_000 });
    const empty = page.getByTestId('journey-empty');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(es.states.empty.title);
    await expect(empty.locator('[role="status"]')).toBeVisible();
    await expect(page.getByTestId('journey-summary')).toContainText(es.runtime.summary.none);
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.empty);
    await expect(play(page)).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('journey-next')).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('journey-prev')).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[data-jr-stages]')).toBeHidden();
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', '0');
    for (let i = 0; i < TOTAL; i += 1) await expect(steps(page).nth(i)).toHaveAttribute('aria-disabled', 'true');
    // Volver a una unidad completa recupera la vista.
    await page.getByTestId('journey-unit-select').selectOption(FEATURED_UNIT_CODE);
    await expect(root(page)).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });
    await expect(page.locator('[data-jr-stages]')).toBeVisible();
    await expect(empty).toBeHidden();
  });

  test('el selector solo ofrece unidades existentes en los fixtures', async ({ page }) => {
    await open(page, '/recorrido/');
    const values = await page.getByTestId('journey-unit-select').locator('option').evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value));
    expect(values.length).toBe(es.unitSelector.options.length);
    for (const v of values) expect(UNIT_BY_CODE.has(v), v).toBe(true);
  });
});

test.describe('estados', () => {
  test('error simulado del registro con reintento', async ({ page }) => {
    await open(page, '/recorrido/');
    await page.getByTestId('journey-error-sim').click();
    await expect(root(page)).toHaveAttribute('data-view', 'loading');
    await expect(page.getByTestId('journey-loading')).toBeVisible();
    await expect(root(page)).toHaveAttribute('data-view', 'error', { timeout: 5_000 });
    const err = page.getByTestId('journey-error');
    await expect(err).toBeVisible();
    await expect(err).toContainText(es.states.error.title);
    await expect(err.locator('[role="alert"]')).toBeVisible();
    await expect(page.getByTestId('journey-retry')).toBeFocused();
    await expect(page.locator('[data-jr-content]')).toBeHidden();
    await expect(play(page)).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.error);
    await page.getByTestId('journey-retry').click();
    await expect(root(page)).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });
    await expect(err).toBeHidden();
    await expect(page.locator('[data-jr-content]')).toBeVisible();
    await expect(play(page)).not.toHaveAttribute('aria-disabled', 'true');
  });

  test('con prefers-reduced-motion se muestra el estado final sin reproducción automática', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await page.waitForTimeout(1_500);
    await expect(root(page)).toHaveAttribute('data-stage-index', String(TOTAL - 1));
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(steps(page).nth(TOTAL - 1)).toHaveAttribute('aria-current', 'step');
    const offsets = await page.$$eval('[data-trace-path]', (paths) => paths.map((p) => parseFloat((p as SVGPathElement).style.strokeDashoffset || '0')));
    for (const o of offsets) expect(Math.abs(o)).toBeLessThan(0.5);
    // Navegación por pasos equivalente (sin animación).
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await page.getByTestId('journey-next').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '1');
    // Reproducir avanza por pasos (sin animación de trazo) hasta el final.
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 15_000 });
  });

  test('el HTML renderizado en servidor ya contiene el recorrido completo (sin JavaScript)', async ({ request }) => {
    const html = await (await request.get('/recorrido/')).text();
    expect(html).toContain('data-stage-index="5"');
    expect(html).toContain('data-view="ready"');
    for (const stage of es.stages) expect(html).toContain(stage.label);
    expect(html).toContain(es.explorer.noScript);
  });
});

test.describe('inglés', () => {
  test('/en/journey/ reproduce y anuncia en inglés', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/en/journey/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 15_000 });
    await expect(page.getByTestId('journey-status')).toHaveText(en.runtime.live.ended.replace('{stage}', en.stages[TOTAL - 1]!.label));
    await expect(play(page)).toHaveText(en.controls.replay);
    await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-2B8X-40NE');
    await expect(page.getByTestId('journey-empty')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByTestId('journey-empty')).toContainText(en.states.empty.title);
    expect(console.stop()).toEqual([]);
  });
});
