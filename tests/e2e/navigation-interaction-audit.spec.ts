/** Additional usage contracts absent from the initial navigation audit.
 * No external mail application, real camera or backend mutation is involved.
 * Offline is browser-context emulation; it is not a physical network test.
 */
import { expect, test } from '@playwright/test';
import { ROUTES, otherLocale } from '@/i18n';
import { ALERTS, CASES, INSPECTOR_ID } from '@/fixtures/institutional';
import { content, open } from './helpers';

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: mobile menu closes on outside click, focus exit and breakpoint changes`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile disclosure behavior');
    await open(page, ROUTES[locale].home);
    const toggle = page.locator('[data-nav-toggle]');
    const nav = page.locator('[data-nav]');
    await toggle.click();
    await expect(nav).toBeVisible();
    // The disclosure occupies the central 90% of the page; this gutter point is
    // outside the sticky header and its menu, without clicking any product action.
    await page.mouse.click(1, page.viewportSize()!.height - 8);
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await nav.locator('a').last().focus();
    await page.keyboard.press('Tab');
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.activeElement?.closest('[data-header]') !== null)).toBe(false);

    await toggle.click();
    await expect(nav).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(toggle).toBeVisible();
    await expect(nav).toBeHidden();
    await toggle.click();
    await nav.locator(`a[href="${ROUTES[locale].platform}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${ROUTES[locale].platform}$`));
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test(`${locale}: desktop submenus dismiss from a child and rearm by keyboard`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop hover/focus disclosure');
    await open(page, ROUTES[locale].home);
    for (const item of await page.locator('.site-nav__item').all()) {
      const children = item.locator('.site-nav__sublink');
      if (await children.count() === 0) continue;
      const parent = item.locator('.site-nav__link');
      await parent.focus();
      await expect(children.first()).toBeVisible();
      await parent.press('Tab');
      await expect(children.first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(parent).toBeFocused();
      await expect(children.first()).toBeHidden();
      await parent.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.classList.contains('site-nav__sublink'))).toBe(false);
      await page.keyboard.press('Shift+Tab');
      await expect(parent).toBeFocused();
      await expect(children.first()).toBeVisible();
      await parent.press('Tab');
      await expect(children.first()).toBeFocused();
    }
  });

  test(`${locale}: all severity/status combinations expose exactly the matching example alerts`, async ({ page }) => {
    test.setTimeout(90_000);
    await open(page, ROUTES[locale].institutional);
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready');
    for (const severity of ['all', 'info', 'warning', 'critical']) {
      await page.locator(`[data-filter-severity="${severity}"]`).click();
      for (const status of ['all', 'open', 'acknowledged', 'closed']) {
        await page.locator(`[data-filter-status="${status}"]`).click();
        const expected = ALERTS.filter(alert =>
          (severity === 'all' || alert.severity === severity) &&
          (status === 'all' || alert.status === status),
        ).map(alert => alert.id).sort();
        const visible = page.locator('[data-testid="alert-list"] li[data-alert-id]:not([hidden])');
        expect((await visible.evaluateAll(rows => rows.map(row => row.getAttribute('data-alert-id')))).sort()).toEqual(expected);
        await expect(page.locator('[data-alert-count]')).toHaveText(content(locale).institutional.alerts.countTemplate.replace('%n', String(expected.length)));
        await expect(page.locator(`[data-filter-status="${status}"]`)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator(`[data-filter-severity="${severity}"]`)).toHaveAttribute('aria-pressed', 'true');
        if (expected.length) await expect(page.getByTestId('alert-empty')).toBeHidden();
        else await expect(page.getByTestId('alert-empty')).toBeVisible();
      }
    }
    await page.locator('[data-filter-severity="critical"]').click();
    await page.locator('[data-filter-status="open"]').click();
    await page.getByTestId('alert-empty').locator('[data-action="clear-filters"]').click();
    await expect(page.locator('[data-filter-severity="all"]')).toBeFocused();
    await expect(page.locator('[data-testid="alert-list"] li[data-alert-id]:not([hidden])')).toHaveCount(ALERTS.length);
  });

  test(`${locale}: role radios and detail restrictions work through successive keyboard changes`, async ({ page }) => {
    await open(page, ROUTES[locale].institutional);
    const root = page.getByTestId('institutional');
    await expect(root).toHaveAttribute('data-load', 'ready');
    const analyst = page.locator('input[name="session-role"][value="analyst"]');
    const inspector = page.locator('input[name="session-role"][value="inspector"]');
    const observer = page.locator('input[name="session-role"][value="observer"]');
    await analyst.focus();
    await analyst.press('ArrowRight');
    await expect(inspector).toBeFocused();
    await expect(inspector).toBeChecked();
    const assignedCases = CASES.filter(c => c.inspectorId === INSPECTOR_ID).map(c => c.id).sort();
    const visibleCases = page.locator('[data-testid="case-list"] li[data-case-id]:not([data-proto]):not([hidden])');
    expect((await visibleCases.evaluateAll(rows => rows.map(row => row.getAttribute('data-case-id')))).sort()).toEqual(assignedCases);
    await expect(page.locator('[data-audit-inspector-note]')).toBeVisible();
    await expect(page.locator('[data-filter-role="all"]')).toBeHidden();
    const firstAssigned = page.locator('[data-testid="alert-list"] li:not([hidden]) [data-alert-open]').first();
    await firstAssigned.focus();
    await firstAssigned.press('Enter');
    await expect(page.getByTestId('alert-detail')).toBeFocused();
    await expect(page.getByTestId('alert-detail').locator('[data-action="open-case"]')).toBeDisabled();
    await inspector.focus();
    await inspector.press('ArrowRight');
    await expect(observer).toBeFocused();
    await expect(observer).toBeChecked();
    await expect(page.getByTestId('alert-detail')).toHaveCount(0);
    await expect(page.locator('[data-audit-body]')).toBeHidden();
    await observer.press('ArrowLeft');
    await inspector.press('ArrowLeft');
    await expect(analyst).toBeFocused();
    await expect(analyst).toBeChecked();
    await expect(visibleCases).toHaveCount(CASES.length);
    await expect(page.locator('[data-audit-body]')).toBeVisible();
  });

  test(`${locale}: browser offline blocks mutations and recovery permits the same action`, async ({ page, context }) => {
    await open(page, ROUTES[locale].institutional);
    const root = page.getByTestId('institutional');
    await expect(root).toHaveAttribute('data-load', 'ready');
    const row = page.locator('li[data-alert-id="ALR-2026-035"]');
    await row.locator('[data-alert-open]').click();
    const detail = page.getByTestId('alert-detail');
    const audit = page.locator('[data-testid="audit-log"] tr[data-audit-id]:not([data-proto])');
    const count = await audit.count();
    await context.setOffline(true);
    await expect(page.getByTestId('inst-offline')).toBeVisible();
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(row).toHaveAttribute('data-status', 'open');
    await expect(detail.locator('[data-slot="hint"]')).toHaveText(content(locale).institutional.island.hints.offline);
    await expect(audit).toHaveCount(count);
    await detail.locator('[data-action="open-case"]').click();
    await expect(page.locator('[data-testid="case-list"] li[data-case-id]:not([data-proto])')).toHaveCount(CASES.length);
    await context.setOffline(false);
    await expect(page.getByTestId('inst-offline')).toBeHidden();
    await expect(page.locator('[data-online]')).toBeVisible();
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(row).toHaveAttribute('data-status', 'acknowledged');
    await expect(audit).toHaveCount(count + 1);
  });

  test(`${locale}: institutional language reentry starts a new example session`, async ({ page }) => {
    await open(page, ROUTES[locale].institutional);
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready');
    const alert = page.locator('li[data-alert-id="ALR-2026-035"]');
    await alert.locator('[data-alert-open]').click();
    await page.getByTestId('alert-detail').locator('[data-action="acknowledge"]').click();
    await expect(alert).toHaveAttribute('data-status', 'acknowledged');
    const switcher = page.locator('[data-footer-lang-switch]');
    await switcher.click();
    const other = otherLocale(locale);
    await expect(page).toHaveURL(new RegExp(`${ROUTES[other].institutional}$`));
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready');
    await expect(alert).toHaveAttribute('data-status', 'open');
    await expect(page.locator('html')).toHaveAttribute('lang', other);
    await switcher.click();
    await expect(page).toHaveURL(new RegExp(`${ROUTES[locale].institutional}$`));
    await expect(page.getByTestId('institutional')).toHaveAttribute('data-load', 'ready');
    await expect(alert).toHaveAttribute('data-status', 'open');
  });
}
