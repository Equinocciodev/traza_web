/**
 * Isla de la vista institucional.
 *
 * Monta sobre el HTML renderizado en servidor (InstitutionalApp.astro):
 *  - rol de la sesión (analista / inspector de campo / observador) con sus permisos;
 *  - filtros de alertas (severidad, estado) y de auditoría (rol del actor);
 *  - detalle de alerta/caso clonando plantillas `<template data-tpl>` y pastillas `<template data-pill>`;
 *  - acciones que cambian el estado SOLO en memoria y añaden entradas a la cronología;
 *  - estados: carga, vacío, error del registro, sin conexión y sin permisos.
 *
 * Nada se guarda ni se transmite. Sin innerHTML con datos: todo texto se asigna con textContent.
 */
import {
  ALERTS,
  CASES,
  INSPECTIONS,
  AUDIT_LOG,
  PERSON_BY_ID,
  INSPECTOR_ID,
  SESSION_ACTOR_PREFIX,
  computeKpis,
  alertAssignedTo,
  type InstitutionalAlert,
  type InstitutionalCase,
  type FieldInspection,
  type AuditEntry,
  type AuditAction,
  type ActorRole,
  type AlertStatus,
} from '@/fixtures/institutional';
import type { Severity, LocalizedText } from '@/fixtures/types';
import { UNIT_BY_CODE } from '@/fixtures/units';
import { evaluateUnit, CHECK_ORDER, type CheckKey, type VerificationResult } from '@/lib/verify/engine';
import { simulateLatency, ApiError, isBrowserOffline } from '@/lib/api/client';
import { formatNumber, type Locale } from '@/i18n';
import { track } from '@/lib/analytics';
import type { InstitutionalIslandStrings, InstitutionalLabels, InstitutionalRoleId } from '@/content/institutional.types';
import { fmtDate, fmtDateTime, fill } from './format';
import { pillKey, type PillGroup } from './pills';

type Role = InstitutionalRoleId;
type LoadState = 'loading' | 'ready' | 'error';
type SeverityFilter = 'all' | Severity;
type StatusFilter = 'all' | AlertStatus;
type RoleFilter = 'all' | ActorRole;

interface State {
  role: Role;
  severity: SeverityFilter;
  status: StatusFilter;
  auditRole: RoleFilter;
  selectedAlert: string | null;
  selectedCase: string | null;
  load: LoadState;
  accessRequested: boolean;
  alerts: InstitutionalAlert[];
  cases: InstitutionalCase[];
  inspections: FieldInspection[];
  audit: AuditEntry[];
  counters: { case: number; inspection: number; audit: number; access: number };
}

const LOAD_LATENCY_MS = 650;

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function text(value: string): LocalizedText {
  return { es: value, en: value };
}

