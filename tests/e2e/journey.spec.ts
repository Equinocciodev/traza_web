/**
 * Recorrido del producto: reproducción del registro disponible, controles, teclado, cambio de unidad
 * (incluida la vacía), error simulado, reduced motion y versión móvil (el proyecto "mobile" ejecuta todo).
 */
import { expect, test, type Page } from '@playwright/test';
import { UNIT_BY_CODE, FEATURED_UNIT_CODE } from '@/fixtures/units';
import { CHAIN_STAGES } from '@/fixtures/types';
import { collectConsoleErrors, content, open } from './helpers';

const es = content('es').journey;
const en = content('en').journey;
const TOTAL = CHAIN_STAGES.length;
const FEATURED_LAST = lastRecorded(FEATURED_UNIT_CODE);
const CLOSED_UNIT_CODE = 'TRZ-7F2K-5R9C-77MQ';

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

/** La línea representa distancia entre nodos: consulta (índice 3 de 6) deja 2/5 sin trazar. */
async function expectLineAt(page: Page, last: number): Promise<void> {
  const paths = page.locator('[data-trace-path]');
  await expect(paths).toHaveCount(2); // versiones horizontal y vertical
  const remaining = 1 - last / (TOTAL - 1);
  await expect.poll(() => paths.evaluateAll((nodes, expected) => Math.max(...nodes.map(node => {
    const path = node as SVGPathElement;
    const length = Number(path.dataset.length);
    const offset = parseFloat(path.style.strokeDashoffset || path.getAttribute('stroke-dashoffset') || 'NaN');
    return Math.abs(offset / length - expected);
  })), remaining)).toBeLessThan(0.005);
}

async function expectUnrecordedAfter(page: Page, last: number): Promise<void> {
  await expect(steps(page)).toHaveCount(TOTAL);
  for (let i = last + 1; i < TOTAL; i += 1) {
    await expect(steps(page).nth(i)).toHaveAttribute('aria-disabled', 'true');
    await expect(steps(page).nth(i)).toHaveAttribute('data-state', 'unrecorded');
    await expect(steps(page).nth(i)).not.toHaveAttribute('aria-current', 'step');
    const stage = page.getByTestId('journey-stage').nth(i);
    await expect(stage).toHaveAttribute('data-state', 'unrecorded');
    await expect(stage.getByTestId('journey-card')).toHaveCount(0);
  }
}

test.describe('reproducción', () => {
  test('la reproducción automática termina en la última etapa registrada en ≤ 12 s, conservando seis etapas posibles', async ({ page }) => {
    const console = collectConsoleErrors(page);
    expect(TOTAL).toBe(6);
    expect(FEATURED_LAST).toBe(3);
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
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', String(FEATURED_LAST + 1));
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuemax', String(TOTAL));
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.endedPartial.replace('{stage}', es.stages[FEATURED_LAST]!.label));
    await expect(page.getByTestId('journey-summary')).toContainText(es.runtime.summary.inProgress.replace('{stage}', es.stages[FEATURED_LAST]!.label));
    await expect(steps(page).nth(FEATURED_LAST)).toHaveAttribute('aria-current', 'step');
    await expect(steps(page).nth(0)).toHaveAttribute('data-state', 'done');
    await expectLineAt(page, FEATURED_LAST);
    await expectUnrecordedAfter(page, FEATURED_LAST);
    await expect(page.getByTestId('journey-card')).toHaveCount(UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!.events.length);
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
    await expect.poll(async () => Number(await root(page).getAttribute('data-stage-index')), { timeout: 5_000 }).toBeGreaterThan(0);
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await expect(play(page)).toHaveText(es.controls.play);
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
    await steps(page).nth(FEATURED_LAST).click();
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(page.getByTestId('journey-status')).toContainText(es.stages[FEATURED_LAST]!.label);
    await expect(page.getByTestId('journey-stage').nth(FEATURED_LAST)).toHaveAttribute('data-state', 'active');
    await expect(page.getByTestId('journey-next')).toHaveAttribute('aria-disabled', 'true');
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(play(page)).toHaveText(es.controls.replay);
    await expectUnrecordedAfter(page, FEATURED_LAST);
    // aria-disabled conserva el anuncio explicativo: la activación deliberada no inventa un evento.
    await steps(page).nth(FEATURED_LAST + 1).click({ force: true });
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.unrecorded.replace('{stage}', es.stages[FEATURED_LAST + 1]!.label));
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(play(page)).toHaveText(es.controls.replay);
    await page.getByTestId('journey-prev').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST - 1));
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await expect(play(page)).toHaveText(es.controls.play);
    await page.getByTestId('journey-next').click();
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(play(page)).toHaveText(es.controls.replay);
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await expect(play(page)).toHaveText(es.controls.play);
    await steps(page).nth(FEATURED_LAST).click();
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(play(page)).toHaveText(es.controls.replay);
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'playing');
    await expect(root(page)).toHaveAttribute('data-stage-index', /^[0-2]$/);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
  });

  test('teclado en la lista de etapas: flechas, Inicio y Fin', async ({ page }) => {
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'playing', { timeout: 5_000 });
    await expect.poll(async () => Number(await root(page).getAttribute('data-stage-index')), { timeout: 5_000 }).toBeGreaterThan(0);
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
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(steps(page).nth(FEATURED_LAST)).toBeFocused();
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(play(page)).toHaveText(es.controls.replay);
    await page.keyboard.press('ArrowRight');
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(steps(page).nth(FEATURED_LAST)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await expect(steps(page).nth(0)).toBeFocused();
    await expect(play(page)).toHaveAttribute('data-state', 'paused');
    await expect(play(page)).toHaveText(es.controls.play);
    await expect(page.getByTestId('journey-status')).toContainText(es.stages[0]!.label);
  });
});

