/**
 * Story controls, in ES/EN under the existing desktop and mobile projects.
 * Clock cases simulate elapsed time; they are not hardware/performance measurements.
 * Authored during the dynamic audit. Execution requires the separately authorized E2E run.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { getV2Narrative } from '@/content/v2-narrative';

const CLOCK_START = new Date('2026-09-09T12:00:00Z');
const CLOCK_PAUSE = new Date('2026-09-09T12:01:00Z');

const root = (page: Page) => page.locator('[data-story-player]');
const panel = (page: Page) => root(page).locator('[data-story-panel]:not([hidden])');
const visibleStep = (page: Page) => panel(page).locator('[data-story-step]:not([hidden])');
const play = (page: Page) => panel(page).locator('[data-story-play]');
const announcement = (page: Page) => root(page).locator('[data-story-announcement]');

async function openStory(page: Page, locale: 'es' | 'en', clock = false): Promise<void> {
  if (clock) await page.clock.install({ time: CLOCK_START });
  await page.goto(locale === 'es' ? '/' : '/en/');
  await expect(root(page)).toHaveAttribute('data-enhanced', 'true');
  await root(page).locator('[data-story-tab]').first().scrollIntoViewIfNeeded();
  if (clock) await page.clock.pauseAt(CLOCK_PAUSE);
}

/** Keep the actual play control observable; reading lower down intentionally pauses the story. */
async function pressPlay(page: Page, clock = false): Promise<void> {
  await play(page).scrollIntoViewIfNeeded();
  if (clock) await page.clock.runFor(50);
  await expect(play(page)).toBeInViewport({ ratio: 0.5 });
  await play(page).press('Enter');
}

async function expectStep(page: Page, id: string): Promise<void> {
  await expect(visibleStep(page)).toHaveCount(1);
  await expect(visibleStep(page)).toHaveAttribute('data-story-step', id);
  await expect(visibleStep(page)).toBeVisible();
}

async function duration(step: Locator): Promise<number> {
  const ms = Number(await step.getAttribute('data-duration'));
  expect(Number.isFinite(ms)).toBe(true);
  expect(ms).toBeGreaterThan(2_000);
  return ms;
}

