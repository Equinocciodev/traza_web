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

// A-07: simulate delayed IntersectionObserver delivery, not real viewport timing.
// Only the journey diagram observer is held; other page observers stay native.
// This reproduces the accessibility race without sleeps or changing its assertions.
for (const locale of ['es', 'en'] as const) {
  for (const navigation of ['keyboard', 'step', 'next'] as const) {
    test(`${locale}: ${navigation} owns the stage before delayed autoplay or resume`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.clock.install({ time: new Date('2026-09-09T12:00:00Z') });
      await page.addInitScript(() => {
        const NativeObserver = window.IntersectionObserver;
        const deliveries = new Map<Element, (visible: boolean) => void>();
        class DeferredJourneyObserver extends NativeObserver {
          private readonly deliverCallback: IntersectionObserverCallback;
          private readonly deferredTargets = new Set<Element>();
          constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            super(callback, options);
            this.deliverCallback = callback;
          }
          observe(target: Element): void {
            if (!target.matches('[data-jr-diagram]')) {
              super.observe(target);
              return;
            }
            this.deferredTargets.add(target);
            deliveries.set(target, (visible) => {
              const rect = target.getBoundingClientRect();
              this.deliverCallback([{
                target, time: performance.now(), isIntersecting: visible,
                intersectionRatio: visible ? 1 : 0, rootBounds: null,
                boundingClientRect: rect,
                intersectionRect: visible ? rect : new DOMRect(),
              }], this);
            });
          }
          unobserve(target: Element): void {
            deliveries.delete(target);
            this.deferredTargets.delete(target);
            super.unobserve(target);
          }
          disconnect(): void {
            for (const target of this.deferredTargets) deliveries.delete(target);
            this.deferredTargets.clear();
            super.disconnect();
          }
        }
        window.IntersectionObserver = DeferredJourneyObserver;
        (window as unknown as { deliverJourneyIntersection: (visible: boolean) => number })
          .deliverJourneyIntersection = (visible) => {
            for (const deliver of deliveries.values()) deliver(visible);
            return deliveries.size;
          };
      });
      const deliver = async (visible: boolean) => {
        const count = await page.evaluate((value) => (
          window as unknown as { deliverJourneyIntersection: (visible: boolean) => number }
        ).deliverJourneyIntersection(value), visible);
        expect(count).toBe(1);
      };
      // Separate page loads exercise initial autoplay and an already auto-paused loop.
      for (const pending of ['initial', 'resume'] as const) {
        await test.step(`manual navigation overrides pending ${pending}`, async () => {
          await page.goto(locale === 'es' ? '/recorrido/' : '/en/journey/');
          const journey = page.getByTestId('journey');
          const play = page.getByTestId('journey-play');
          const steps = page.getByTestId('journey-step');
          await expect(journey).toHaveAttribute('data-enhanced', '');
          await expect(journey).toHaveAttribute('data-view', 'ready');
          await page.clock.pauseAt(new Date(pending === 'initial'
            ? '2026-09-09T12:01:00Z' : '2026-09-09T12:02:00Z'));
          await expect(journey).toHaveAttribute('data-stage-index', '0');
          if (pending === 'resume') {
            await deliver(true);
            await expect(play).toHaveAttribute('data-state', 'playing');
            await deliver(false);
            await expect(play).toHaveAttribute('data-state', 'paused');
          }
          if (navigation === 'keyboard') {
            await steps.first().focus();
            await page.keyboard.press('ArrowRight');
            await expect(steps.nth(1)).toBeFocused();
          } else if (navigation === 'step') {
            await steps.nth(1).press('Enter');
          } else {
            await page.getByTestId('journey-next').press('Enter');
          }
          await expect(journey).toHaveAttribute('data-stage-index', '1');
          await expect(steps.nth(1)).toHaveAttribute('aria-current', 'step');
          await deliver(true);
          // Simulated 2 s exceeds the 700 ms autoplay pause and 900 ms stroke.
          await page.clock.runFor(2_000);
          await expect(journey).toHaveAttribute('data-stage-index', '1');
          await expect(steps.nth(1)).toHaveAttribute('aria-current', 'step');
          await expect(play).toHaveAttribute('data-state', 'paused');
          if (navigation === 'keyboard') await expect(steps.nth(1)).toBeFocused();
          // Explicit Play remains available after manual control takes ownership.
          await play.press('Enter');
          await expect(play).toHaveAttribute('data-state', 'playing');
          await page.clock.runFor(2_000);
          await expect(journey).toHaveAttribute('data-stage-index', '2');
        });
      }
    });
  }
}
