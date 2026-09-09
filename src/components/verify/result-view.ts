/**
 * Rellena la estructura del resultado (renderizada en servidor) con un VerificationResult.
 * Solo cambia atributos, texto y visibilidad; las cadenas vienen del bloque de contenido tipado.
 */
import type { VerifyClientStrings } from '@/content/verify.types';
import { TENANTS, type Tenant } from '@/config/tenants';
import { formatDate, formatDateTime, type Locale } from '@/i18n';
import type { CheckKey } from '@/lib/verify/engine';
import { CHECK_ORDER } from '@/lib/verify/engine';
import type { VerificationResult, PublicUnit } from '@/lib/verify/types';
import { fill } from '@/lib/verify/present';
import { clear, create, hide, qs, setText, show, toggle } from './dom';

export interface RenderContext {
  strings: VerifyClientStrings;
  locale: Locale;
  tenant: Tenant;
}

type Detail = { label: string; value: string; mono?: boolean };

function renderDetails(dl: HTMLElement, details: Detail[]): void {
  clear(dl);
  if (details.length === 0) {
    hide(dl);
    return;
  }
  for (const d of details) {
    const wrap = create('div');
    wrap.appendChild(create('dt', { text: d.label }));
    wrap.appendChild(create('dd', { text: d.value, className: d.mono ? 'mono' : undefined }));
    dl.appendChild(wrap);
  }
  show(dl);
}

function lastEventOf(unit: PublicUnit) {
  return unit.events.reduce<PublicUnit['events'][number] | null>((acc, ev) => (acc === null || ev.at > acc.at ? ev : acc), null);
}

export function renderResult(article: HTMLElement, result: VerificationResult, ctx: RenderContext): void {
  const { strings, locale, tenant } = ctx;
  article.dataset.verdict = result.verdict;
  article.dataset.reason = result.reason;

  const reason = strings.reasons[result.reason];
  setText(qs(article, '[data-result-title]'), reason.title);
  setText(qs(article, '[data-result-explanation]'), reason.body);
  setText(qs(article, '[data-result-code]'), result.code);
  setText(qs(article, '[data-result-verified-at]'), formatDateTime(result.verifiedAt, locale));

  const registryName = result.checks.registry.registryName ?? TENANTS[result.tenant].registryName[locale];
  setText(qs(article, '[data-result-registry]'), registryName);

  const otherTenant = qs(article, '[data-result-other-tenant]');
  if (result.tenant !== tenant.id && result.unit) {
    setText(otherTenant, fill(strings.states.otherTenantNote, { registry: TENANTS[result.tenant].registryName[locale] }));
    show(otherTenant);
  } else {
    hide(otherTenant);
  }

  for (const key of CHECK_ORDER) renderCheck(article, key, result, ctx);

  const unitSection = qs(article, '[data-result-unit]');
  const unitHidden = qs(article, '[data-result-unit-hidden]');
  if (result.unit) {
    renderUnit(unitSection, result.unit, ctx);
    show(unitSection);
    hide(unitHidden);
  } else {
    hide(unitSection);
    // La nota solo tiene sentido cuando sí se consultó y la firma/identidad no superó la comprobación.
    toggle(unitHidden, result.verdict === 'invalid');
  }

  setText(qs(article, '[data-result-confidence]'), strings.verdicts[result.verdict].confidence);
  const steps = qs(article, '[data-result-steps]');
  clear(steps);
  for (const step of result.nextSteps) steps.appendChild(create('li', { text: strings.meaning.steps[step] }));
  setText(qs(article, '[data-result-tenant-hint]'), tenant.nextStepHint[locale]);
}

