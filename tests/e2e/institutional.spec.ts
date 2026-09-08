/**
 * Demo C · Vista institucional: roles y permisos, filtros y estado vacío, detalle de alerta/caso,
 * acciones simuladas que alteran la cronología y los KPIs, solicitud de acceso, error + reintento,
 * sin conexión real (context.setOffline) y versión en inglés.
 */
import { expect, test, type Page } from '@playwright/test';
import { ALERTS, CASES, CASE_BY_ID, INSPECTIONS, DEMO_INSPECTOR_ID, KPIS, alertAssignedTo } from '@/fixtures/institutional';
import { collectConsoleErrors, content, expectNoAuthenticClaim, open } from './helpers';

const es = content('es').institutional;
const en = content('en').institutional;

const root = (page: Page) => page.getByTestId('institutional');
const alertRows = (page: Page) => page.locator('[data-testid="alert-list"] li[data-alert-id]');
const visibleAlerts = (page: Page) => page.locator('[data-testid="alert-list"] li[data-alert-id]:not([hidden])');
const visibleCases = (page: Page) => page.locator('[data-testid="case-list"] li[data-case-id]:not([data-proto]):not([hidden])');
const visibleInspections = (page: Page) => page.locator('[data-testid="inspection-list"] tr[data-inspection-id]:not([data-proto]):not([hidden])');
const visibleAudit = (page: Page) => page.locator('[data-testid="audit-log"] tr[data-audit-id]:not([data-proto]):not([hidden])');
const kpi = (page: Page, key: string) => page.locator(`[data-kpi-value="${key}"]`);

async function ready(page: Page, path = '/institucional/'): Promise<void> {
  await open(page, path);
  // Carga simulada: loading → ready.
  await expect(root(page)).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
}

async function setRole(page: Page, role: 'analyst' | 'inspector' | 'observer'): Promise<void> {
  await page.locator(`[data-testid="role-select"] input[data-role="${role}"]`).check();
  await expect(root(page)).toHaveAttribute('data-role', role);
}

const inspectorAlerts = ALERTS.filter((a) => alertAssignedTo(a, (id) => CASE_BY_ID.get(id)) === DEMO_INSPECTOR_ID);
const inspectorCases = CASES.filter((c) => c.inspectorId === DEMO_INSPECTOR_ID);
const inspectorInspections = INSPECTIONS.filter((i) => i.inspectorId === DEMO_INSPECTOR_ID);

