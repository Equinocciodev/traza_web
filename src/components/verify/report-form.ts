/**
 * Preparación local de un reporte descargable. No envía datos ni modifica el registro.
 * La copia solo permanece en memoria hasta cerrar el reporte; guardarla exige una descarga explícita.
 */
import type { TransportErrorKind, VerifyClientStrings } from '@/content/verify.types';
import type { Tenant } from '@/config/tenants';
import { formatDateTime, type Locale } from '@/i18n';
import type { TrazaApi } from '@/lib/api';
import { track } from '@/lib/analytics';
import type { VerificationResult } from '@/lib/verify/types';
import { REPORT_DESCRIPTION_MAX, REPORT_DESCRIPTION_MIN, fill } from '@/lib/verify/present';
import { focusHeading, hide, qs, qsa, setText, show } from './dom';

export interface ReportFormContext {
  region: HTMLElement;
  strings: VerifyClientStrings;
  locale: Locale;
  api: TrazaApi;
  getTenant: () => Tenant;
  isSimulatedOffline: () => boolean;
  /** Se invoca al cerrar el reporte (cancelar o volver al resultado). */
  onClose: () => void;
}

export interface ReportFormController {
  open(result: VerificationResult): void;
  /** Cierra el reporte; con `silent` no se invoca `onClose` (la vista la decide quien llama). */
  close(silent?: boolean): void;
  readonly isOpen: boolean;
}

export function initReportForm(ctx: ReportFormContext): ReportFormController {
  const { region, strings, locale } = ctx;
  const t = strings.report;
  const form = qs<HTMLFormElement>(region, '[data-report-form]');
  const title = qs(region, '[data-report-title]');
  const codeEl = qs(region, '[data-report-code]');
  const kind = qs<HTMLSelectElement>(region, '[data-report-kind]');
  const description = qs<HTMLTextAreaElement>(region, '[data-report-description]');
  const counter = qs(region, '[data-report-counter]');
  const submit = qs<HTMLButtonElement>(region, '[data-report-submit]');
  const submitLabel = qs(region, '[data-report-submit-label]');
  const errorView = qs(region, '[data-report-view="error"]');
  const errorTitle = qs(region, '[data-report-error-title]');
  const errorBody = qs(region, '[data-report-error-body]');
  const successView = qs(region, '[data-report-view="success"]');
  const successTitle = qs(region, '[data-report-success-title]');
  const folio = qs(region, '[data-report-folio]');
  const receivedAt = qs(region, '[data-report-received-at]');
  const successCode = qs(region, '[data-report-success-code]');
  const successHint = qs(region, '[data-report-tenant-hint]');
  const download = qs<HTMLAnchorElement>(region, '[data-report-download]');

  let current: VerificationResult | null = null;
  let sending = false;
  let open = false;
  let downloadUrl: string | null = null;

  const fieldError = (name: string) => qs(region, `[data-field-error="${name}"]`);

  function updateCounter(): void {
    setText(counter, fill(t.counter, { count: description.value.length, max: REPORT_DESCRIPTION_MAX }));
  }

  function setInvalid(control: HTMLElement, name: string, message: string | null): void {
    const err = fieldError(name);
    if (message) {
      setText(err, message);
      show(err);
      control.setAttribute('aria-invalid', 'true');
    } else {
      hide(err);
      control.removeAttribute('aria-invalid');
    }
  }

  function validate(): HTMLElement | null {
    let firstInvalid: HTMLElement | null = null;
    const mark = (control: HTMLElement, name: string, message: string | null) => {
      setInvalid(control, name, message);
      if (message && !firstInvalid) firstInvalid = control;
    };
    mark(kind, 'kind', kind.value ? null : t.errors.kind);
    const text = description.value.trim();
    mark(
      description,
      'description',
      text.length < REPORT_DESCRIPTION_MIN ? t.errors.descriptionShort : text.length > REPORT_DESCRIPTION_MAX ? t.errors.descriptionLong : null,
    );
    return firstInvalid;
  }

  function setSending(value: boolean): void {
    sending = value;
    // aria-disabled (y no `disabled`) para no perder el foco del teclado mientras se envía.
    if (value) submit.setAttribute('aria-disabled', 'true');
    else submit.removeAttribute('aria-disabled');
    form.setAttribute('aria-busy', String(value));
    setText(submitLabel, value ? (submitLabel.dataset.sending ?? t.sending) : (submitLabel.dataset.idle ?? t.submit));
  }

  function showFailure(kindOfError: TransportErrorKind): void {
    const text = t.failure[kindOfError];
    errorView.dataset.kind = kindOfError;
    setText(errorTitle, text.title);
    setText(errorBody, text.body);
    show(errorView);
    focusHeading(errorTitle.closest('[data-report-view="error"]') as HTMLElement);
  }

  function clearDownload(): void {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = null;
    download.removeAttribute('href');
    download.removeAttribute('download');
    hide(download);
  }

  function prepare(): void {
    if (sending || !open || !current) return;
    hide(errorView);
    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const tenant = ctx.getTenant();
    const result = current;
    setSending(true);
    try {
      const preparedAt = new Date().toISOString();
      // LOCAL evita presentar el identificador como un recibo del servidor.
      const localFolio = `RPT-LOCAL-${crypto.randomUUID()}`;
      const copy = {
        schema: 'traza-local-report-v1',
        status: 'prepared-locally-not-sent',
        folio: localFolio,
        preparedAt,
        code: result.code,
        kind: kind.value,
        description: description.value.trim(),
      };
      const blob = new Blob([JSON.stringify(copy, null, 2) + '\n'], { type: 'application/json;charset=utf-8' });
      clearDownload();
      downloadUrl = URL.createObjectURL(blob);
      download.href = downloadUrl;
      download.download = `${localFolio}.json`;
      show(download);
      successView.dataset.folio = localFolio;
      setText(folio, localFolio);
      setText(receivedAt, formatDateTime(preparedAt, locale));
      setText(successCode, result.code);
      setText(successHint, tenant.nextStepHint[locale]);
      hide(form);
      show(successView);
      focusHeading(successTitle);
      track('report_submitted', { outcome: 'prepared', kind: copy.kind, verdict: result.verdict, reason: result.reason, tenant: tenant.id });
    } catch {
      clearDownload();
      showFailure('network');
    } finally {
      setSending(false);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    prepare();
  });
  description.addEventListener('input', () => {
    updateCounter();
    if (description.getAttribute('aria-invalid')) setInvalid(description, 'description', null);
  });
  kind.addEventListener('change', () => setInvalid(kind, 'kind', null));

  qsa<HTMLButtonElement>(region, '[data-action="report-cancel"], [data-action="report-done"]').forEach((btn) =>
    btn.addEventListener('click', () => controller.close()),
  );

  function reset(): void {
    clearDownload();
    form.reset();
    hide(errorView);
    hide(successView);
    show(form);
    for (const [control, name] of [
      [kind, 'kind'],
      [description, 'description'],
    ] as const) {
      setInvalid(control, name, null);
    }
    updateCounter();
    setSending(false);
  }

  const controller: ReportFormController = {
    get isOpen() {
      return open;
    },
    open(result) {
      current = result;
      reset();
      setText(codeEl, result.code);
      show(region);
      open = true;
      focusHeading(title);
    },
    close(silent = false) {
      if (!open) return;
      current = null;
      clearDownload();
      form.reset();
      setSending(false);
      open = false;
      hide(region);
      if (!silent) ctx.onClose();
    },
  };

  updateCounter();
  // El HTML no puede enviar de forma nativa antes de instalar el listener de submit.
  submit.disabled = false;
  return controller;
}