for (const locale of ['es', 'en'] as const) {
  const { ui, stories } = getV2Narrative(locale);

  test.describe(`story ${locale}`, () => {
    test('all chapters, previous/next boundaries and initial state', async ({ page }) => {
      await openStory(page, locale);
      await expect(root(page)).toHaveAttribute('data-playing', 'false');
      await expect(root(page)).toHaveAttribute('data-engaged', 'false');
      await expect(panel(page).locator('[data-story-reader]')).toBeHidden();
      await expect(play(page)).toHaveText(ui.play);
      expect(stories.map(story => story.chapters.length)).toEqual([4, 6]);
      expect(stories.map(story => story.beats.length)).toEqual([10, 8]);

      for (const story of stories) {
        await root(page).locator(`[data-story-tab="${story.id}"]`).click();
        const chapters = panel(page).locator('[data-story-chapter]');
        await expect(chapters).toHaveCount(story.chapters.length);
        for (const chapter of story.chapters) {
          const control = chapters.filter({ hasText: chapter.label });
          await control.click();
          const first = story.beats.findIndex(beat => beat.chapter === chapter.id);
          expect(first).toBeGreaterThanOrEqual(0);
          await expectStep(page, story.beats[first].id);
          await expect(control).toHaveAttribute('aria-current', 'step');
          await expect(root(page)).toHaveAttribute('data-playing', 'false');
          if (first < story.beats.length - 1) {
            await panel(page).locator('[data-story-next]').click();
            await expectStep(page, story.beats[first + 1].id);
            await panel(page).locator('[data-story-previous]').click();
            await expectStep(page, story.beats[first].id);
          }
        }
        // Reach the final beat through normal controls, including product's second Lookup beat.
        const lastChapter = story.chapters.at(-1)!;
        await panel(page).locator(`[data-story-chapter="${lastChapter.id}"]`).click();
        const firstInLast = story.beats.findIndex(beat => beat.chapter === lastChapter.id);
        for (let i = firstInLast; i < story.beats.length - 1; i++) {
          await panel(page).locator('[data-story-next]').click();
        }
        await expectStep(page, story.beats.at(-1)!.id);
        await expect(panel(page).locator('[data-story-next]')).toBeDisabled();
        await panel(page).locator('[data-story-chapter]').first().click();
        await expectStep(page, story.beats[0].id);
        await expect(panel(page).locator('[data-story-previous]')).toBeDisabled();
      }
    });

    test('keyboard tabs and reset clear stale announcements and preserve focus', async ({ page }) => {
      await openStory(page, locale);
      const tabs = root(page).locator('[data-story-tab]');
      await panel(page).locator('[data-story-chapter]').last().click();
      await expect(announcement(page)).not.toHaveText('');
      await tabs.first().focus();
      const moves = [
        ['ArrowRight', 1], ['ArrowRight', 0], ['ArrowLeft', 1], ['Home', 0], ['End', 1],
      ] as const;
      for (const [key, index] of moves) {
        await page.keyboard.press(key);
        await expect(tabs.nth(index)).toBeFocused();
        await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
        await expect(tabs.nth(index)).toHaveAttribute('tabindex', '0');
        await expect(tabs.nth(1 - index)).toHaveAttribute('aria-selected', 'false');
        await expect(tabs.nth(1 - index)).toHaveAttribute('tabindex', '-1');
        await expect(panel(page)).toHaveAttribute('data-story-panel', stories[index].id);
        await expect(announcement(page)).toHaveText('');
        await expect(root(page)).toHaveAttribute('data-engaged', 'false');
      }
      await panel(page).locator('[data-story-chapter]').last().click();
      await expect(announcement(page)).not.toHaveText('');
      await panel(page).locator('[data-story-restart]').click();
      await expect(play(page)).toBeFocused();
      await expect(play(page)).toHaveText(ui.play);
      await expect(announcement(page)).toHaveText('');
      await expect(root(page)).toHaveAttribute('data-playing', 'false');
      await expect(panel(page).locator('[data-story-reader]')).toBeHidden();
    });

    test('clock simulation: pause preserves remaining time, then finish and replay', async ({ page }) => {
      // Several minutes of reading budgets are advanced with the installed test clock.
      // The wall-clock timeout remains the normal 45 seconds; no real long sleeps are used.
      await openStory(page, locale, true);
      const story = stories[0];
      await pressPlay(page, true);
      await expect(play(page)).toHaveText(ui.pause);
      await expect(play(page)).toHaveAttribute('aria-pressed', 'true');
      await expectStep(page, story.beats[0].id);
      const firstDuration = await duration(visibleStep(page));
      await page.clock.runFor(2_000);
      await play(page).press('Enter');
      await expect(play(page)).toHaveText(ui.resume);
      await expect(play(page)).toHaveAttribute('aria-pressed', 'false');
      await page.clock.runFor(firstDuration * 2);
      await expectStep(page, story.beats[0].id);
      await play(page).press('Enter');
      await expect(play(page)).toHaveText(ui.pause);
      await page.clock.runFor(firstDuration - 2_000 - 1);
      await expectStep(page, story.beats[0].id);
      await page.clock.runFor(2);
      await expectStep(page, story.beats[1].id);

      await panel(page).locator('[data-story-chapter]').last().press('Enter');
      await panel(page).locator('[data-story-next]').press('Enter');
      await expectStep(page, story.beats.at(-1)!.id);
      const lastDuration = await duration(visibleStep(page));
      await pressPlay(page, true);
      await page.clock.runFor(lastDuration + 1);
      await expect(root(page)).toHaveAttribute('data-playing', 'false');
      await expect(play(page)).toHaveText(ui.replay);
      await expect(announcement(page)).toHaveText(ui.finished);
      await play(page).press('Enter');
      await expectStep(page, story.beats[0].id);
      await expect(root(page)).toHaveAttribute('data-playing', 'true');
      await panel(page).locator('[data-story-restart]').press('Enter');
      await expect(play(page)).toBeFocused();
      await expect(announcement(page)).toHaveText('');
    });

    test('clock simulation: reduced motion is manual, including last-step replay', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openStory(page, locale, true);
      for (const story of stories) {
        await root(page).locator(`[data-story-tab="${story.id}"]`).press('Enter');
        await expect(play(page)).toHaveText(ui.manualStart);
        await pressPlay(page, true);
        await expectStep(page, story.beats[0].id);
        await expect(panel(page).locator('[data-story-reduced]')).toBeVisible();
        await expect(root(page)).toHaveAttribute('data-playing', 'false');
        await page.clock.runFor(120_000);
        await expectStep(page, story.beats[0].id);
        for (let i = 1; i < story.beats.length; i++) {
          await play(page).press('Enter');
          await expectStep(page, story.beats[i].id);
          await expect(play(page)).toHaveAttribute('aria-pressed', 'false');
        }
        await expect(play(page)).toHaveText(ui.replay);
        await expect(panel(page).locator('[data-story-next]')).toBeDisabled();
        await play(page).press('Enter');
        await expectStep(page, story.beats[0].id);
        await expect(play(page)).toHaveText(ui.next);
      }
    });

    test('opening full reading pauses playback; both transcripts contain every step', async ({ page }) => {
      await openStory(page, locale);
      for (const story of stories) {
        await root(page).locator(`[data-story-tab="${story.id}"]`).click();
        await pressPlay(page);
        await expect(root(page)).toHaveAttribute('data-playing', 'true');
        const transcript = panel(page).locator('[data-story-transcript]');
        await transcript.locator('summary').click();
        await expect(transcript).toHaveAttribute('open', '');
        await expect(root(page)).toHaveAttribute('data-playing', 'false');
        await expect(transcript.locator('h3')).toHaveText(story.beats.map(beat => beat.title));
        await transcript.locator('summary').click();
        await expect(transcript).not.toHaveAttribute('open');
        await expect(root(page)).toHaveAttribute('data-playing', 'false');
      }
      // On a small viewport scrolling to the summary can pause first. The asserted contract
      // is the user-visible result, not which of the two legitimate pause handlers ran first.
    });

    test('clock simulation: leaving the viewport pauses and returning needs manual resume', async ({ page }) => {
      await openStory(page, locale, true);
      await pressPlay(page, true);
      await expect(root(page)).toHaveAttribute('data-playing', 'true');
      await page.locator('h1').scrollIntoViewIfNeeded();
      await page.clock.runFor(100);
      await expect(play(page)).not.toBeInViewport();
      await expect(root(page)).toHaveAttribute('data-playing', 'false');
      await expect(announcement(page)).toHaveText(ui.pausedAway);
      const before = await visibleStep(page).getAttribute('data-story-step');
      await page.clock.runFor(120_000);
      await play(page).scrollIntoViewIfNeeded();
      await page.clock.runFor(100);
      await expect(root(page)).toHaveAttribute('data-playing', 'false');
      await expect(visibleStep(page)).toHaveAttribute('data-story-step', before!);
      await expect(play(page)).toHaveText(ui.resume);
      await play(page).press('Enter');
      await expect(root(page)).toHaveAttribute('data-playing', 'true');
    });
  });
}