test.describe('cambio de unidad', () => {
  test('una revocación registrada alcanza Cierre sin inventar eventos en las etapas vacías', async ({ page }) => {
    const unit = UNIT_BY_CODE.get(CLOSED_UNIT_CODE)!;
    const last = lastRecorded(CLOSED_UNIT_CODE);
    expect(last).toBe(TOTAL - 1);
    expect(unit.events.some(event => event.stage === 'closure' && event.kind === 'revoked')).toBe(true);
    const emptyStages = CHAIN_STAGES.filter(stage => !unit.events.some(event => event.stage === stage));
    expect(emptyStages).toEqual(['lookup', 'signals']);
    await open(page, '/recorrido/');
    await page.getByTestId('journey-unit-select').selectOption(CLOSED_UNIT_CODE);
    await expect(root(page)).toHaveAttribute('data-view', 'ready', { timeout: 5_000 });
    await expect(root(page)).toHaveAttribute('data-unit', CLOSED_UNIT_CODE);
    await scrollToDiagram(page);
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 12_000 });
    await expect(root(page)).toHaveAttribute('data-stage-index', String(last));
    await expect(steps(page)).toHaveCount(TOTAL);
    await expect(steps(page).nth(last)).toHaveAttribute('aria-current', 'step');
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', String(TOTAL));
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuemax', String(TOTAL));
    await expect(page.getByTestId('journey-status')).toHaveText(es.runtime.live.ended.replace('{stage}', es.stages[last]!.label));
    await expect(page.getByTestId('journey-summary')).toContainText(es.runtime.summary.complete.replace('{stage}', es.stages[last]!.label));
    await expect(play(page)).toHaveText(es.controls.replay);
    await expect(page.getByTestId('journey-next')).toHaveAttribute('aria-disabled', 'true');
    await expectLineAt(page, last);
    await expect(page.getByTestId('journey-card')).toHaveCount(unit.events.length);
    await expect(page.getByTestId('journey-stage').nth(last).locator('[data-kind="revoked"]')).toHaveCount(1);
    for (const id of emptyStages) {
      const stage = page.getByTestId('journey-stage').nth(CHAIN_STAGES.indexOf(id));
      await expect(stage.getByTestId('journey-card')).toHaveCount(0);
      await expect(stage).toContainText(es.runtime.stageEmpty);
    }
  });

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
    // Volver a una unidad con eventos recupera la vista, aunque su recorrido siga en curso.
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

  test('con prefers-reduced-motion se muestra la última etapa registrada sin reproducción automática', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '/recorrido/');
    await scrollToDiagram(page);
    await page.waitForTimeout(1_500);
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(play(page)).toHaveAttribute('data-state', 'ended');
    await expect(steps(page).nth(FEATURED_LAST)).toHaveAttribute('aria-current', 'step');
    await expectLineAt(page, FEATURED_LAST);
    await expectUnrecordedAfter(page, FEATURED_LAST);
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuenow', String(FEATURED_LAST + 1));
    await expect(page.getByTestId('journey-progress')).toHaveAttribute('aria-valuemax', String(TOTAL));
    // Navegación por pasos equivalente (sin animación).
    await page.getByTestId('journey-restart').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '0');
    await page.getByTestId('journey-next').click();
    await expect(root(page)).toHaveAttribute('data-stage-index', '1');
    // Reproducir avanza por pasos (sin animación de trazo) hasta el final.
    await play(page).click();
    await expect(play(page)).toHaveAttribute('data-state', 'ended', { timeout: 15_000 });
  });

  test('el HTML renderizado en servidor conserva seis etapas y el último registro disponible (sin JavaScript)', async ({ request }) => {
    const html = await (await request.get('/recorrido/')).text();
    expect(html).toContain(`data-stage-index="${FEATURED_LAST}"`);
    expect(html.match(/data-testid="journey-step"/g)).toHaveLength(TOTAL);
    for (const stage of CHAIN_STAGES.slice(FEATURED_LAST + 1)) {
      expect(html).toMatch(new RegExp(`<button\\b(?=[^>]*data-stage="${stage}")(?=[^>]*aria-disabled="true")(?=[^>]*data-state="unrecorded")[^>]*>`));
    }
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
    await expect(root(page)).toHaveAttribute('data-stage-index', String(FEATURED_LAST));
    await expect(page.getByTestId('journey-status')).toHaveText(en.runtime.live.endedPartial.replace('{stage}', en.stages[FEATURED_LAST]!.label));
    await expect(page.getByTestId('journey-summary')).toContainText(en.runtime.summary.inProgress.replace('{stage}', en.stages[FEATURED_LAST]!.label));
    await expectUnrecordedAfter(page, FEATURED_LAST);
    await expectLineAt(page, FEATURED_LAST);
    await expect(play(page)).toHaveText(en.controls.replay);
    await page.getByTestId('journey-unit-select').selectOption('TRZ-7F2K-2B8X-40NE');
    await expect(page.getByTestId('journey-empty')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByTestId('journey-empty')).toContainText(en.states.empty.title);
    expect(console.stop()).toEqual([]);
  });
});