export function initInstitutional(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'es';
  const S = JSON.parse(root.dataset.i18n ?? '{}') as InstitutionalIslandStrings;
  const L = JSON.parse(root.dataset.labels ?? '{}') as InstitutionalLabels;
  const registryName = root.dataset.registry ?? '';

  /* ---------------------------------------------------------------- */
  /* Referencias al DOM                                                */
  /* ---------------------------------------------------------------- */

  const q = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = root): T | null => ctx.querySelector<T>(sel);
  const qa = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = root): T[] => Array.from(ctx.querySelectorAll<T>(sel));
  const must = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = root): T => {
    const el = ctx.querySelector<T>(sel);
    if (!el) throw new Error(`[institutional] Falta el elemento ${sel}`);
    return el;
  };

  const live = must('[data-live]');
  const alertsPanel = must('[data-panel="alerts"]');
  const casesPanel = must('[data-panel="cases"]');
  const alertList = must('[data-testid="alert-list"]');
  const caseList = must('[data-testid="case-list"]');
  const alertHost = must('[data-alert-detail-host]');
  const caseHost = must('[data-case-detail-host]');
  const alertPlaceholder = must('[data-alert-placeholder]');
  const casePlaceholder = must('[data-case-placeholder]');
  const alertDenied = must('[data-denied]', alertsPanel);
  const caseDenied = must('[data-denied]', casesPanel);
  const alertEmpty = must('[data-alert-empty]');
  const alertCount = must('[data-alert-count]');
  const auditSection = must('[data-section="audit"]');
  const auditDenied = must('[data-denied]', auditSection);
  const auditBody = must('[data-audit-body]');
  const auditRows = must('[data-audit-rows]');
  const auditEmpty = must('[data-audit-empty]');
  const auditInspectorNote = must('[data-audit-inspector-note]');
  const auditFilterGroup = must('[data-filter-role]').closest<HTMLElement>('.filter') ?? must('[data-filter-role]');
  const inspectionRows = must('[data-testid="inspection-list"] tbody');
  const errorBox = must('[data-error]');
  const offlineBox = must('[data-offline]');
  const onlineBox = must('[data-online]');
  const loadingText = must('[data-loading-text]');
  const sections = qa('[data-section]');

  /* ---------------------------------------------------------------- */
  /* Estado en memoria (copia mutable de los fixtures)                 */
  /* ---------------------------------------------------------------- */

  const state: State = {
    role: 'analyst',
    severity: 'all',
    status: 'all',
    auditRole: 'all',
    selectedAlert: null,
    selectedCase: null,
    load: 'ready',
    accessRequested: false,
    alerts: ALERTS.map((a) => ({ ...a })),
    cases: CASES.map((c) => ({ ...c, alertIds: [...c.alertIds], actions: [...c.actions] })),
    inspections: INSPECTIONS.map((i) => ({ ...i })),
    audit: AUDIT_LOG.map((e) => ({ ...e })),
    counters: { case: 145, inspection: 14, audit: 228, access: 31 },
  };

  const alertById = (id: string) => state.alerts.find((a) => a.id === id);
  const caseById = (id: string) => state.cases.find((c) => c.id === id);
  const sessionActorId = () => `${SESSION_ACTOR_PREFIX}${state.role}`;

  function actorName(actorId: string): string {
    if (actorId.startsWith(SESSION_ACTOR_PREFIX)) {
      const role = actorId.slice(SESSION_ACTOR_PREFIX.length) as Role;
      return fill(S.sessionActor, { s: S.roles[role] ?? role });
    }
    return PERSON_BY_ID.get(actorId)?.name ?? actorId;
  }

  function actorRole(actorId: string): ActorRole {
    if (actorId.startsWith(SESSION_ACTOR_PREFIX)) return actorId.slice(SESSION_ACTOR_PREFIX.length) as ActorRole;
    return PERSON_BY_ID.get(actorId)?.role ?? 'system';
  }

  /* ---------------------------------------------------------------- */
  /* Utilidades de plantillas y accesibilidad                          */
  /* ---------------------------------------------------------------- */

  function announce(message: string): void {
    live.textContent = '';
    window.setTimeout(() => {
      live.textContent = message;
    }, 40);
  }

  function cloneTpl(name: string): HTMLElement {
    const tpl = must<HTMLTemplateElement>(`template[data-tpl="${name}"]`);
    const node = tpl.content.firstElementChild?.cloneNode(true);
    if (!(node instanceof HTMLElement)) throw new Error(`[institutional] Plantilla vacía: ${name}`);
    return node;
  }

  function pill(group: PillGroup, value: string): Node {
    const tpl = q<HTMLTemplateElement>(`template[data-pill="${pillKey(group, value)}"]`);
    const node = tpl?.content.firstElementChild?.cloneNode(true);
    return node ?? document.createTextNode(value);
  }

  function slot(node: ParentNode, name: string): HTMLElement | null {
    return node.querySelector<HTMLElement>(`[data-slot="${name}"]`);
  }

  function setSlot(node: ParentNode, name: string, value: string): void {
    const el = slot(node, name);
    if (el) el.textContent = value;
  }

  function fillSlot(node: ParentNode, name: string, ...children: Node[]): void {
    const el = slot(node, name);
    if (el) el.replaceChildren(...children);
  }

  function setHint(container: ParentNode, message: string): void {
    const el = slot(container, 'hint');
    if (!el) return;
    el.textContent = message;
    if (message) {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Visibilidad por rol                                               */
  /* ---------------------------------------------------------------- */

  const canSeeAlert = (a: InstitutionalAlert): boolean => state.role !== 'inspector' || alertAssignedTo(a, caseById) === INSPECTOR_ID;
  const canSeeCase = (c: InstitutionalCase): boolean => state.role !== 'inspector' || c.inspectorId === INSPECTOR_ID;
  const canSeeInspection = (i: FieldInspection): boolean => state.role !== 'inspector' || i.inspectorId === INSPECTOR_ID;
  const canSeeAudit = (e: AuditEntry): boolean => {
    if (state.role === 'analyst') return true;
    if (state.role === 'inspector') return e.actorId === INSPECTOR_ID || e.actorId === `${SESSION_ACTOR_PREFIX}inspector`;
    return false;
  };

  /* ---------------------------------------------------------------- */
  /* Render de listas                                                  */
  /* ---------------------------------------------------------------- */

  function applyAlertFilters(): void {
    let visible = 0;
    for (const li of qa('li[data-alert-id]', alertList)) {
      const a = alertById(li.dataset.alertId ?? '');
      const show =
        !!a && canSeeAlert(a) && (state.severity === 'all' || a.severity === state.severity) && (state.status === 'all' || a.status === state.status);
      li.hidden = !show;
      if (show) visible += 1;
    }
    alertCount.textContent = fill(alertCount.dataset.countTemplate ?? '%n', { n: visible });
    alertEmpty.hidden = visible > 0 || state.load !== 'ready';
    for (const b of qa('[data-filter-severity]')) b.setAttribute('aria-pressed', String(b.dataset.filterSeverity === state.severity));
    for (const b of qa('[data-filter-status]')) b.setAttribute('aria-pressed', String(b.dataset.filterStatus === state.status));
  }

  function applyCaseVisibility(): void {
    for (const li of qa('li[data-case-id]:not([data-proto])', caseList)) {
      const c = caseById(li.dataset.caseId ?? '');
      li.hidden = !c || !canSeeCase(c);
    }
    for (const tr of qa('tr[data-inspection-id]:not([data-proto])', inspectionRows)) {
      const i = state.inspections.find((x) => x.id === tr.dataset.inspectionId);
      tr.hidden = !i || !canSeeInspection(i);
    }
  }

  function applyAuditFilters(): void {
    const observer = state.role === 'observer';
    auditDenied.hidden = !observer;
    auditBody.hidden = observer;
    auditInspectorNote.hidden = state.role !== 'inspector';
    auditFilterGroup.hidden = state.role === 'inspector';
    if (state.role === 'inspector') state.auditRole = 'all';
    let visible = 0;
    for (const tr of qa('tr[data-audit-id]:not([data-proto])', auditRows)) {
      const e = state.audit.find((x) => x.id === tr.dataset.auditId);
      const show = !!e && canSeeAudit(e) && (state.auditRole === 'all' || actorRole(e.actorId) === state.auditRole);
      tr.hidden = !show;
      if (show) visible += 1;
    }
    auditEmpty.hidden = visible > 0 || observer;
    for (const b of qa('[data-filter-role]')) b.setAttribute('aria-pressed', String(b.dataset.filterRole === state.auditRole));
  }

  function renderKpis(): void {
    const kpis = computeKpis(state.alerts, state.cases);
    for (const el of qa('[data-kpi-value]')) {
      const key = el.dataset.kpiValue as keyof typeof kpis;
      const value = kpis[key];
      if (value === undefined) continue;
      if (el.dataset.count !== String(value)) {
        el.dataset.count = String(value);
        el.textContent = formatNumber(value, locale);
      }
    }
  }

  function updateAlertRow(a: InstitutionalAlert): void {
    const li = q(`li[data-alert-id="${a.id}"]`, alertList);
    if (!li) return;
    li.dataset.status = a.status;
    li.dataset.case = a.caseId ?? '';
    li.dataset.assigned = alertAssignedTo(a, caseById) ?? '';
    const holder = q('[data-status-pill]', li);
    holder?.replaceChildren(pill('alert', a.status));
  }

  function fillCaseRow(li: HTMLElement, c: InstitutionalCase): void {
    li.dataset.caseId = c.id;
    li.dataset.status = c.status;
    li.dataset.inspector = c.inspectorId;
    const btn = q('[data-case-open]', li);
    if (btn) btn.dataset.caseOpen = c.id;
    setSlot(li, 'id', c.id);
    setSlot(li, 'title', c.title[locale]);
    setSlot(li, 'inspector', actorName(c.inspectorId));
    setSlot(li, 'alerts', c.alertIds.join(', ') || '—');
    const opened = slot(li, 'opened');
    if (opened) {
      opened.textContent = fmtDate(c.openedAt, locale);
      opened.setAttribute('datetime', c.openedAt);
    }
    q('[data-status-pill]', li)?.replaceChildren(pill('case', c.status));
  }

  function addCaseRow(c: InstitutionalCase): void {
    const proto = must('li[data-proto]', caseList);
    const li = proto.cloneNode(true) as HTMLElement;
    li.removeAttribute('data-proto');
    li.hidden = false;
    fillCaseRow(li, c);
    li.classList.add('reveal-up');
    caseList.prepend(li);
  }

  function updateCaseRow(c: InstitutionalCase): void {
    const li = q(`li[data-case-id="${c.id}"]`, caseList);
    if (li) fillCaseRow(li, c);
  }

  function addInspectionRow(i: FieldInspection): void {
    const proto = must('tr[data-proto]', inspectionRows);
    const tr = proto.cloneNode(true) as HTMLElement;
    tr.removeAttribute('data-proto');
    tr.hidden = false;
    tr.dataset.inspectionId = i.id;
    tr.dataset.inspector = i.inspectorId;
    tr.dataset.case = i.caseId;
    setSlot(tr, 'id', i.id);
    setSlot(tr, 'site', `${i.site} · ${i.region}`);
    setSlot(tr, 'date', fmtDateTime(i.at, locale));
    setSlot(tr, 'inspector', actorName(i.inspectorId));
    if (i.result) setSlot(tr, 'result', i.result[locale]); // sin resultado: conserva el "Pendiente" del prototipo
    setSlot(tr, 'case', i.caseId || '—');
    q('[data-status-pill]', tr)?.replaceChildren(pill('inspection', i.status));
    tr.classList.add('reveal-up');
    inspectionRows.prepend(tr);
  }

  function addAudit(action: AuditAction, object: string, result: string, description: string): void {
    const id = `AUD-2026-${pad(state.counters.audit++, 4)}`;
    const actorId = sessionActorId();
    const entry: AuditEntry = { id, at: new Date().toISOString(), actorId, action, object, result: text(result), description: text(description) };
    state.audit.unshift(entry);
    const proto = must('tr[data-proto]', auditRows);
    const tr = proto.cloneNode(true) as HTMLElement;
    tr.removeAttribute('data-proto');
    tr.hidden = false;
    tr.dataset.auditId = id;
    tr.dataset.actorRole = state.role;
    tr.dataset.actor = actorId;
    tr.classList.add('is-new', 'reveal-up');
    setSlot(tr, 'at', fmtDateTime(entry.at, locale));
    setSlot(tr, 'actor', actorName(actorId));
    setSlot(tr, 'role', L.actorRole[state.role]);
    setSlot(tr, 'action', L.auditAction[action]);
    setSlot(tr, 'desc', description);
    setSlot(tr, 'object', object);
    setSlot(tr, 'result', result);
    auditRows.prepend(tr);
    applyAuditFilters();
  }

  /* ---------------------------------------------------------------- */
  /* Detalle de alerta                                                 */
  /* ---------------------------------------------------------------- */

  function checkDetail(key: CheckKey, result: VerificationResult): string {
    switch (key) {
      case 'signature': {
        const c = result.checks.signature;
        return `${S.signatureStatus[c.status]} · ${fill(S.detail.keyTemplate, { a: c.algorithm ?? '—', k: c.keyId ?? '—' })}`;
      }
      case 'registry': {
        const c = result.checks.registry;
        const parts = [S.registryStatus[c.status], c.registryName ?? ''];
        if (c.registeredAt) parts.push(fill(S.detail.registeredTemplate, { d: fmtDate(c.registeredAt, locale) }));
        if (c.revokedAt) parts.push(fill(S.detail.revokedTemplate, { d: fmtDate(c.revokedAt, locale) }));
        if (c.revokedReason) parts.push(c.revokedReason[locale]);
        return parts.filter(Boolean).join(' · ');
      }
      case 'dataMatch': {
        const c = result.checks.dataMatch;
        return c.detail ? `${S.dataMatch[c.status]} · ${c.detail[locale]}` : S.dataMatch[c.status];
      }
      case 'anomalies': {
        const c = result.checks.anomalies;
        return c.items.length ? c.items.map((i) => `${S.anomalyCode[i.code]} (${L.severity[i.severity]})`).join(' · ') : S.detail.anomaliesNone;
      }
    }
  }

  function hasScheduledInspection(caseId: string | undefined): boolean {
    return !!caseId && state.inspections.some((i) => i.caseId === caseId && i.status === 'scheduled');
  }

  function renderAlertActions(node: HTMLElement, a: InstitutionalAlert, hint?: string): void {
    const btnAck = q<HTMLButtonElement>('[data-action="acknowledge"]', node);
    const btnCase = q<HTMLButtonElement>('[data-action="open-case"]', node);
    const btnIns = q<HTMLButtonElement>('[data-action="schedule-inspection"]', node);
    const btnView = q<HTMLButtonElement>('[data-action="view-case"]', node);
    const closed = a.status === 'closed';
    const role = state.role;
    if (btnAck) btnAck.disabled = closed || a.status !== 'open';
    if (btnCase) btnCase.disabled = closed || !!a.caseId || role !== 'analyst';
    if (btnIns) btnIns.disabled = closed || !a.caseId || hasScheduledInspection(a.caseId);
    if (btnView) {
      btnView.hidden = !a.caseId;
      btnView.dataset.caseId = a.caseId ?? '';
    }
    const caseSlot = slot(node, 'case');
    if (caseSlot) {
      caseSlot.textContent = a.caseId ?? S.detail.caseNone;
      caseSlot.classList.toggle('mono', !!a.caseId);
    }
    setSlot(node, 'inspector', alertAssignedTo(a, caseById) ? actorName(alertAssignedTo(a, caseById) ?? '') : S.detail.inspectorNone);
    fillSlot(node, 'pills', pill('severity', a.severity), pill('alert', a.status));

    let message = hint ?? '';
    if (!message) {
      if (closed) message = S.hints.closed;
      else if (!a.caseId && role === 'inspector') message = S.hints.inspectorCannotOpenCase;
      else if (!a.caseId) message = S.hints.needsCase;
      else if (hasScheduledInspection(a.caseId)) message = S.hints.inspectionExists;
    }
    const hintEl = slot(node, 'hint');
    if (hintEl) hintEl.textContent = message;
  }

  function renderAlertDetail(a: InstitutionalAlert): HTMLElement {
    const node = cloneTpl('alert-detail');
    const unit = UNIT_BY_CODE.get(a.unitCode);
    setSlot(node, 'id', a.id);
    setSlot(node, 'title', fill(S.detail.titleTemplate, { s: L.alertType[a.type], u: a.unitCode }));
    setSlot(node, 'summary', a.summary[locale]);
    setSlot(node, 'unit', a.unitCode);
    setSlot(node, 'product', unit ? `${unit.product.name} · ${unit.product.presentation}` : '—');
    setSlot(node, 'region', a.region);
    setSlot(node, 'date', fmtDateTime(a.detectedAt, locale));
    setSlot(node, 'explanation', a.explanation[locale]);

    const checks = slot(node, 'checks');
    const signals = slot(node, 'signals');
    if (unit) {
      const result = evaluateUnit(unit, { registryName });
      fillSlot(node, 'verdict-pill', pill('verdict', result.verdict));
      setSlot(node, 'verdict-reason', S.verdictReason[result.reason]);
      for (const key of CHECK_ORDER) {
        const li = cloneTpl('check');
        setSlot(li, 'name', L.checkName[key]);
        fillSlot(li, 'outcome', pill('outcome', result.checks[key].outcome));
        setSlot(li, 'detail', checkDetail(key, result));
        checks?.append(li);
      }
      for (const an of unit.anomalies) {
        const li = cloneTpl('signal');
        setSlot(li, 'kind', `${S.detail.signalAnomaly}: ${S.anomalyCode[an.code]}`);
        fillSlot(li, 'pill', pill('severity', an.severity));
        setSlot(li, 'text', an.detail[locale]);
        signals?.append(li);
      }
      if (unit.dataMatch !== 'match' && unit.dataMatchDetail) {
        const li = cloneTpl('signal');
        setSlot(li, 'kind', S.detail.signalDataMatch);
        fillSlot(li, 'pill', pill('outcome', unit.dataMatch === 'partial' ? 'warn' : 'fail'));
        setSlot(li, 'text', unit.dataMatchDetail[locale]);
        signals?.append(li);
      }
      const li = cloneTpl('signal');
      setSlot(li, 'kind', S.detail.signalScans);
      slot(li, 'pill')?.remove();
      setSlot(
        li,
        'text',
        fill(S.detail.scansTemplate, {
          n: unit.scans.total,
          v: unit.scans.total === 1 ? S.detail.verificationWord.one : S.detail.verificationWord.other,
          r: unit.scans.distinctRegions,
          g: unit.scans.distinctRegions === 1 ? S.detail.regionWord.one : S.detail.regionWord.other,
          d: unit.scans.lastAt ? fmtDateTime(unit.scans.lastAt, locale) : '—',
        }),
      );
      signals?.append(li);
    } else {
      const li = cloneTpl('signal');
      setSlot(li, 'kind', S.detail.signalNone);
      slot(li, 'pill')?.remove();
      slot(li, 'text')?.remove();
      signals?.append(li);
    }
    renderAlertActions(node, a);
    return node;
  }

  function setAlertCurrent(id: string | null): void {
    for (const btn of qa('[data-alert-open]', alertList)) {
      if (btn.dataset.alertOpen === id) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    }
  }

  /** Abre el detalle. `focus=false` (cambio de rol) refresca el contenido sin revelar el panel en móvil. */
  function openAlert(id: string, focus = true): void {
    const a = alertById(id);
    if (!a || !canSeeAlert(a)) return;
    state.selectedAlert = id;
    setAlertCurrent(id);
    if (focus) alertsPanel.classList.add('is-detail-open');
    alertPlaceholder.hidden = true;
    if (state.role === 'observer') {
      alertHost.replaceChildren();
      alertDenied.hidden = false;
      if (focus) alertDenied.focus();
      announce(fill(S.live.detailOpened, { s: id }));
      return;
    }
    alertDenied.hidden = true;
    const node = renderAlertDetail(a);
    node.classList.add('reveal-up');
    alertHost.replaceChildren(node);
    if (focus) node.focus();
    announce(fill(S.live.detailOpened, { s: id }));
  }

  function refreshAlertDetail(a: InstitutionalAlert, hint?: string): void {
    const node = q('[data-testid="alert-detail"]', alertHost);
    if (node && state.selectedAlert === a.id) {
      renderAlertActions(node, a, hint);
      if (hint) setHint(node, hint);
    }
  }

  function clearAlertDetail(): void {
    state.selectedAlert = null;
    setAlertCurrent(null);
    alertHost.replaceChildren();
    alertsPanel.classList.remove('is-detail-open');
    if (state.role === 'observer') {
      alertDenied.hidden = false;
      alertPlaceholder.hidden = true;
    } else {
      alertDenied.hidden = true;
      alertPlaceholder.hidden = false;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Detalle de caso                                                   */
  /* ---------------------------------------------------------------- */

  function renderCaseActions(node: HTMLElement, c: InstitutionalCase, hint?: string): void {
    const btnClose = q<HTMLButtonElement>('[data-action="close-case"]', node);
    const closed = c.status === 'closed';
    if (btnClose) btnClose.disabled = closed || state.role !== 'analyst';
    let message = hint ?? '';
    if (!message) {
      if (closed) message = S.hints.caseAlreadyClosed;
      else if (state.role === 'inspector') message = S.hints.inspectorCannotCloseCase;
    }
    const hintEl = slot(node, 'hint');
    if (hintEl) hintEl.textContent = message;
    fillSlot(node, 'pills', pill('case', c.status));
    setSlot(node, 'outcome', c.outcome ? c.outcome[locale] : S.detail.caseNoOutcome);
  }

  function renderCaseDetail(c: InstitutionalCase): HTMLElement {
    const node = cloneTpl('case-detail');
    setSlot(node, 'id', c.id);
    setSlot(node, 'title', c.title[locale]);
    setSlot(node, 'inspector', actorName(c.inspectorId));
    setSlot(node, 'opened', fmtDateTime(c.openedAt, locale));

    const alerts = slot(node, 'alerts');
    for (const alertId of c.alertIds) {
      const a = alertById(alertId);
      if (!a) continue;
      const li = cloneTpl('linked-alert');
      const btn = q('[data-alert-open]', li);
      if (btn) btn.dataset.alertOpen = a.id;
      fillSlot(li, 'pill', pill('severity', a.severity));
      setSlot(li, 'type', L.alertType[a.type]);
      setSlot(li, 'id', a.id);
      alerts?.append(li);
    }

    const timeline = slot(node, 'timeline');
    const actions = [...c.actions].sort((x, y) => (x.at < y.at ? -1 : 1));
    for (const action of actions) {
      const li = cloneTpl('timeline-item');
      const time = slot(li, 'time');
      if (time) {
        time.textContent = fmtDateTime(action.at, locale);
        time.setAttribute('datetime', action.at);
      }
      setSlot(li, 'actor', actorName(action.actorId));
      setSlot(li, 'desc', action.description[locale]);
      timeline?.append(li);
    }
    renderCaseActions(node, c);
    return node;
  }

  function setCaseCurrent(id: string | null): void {
    for (const btn of qa('[data-case-open]', caseList)) {
      if (btn.dataset.caseOpen === id) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    }
  }

  function openCase(id: string, focus = true): void {
    const c = caseById(id);
    if (!c || !canSeeCase(c)) return;
    state.selectedCase = id;
    setCaseCurrent(id);
    if (focus) casesPanel.classList.add('is-detail-open');
    casePlaceholder.hidden = true;
    if (state.role === 'observer') {
      caseHost.replaceChildren();
      caseDenied.hidden = false;
      if (focus) caseDenied.focus();
      announce(fill(S.live.caseOpened, { s: id }));
      return;
    }
    caseDenied.hidden = true;
    const node = renderCaseDetail(c);
    node.classList.add('reveal-up');
    caseHost.replaceChildren(node);
    if (focus) node.focus();
    announce(fill(S.live.caseOpened, { s: id }));
  }

  function refreshCaseDetail(c: InstitutionalCase, hint?: string): void {
    if (state.selectedCase !== c.id) return;
    const node = renderCaseDetail(c);
    caseHost.replaceChildren(node);
    if (hint) setHint(node, hint);
  }

  function clearCaseDetail(): void {
    state.selectedCase = null;
    setCaseCurrent(null);
    caseHost.replaceChildren();
    casesPanel.classList.remove('is-detail-open');
    if (state.role === 'observer') {
      caseDenied.hidden = false;
      casePlaceholder.hidden = true;
    } else {
      caseDenied.hidden = true;
      casePlaceholder.hidden = false;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Rol                                                               */
  /* ---------------------------------------------------------------- */

  function setRole(role: Role, opts: { announceChange?: boolean } = {}): void {
    state.role = role;
    root.dataset.role = role;
    for (const input of qa<HTMLInputElement>('input[name="session-role"]')) input.checked = input.value === role;
    for (const desc of qa('[data-role-desc]')) desc.hidden = desc.dataset.roleDesc !== role;

    applyAlertFilters();
    applyCaseVisibility();
    applyAuditFilters();

    const selectedAlert = state.selectedAlert ? alertById(state.selectedAlert) : undefined;
    if (selectedAlert && canSeeAlert(selectedAlert) && state.load === 'ready') openAlert(selectedAlert.id, false);
    else clearAlertDetail();

    const selectedCase = state.selectedCase ? caseById(state.selectedCase) : undefined;
    if (selectedCase && canSeeCase(selectedCase) && state.load === 'ready') openCase(selectedCase.id, false);
    else clearCaseDetail();

    if (opts.announceChange !== false) {
      announce(fill(S.live.roleChanged, { s: S.roles[role] }));
      track('institutional_role_change', { role });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Carga, error y conexión                                           */
  /* ---------------------------------------------------------------- */

  function setLoad(load: LoadState): void {
    state.load = load;
    root.dataset.load = load;
    loadingText.hidden = load !== 'loading';
    errorBox.hidden = load !== 'error';
    for (const s of sections) s.setAttribute('aria-busy', String(load === 'loading'));
    if (load !== 'ready') {
      clearAlertDetail();
      clearCaseDetail();
      alertEmpty.hidden = true;
    } else {
      applyAlertFilters();
      applyCaseVisibility();
      applyAuditFilters();
    }
  }

  let loading = false;
  async function load(opts: { fail?: boolean } = {}): Promise<void> {
    if (loading) return;
    loading = true;
    setLoad('loading');
    try {
      await simulateLatency(LOAD_LATENCY_MS);
      if (isBrowserOffline()) throw new ApiError('offline');
      if (opts.fail) throw new ApiError('server', 'registry_error', 503);
      setLoad('ready');
      announce(S.live.loaded);
    } catch (err) {
      if (err instanceof ApiError && err.kind === 'offline') {
        setLoad('ready');
        setOffline(true);
      } else {
        setLoad('error');
        announce(S.live.error);
        errorBox.focus();
      }
    } finally {
      loading = false;
    }
  }

  let onlineTimer = 0;
  function setOffline(offline: boolean): void {
    offlineBox.hidden = !offline;
    if (offline) {
      onlineBox.hidden = true;
      announce(S.live.offline);
    }
  }

  window.addEventListener('offline', () => setOffline(true));
  window.addEventListener('online', () => {
    offlineBox.hidden = true;
    onlineBox.hidden = false;
    announce(S.live.online);
    window.clearTimeout(onlineTimer);
    onlineTimer = window.setTimeout(() => {
      onlineBox.hidden = true;
    }, 6000);
  });

  function guardOnline(container: ParentNode | null): boolean {
    if (!isBrowserOffline()) return true;
    setOffline(true);
    if (container) setHint(container, S.hints.offline);
    return false;
  }

  /* ---------------------------------------------------------------- */
  /* Acciones de la sesión                                                */
  /* ---------------------------------------------------------------- */

  function acknowledge(a: InstitutionalAlert): void {
    if (a.status !== 'open') {
      refreshAlertDetail(a, a.status === 'closed' ? S.hints.closed : S.hints.alreadyAcknowledged);
      return;
    }
    a.status = 'acknowledged';
    updateAlertRow(a);
    addAudit('alert_acknowledged', a.id, S.audit.acknowledgedResult, S.audit.acknowledgedDescription);
    renderKpis();
    applyAlertFilters();
    refreshAlertDetail(a, S.hints.acknowledged);
    announce(fill(S.live.acknowledged, { s: a.id }));
  }

  function openCaseFromAlert(a: InstitutionalAlert): void {
    if (state.role !== 'analyst') {
      refreshAlertDetail(a, S.hints.inspectorCannotOpenCase);
      return;
    }
    if (a.caseId) {
      refreshAlertDetail(a, S.hints.hasCase);
      return;
    }
    const id = `CASO-2026-${pad(state.counters.case++, 4)}`;
    const now = new Date().toISOString();
    const c: InstitutionalCase = {
      id,
      title: text(fill(S.newCase.titleTemplate, { s: a.id })),
      status: 'open',
      alertIds: [a.id],
      inspectorId: INSPECTOR_ID,
      openedAt: now,
      actions: [{ id: `${id}-01`, at: now, actorId: sessionActorId(), description: text(fill(S.newCase.openedDescription, { s: a.id })) }],
    };
    state.cases.unshift(c);
    a.caseId = id;
    a.assignedTo = INSPECTOR_ID;
    if (a.status === 'open') a.status = 'acknowledged';
    addCaseRow(c);
    updateAlertRow(a);
    addAudit('case_opened', id, S.audit.caseOpenedResult, fill(S.audit.caseOpenedDescription, { s: a.id }));
    renderKpis();
    applyAlertFilters();
    applyCaseVisibility();
    refreshAlertDetail(a, fill(S.live.caseCreated, { s: id }));
    announce(fill(S.live.caseCreated, { s: id }));
  }

  function scheduleInspection(a: InstitutionalAlert): void {
    const c = a.caseId ? caseById(a.caseId) : undefined;
    if (!c) {
      refreshAlertDetail(a, S.hints.needsCase);
      return;
    }
    if (hasScheduledInspection(c.id)) {
      refreshAlertDetail(a, S.hints.inspectionExists);
      return;
    }
    const unit = UNIT_BY_CODE.get(a.unitCode);
    const site = unit?.destination?.site ?? unit?.origin.place.site ?? '—';
    const region = unit?.destination?.region ?? a.region;
    const id = `INS-2026-${pad(state.counters.inspection++, 3)}`;
    const when = new Date();
    when.setUTCDate(when.getUTCDate() + 3);
    when.setUTCHours(9, 0, 0, 0);
    const ins: FieldInspection = { id, caseId: c.id, status: 'scheduled', site, region, at: when.toISOString(), inspectorId: c.inspectorId };
    state.inspections.unshift(ins);
    const place = `${site} · ${region}`;
    c.actions.push({ id: `${c.id}-${pad(c.actions.length + 1, 2)}`, at: new Date().toISOString(), actorId: sessionActorId(), description: text(fill(S.newCase.inspectionDescription, { s: id, p: place })) });
    addInspectionRow(ins);
    addAudit('inspection_scheduled', id, S.audit.inspectionResult, fill(S.audit.inspectionDescription, { p: place }));
    applyCaseVisibility();
    refreshAlertDetail(a, fill(S.live.inspectionScheduled, { s: id }));
    refreshCaseDetail(c);
    announce(fill(S.live.inspectionScheduled, { s: id }));
  }

  function closeCase(c: InstitutionalCase): void {
    if (c.status === 'closed') {
      refreshCaseDetail(c, S.hints.caseAlreadyClosed);
      return;
    }
    if (state.role !== 'analyst') {
      refreshCaseDetail(c, S.hints.inspectorCannotCloseCase);
      return;
    }
    c.status = 'closed';
    c.outcome = text(S.newCase.closedOutcome);
    c.actions.push({ id: `${c.id}-${pad(c.actions.length + 1, 2)}`, at: new Date().toISOString(), actorId: sessionActorId(), description: text(S.newCase.closedDescription) });
    for (const alertId of c.alertIds) {
      const a = alertById(alertId);
      if (!a) continue;
      a.status = 'closed';
      updateAlertRow(a);
      if (state.selectedAlert === a.id) refreshAlertDetail(a);
    }
    updateCaseRow(c);
    addAudit('case_closed', c.id, S.audit.caseClosedResult, S.audit.caseClosedDescription);
    renderKpis();
    applyAlertFilters();
    refreshCaseDetail(c, fill(S.live.caseClosed, { s: c.id }));
    announce(fill(S.live.caseClosed, { s: c.id }));
  }

  function requestAccess(): void {
    const folio = `SOL-2026-${pad(state.counters.access++, 4)}`;
    state.accessRequested = true;
    for (const panel of qa('[data-denied]')) {
      const requested = q('[data-requested]', panel);
      if (requested) requested.hidden = false;
      const btn = q<HTMLButtonElement>('[data-action="request-access"]', panel);
      if (btn) btn.disabled = true;
    }
    addAudit('access_requested', folio, S.audit.accessResult, S.audit.accessDescription);
    announce(`${S.live.accessRequested} ${fill(S.access.requestedTemplate, { s: folio })}`);
  }

  function goBack(panel: HTMLElement): void {
    panel.classList.remove('is-detail-open');
    if (panel === alertsPanel) {
      const btn = state.selectedAlert ? q(`[data-alert-open="${state.selectedAlert}"]`, alertList) : null;
      (btn ?? q('[data-alert-open]', alertList))?.focus();
    } else {
      const btn = state.selectedCase ? q(`[data-case-open="${state.selectedCase}"]`, caseList) : null;
      (btn ?? q('[data-case-open]', caseList))?.focus();
    }
  }

  /* ---------------------------------------------------------------- */
  /* Eventos                                                           */
  /* ---------------------------------------------------------------- */

  root.addEventListener('change', (ev) => {
    const input = ev.target;
    if (input instanceof HTMLInputElement && input.name === 'session-role' && input.checked) {
      const role = input.value as Role;
      if (role === 'analyst' || role === 'inspector' || role === 'observer') setRole(role);
    }
  });

  root.addEventListener('click', (ev) => {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const el = target.closest<HTMLElement>('[data-action], [data-alert-open], [data-case-open], [data-filter-severity], [data-filter-status], [data-filter-role]');
    if (!el || !root.contains(el)) return;

    if (el.dataset.alertOpen !== undefined) {
      ev.preventDefault();
      openAlert(el.dataset.alertOpen);
      return;
    }
    if (el.dataset.caseOpen !== undefined) {
      ev.preventDefault();
      openCase(el.dataset.caseOpen);
      return;
    }
    if (el.dataset.filterSeverity !== undefined) {
      state.severity = el.dataset.filterSeverity as SeverityFilter;
      applyAlertFilters();
      announce(fill(S.live.filtered, { n: qa('li[data-alert-id]:not([hidden])', alertList).length }));
      return;
    }
    if (el.dataset.filterStatus !== undefined) {
      state.status = el.dataset.filterStatus as StatusFilter;
      applyAlertFilters();
      announce(fill(S.live.filtered, { n: qa('li[data-alert-id]:not([hidden])', alertList).length }));
      return;
    }
    if (el.dataset.filterRole !== undefined) {
      state.auditRole = el.dataset.filterRole as RoleFilter;
      applyAuditFilters();
      return;
    }

    const detail = el.closest<HTMLElement>('[data-testid="alert-detail"], [data-testid="case-detail"]');
    switch (el.dataset.action) {
      case 'clear-filters': {
        state.severity = 'all';
        state.status = 'all';
        applyAlertFilters();
        q('[data-filter-severity="all"]')?.focus();
        announce(fill(S.live.filtered, { n: qa('li[data-alert-id]:not([hidden])', alertList).length }));
        break;
      }
      case 'back': {
        const panel = el.closest<HTMLElement>('[data-panel]');
        if (panel) goBack(panel);
        break;
      }
      case 'acknowledge':
      case 'open-case':
      case 'schedule-inspection': {
        const a = state.selectedAlert ? alertById(state.selectedAlert) : undefined;
        if (!a || !guardOnline(detail)) return;
        if (el.dataset.action === 'acknowledge') acknowledge(a);
        else if (el.dataset.action === 'open-case') openCaseFromAlert(a);
        else scheduleInspection(a);
        break;
      }
      case 'view-case': {
        const id = el.dataset.caseId;
        if (id) openCase(id);
        break;
      }
      case 'close-case': {
        const c = state.selectedCase ? caseById(state.selectedCase) : undefined;
        if (!c || !guardOnline(detail)) return;
        closeCase(c);
        break;
      }
      case 'request-access': {
        if (!guardOnline(null)) return;
        requestAccess();
        break;
      }
      case 'simulate-error': {
        void load({ fail: true });
        break;
      }
      case 'retry': {
        void load();
        break;
      }
      default:
        break;
    }
  });

  root.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const panel = target.closest<HTMLElement>('[data-panel].is-detail-open');
    if (panel && window.matchMedia('(max-width: 63.99em)').matches) {
      ev.preventDefault();
      goBack(panel);
    }
  });

  /* ---------------------------------------------------------------- */
  /* Arranque                                                          */
  /* ---------------------------------------------------------------- */

  root.classList.add('is-enhanced');
  const checked = q<HTMLInputElement>('input[name="session-role"]:checked');
  const initialRole = (checked?.value as Role | undefined) ?? 'analyst';
  setRole(initialRole === 'inspector' || initialRole === 'observer' ? initialRole : 'analyst', { announceChange: false });
  renderKpis();
  if (isBrowserOffline()) setOffline(true);
  void load();
}
