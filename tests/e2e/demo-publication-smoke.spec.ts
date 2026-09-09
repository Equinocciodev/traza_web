import { expect, test } from '@playwright/test';
import { content } from './helpers';

test.use({ timezoneId: 'America/New_York' });
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });
const CODE = 'TRZ-7F2K-4K7Q-92FA';

for (const locale of ['es', 'en'] as const) {
  const verify = locale === 'es' ? '/verificar/' : '/en/verify/';
  test(`${locale}: fecha de fabricación conserva el día en Nueva York`, async ({ page }) => {
    await page.goto(`${verify}?t=medicamentos&c=${CODE}`);
    await expect(page.getByTestId('verify-result')).toBeVisible();
    await expect(page.locator('[data-unit="producedAt"]')).toHaveText(locale === 'es' ? '12 jul. 2026' : 'Jul 12, 2026');
  });

  test(`${locale}: cinco pasos de la presentación pública`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    const c = content(locale);
    await page.goto(locale === 'es' ? '/' : '/en/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main')).toContainText(locale === 'es' ? 'medicamentos' : 'medicines');
    expect(await page.locator('main img').evaluateAll(images => images.filter(image => (image as HTMLImageElement).loading !== 'lazy').every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await page.goto(`${verify}?t=medicamentos&c=${CODE}`);
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid');
    await expect(page.getByTestId('result-code')).toHaveText(CODE);
    await expect(page.locator('[data-unit="presentation"]')).toContainText('120 ml');
    await page.getByTestId('read-example-qr').click();
    await expect(page.locator('[data-image-status]')).not.toBeEmpty();
    await expect(page.getByTestId('verify-result')).toHaveAttribute('data-verdict', 'valid');
    await expect(page.getByTestId('result-code')).toHaveText(CODE);
    await page.goto(locale === 'es' ? '/recorrido/' : '/en/journey/');
    const steps = page.getByTestId('journey-step');
    await steps.nth(3).click();
    await expect(page.getByTestId('journey-play')).toHaveText(c.journey.controls.replay);
    await page.getByTestId('journey-prev').click();
    await expect(page.getByTestId('journey-play')).toHaveText(c.journey.controls.play);
    await page.goto(locale === 'es' ? '/institucional/' : '/en/institutional/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const observer = page.getByRole('radio', { name: locale === 'es' ? 'Observador' : 'Observer', exact: true });
    await observer.check();
    await expect(observer).toBeChecked();
    await expect(page.getByRole('group', { name: locale === 'es' ? 'Rol de la sesión' : 'Session role', exact: true })).toContainText(locale === 'es' ? 'Permisos limitados' : 'Limited permissions');
    expect(pageErrors).toEqual([]);
  });
}