test.describe('carga y roles', () => {
  test('carga simulada, KPIs derivados de los fixtures y rotulados como simulados', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await open(page, '/institucional/');
    await expect(root(page)).toHaveAttribute('data-load', /^(loading|ready)$/);
    await expect(root(page)).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.loaded);
    await expect(kpi(page, 'alertsOpen')).toHaveAttribute('data-count', String(KPIS.alertsOpen));
    await expect(kpi(page, 'casesInProgress')).toHaveAttribute('data-count', String(KPIS.casesInProgress));
    await expect(kpi(page, 'unitsRegistered')).toHaveAttribute('data-count', String(KPIS.unitsRegistered));
    await expect(page.getByTestId('kpis').locator('.demo-tag')).toHaveCount(4);
    await expect(page.getByTestId('institutional-banner').or(page.locator('.inst-banner, [data-banner]')).first()).toBeVisible();
    await expect(page.locator('body')).toContainText(es.banner.title);
    await expect(alertRows(page)).toHaveCount(ALERTS.length);
    await expect(visibleAlerts(page)).toHaveCount(ALERTS.length);
    await expectNoAuthenticClaim(page);
    expect(console.stop()).toEqual([]);
  });

  test('inspector: solo ve lo asignado a su persona y sus propias acciones en la cronología', async ({ page }) => {
    await ready(page);
    await setRole(page, 'inspector');
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.roleChanged.replace('%s', es.island.roles.inspector));
    await expect(visibleAlerts(page)).toHaveCount(inspectorAlerts.length);
    for (const a of inspectorAlerts) await expect(page.locator(`li[data-alert-id="${a.id}"]`)).toBeVisible();
    await expect(visibleCases(page)).toHaveCount(inspectorCases.length);
    await expect(visibleInspections(page)).toHaveCount(inspectorInspections.length);
    await expect(page.locator('[data-audit-inspector-note]')).toBeVisible();
    await expect(page.locator('[data-filter-role="all"]')).toBeHidden();
    const actors = await visibleAudit(page).evaluateAll((rows) => rows.map((r) => (r as HTMLElement).dataset.actor));
    expect(actors.length).toBeGreaterThan(0);
    for (const actor of actors) expect(actor).toBe(DEMO_INSPECTOR_ID);
    // El inspector puede reconocer pero no abrir casos.
    await page.locator(`button[data-alert-open="${inspectorAlerts[0]!.id}"]`).click();
    const detail = page.getByTestId('alert-detail');
    await expect(detail).toBeVisible();
    await expect(detail.locator('[data-action="open-case"]')).toBeDisabled();
  });

  test('observador: ve resumen y listas pero no el detalle ni la auditoría; puede solicitar acceso', async ({ page }) => {
    await ready(page);
    await setRole(page, 'observer');
    await expect(visibleAlerts(page)).toHaveCount(ALERTS.length);
    await page.locator(`button[data-alert-open="${ALERTS[0]!.id}"]`).click();
    const denied = page.locator('[data-panel="alerts"] [data-testid="permission-denied"]');
    await expect(denied).toBeVisible();
    await expect(denied).toContainText(es.permissions.title);
    await expect(page.getByTestId('alert-detail')).toHaveCount(0);
    await expect(page.locator('[data-section="audit"] [data-testid="permission-denied"]')).toBeVisible();
    await expect(page.locator('[data-audit-body]')).toBeHidden();
    // Solicitar acceso (simulado): confirmación, botón deshabilitado y anuncio.
    await denied.getByTestId('request-access').click();
    await expect(denied.locator('[data-requested]')).toBeVisible();
    await expect(denied.locator('[data-requested]')).toContainText(es.permissions.requested);
    await expect(denied.getByTestId('request-access')).toBeDisabled();
    await expect(page.getByTestId('inst-live')).toContainText(es.island.live.accessRequested);
    // La solicitud queda en la cronología, visible al volver a analista.
    await setRole(page, 'analyst');
    const first = visibleAudit(page).first();
    await expect(first).toHaveAttribute('data-actor-role', 'observer');
    await expect(first).toContainText(es.labels.auditAction.access_requested);
    await expect(first).toContainText(/SOL-2026-\d{4}/);
    await expect(page.getByTestId('alert-detail')).toBeVisible();
  });
});

