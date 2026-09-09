import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { content, open } from './helpers';
import { SCENARIO_BY_ID } from '@/fixtures/scenarios';

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: descarga explícita local, sin envío ni cambios de registro`, async ({ page, context }) => {
    await open(page, locale === 'es' ? '/verificar/' : '/en/verify/');
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-enhanced', 'true');
    const revokedUrls = await page.evaluateHandle(() => {
      const urls: string[] = [];
      const nativeRevokeObjectURL = URL.revokeObjectURL;
      URL.revokeObjectURL = (url: string) => {
        nativeRevokeObjectURL.call(URL, url);
        urls.push(url);
      };
      return urls;
    });
    await page.locator('[data-scenario="partial_match"]').click();
    const result = page.getByTestId('verify-result');
    await expect(result).toBeVisible();
    const reason = await result.getAttribute('data-reason');
    const verdict = await result.getAttribute('data-verdict');
    const anomalies = await result.locator('[data-check="anomalies"]').textContent();
    const requests: string[] = [];
    page.on('request', req => { if (req.resourceType() !== 'websocket') requests.push(req.url()); });
    const downloads: string[] = [];
    page.on('download', item => downloads.push(item.suggestedFilename()));
    await page.getByTestId('report-button').click();
    await expect(page.getByTestId('report-email')).toHaveCount(0);
    await expect(page.getByTestId('report-location')).toHaveCount(0);
    await page.getByTestId('report-kind').selectOption('seal_damaged');
    const description = 'El sello de la caja está abierto. Observación [error] literal.';
    await page.getByTestId('report-description').fill(description);
    await context.setOffline(true);
    await page.getByTestId('report-submit').click();
    await expect(page.getByTestId('report-success')).toBeVisible();
    await expect(page.locator('[data-report-success-title]')).toBeFocused();
    expect(downloads).toEqual([]);
    const link = page.getByTestId('report-download');
    await expect(link).toHaveText(content(locale).verify.report.success.downloadLabel);
    const blobUrl = await link.getAttribute('href');
    expect(blobUrl).toMatch(/^blob:/);
    const event = page.waitForEvent('download');
    await link.click();
    const download = await event;
    expect(download.suggestedFilename()).toMatch(/^RPT-LOCAL-[0-9a-f-]{36}\.json$/);
    const path = await download.path();
    expect(path).toBeTruthy();
    const data = JSON.parse(await readFile(path!, 'utf8'));
    expect(Object.keys(data).sort()).toEqual(['code', 'description', 'folio', 'kind', 'preparedAt', 'schema', 'status']);
    expect(data).toMatchObject({schema: 'traza-local-report-v1', status: 'prepared-locally-not-sent', code: SCENARIO_BY_ID.get('partial_match')!.code, kind: 'seal_damaged', description});
    expect(data.folio).toBe(await page.getByTestId('report-folio').textContent());
    expect(Number.isNaN(Date.parse(data.preparedAt))).toBe(false);
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => ({local: localStorage.length, session: sessionStorage.length, cookie: document.cookie}))).toEqual({local: 0, session: 0, cookie: ''});
    // El archivo descargado y validado arriba es el control positivo del blob.
    // Observar la revocación real evita realizar fetch(blob), restringido por la CSP.
    expect(await revokedUrls.jsonValue()).not.toContain(blobUrl);
    await page.getByTestId('report-done').click();
    await expect(result).toBeVisible();
    await expect(result).toHaveAttribute('data-reason', reason!);
    await expect(result).toHaveAttribute('data-verdict', verdict!);
    await expect(link).not.toHaveAttribute('href');
    expect(await revokedUrls.jsonValue()).toContain(blobUrl);
    await revokedUrls.dispose();
    await context.setOffline(false);
    await page.getByTestId('report-button').click();
    await expect(page.getByTestId('report-description')).toHaveValue('');
    await page.getByTestId('report-cancel').click();
    await page.locator('[data-scenario="partial_match"]').click();
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'loading');
    await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'result');
    await expect(result).toHaveAttribute('data-reason', reason!);
    await expect(result).toHaveAttribute('data-verdict', verdict!);
    await expect(result.locator('[data-check="anomalies"]')).toHaveText(anomalies!);
  });
}