for (const locale of ['es', 'en'] as const) {
  test(`story ${locale}: real clock first advance stays visible`, async ({ page }, testInfo) => {
    const { stories, ui } = getV2Narrative(locale);
    const story = stories[0];
    // One reading step only, without installing/advancing a fake clock. Allow its actual
    // reading budget plus 25 seconds for page setup, screenshots and assertion scheduling.
    test.setTimeout(story.beats[0].durationMs + 25_000);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openStory(page, locale);
    await play(page).evaluate(control => {
      window.scrollBy({ top: control.getBoundingClientRect().top - 120, behavior: 'instant' });
    });
    await expect(play(page)).toBeInViewport({ ratio: 1 });

    const sample = () => page.evaluate(() => {
      const player = document.querySelector<HTMLElement>('[data-story-player]')!;
      const active = player.querySelector<HTMLElement>('[data-story-panel]:not([hidden])')!;
      const control = active.querySelector<HTMLElement>('[data-story-play]')!;
      const step = active.querySelector<HTMLElement>('[data-story-step]:not([hidden])')!;
      const box = (element: Element) => {
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom };
      };
      return {
        now: performance.now(), viewport: { width: innerWidth, height: innerHeight },
        visibility: document.visibilityState,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        playing: player.dataset.playing, step: step.dataset.storyStep,
        durationMs: Number(step.dataset.duration), playLabel: control.textContent?.trim(),
        playPressed: control.getAttribute('aria-pressed'), playRect: box(control),
        stepRect: box(step), titleRect: box(step.querySelector('[data-story-step-title]')!),
      };
    });

    // The instant setup scroll can precede the renderer's IntersectionObserver delivery.
    // Settle two real paint frames before the single user input; do not retry Play or
    // relax its playing/advance assertions to hide a refusal to start.
    const preFrame = await sample();
    expect(preFrame.visibility).toBe('visible');
    await page.evaluate(() => new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));
    const preInput = await sample();
    const startedAt = await page.evaluate(() => performance.now());
    await play(page).press('Enter');
    const afterInput = await sample();
    await testInfo.attach(`story-realtime-${locale}-${testInfo.project.name}-setup`, {
      body: JSON.stringify({ preFrame, preInput, afterInput }), contentType: 'application/json',
    });
    await expectStep(page, story.beats[0].id);
    await expect(play(page)).toHaveText(ui.pause);
    await expect(play(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleStep(page).locator('[data-story-step-title]')).toBeInViewport();
    const before = await sample();
    expect(before.visibility).toBe('visible');
    expect(before.reducedMotion).toBe(false);
    expect(before.durationMs).toBe(story.beats[0].durationMs);
    const stem = `story-realtime-${locale}-${testInfo.project.name}`;
    const beforePath = testInfo.outputPath(`${stem}-before.png`);
    await page.screenshot({ path: beforePath });
    await testInfo.attach(`${stem}-before`, { path: beforePath, contentType: 'image/png' });

    // No scroll, focus change or navigation while the real timer runs.
    await expect(visibleStep(page)).toHaveAttribute('data-story-step', story.beats[1].id, {
      timeout: before.durationMs + 10_000,
    });
    const after = await sample();
    const elapsedMs = after.now - startedAt;
    expect(after.playing).toBe('true');
    expect(after.visibility).toBe('visible');
    expect(after.playRect.top).toBeGreaterThanOrEqual(0);
    expect(after.playRect.bottom).toBeLessThanOrEqual(after.viewport.height);
    expect(elapsedMs).toBeGreaterThanOrEqual(before.durationMs - 500);
    expect(elapsedMs).toBeLessThan(before.durationMs + 12_000);
    await expect(visibleStep(page).locator('[data-story-step-title]')).toBeInViewport();
    const afterPath = testInfo.outputPath(`${stem}-after.png`);
    await page.screenshot({ path: afterPath });
    await testInfo.attach(`${stem}-after`, { path: afterPath, contentType: 'image/png' });
    const record = {
      method: 'Real browser clock; one product-story advance; no simulated time',
      locale, project: testInfo.project.name, url: page.url(), startedAt, elapsedMs,
      preFrame, preInput, afterInput, before, after,
      limit: 'A measured first advance is not the full narrative runtime or a hardware performance benchmark.',
    };
    const { writeFile } = await import('node:fs/promises');
    const evidencePath = testInfo.outputPath(`${stem}.json`);
    await writeFile(evidencePath, JSON.stringify(record, null, 2));
    await testInfo.attach(`${stem}-timing`, { path: evidencePath, contentType: 'application/json' });
    await play(page).press('Enter');
    await expect(root(page)).toHaveAttribute('data-playing', 'false');
  });
}