test.describe('alertas: filtros, vacío y detalle', () => {
  test('filtros por severidad y estado, estado vacío y limpiar filtros', async ({ page }) => {
    await ready(page);
    const critical = ALERTS.filter((a) => a.severity === 'critical');
    await page.locator('[data-filter-severity="critical"]').click();
    await expect(page.locator('[data-filter-severity="critical"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-filter-severity="all"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(visibleAlerts(page)).toHaveCount(critical.length);
    await expect(page.locator('[data-alert-count]')).toHaveText(es.alerts.countTemplate.replace('%n', String(critical.length)));
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.filtered.replace('%n', String(critical.length)));
    // Crítica + abierta no existe en los fixtures → vacío con acción de limpiar.
    expect(critical.filter((a) => a.status === 'open')).toHaveLength(0);
    await page.locator('[data-filter-status="open"]').click();
    await expect(visibleAlerts(page)).toHaveCount(0);
    const empty = page.getByTestId('alert-empty');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(es.alerts.empty.title);
    await empty.locator('[data-action="clear-filters"]').click();
    await expect(empty).toBeHidden();
    await expect(visibleAlerts(page)).toHaveCount(ALERTS.length);
    await expect(page.locator('[data-filter-severity="all"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-filter-status="all"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-filter-severity="all"]')).toBeFocused();
  });

  test('detalle: evidencia del motor, señales y acciones que alteran auditoría y KPIs', async ({ page }) => {
    await ready(page);
    const alert = ALERTS.find((a) => a.status === 'open' && !a.caseId)!; // ALR-2026-035 (informativa, sin caso)
    const openBefore = KPIS.alertsOpen;
    const casesBefore = KPIS.casesInProgress;
    const auditBefore = await visibleAudit(page).count();

    await page.locator(`button[data-alert-open="${alert.id}"]`).click();
    const detail = page.getByTestId('alert-detail');
    await expect(detail).toBeVisible();
    await expect(detail).toBeFocused();
    await expect(detail.locator('.detail__toolbar [data-slot="id"]')).toHaveText(alert.id);
    await expect(detail.locator('[data-slot="unit"]')).toHaveText(alert.unitCode);
    await expect(detail.locator('[data-slot="explanation"]')).toHaveText(alert.explanation.es);
    await expect(detail.locator('[data-slot="checks"] li')).toHaveCount(4);
    await expect(detail).toContainText(es.island.detail.verdictNote);
    await expect(page.locator(`button[data-alert-open="${alert.id}"]`)).toHaveAttribute('aria-current', 'true');
    await expectNoAuthenticClaim(page);
    // Sin caso: programar inspección deshabilitado con motivo visible.
    await expect(detail.locator('[data-action="schedule-inspection"]')).toBeDisabled();
    await expect(detail.locator('[data-slot="hint"]')).toHaveText(es.island.hints.needsCase);

    // Reconocer → estado, KPI y cronología.
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(page.locator(`li[data-alert-id="${alert.id}"]`)).toHaveAttribute('data-status', 'acknowledged');
    await expect(kpi(page, 'alertsOpen')).toHaveAttribute('data-count', String(openBefore - 1));
    await expect(kpi(page, 'alertsOpen')).toHaveText(String(openBefore - 1));
    await expect(visibleAudit(page)).toHaveCount(auditBefore + 1);
    await expect(visibleAudit(page).first()).toContainText(es.labels.auditAction.alert_acknowledged);
    await expect(visibleAudit(page).first()).toContainText(es.island.sessionActor.replace('%s', es.island.roles.analyst));
    await expect(detail.locator('[data-action="acknowledge"]')).toBeDisabled();
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.acknowledged.replace('%s', alert.id));

    // Abrir caso → nueva fila de caso, KPI de casos, botón "Ver caso".
    await detail.locator('[data-action="open-case"]').click();
    const newCase = page.locator('[data-testid="case-list"] li[data-case-id]:not([data-proto])').first();
    await expect(newCase).toHaveAttribute('data-case-id', /^CASO-2026-\d{4}$/);
    const newCaseId = (await newCase.getAttribute('data-case-id'))!;
    await expect(kpi(page, 'casesInProgress')).toHaveAttribute('data-count', String(casesBefore + 1));
    await expect(visibleAudit(page)).toHaveCount(auditBefore + 2);
    await expect(visibleAudit(page).first()).toContainText(es.labels.auditAction.case_opened);
    await expect(detail.locator('[data-action="open-case"]')).toBeDisabled();
    await expect(detail.locator('[data-action="view-case"]')).toBeVisible();
    await expect(detail.locator('[data-slot="case"]')).toHaveText(newCaseId);

    // Programar inspección → nueva fila en inspecciones y cronología.
    const inspectionsBefore = await visibleInspections(page).count();
    await detail.locator('[data-action="schedule-inspection"]').click();
    await expect(visibleInspections(page)).toHaveCount(inspectionsBefore + 1);
    await expect(visibleInspections(page).first()).toHaveAttribute('data-inspection-id', /^INS-2026-\d{3}$/);
    await expect(visibleInspections(page).first()).toHaveAttribute('data-case', newCaseId);
    await expect(visibleAudit(page)).toHaveCount(auditBefore + 3);
    await expect(detail.locator('[data-action="schedule-inspection"]')).toBeDisabled();
    await expect(detail.locator('[data-slot="hint"]')).toContainText(/INS-2026-\d{3}/);

    // Ver caso → detalle del caso con la alerta vinculada; cerrar caso → KPI vuelve y alerta cerrada.
    await detail.locator('[data-action="view-case"]').click();
    const caseDetail = page.getByTestId('case-detail');
    await expect(caseDetail).toBeVisible();
    await expect(caseDetail.locator('.detail__toolbar [data-slot="id"]')).toHaveText(newCaseId);
    await expect(caseDetail.locator('[data-slot="alerts"] li')).toHaveCount(1);
    await expect(caseDetail.locator('[data-slot="timeline"] li')).toHaveCount(2);
    await expect(caseDetail.locator('[data-slot="outcome"]')).toHaveText(es.island.detail.caseNoOutcome);
    await caseDetail.locator('[data-action="close-case"]').click();
    await expect(page.locator(`li[data-case-id="${newCaseId}"]`)).toHaveAttribute('data-status', 'closed');
    await expect(kpi(page, 'casesInProgress')).toHaveAttribute('data-count', String(casesBefore));
    await expect(page.locator(`li[data-alert-id="${alert.id}"]`)).toHaveAttribute('data-status', 'closed');
    await expect(visibleAudit(page)).toHaveCount(auditBefore + 4);
    await expect(visibleAudit(page).first()).toContainText(es.labels.auditAction.case_closed);
    await expect(page.getByTestId('case-detail').locator('[data-action="close-case"]')).toBeDisabled();
    await expect(page.getByTestId('case-detail').locator('[data-slot="hint"]')).toContainText(newCaseId);
    // Nada se persiste: al recargar vuelve el estado inicial.
    await ready(page);
    await expect(kpi(page, 'alertsOpen')).toHaveAttribute('data-count', String(openBefore));
    await expect(visibleAudit(page)).toHaveCount(auditBefore);
  });

  test('caso existente: cronología ordenada, alertas vinculadas navegables y casos cerrados sin acciones', async ({ page }) => {
    await ready(page);
    const closed = CASES.find((c) => c.status === 'closed')!;
    await page.locator(`button[data-case-open="${closed.id}"]`).click();
    const detail = page.getByTestId('case-detail');
    await expect(detail).toBeVisible();
    await expect(detail.locator('[data-slot="timeline"] li')).toHaveCount(closed.actions.length);
    await expect(detail.locator('[data-slot="outcome"]')).toHaveText(closed.outcome!.es);
    await expect(detail.locator('[data-action="close-case"]')).toBeDisabled();
    await expect(detail.locator('[data-slot="hint"]')).toHaveText(es.island.hints.caseAlreadyClosed);
    await detail.locator('[data-slot="alerts"] button[data-alert-open]').first().click();
    await expect(page.getByTestId('alert-detail').locator('.detail__toolbar [data-slot="id"]')).toHaveText(closed.alertIds[0]!);
    await expect(page.getByTestId('alert-detail').locator('[data-slot="hint"]')).toHaveText(es.island.hints.closed);
  });

  test('cronología: filtro por rol del actor', async ({ page }) => {
    await ready(page);
    await page.locator('[data-filter-role="system"]').click();
    const roles = await visibleAudit(page).evaluateAll((rows) => rows.map((r) => (r as HTMLElement).dataset.actorRole));
    expect(roles.length).toBeGreaterThan(0);
    for (const r of roles) expect(r).toBe('system');
    // El filtro "issuer" solo tiene entradas del emisor; "observer" no se ofrece como filtro (solo aparece en acciones de sesión).
    await page.locator('[data-filter-role="issuer"]').click();
    const issuerRoles = await visibleAudit(page).evaluateAll((rows) => rows.map((r) => (r as HTMLElement).dataset.actorRole));
    expect(issuerRoles.length).toBeGreaterThan(0);
    for (const r of issuerRoles) expect(r).toBe('issuer');
    await expect(page.locator('[data-filter-role="observer"]')).toHaveCount(0);
    await page.locator('[data-filter-role="all"]').click();
    await expect(visibleAudit(page).first()).toBeVisible();
  });
});

