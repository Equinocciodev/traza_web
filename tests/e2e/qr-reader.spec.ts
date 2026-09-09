/**
 * Real QR pixels exercise the complete browser image/video decoding path.
 * Only camera acquisition is replaced in camera tests; the decoder is never mocked.
 * Canvas video is not evidence of physical phone-camera autofocus or hardware compatibility.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { content, open } from './helpers';

// Playwright's network trace can re-fetch an unreadable blob through
// Network.loadNetworkResource, producing its own connect-src violation for a
// corrupt image. Measure the application's CSP without that extra request;
// the independent violation log and failure attachments below stay enabled.
test.use({ trace: 'off' });

const VALID = 'TRZ-7F2K-4K7Q-92FA';
const fixture = (name: string) => fileURLToPath(new URL(`./fixtures/qr/${name}`, import.meta.url));
const result = (page: Page) => page.getByTestId('verify-result');

type CspViolation = { directive: string; blockedURI: string; disposition: string; sourceFile: string; lineNumber: number };
const cspViolations = new WeakMap<Page, CspViolation[]>();

test.beforeEach(async ({ page }) => {
  const violations: CspViolation[] = [];
  cspViolations.set(page, violations);
  // Keep evidence outside the document so a navigation cannot erase an earlier violation.
  await page.exposeFunction('__recordQrCspViolation', (violation: CspViolation) => violations.push(violation));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', event => {
      void (window as unknown as { __recordQrCspViolation: (violation: CspViolation) => Promise<void> }).__recordQrCspViolation({
        directive: event.effectiveDirective,
        blockedURI: event.blockedURI,
        disposition: event.disposition,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
      });
    });
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const violations = cspViolations.get(page) ?? [];
  if (violations.length) await testInfo.attach('qr-csp-violations', { body: JSON.stringify(violations, null, 2), contentType: 'application/json' });
  expect(violations, 'El lector no debe infringir la CSP real del servidor').toEqual([]);
});

async function openReader(page: Page, locale: 'es' | 'en' = 'es'): Promise<void> {
  // Force the portable decoder, including browsers which happen to expose BarcodeDetector.
  await page.addInitScript(() => Object.defineProperty(globalThis, 'BarcodeDetector', { configurable: true, value: undefined }));
  await open(page, locale === 'es' ? '/verificar/' : '/en/verify/');
  await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-enhanced', 'true');
  await expect(page.getByTestId('qr-image-input')).toBeAttached();
}

async function expectRead(page: Page, action: () => Promise<unknown>, code: string | null = VALID, reason = 'all_checks_passed'): Promise<void> {
  // Arm a state observer before the input action: it catches even a short loading phase,
  // and requires a subsequent result rather than accepting attributes left by an older lookup.
  const settled = page.evaluate(() => new Promise<void>((resolve, reject) => {
    const root = document.querySelector<HTMLElement>('[data-verify-app]')!;
    let loading = false;
    const timeout = window.setTimeout(() => { observer.disconnect(); reject(new Error('QR lookup did not complete loading → result')); }, 15000);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.attributeName === 'data-state' && (record.oldValue === 'loading' || root.dataset.state === 'loading')) loading = true;
      }
      if (loading && root.dataset.state === 'result') { window.clearTimeout(timeout); observer.disconnect(); resolve(); }
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-state'], attributeOldValue: true });
  }));
  await Promise.all([settled, action()]);
  await expect(result(page)).toBeVisible();
  if (code !== null) await expect(page.getByTestId('result-code')).toHaveText(code);
  await expect(result(page)).toHaveAttribute('data-reason', reason);
}

for (const locale of ['es', 'en'] as const) {
  for (const name of ['valid.png', 'rotated-90.png', 'inverted.png']) {
    test(`${locale}: decodifica píxeles reales de ${name} sin BarcodeDetector`, async ({ page }) => {
      await openReader(page, locale);
      await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture(name)));
      await expect(page.locator('[data-image-error]')).toBeHidden();
      await expect(page.locator('[data-image-status]')).not.toBeEmpty();
    });
  }

  test(`${locale}: el botón de ejemplo lee su QR y llega al registro`, async ({ page }) => {
    await openReader(page, locale);
    await expectRead(page, () => page.getByTestId('read-example-qr').click());
    await expect(result(page)).toHaveAttribute('data-verdict', 'valid');
  });
}

test('QR pequeño en panorama de 6000 × 1000 conserva sus módulos y se lee', async ({ page }) => {
  await openReader(page);
  // Fixed 164 × 164 QR at (2900, 400): shrinking the whole panorama destroys it.
  // Its pixels are frozen from the independent reproduction, not generated by the decoder.
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('panorama-small-qr.png')));
  await expect(page.locator('[data-image-error]')).toBeHidden();
});

test('un error de imagen desaparece al consultar un código manual', async ({ page }) => {
  await openReader(page);
  await page.getByTestId('qr-image-input').setInputFiles(fixture('corrupt.png'));
  await expect(page.locator('[data-image-error]')).toBeVisible();
  await page.getByTestId('manual-input').fill(VALID);
  await expectRead(page, () => page.getByTestId('manual-input').press('Enter'));
  await expect(page.locator('[data-image-error]')).toBeHidden();
});

test('Escape cancela la lectura del ejemplo demorada sin resultado tardío', async ({ page }) => {
  await openReader(page);
  let releaseResponse!: () => void;
  let requestStarted!: () => void;
  let responseFinished!: () => void;
  const held = new Promise<void>(resolve => { releaseResponse = resolve; });
  const started = new Promise<void>(resolve => { requestStarted = resolve; });
  const finished = new Promise<void>(resolve => { responseFinished = resolve; });
  // Installed after the initial example <img> load; only the user-requested fetch is held.
  await page.route('**/images/qr/ejemplo-traza.png', async route => {
    requestStarted();
    await held;
    try { await route.fulfill({ path: fixture('valid.png'), contentType: 'image/png' }); }
    finally { responseFinished(); }
  });
  await page.getByTestId('read-example-qr').click();
  await started;
  await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-image-reader]')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('[data-image-status]')).toHaveText(content('es').verify.scanner.image.cancelled);
  await page.evaluate(() => {
    const state = window as unknown as { __afterImageCancel: string[] };
    state.__afterImageCancel = [];
    const root = document.querySelector<HTMLElement>('[data-verify-app]')!;
    new MutationObserver(records => {
      for (const record of records) state.__afterImageCancel.push(record.oldValue ?? '', root.dataset.state ?? '');
    }).observe(root, { attributes: true, attributeFilter: ['data-state'], attributeOldValue: true });
  });
  releaseResponse();
  await finished;
  // Deliberate negative-observation window, exceeding a normal decode + mock lookup.
  await page.waitForTimeout(2000);
  const states = await page.evaluate(() => (window as unknown as { __afterImageCancel: string[] }).__afterImageCancel);
  expect(states).not.toContain('loading');
  expect(states).not.toContain('result');
  await expect(result(page)).toBeHidden();
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
});