function renderCheck(article: HTMLElement, key: CheckKey, result: VerificationResult, ctx: RenderContext): void {
  const { strings, locale } = ctx;
  const row = qs(article, `[data-check="${key}"]`);
  const status = qs(row, '[data-check-status]');
  const note = qs(row, '[data-check-note]');
  const details = qs<HTMLElement>(row, '[data-check-details]');
  hide(note);
  const c = strings.checks;

  switch (key) {
    case 'signature': {
      const check = result.checks.signature;
      row.dataset.outcome = check.outcome;
      setText(status, c.signature.status[check.status]);
      const list: Detail[] = [];
      if (check.algorithm) list.push({ label: c.signature.algorithmLabel, value: check.algorithm, mono: true });
      if (check.issuedAt) list.push({ label: c.signature.issuedAtLabel, value: formatDateTime(check.issuedAt, locale), mono: true });
      if (check.keyId) list.push({ label: c.signature.keyIdLabel, value: check.keyId, mono: true });
      renderDetails(details, list);
      break;
    }
    case 'registry': {
      const check = result.checks.registry;
      row.dataset.outcome = check.outcome;
      setText(status, c.registry.status[check.status]);
      const list: Detail[] = [];
      if (check.registryName) list.push({ label: c.registry.registryLabel, value: check.registryName });
      if (check.registeredAt) list.push({ label: c.registry.registeredAtLabel, value: formatDateTime(check.registeredAt, locale), mono: true });
      if (check.revokedAt) list.push({ label: c.registry.revokedAtLabel, value: formatDateTime(check.revokedAt, locale), mono: true });
      renderDetails(details, list);
      if (check.revokedReason) {
        setText(note, `${c.registry.reasonLabel}: ${check.revokedReason[locale]}`);
        show(note);
      }
      break;
    }
    case 'dataMatch': {
      const check = result.checks.dataMatch;
      row.dataset.outcome = check.outcome;
      setText(status, c.dataMatch.status[check.status]);
      renderDetails(details, []);
      if (check.detail) {
        setText(note, check.detail[locale]);
        show(note);
      }
      break;
    }
    case 'anomalies': {
      const check = result.checks.anomalies;
      row.dataset.outcome = check.outcome;
      renderDetails(details, []);
      const list = qs(row, '[data-check-anomalies]');
      clear(list);
      if (check.outcome === 'skipped') {
        setText(status, c.anomalies.skipped);
        hide(list);
        break;
      }
      if (check.items.length === 0) {
        setText(status, c.anomalies.none);
        hide(list);
        break;
      }
      setText(status, '');
      const template = qs<HTMLTemplateElement>(article.closest('[data-verify-app]') ?? document, '[data-template="anomaly"]');
      for (const item of check.items) {
        const node = template.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
        if (!node) continue;
        node.dataset.severity = item.severity;
        setText(node.querySelector('[data-anomaly-title]'), c.anomalies.codes[item.code]);
        setText(node.querySelector('[data-anomaly-detail]'), item.detail[locale]);
        const time = node.querySelector<HTMLTimeElement>('[data-anomaly-date]');
        if (time) {
          time.dateTime = item.detectedAt;
          time.textContent = formatDateTime(item.detectedAt, locale);
        }
        list.appendChild(node);
      }
      show(list);
      break;
    }
  }
}

function renderUnit(section: HTMLElement, unit: PublicUnit, ctx: RenderContext): void {
  const { strings, locale } = ctx;
  const u = strings.unit;
  const set = (field: string, value: string) => setText(section.querySelector(`[data-unit="${field}"]`), value);
  set('product', unit.product.name);
  set('presentation', unit.product.presentation);
  set('dosageForm', unit.product.dosageForm?.[locale] ?? '—');
  set('concentration', unit.product.concentration ?? '—');
  set('healthRegistration', unit.product.healthRegistration ?? '—');
  set('brand', unit.product.brand);
  set('category', unit.product.category[locale]);
  set('issuer', `${unit.issuer.name} · ${u.issuerRoles[unit.issuer.role]}`);
  set('lot', unit.origin.lot);
  set('origin', `${unit.origin.place.site}, ${unit.origin.place.region}`);
  // La fecha de fabricación es un día de calendario, no un instante local.
  set('producedAt', formatDate(unit.origin.producedAt, locale, { timeZone: 'UTC' }));
  set('stage', u.stages[unit.currentStage]);
  set('lastLookupPlace', unit.lastLookupPlace ? `${unit.lastLookupPlace.site}, ${unit.lastLookupPlace.region}` : '—');
  const last = lastEventOf(unit);
  set('lastEvent', last ? `${u.eventKinds[last.kind]} · ${formatDateTime(last.at, locale)} · ${last.place.site}` : '—');
  set('scans', unit.scans.total > 0 ? fill(u.scansValue, { total: unit.scans.total, regions: unit.scans.distinctRegions }) : u.noScans);
  set('lastScan', unit.scans.lastAt ? formatDateTime(unit.scans.lastAt, locale) : u.noScans);
}
