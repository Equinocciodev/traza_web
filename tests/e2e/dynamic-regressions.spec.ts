/**
 * Regressions from the September 2026 usage audit, independently specified from
 * observed failures. These exercise the UI; no email is composed or transmitted.
 * The one synthetic click targets an existing hidden case link to represent a
 * queued/stale event, and is explicitly distinct from the normal user flow.
 */
import { expect, test, type Page } from '@playwright/test';
import { ROUTES, otherLocale, type Locale } from '@/i18n';
import { TRANSPORT_CODES } from '@/fixtures/scenarios';
import { content, open } from './helpers';

const initialCode = 'TRZ-7F2K-4K7Q-92FA';
const languageSelectors = ['[data-lang-switch]', '[data-footer-lang-switch]'] as const;

async function expectLookupContext(page: Page, locale: Locale, code: string | null): Promise<void> {
  const current = new URL(page.url());
  expect(current.searchParams.get('c')).toBe(code);
  expect(current.searchParams.get('t')).toBe('medicamentos');
  // Inspect both actual anchor destinations, including a collapsed mobile header.
  for (const selector of languageSelectors) {
    const href = await page.locator(selector).getAttribute('href');
    expect(href).toBeTruthy();
    const target = new URL(href!, page.url());
    expect(target.pathname).toBe(ROUTES[otherLocale(locale)].verify);
    expect(target.searchParams.get('c')).toBe(code);
    expect(target.searchParams.get('t')).toBe('medicamentos');
    expect(target.searchParams.has('irrelevant')).toBe(false);
  }
}

async function followLanguageLink(page: Page, selector: string): Promise<void> {
  const link = page.locator(selector);
  if (!(await link.isVisible())) await page.locator('[data-nav-toggle]').click();
  await link.click();
}