test('QR ajeno: formato desconocido sin abrir ni consultar su URL', async ({ page }) => {
  await openReader(page);
  const startingUrl = page.url();
  const external: string[] = [];
  const popups: Page[] = [];
  page.on('popup', popup => popups.push(popup));
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(startingUrl).origin) external.push(request.url()); });
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('foreign.png')), null, 'unknown_format');
  await expect(result(page)).toHaveAttribute('data-verdict', 'unverifiable');
  expect(page.url()).toBe(startingUrl);
  expect(popups).toEqual([]);
  expect(external).toEqual([]);
});

for (const [name, message] of [['corrupt.png', 'invalidFile'], ['no-qr.png', 'noQr']] as const) {
  test(`${name}: error comprensible y recuperación con otro QR`, async ({ page }) => {
    await openReader(page);
    await page.getByTestId('qr-image-input').setInputFiles(fixture(name));
    await expect(page.locator('[data-image-error]')).toBeVisible();
    await expect(page.locator('[data-image-error]')).toContainText(content('es').verify.scanner.image[message]);
    await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
    await expect(page.locator('[data-image-error]')).toBeHidden();
  });
}

test('rechaza un archivo superior a 10 MiB y permite leer después', async ({ page }) => {
  await openReader(page);
  const padded = Buffer.alloc(10 * 1024 * 1024 + 1);
  (await readFile(fixture('valid.png'))).copy(padded);
  await page.getByTestId('qr-image-input').setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: padded });
  await expect(page.locator('[data-image-error]')).toContainText(content('es').verify.scanner.image.tooLarge);
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
});

test('leer la imagen no transmite archivo ni payload y no persiste datos', async ({ page }) => {
  await openReader(page);
  const origin = new URL(page.url()).origin;
  const dataRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== origin || request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType())) dataRequests.push(`${request.method()} ${request.url()}`);
  });
  const before = await page.evaluate(() => ({ cookie: document.cookie, local: localStorage.length, session: sessionStorage.length }));
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
  expect(dataRequests).toEqual([]);
  expect(await page.evaluate(() => ({ cookie: document.cookie, local: localStorage.length, session: sessionStorage.length }))).toEqual(before);
});

