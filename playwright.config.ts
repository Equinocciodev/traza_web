import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PW_PORT ?? 4321);
const baseURL = process.env.PW_BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * Pruebas end-to-end sobre el build de producción (astro preview).
 * Proyectos:
 *  - desktop / mobile: flujos principales en escritorio y en un móvil Android modesto.
 *  - a11y: barrido con axe-core de todas las páginas.
 *  - screenshots: capturas responsive para la entrega (docs/capturas).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    // Optional local installed Chrome; CI keeps Playwright's bundled Chromium by default.
    channel: process.env.PW_CHANNEL === 'chrome' ? 'chrome' : undefined,
    trace: 'retain-on-failure',
    locale: 'es-VE',
    timezoneId: 'America/Caracas',
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'desktop',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /(a11y|screenshots)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /(a11y|screenshots)\.spec\.ts/,
      use: { ...devices['Pixel 5'], isMobile: true, hasTouch: true },
    },
    {
      name: 'a11y',
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'screenshots',
      testMatch: /screenshots\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