async function startWithResult(page: Page, locale: Locale): Promise<void> {
  await open(page, `${ROUTES[locale].verify}?c=${initialCode}&t=medicamentos&irrelevant=discard`);
  await expect(page.getByTestId('verify-result')).toBeVisible();
  await expect(page.getByTestId('result-code')).toHaveText(initialCode);
}

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: contact summary follows corrections and new errors without stealing focus`, async ({ page }) => {
    await open(page, ROUTES[locale].company);
    const summary = page.locator('[data-summary]');
    const name = page.locator('#contact-name');
    const email = page.locator('#contact-email');
    const message = page.locator('#contact-message');
    const consent = page.locator('#contact-consent');

    await page.locator('[data-submit]').click();
    await expect(summary).toBeFocused();
    await expect(summary.locator('li')).toHaveCount(4);
    await summary.locator('a[href="#contact-name"]').click();
    await name.fill('Ana');
    await expect(name).toBeFocused();
    await expect(name).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-name-error')).toBeHidden();
    await expect(summary.locator('li')).toHaveCount(3);
    await expect(summary.locator('a[href="#contact-name"]')).toHaveCount(0);

    await email.fill('audit@example.com');
    await expect(email).toBeFocused();
    await expect(summary.locator('li')).toHaveCount(2);
    await message.fill('Local regression review of medicine identity and public lookup.');
    await expect(message).toBeFocused();
    await expect(summary.locator('li')).toHaveCount(1);
    await consent.focus();
    await consent.press('Space');
    await expect(consent).toBeChecked();
    await expect(consent).toBeFocused();
    await expect(summary).toBeHidden();
    await expect(summary.locator('li')).toHaveCount(0);
    await expect(page.locator('[data-contact-form] [aria-invalid="true"]')).toHaveCount(0);

    // After all errors disappear, introducing a new one must rebuild the summary.
    await email.fill('not-an-email');
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(summary).toBeVisible();
    await expect(summary.locator('li')).toHaveCount(1);
    await expect(summary.locator('a')).toHaveAttribute('href', '#contact-email');
    await expect(summary).toContainText(content(locale).common.form.invalidEmail);
    await email.fill('audit@example.com');
    await expect(email).toBeFocused();
    await expect(summary).toBeHidden();
    await expect(page.locator('[data-status="success"]')).toBeHidden();
    // Stop at valid fields: submitting would invoke the external mail application.
  });

  test(`${locale}: institutional loading/error blocks all data panels and stale case activation`, async ({ page }) => {
    await open(page, ROUTES[locale].institutional);
    const root = page.getByTestId('institutional');
    await expect(root).toHaveAttribute('data-load', 'ready');
    const caseRow = page.locator('li[data-case-id="CASO-2026-0144"]');
    const caseLink = caseRow.locator('[data-case-open]');
    const auditRows = page.locator('[data-testid="audit-log"] tr[data-audit-id]:not([data-proto])');
    const inspections = page.getByTestId('inspection-list');
    const auditCount = await auditRows.count();
    const caseCount = await page.locator('[data-testid="case-list"] li:not([data-proto])').count();
    const initialKpis = await page.locator('[data-kpi-value]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-count')));
    await expect(caseRow).toHaveAttribute('data-status', 'open');
    await caseLink.click();
    await expect(page.getByTestId('case-detail').locator('[data-action="close-case"]')).toBeEnabled();

    // Observe before the real click. The observer runs after setLoad's synchronous
    // DOM updates, preserving the loading evidence even if the next runner command
    // arrives after the example's short loading interval has ended.
    await root.evaluate(element => {
      element.removeAttribute('data-audit-loading-snapshot');
      const observer = new MutationObserver(() => {
        if (element.getAttribute('data-load') !== 'loading') return;
        const snapshot = {
          load: element.getAttribute('data-load'),
          busy: Array.from(element.querySelectorAll('[data-section]')).every(section => section.getAttribute('aria-busy') === 'true'),
          hidden: Array.from(element.querySelectorAll<HTMLElement>('[data-loadable]')).every(panel => panel.hidden),
        };
        // Test-only evidence attribute: no clocks, handlers or product state changed.
        element.setAttribute('data-audit-loading-snapshot', JSON.stringify(snapshot));
        observer.disconnect();
      });
      observer.observe(element, { attributes: true, attributeFilter: ['data-load'] });
    });
    await page.locator('[data-action="simulate-error"]').click();
    await expect(root).toHaveAttribute('data-audit-loading-snapshot', JSON.stringify({ load: 'loading', busy: true, hidden: true }));
    await root.evaluate(element => element.removeAttribute('data-audit-loading-snapshot'));
    await expect(root).toHaveAttribute('data-load', 'error');
    await expect(page.getByTestId('inst-error')).toBeVisible();
    await expect(page.getByTestId('inst-error')).toBeFocused();
    await expect(page.getByTestId('case-list')).toBeHidden();
    await expect(inspections).toBeHidden();
    await expect(page.getByTestId('audit-log')).toBeHidden();
    await expect(page.getByTestId('alert-list')).toBeHidden();
    await expect(page.getByTestId('case-detail')).toHaveCount(0);

    // A stale event on a real, now-hidden case control must not recreate a detail
    // from which the user could close the case while the registry is unavailable.
    await caseLink.dispatchEvent('click');
    await expect(page.getByTestId('case-detail')).toHaveCount(0);
    await expect(root.locator('[data-action="close-case"]')).toHaveCount(0);
    await expect(caseRow).toHaveAttribute('data-status', 'open');
    await expect(auditRows).toHaveCount(auditCount);
    expect(await page.locator('[data-kpi-value]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-count')))).toEqual(initialKpis);

    await page.getByTestId('inst-error').locator('[data-action="retry"]').click();
    await expect(root).toHaveAttribute('data-load', 'ready');
    await expect(page.getByTestId('case-list')).toBeVisible();
    await expect(inspections).toBeVisible();
    await expect(page.getByTestId('audit-log')).toBeVisible();
    await expect(page.getByTestId('alert-list')).toBeVisible();
    await expect(page.getByTestId('inst-error')).toBeHidden();
    await expect(page.locator('[data-testid="case-list"] li:not([data-proto])')).toHaveCount(caseCount);
    await expect(auditRows).toHaveCount(auditCount);
    await expect(caseRow).toHaveAttribute('data-status', 'open');
    await caseLink.click();
    const close = page.getByTestId('case-detail').locator('[data-action="close-case"]');
    await expect(close).toBeEnabled();
    await close.click();
    await expect(caseRow).toHaveAttribute('data-status', 'closed');
    await expect(auditRows).toHaveCount(auditCount + 1);
    // A new page load resets the example session; retry above only preserved it.
    await open(page, ROUTES[locale].institutional);
    await expect(root).toHaveAttribute('data-load', 'ready');
    await expect(caseRow).toHaveAttribute('data-status', 'open');
    await expect(auditRows).toHaveCount(auditCount);
  });

  for (const selector of languageSelectors) {
    for (const [scenario, code, kind] of [
      ['server_error', TRANSPORT_CODES.serverError, 'server'],
      ['timeout', TRANSPORT_CODES.timeout, 'timeout'],
    ] as const) {
      test(`${locale}: ${scenario} replaces prior lookup during loading, retry and language switch via ${selector}`, async ({ page }) => {
        await startWithResult(page, locale);
        await page.locator(`[data-scenario="${scenario}"]`).click();
        await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'loading');
        await expectLookupContext(page, locale, code);
        const error = page.locator('[data-view="error"][data-testid="verify-error"]');
        await expect(error).toBeVisible();
        await expect(error).toHaveAttribute('data-kind', kind);
        await expectLookupContext(page, locale, code);
        await page.getByTestId('retry-button').click();
        await expect(page.locator('[data-verify-app]')).toHaveAttribute('data-state', 'loading');
        await expectLookupContext(page, locale, code);
        await expect(error).toBeVisible();
        await followLanguageLink(page, selector);
        await expect(page.locator('html')).toHaveAttribute('lang', otherLocale(locale));
        await expect(error).toBeVisible();
        await expect(error).toHaveAttribute('data-kind', kind);
        await expectLookupContext(page, otherLocale(locale), code);
        await expect(page.getByTestId('verify-result')).toBeHidden();
        await page.getByTestId('type-another').click();
        await expect(page.getByTestId('verify-idle')).toBeVisible();
        await expectLookupContext(page, otherLocale(locale), null);
      });
    }

    test(`${locale}: unknown format and reset never resurrect the preceding lookup via ${selector}`, async ({ page }) => {
      await startWithResult(page, locale);
      await page.locator('[data-scenario="unknown_format"]').click();
      await expect(page.getByTestId('verify-result')).toHaveAttribute('data-reason', 'unknown_format');
      await expect(page.getByTestId('result-code')).toHaveText('ABC-123');
      await expectLookupContext(page, locale, null);
      await followLanguageLink(page, selector);
      const other = otherLocale(locale);
      await expect(page.locator('html')).toHaveAttribute('lang', other);
      await expect(page.getByTestId('verify-idle')).toBeVisible();
      await expectLookupContext(page, other, null);
      // Also cover reset after a successful lookup, not only after an error.
      await page.getByTestId('manual-input').fill(initialCode);
      await page.getByTestId('manual-input').press('Enter');
      await expect(page.getByTestId('result-code')).toHaveText(initialCode);
      await expectLookupContext(page, other, initialCode);
      await page.getByTestId('verify-again').click();
      await expect(page.getByTestId('verify-idle')).toBeVisible();
      await expectLookupContext(page, other, null);
      await followLanguageLink(page, selector);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByTestId('verify-idle')).toBeVisible();
      await expectLookupContext(page, locale, null);
    });
  }
}