for (const width of [320, 390]) {
  test.describe(`ancho ${width}px / DPR2`, () => {
    test.use({ viewport: { width, height: 844 }, deviceScaleFactor: 2 });
    test('lector y resultado funcionan sin desbordamiento horizontal', async ({ page }) => {
      await openReader(page);
      expect(await page.evaluate(() => window.devicePixelRatio)).toBe(2);
      await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('rotated-90.png')));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      await expect(page.getByTestId('use-camera')).toBeVisible();
      await expect(page.locator('[data-image-error]')).toBeHidden();
    });
  });
}

test('cámara: permiso denegado conserva la alternativa de imagen', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
    configurable: true,
    value: () => Promise.reject(new DOMException('Permission denied for test', 'NotAllowedError')),
  }));
  await openReader(page);
  await page.getByTestId('use-camera').click();
  await expect(page.locator('[data-device="denied"]')).toBeVisible();
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
});

test('cámara: vídeo de canvas con QR real se decodifica y libera su track', async ({ page }) => {
  const image = `data:image/png;base64,${(await readFile(fixture('valid.png'))).toString('base64')}`;
  await page.addInitScript(({ image }) => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: async () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 640;
      const ctx = canvas.getContext('2d')!;
      const bitmap = new Image(); bitmap.src = image; await bitmap.decode();
      const paint = () => { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 640, 640); ctx.imageSmoothingEnabled = false; ctx.drawImage(bitmap, 64, 64, 512, 512); };
      paint();
      const stream = canvas.captureStream(10);
      const state = window as unknown as { __qrVideoTrack: MediaStreamTrack; __qrFrameTimer: number };
      state.__qrVideoTrack = stream.getVideoTracks()[0]!;
      state.__qrFrameTimer = window.setInterval(paint, 100);
      return stream;
    }});
  }, { image });
  await openReader(page);
  await expectRead(page, () => page.getByTestId('use-camera').click());
  await expect.poll(() => page.evaluate(() => (window as unknown as { __qrVideoTrack: MediaStreamTrack }).__qrVideoTrack.readyState)).toBe('ended');
  await expect(page.getByTestId('stop-camera')).toBeHidden();
  await expect(page.locator('[data-video]')).toBeHidden();
  await page.evaluate(() => window.clearInterval((window as unknown as { __qrFrameTimer: number }).__qrFrameTimer));
});

test('cámara: cancelar permiso pendiente detiene un stream concedido tarde', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as { __resolveQrCamera?: (stream: MediaStream) => void; __lateQrTrack?: MediaStreamTrack; __cameraStates?: string[] };
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: () => new Promise<MediaStream>(resolve => { state.__resolveQrCamera = resolve; }) });
  });
  await openReader(page);
  await page.getByTestId('use-camera').click();
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { __resolveQrCamera?: unknown }).__resolveQrCamera)).toBe('function');
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    const state = window as unknown as { __resolveQrCamera: (stream: MediaStream) => void; __lateQrTrack: MediaStreamTrack; __cameraStates: string[] };
    state.__cameraStates = [];
    const scanner = document.querySelector<HTMLElement>('[data-scanner]')!;
    new MutationObserver(() => state.__cameraStates.push(scanner.dataset.camera ?? '')).observe(scanner, { attributes: true, attributeFilter: ['data-camera'] });
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
    const stream = canvas.captureStream(); state.__lateQrTrack = stream.getVideoTracks()[0]!;
    state.__resolveQrCamera(stream);
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as { __lateQrTrack: MediaStreamTrack }).__lateQrTrack.readyState)).toBe('ended');
  expect(await page.evaluate(() => (window as unknown as { __cameraStates: string[] }).__cameraStates)).not.toContain('active');
  await expect(page.getByTestId('stop-camera')).toBeHidden();
  await expect(page.getByTestId('use-camera')).toBeVisible();
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
});

test('cámara: detener vídeo activo libera el track y permite elegir una imagen', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: async () => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const paint = () => { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 256, 256); };
    paint(); const stream = canvas.captureStream(10);
    const state = window as unknown as { __blankQrTrack: MediaStreamTrack; __blankQrTimer: number };
    state.__blankQrTrack = stream.getVideoTracks()[0]!;
    state.__blankQrTimer = window.setInterval(paint, 100);
    return stream;
  }}));
  await openReader(page);
  await page.getByTestId('use-camera').click();
  await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', 'active');
  await expect(page.getByTestId('stop-camera')).toBeVisible();
  await page.getByTestId('stop-camera').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __blankQrTrack: MediaStreamTrack }).__blankQrTrack.readyState)).toBe('ended');
  await expect(page.locator('[data-scanner]')).toHaveAttribute('data-camera', 'idle');
  await expect(page.getByTestId('use-camera')).toBeFocused();
  await page.evaluate(() => window.clearInterval((window as unknown as { __blankQrTimer: number }).__blankQrTimer));
  await expectRead(page, () => page.getByTestId('qr-image-input').setInputFiles(fixture('valid.png')));
});