test.describe('estados', () => {
  test('error simulado del registro y reintento', async ({ page }) => {
    await ready(page);
    await page.locator('[data-action="simulate-error"]').click();
    await expect(root(page)).toHaveAttribute('data-load', 'loading');
    await expect(page.locator('[data-section]').first()).toHaveAttribute('aria-busy', 'true');
    await expect(root(page)).toHaveAttribute('data-load', 'error', { timeout: 10_000 });
    const err = page.getByTestId('inst-error');
    await expect(err).toBeVisible();
    await expect(err).toContainText(es.states.errorTitle);
    await expect(err).toBeFocused();
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.error);
    await expect(page.getByTestId('alert-empty')).toBeHidden();
    await err.locator('[data-action="retry"]').click();
    await expect(root(page)).toHaveAttribute('data-load', 'ready', { timeout: 10_000 });
    await expect(err).toBeHidden();
    await expect(visibleAlerts(page)).toHaveCount(ALERTS.length);
  });

  test('sin conexión real: aviso, acciones en pausa con motivo y recuperación', async ({ page, context }) => {
    await ready(page);
    const alert = ALERTS.find((a) => a.status === 'open')!;
    await page.locator(`button[data-alert-open="${alert.id}"]`).click();
    const detail = page.getByTestId('alert-detail');
    await expect(detail).toBeVisible();
    await context.setOffline(true);
    await expect(page.getByTestId('inst-offline')).toBeVisible();
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.offline);
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(detail.locator('[data-slot="hint"]')).toHaveText(es.island.hints.offline);
    await expect(page.locator(`li[data-alert-id="${alert.id}"]`)).toHaveAttribute('data-status', 'open');
    await context.setOffline(false);
    await expect(page.getByTestId('inst-offline')).toBeHidden();
    await expect(page.locator('[data-online]')).toBeVisible();
    await expect(page.getByTestId('inst-live')).toHaveText(es.island.live.online);
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(page.locator(`li[data-alert-id="${alert.id}"]`)).toHaveAttribute('data-status', 'acknowledged');
  });

  test('el HTML del servidor contiene alertas, casos, inspecciones y cronología legibles sin JavaScript', async ({ request }) => {
    const html = await (await request.get('/institucional/')).text();
    for (const a of ALERTS) expect(html).toContain(a.id);
    for (const c of CASES) expect(html).toContain(c.id);
    for (const i of INSPECTIONS) expect(html).toContain(i.id);
    expect(html).toContain(es.banner.title);
  });
});

test.describe('inglés', () => {
  test('/en/institutional/ con roles, detalle y acciones en inglés', async ({ page }) => {
    const console = collectConsoleErrors(page);
    await ready(page, '/en/institutional/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByTestId('inst-live')).toHaveText(en.island.live.loaded);
    const alert = ALERTS.find((a) => a.status === 'open' && !a.caseId)!;
    await page.locator(`button[data-alert-open="${alert.id}"]`).click();
    const detail = page.getByTestId('alert-detail');
    await expect(detail.locator('[data-slot="explanation"]')).toHaveText(alert.explanation.en);
    await expect(detail.locator('[data-slot="hint"]')).toHaveText(en.island.hints.needsCase);
    await detail.locator('[data-action="acknowledge"]').click();
    await expect(visibleAudit(page).first()).toContainText(en.labels.auditAction.alert_acknowledged);
    await setRole(page, 'observer');
    await expect(page.locator('[data-panel="alerts"] [data-testid="permission-denied"]')).toContainText(en.permissions.title);
    await expectNoAuthenticClaim(page);
    expect(console.stop()).toEqual([]);
  });
});
