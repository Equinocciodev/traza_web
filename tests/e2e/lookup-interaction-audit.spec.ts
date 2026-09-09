/**
 * Remaining interaction contracts identified by the September usage audit.
 * ES/EN run in the existing desktop/mobile projects. Image fetch failures,
 * delayed responses and the clock are controlled; no physical camera is used.
 */
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { expect, test, type Page } from '@playwright/test';
import { ROUTES, type Locale } from '@/i18n';
import { content, open } from './helpers';

const VALID = 'TRZ-7F2K-4K7Q-92FA';
const REVOKED = 'TRZ-7F2K-5R9C-77MQ';
const TIMEOUT = 'TRZ-7F2K-TIME-0000';
const qrFixture = fileURLToPath(new URL('./fixtures/qr/valid.png', import.meta.url));
const root = (page: Page) => page.locator('[data-verify-app]');

/** A real, tiny 1-bit PNG declaring 40,006,250 pixels, without a giant canvas. */
function oversizedPixelPng(): Buffer {
  const width = 6401;
  const height = 6250;
  const chunk = (name: string, data: Buffer) => {
    const type = Buffer.from(name);
    const body = Buffer.concat([type, data]);
    let crc = 0xffffffff;
    for (const byte of body) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const checksum = Buffer.alloc(4);
    checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([length, body, checksum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 1; // one bit, grayscale; all other IHDR fields remain zero
  const scanlines = Buffer.alloc((Math.ceil(width / 8) + 1) * height);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(scanlines)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function reader(page: Page, locale: Locale, clock = false): Promise<void> {
  if (clock) await page.clock.install({ time: new Date('2026-09-09T12:00:00Z') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, `${ROUTES[locale].verify}?t=medicamentos`);
  await expect(root(page)).toHaveAttribute('data-enhanced', 'true');
  if (clock) await page.clock.pauseAt(new Date('2026-09-09T12:01:00Z'));
}

async function manual(page: Page, code: string): Promise<void> {
  await page.getByTestId('manual-input').fill(code);
  await page.getByTestId('manual-input').press('Enter');
}

/** Hold only the explicit reader fetch: the initial <img> is already loaded. */
async function holdExample(page: Page, responseFixture = qrFixture) {
  let release!: () => void;
  let started!: () => void;
  let finished!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const requestStarted = new Promise<void>(resolve => { started = resolve; });
  const responseFinished = new Promise<void>(resolve => { finished = resolve; });
  await page.route('**/images/qr/ejemplo-traza.png', async route => {
    started();
    await held;
    try { await route.fulfill({ path: responseFixture, contentType: 'image/png' }); }
    catch { /* The reader deliberately aborted this request. */ }
    finally { finished(); }
  });
  return { release, requestStarted, responseFinished };
}

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: photo lookup survives language, back, reload and tenant changes while reset stays empty`, async ({ page }) => {
    await reader(page, locale);
    const expectLookup = async (language: Locale, tenant: 'traza' | 'medicamentos') => {
      await expect(root(page)).toHaveAttribute('data-state', 'result');
      await expect(page.getByTestId('result-code')).toHaveText(VALID);
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      const url = new URL(page.url());
      expect(url.pathname).toBe(ROUTES[language].verify);
      expect(url.searchParams.get('c')).toBe(VALID);
      // The default context is also represented by an omitted t after a toggle.
      expect(url.searchParams.get('t') ?? 'traza').toBe(tenant);
      await expect(page.getByTestId(`tenant-${tenant}`)).toHaveAttribute('aria-current', 'true');
      if (tenant === 'medicamentos') {
        await expect(root(page)).toHaveAttribute('data-tenant', 'medicamentos');
        await expect(page.locator('[data-result-other-tenant]')).toBeHidden();
      } else {
        await expect(root(page)).not.toHaveAttribute('data-tenant', 'medicamentos');
        await expect(page.locator('[data-result-other-tenant]')).toBeVisible();
      }
    };
    await page.getByTestId('qr-image-input').setInputFiles(qrFixture);
    await expectLookup(locale, 'medicamentos');
    const other = locale === 'es' ? 'en' : 'es';
    const languageLink = page.locator('[data-lang-switch]');
    if (!(await languageLink.isVisible())) await page.locator('[data-nav-toggle]').click();
    await languageLink.click();
    await expectLookup(other, 'medicamentos');

    // Native history and reload, not a second goto or injected popstate event.
    await page.goBack({ waitUntil: 'load' });
    await expectLookup(locale, 'medicamentos');
    await page.reload({ waitUntil: 'load' });
    await expectLookup(locale, 'medicamentos');
    await page.getByTestId('tenant-traza').click();
    await expectLookup(locale, 'traza');
    await page.getByTestId('tenant-medicamentos').click();
    await expectLookup(locale, 'medicamentos');

    await page.getByTestId('verify-again').click();
    await expect(page.getByTestId('verify-idle')).toBeVisible();
    await expect(page.getByTestId('verify-result')).toBeHidden();
    expect(new URL(page.url()).searchParams.has('c')).toBe(false);
    expect(new URL(page.url()).searchParams.get('t')).toBe('medicamentos');
    await page.reload({ waitUntil: 'load' });
    await expect(root(page)).toHaveAttribute('data-enhanced', 'true');
    await expect(root(page)).toHaveAttribute('data-state', 'idle');
    await expect(page.getByTestId('verify-result')).toBeHidden();
    await expect(page.getByTestId('manual-input')).toHaveValue('');
    await expect(page.getByTestId('tenant-medicamentos')).toHaveAttribute('aria-current', 'true');
    expect(new URL(page.url()).searchParams.has('c')).toBe(false);
    expect(new URL(page.url()).searchParams.get('t')).toBe('medicamentos');
  });

  test(`${locale}: empty, non-image and over-40MP files fail safely before a valid image recovers`, async ({ page }) => {
    await reader(page, locale);
    const hugePixels = oversizedPixelPng();
    // Isolate pixel-count rejection from the separate 10 MiB file-size guard.
    expect(hugePixels.length).toBeLessThan(10 * 1024 * 1024);
    for (const [name, mimeType, buffer, message] of [
      ['empty.png', 'image/png', Buffer.alloc(0), 'invalidFile'],
      ['synthetic.txt', 'text/plain', Buffer.from('Synthetic non-image fixture.'), 'invalidFile'],
      ['over-40mp.png', 'image/png', hugePixels, 'tooLarge'],
    ] as const) {
      // setInputFiles intentionally exercises MIME validation beyond the picker filter.
      await page.getByTestId('qr-image-input').setInputFiles({ name, mimeType, buffer });
      await expect(page.locator('[data-image-error]')).toHaveText(content(locale).verify.scanner.image[message]);
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
      await expect(page.getByTestId('verify-result')).toBeHidden();
      await expect(page.getByTestId('read-example-qr')).not.toHaveAttribute('aria-disabled', 'true');
    }
    await page.getByTestId('qr-image-input').setInputFiles(qrFixture);
    await expect(page.getByTestId('result-code')).toHaveText(VALID);
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
    await expect(page.locator('[data-image-error]')).toBeHidden();
  });

  test(`${locale}: a new image supersedes an older fetch carrying a different QR payload`, async ({ page }) => {
    await reader(page, locale);
    const foreign = fileURLToPath(new URL('./fixtures/qr/foreign.png', import.meta.url));
    const held = await holdExample(page, foreign);
    try {
      await page.getByTestId('read-example-qr').click();
      await held.requestStarted;
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'true');
      await page.getByTestId('qr-image-input').setInputFiles(qrFixture);
      await expect(page.getByTestId('result-code')).toHaveText(VALID);
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
      held.release();
      await held.responseFinished;
      // A stale foreign QR would change this result to unknown_format and clear c.
      await page.waitForTimeout(2000);
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
      await expect(page.getByTestId('result-code')).toHaveText(VALID);
      expect(new URL(page.url()).searchParams.get('c')).toBe(VALID);
      await expect(page.locator('[data-image-error]')).toBeHidden();
    } finally { held.release(); }
  });

  test(`${locale}: failed decoder import exposes a useful error and preserves manual lookup`, async ({ page }) => {
    await reader(page, locale);
    let intercepted = 0;
    // The built verifier imports /_astro/jsQR.<hash>.js lazily. Intercept the
    // observed chunk family without mocking its exports or granting media access.
    await page.route(/\/_astro\/jsQR\.[^/]+\.js(?:\?.*)?$/, route => {
      intercepted++;
      return route.abort('failed');
    });
    await page.getByTestId('qr-image-input').setInputFiles(qrFixture);
    await expect(page.locator('[data-image-error]')).toHaveText(content(locale).verify.scanner.image.unavailable);
    expect(intercepted).toBeGreaterThan(0);
    await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByTestId('verify-result')).toBeHidden();
    await manual(page, VALID);
    await expect(page.getByTestId('result-code')).toHaveText(VALID);
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
    await expect(page.locator('[data-image-error]')).toBeHidden();
    // Browser module failure caching is not a promise of recovery without reload.
  });

  test(`${locale}: a newer lookup and tenant win over an older pending timeout`, async ({ page }) => {
    await reader(page, locale, true);
    await manual(page, TIMEOUT);
    await expect(root(page)).toHaveAttribute('data-state', 'loading');
    expect(new URL(page.url()).searchParams.get('c')).toBe(TIMEOUT);
    await page.getByTestId('tenant-traza').press('Enter');
    await manual(page, REVOKED);
    expect(new URL(page.url()).searchParams.get('c')).toBe(REVOKED);
    expect(new URL(page.url()).searchParams.get('t')).toBe('traza');
    await page.clock.runFor(1000);
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'revoked');
    await expect(page.getByTestId('result-code')).toHaveText(REVOKED);
    await page.clock.runFor(3000);
    // Device notices share this test id; target the transport error explicitly.
    await expect(page.locator('[data-view="error"][data-testid="verify-error"]')).toBeHidden();
    await expect(root(page).locator('[data-device]:visible')).toHaveCount(0);
    await expect(page.getByTestId('result-code')).toHaveText(REVOKED);
    expect(new URL(page.url()).searchParams.get('t')).toBe('traza');
    await expect(page.locator('[data-result-other-tenant]')).toBeVisible();
    await page.getByTestId('verify-again').press('Enter');
    await page.clock.runFor(3000);
    await expect(page.getByTestId('verify-idle')).toBeVisible();
    await expect(page.getByTestId('manual-input')).toBeFocused();
    expect(new URL(page.url()).searchParams.has('c')).toBe(false);
  });

  test(`${locale}: manual input cancels a pending image and its late response cannot overwrite the result`, async ({ page }) => {
    await reader(page, locale);
    const held = await holdExample(page);
    try {
      await page.getByTestId('read-example-qr').click();
      await held.requestStarted;
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'true');
      await manual(page, REVOKED);
      await expect(page.getByTestId('result-code')).toHaveText(REVOKED);
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
      held.release();
      await held.responseFinished;
      // Negative observation window exceeds a normal decode + mock lookup.
      await page.waitForTimeout(2000);
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'revoked');
      await expect(page.getByTestId('result-code')).toHaveText(REVOKED);
      await expect(page.locator('[data-image-error]')).toBeHidden();
      expect(new URL(page.url()).searchParams.get('c')).toBe(REVOKED);
    } finally { held.release(); }
  });

  test(`${locale}: unavailable example image reports an error and a local QR file recovers`, async ({ page }) => {
    await reader(page, locale);
    await page.route('**/images/qr/ejemplo-traza.png', route => route.fulfill({ status: 503, body: '' }));
    await page.getByTestId('read-example-qr').click();
    await expect(page.locator('[data-image-error]')).toHaveText(content(locale).verify.scanner.image.unavailable);
    await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByTestId('read-example-qr')).not.toHaveAttribute('aria-disabled', 'true');
    await page.getByTestId('qr-image-input').setInputFiles(qrFixture);
    await expect(page.getByTestId('result-code')).toHaveText(VALID);
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
    await expect(page.locator('[data-image-error]')).toBeHidden();
  });

  test(`${locale}: a stalled example image times out and manual lookup remains usable`, async ({ page }) => {
    await reader(page, locale, true);
    const held = await holdExample(page);
    try {
      await page.getByTestId('read-example-qr').press('Enter');
      await held.requestStarted;
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'true');
      await page.clock.runFor(20001);
      await expect(page.locator('[data-image-error]')).toHaveText(content(locale).verify.scanner.image.timeout);
      await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
      held.release();
      await held.responseFinished;
      await manual(page, VALID);
      await page.clock.runFor(1000);
      await expect(page.getByTestId('result-code')).toHaveText(VALID);
      await expect(page.locator('[data-image-error]')).toBeHidden();
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'all_checks_passed');
    } finally { held.release(); }
  });

  test(`${locale}: report boundaries, trimmed validation and cancellation preserve a clean next report`, async ({ page }) => {
    await reader(page, locale);
    await manual(page, VALID);
    await expect(page.getByTestId('verify-result')).toBeVisible();
    await page.getByTestId('report-button').click();
    await page.getByTestId('report-kind').selectOption('other');
    const description = page.getByTestId('report-description');
    await description.fill(' 123456789 ');
    await page.getByTestId('report-submit').click();
    await expect(description).toBeFocused();
    await expect(description).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-field-error="description"]')).toHaveText(content(locale).verify.report.errors.descriptionShort);
    await description.fill('1234567890');
    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-success')).toBeVisible();
    await page.getByTestId('report-done').click();
    await page.getByTestId('report-button').click();
    await expect(description).toHaveValue('');
    await expect(page.getByTestId('report-kind')).toHaveValue('');
    await page.getByTestId('report-kind').selectOption('seal_damaged');
    await description.fill('x'.repeat(600));
    await expect(description).toHaveAttribute('maxlength', '600');
    await expect(page.locator('[data-report-counter]')).toHaveText(content(locale).verify.report.counter.replace('{count}', '600').replace('{max}', '600'));
    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-success')).toBeVisible();
    await page.getByTestId('report-done').click();
    await page.getByTestId('report-button').click();
    await description.fill('Borrador sintético que se descarta.');
    await page.getByTestId('report-cancel').click();
    await expect(page.getByTestId('result-title')).toBeFocused();
    await page.getByTestId('report-button').click();
    await expect(description).toHaveValue('');
    await expect(page.getByTestId('report-download')).not.toHaveAttribute('href');
  });

  test(`${locale}: ambiguous URL input clears the previous result and a normalized URL recovers`, async ({ page }) => {
    await reader(page, locale);
    await manual(page, VALID);
    await expect(page.getByTestId('verify-result')).toBeVisible();
    await manual(page, `https://example.org/?c=${VALID}&c=other`);
    await expect(page.getByTestId('manual-error')).toBeVisible();
    await expect(page.getByTestId('verify-result')).toBeHidden();
    await expect(page.getByTestId('manual-input')).toBeFocused();
    expect(new URL(page.url()).searchParams.has('c')).toBe(false);
    await manual(page, `https://example.org/?c=${VALID.toLowerCase()}`);
    await expect(page.getByTestId('result-code')).toHaveText(VALID);
    await expect(page.getByTestId('manual-error')).toBeHidden();
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale].verify);
    expect(new URL(page.url()).searchParams.get('t')).toBe('medicamentos');
  });
}
