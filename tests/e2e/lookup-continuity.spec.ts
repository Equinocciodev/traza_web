import { expect, test } from '@playwright/test';

const code = 'TRZ-7F2K-4K7Q-92FA';
test('QR y consulta manual conservan código y contexto ES ↔ EN', async ({ page }) => {
  await page.goto(`/verificar/?c=${code}&t=medicamentos`);
  await expect(page.getByTestId('verify-result')).toBeVisible();
  for (const path of ['/en/verify/', '/verificar/']) {
    const link = page.locator('[data-lang-switch]');
    if (!(await link.isVisible())) await page.locator('[data-nav-toggle]').click();
    expect(new URL((await link.getAttribute('href'))!, page.url()).searchParams.get('c')).toBe(code);
    await link.click();
    await expect(page).toHaveURL(new RegExp(path));
    await expect(page.getByTestId('result-code')).toHaveText(code);
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-tenant', 'medicamentos');
    await expect(page.locator('[data-unit="brand"]')).toHaveText('Traza');
    await expect(page.locator('[data-unit="product"]')).toHaveText('Solución oral Traza');
    await expect(page.locator('[data-unit="presentation"]')).toHaveText('Frasco 120 ml');
  }
  await page.getByTestId('manual-input').fill('TRZ-7F2K-8H3M-61PC');
  await page.getByTestId('manual-input').press('Enter');
  await expect(page.getByTestId('result-code')).toHaveText('TRZ-7F2K-8H3M-61PC');
  if (!(await page.locator('[data-lang-switch]').isVisible())) await page.locator('[data-nav-toggle]').click();
  await page.locator('[data-lang-switch]').click();
  await expect(page.getByTestId('result-code')).toHaveText('TRZ-7F2K-8H3M-61PC');
  await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-tenant', 'medicamentos');
});
