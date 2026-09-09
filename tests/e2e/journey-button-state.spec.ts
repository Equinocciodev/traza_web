/** D-05: el botón refleja la etapa actual también tras navegación manual. */
import { expect, test } from '@playwright/test';
import { FEATURED_UNIT_CODE, UNIT_BY_CODE } from '@/fixtures/units';
import { CHAIN_STAGES } from '@/fixtures/types';
import { content } from './helpers';

const unit = UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!;
const lastRecorded = CHAIN_STAGES.reduce((last, stage, index) =>
  unit.events.some(event => event.stage === stage) ? index : last, -1);

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: navegación manual sincroniza Reproducir/Reproducir de nuevo`, async ({ page }) => {
    // Evita que el autoplay cambie de etapa mientras se ejercitan controles manuales.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(locale === 'es' ? '/recorrido/' : '/en/journey/');
    const root = page.getByTestId('journey');
    const play = page.getByTestId('journey-play');
    const steps = page.getByTestId('journey-step');
    const labels = content(locale).journey.controls;
    expect(lastRecorded).toBeGreaterThan(0);
    await expect(root).toHaveAttribute('data-unit', FEATURED_UNIT_CODE);
    await expect(steps).toHaveCount(CHAIN_STAGES.length);

    const state = async (index: number, atEnd: boolean) => {
      await expect(root).toHaveAttribute('data-stage-index', String(index));
      await expect(play).toHaveAttribute('data-state', atEnd ? 'ended' : 'paused');
      await expect(play).toHaveText(atEnd ? labels.replay : labels.play);
      await expect(play).toHaveAccessibleName(atEnd ? labels.replay : labels.play);
    };
    await state(lastRecorded, true);
    await page.getByTestId('journey-restart').click();
    await state(0, false);
    await steps.nth(lastRecorded).click();
    await state(lastRecorded, true);
    await page.getByTestId('journey-prev').click();
    await state(lastRecorded - 1, false);
    await page.getByTestId('journey-next').click();
    await state(lastRecorded, true);
    await steps.nth(lastRecorded).press('Home');
    await state(0, false);
    await steps.nth(0).press('End');
    await state(lastRecorded, true);
  });
}
