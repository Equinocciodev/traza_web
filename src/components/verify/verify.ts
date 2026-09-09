/**
 * Controlador de la isla de verificación pública (cliente).
 *
 * Se monta sobre el HTML renderizado por VerifyApp.astro y solo cambia atributos, texto y visibilidad:
 * - Tenant desde `?t=` (resolveTenant) → data-tenant, lockup condicional y textos de contexto.
 * - Deep link `?c=CODIGO` → precarga y verifica.
 * - Escáner con haz de lectura y cámara del dispositivo (getUserMedia + BarcodeDetector si existe).
 * - Entrada manual con normalización y validación accesible.
 * - Escenarios de ejemplo (código, transporte, dispositivo) y estado de red.
 * - Estados: idle, loading, error (offline/servidor/tiempo de espera), result, report.
 * - Conectividad real (online/offline) con reintento automático del código pendiente.
 * - Analítica sin el código completo.
 */
import type { TransportErrorKind, VerifyClientStrings } from '@/content/verify.types';
import { DEFAULT_TENANT, TENANTS, isTenantId, resolveTenant, type Tenant, type TenantId } from '@/config/tenants';
import { FEATURED_UNIT_CODE } from '@/fixtures/units';
import type { ScenarioId } from '@/fixtures/types';
import { localeFromPath, type Locale } from '@/i18n';
import { ApiError, getApi, simulateLatency } from '@/lib/api';
import { track } from '@/lib/analytics';
import { prefersReducedMotion } from '@/lib/motion';
import { CameraController, type CameraFailure } from '@/lib/verify/camera';
import { decodeQrFile, QrImageError } from '@/lib/verify/qr-image';
import { normalizeCode, parseCode, unverifiableResult, type ReasonCode, type VerificationResult } from '@/lib/verify/engine';
import { analyticsPropsFor, isTransportCode } from '@/lib/verify/present';
import { focusHeading, hide, qs, qsa, setText, show, toggle } from './dom';
import { initReportForm } from './report-form';
import { renderResult } from './result-view';

type View = 'idle' | 'loading' | 'error' | 'result';
type Source = 'manual' | 'scan' | 'scenario' | 'link' | 'retry' | 'auto';
type DeviceState = CameraFailure | 'unreadable';
type TenantTextKey = 'name' | 'shortName' | 'scope' | 'statusLabel' | 'verifyContext' | 'registryName' | 'nextStepHint';

type TransportReason = Extract<ReasonCode, 'offline' | 'server_error' | 'timeout' | 'registry_unavailable'>;

const ERROR_REASON: Record<TransportErrorKind, TransportReason> = {
  offline: 'offline',
  server: 'server_error',
  timeout: 'timeout',
  network: 'registry_unavailable',
  aborted: 'registry_unavailable',
};

const TENANT_TEXT_KEYS: TenantTextKey[] = ['name', 'shortName', 'scope', 'statusLabel', 'verifyContext', 'registryName', 'nextStepHint'];

function readStrings(root: HTMLElement): VerifyClientStrings {
  const block = root.querySelector<HTMLScriptElement>('script[data-verify-strings]');
  if (!block?.textContent) throw new Error('[verify] Falta el bloque de contenido de la isla.');
  return JSON.parse(block.textContent) as VerifyClientStrings;
}

export function initVerifyApp(root: HTMLElement): void {
  if (root.dataset.enhanced === 'true') return;
  root.dataset.enhanced = 'true';

  const strings = readStrings(root);
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : root.dataset.locale === 'es' ? 'es' : localeFromPath(location.pathname);
  const api = getApi();
  const params = new URLSearchParams(location.search);
  const defaultTenantId: TenantId = isTenantId(root.dataset.defaultTenant) ? root.dataset.defaultTenant : DEFAULT_TENANT;
  const showCobrand = root.dataset.showCobrand === 'true';
  let tenant: Tenant = resolveTenant(params.get('t'), defaultTenantId);

  /* ---- Elementos ---- */
  const scanner = qs(root, '[data-scanner]');
  const viewer = qs(root, '[data-viewer]');
  const video = qs<HTMLVideoElement>(root, '[data-video]');
  const scannerStatus = qs(root, '[data-scanner-status]');
  const scannerCode = qs(root, '[data-scanner-code]');
  const simulateBtn = qs<HTMLButtonElement>(root, '[data-action="simulate"]');
  const useCameraBtn = qs<HTMLButtonElement>(root, '[data-testid="use-camera"]');
  const stopCameraBtn = qs<HTMLButtonElement>(root, '[data-action="stop-camera"]');
  const deviceViews = qsa(root, '[data-device]');
  const imageInput = qs<HTMLInputElement>(root, '[data-qr-file]');
  const imageReader = qs(root, '[data-image-reader]');
  const imageStatus = qs(root, '[data-image-status]');
  const imageError = qs(root, '[data-image-error]');
  const exampleImage = qs<HTMLImageElement>(root, '[data-qr-example]');
  const readExampleBtn = qs<HTMLButtonElement>(root, '[data-read-example]');

  const form = qs<HTMLFormElement>(root, '[data-verify-form]');
  const input = qs<HTMLInputElement>(root, '[data-manual-input]');
  const manualError = qs(root, '[data-manual-error]');
  const manualNormalized = qs(root, '[data-manual-normalized]');

  const resultRegion = qs(root, '[data-result-region]');
  const views = qsa(resultRegion, '[data-view]');
  const errorView = qs(resultRegion, '[data-view="error"]');
  const errorTitle = qs(errorView, '[data-error-title]');
  const errorBody = qs(errorView, '[data-error-body]');
  const errorCode = qs(errorView, '[data-error-code]');
  const errorNoteAuto = qs(errorView, '[data-error-note="auto"]');
  const errorNoteTransport = qs(errorView, '[data-error-note="transport"]');
  const resultView = qs(resultRegion, '[data-view="result"]');
  const resultTitle = qs(resultView, '[data-result-title]');

  const netOffline = qs(root, '[data-net="offline"]');
  const netRecovered = qs(root, '[data-net="recovered"]');
  const netRetrying = qs(root, '[data-net-retrying]');
  const netToggle = qs<HTMLInputElement>(root, '[data-net-toggle]');
  const reportRegion = qs(root, '[data-report-region]');
  const scenarioButtons = qsa<HTMLButtonElement>(root, '[data-scenario]');

  /* ---- Estado ---- */
  let view: View = 'idle';
  let pendingCode: string | null = null;
  let lastError: TransportErrorKind | null = null;
  let lastResult: VerificationResult | null = null;
  let selectedCode = FEATURED_UNIT_CODE;
  let simulatedOffline = false;
  let simulating = false;
  let controller: AbortController | null = null;
  let simulateTimer: number | undefined;
  let imageController: AbortController | null = null;

  /* ------------------------------------------------------------------ */
  /* Tenant                                                              */
  /* ------------------------------------------------------------------ */

  function applyTenant(next: Tenant, updateUrl: boolean): void {
    tenant = next;
    const attr = next.id !== 'traza' ? next.id : null;
    if (attr) {
      root.dataset.tenant = attr;
      document.body.dataset.tenant = attr;
    } else {
      delete root.dataset.tenant;
      delete document.body.dataset.tenant;
    }
    qsa(root, '[data-tenant-lockup]').forEach((el) => toggle(el, showCobrand && el.dataset.tenantLockup === next.id));
    qsa(root, '[data-tenant-text]').forEach((el) => {
      const key = el.dataset.tenantText as TenantTextKey;
      if (TENANT_TEXT_KEYS.includes(key)) el.textContent = next[key][locale];
    });
    qsa(root, '[data-tenant-link]').forEach((a) => {
      if (a.dataset.tenantLink === next.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    // El resultado visible se vuelve a rellenar con el nuevo contexto (nota de otro despliegue, siguiente paso).
    if (lastResult) renderResult(resultView, lastResult, { strings, locale, tenant: next });
    if (updateUrl) {
      const url = new URL(location.href);
      if (next.id === defaultTenantId) url.searchParams.delete('t');
      else url.searchParams.set('t', next.id);
      history.replaceState(null, '', url);
      window.dispatchEvent(new Event('traza:lookup-context'));
    }
  }

  qsa<HTMLAnchorElement>(root, '[data-tenant-link]').forEach((a) =>
    a.addEventListener('click', (event) => {
      const id = a.dataset.tenantLink;
      if (!isTenantId(id)) return;
      event.preventDefault();
      applyTenant(TENANTS[id], true);
    }),
  );

  /* ------------------------------------------------------------------ */
  /* Vistas del resultado                                                */
  /* ------------------------------------------------------------------ */

  function setView(next: View): void {
    view = next;
    root.dataset.state = next;
    views.forEach((v) => toggle(v, v.dataset.view === next));
    resultRegion.setAttribute('aria-busy', String(next === 'loading'));
  }

  function revealResult(): void {
    resultView.classList.remove('reveal-up');
    // Reinicia la animación de revelado (solo transform/opacity).
    void resultView.offsetWidth;
    resultView.classList.add('reveal-up');
  }

  function showError(kind: TransportErrorKind, code: string, source: Source): void {
    lastError = kind;
    lastResult = null;
    const reason = ERROR_REASON[kind];
    const fromTransportCode = isTransportCode(code);
    const text = strings.states.errors[kind];
    errorView.dataset.kind = kind;
    errorView.dataset.reason = reason;
    setText(errorTitle, text.title);
    setText(errorBody, text.body);
    setText(errorCode, code);
    toggle(errorNoteAuto, kind === 'offline' && !fromTransportCode);
    toggle(errorNoteTransport, fromTransportCode);
    setView('error');
    focusHeading(errorTitle);
    track('verify_result', analyticsPropsFor(unverifiableResult(code, tenant.id, reason), { tenant: tenant.id, mode: source }));
  }

  async function verifyCode(raw: string, source: Source): Promise<void> {
    camera.stop();
    cancelImageRead();
    stopSimulation();
    if (source !== 'scan') clearImageFeedback();
    const code = normalizeCode(raw);
    controller?.abort();
    const current = new AbortController();
    controller = current;
    const { signal } = current;
    pendingCode = code;
    report.close(true);
    if (source !== 'auto') hide(netRecovered);
    setView('loading');
    // The current request, including a failed/pending one, owns the language links.
    // Unknown-format examples clear the previous identifier rather than sharing arbitrary input.
    const lookupUrl = new URL(location.href);
    if (/^TRZ-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) lookupUrl.searchParams.set('c', code);
    else lookupUrl.searchParams.delete('c');
    lookupUrl.searchParams.set('t', tenant.id);
    history.replaceState(null, '', lookupUrl);
    window.dispatchEvent(new Event('traza:lookup-context'));
    track('verify_start', { mode: source, tenant: tenant.id });
    try {
      if (simulatedOffline) {
        await simulateLatency(160, signal);
        throw new ApiError('offline');
      }
      const result = await api.verify(code, { tenant: tenant.id, locale, signal });
      if (signal.aborted) return;
      lastResult = result;
      lastError = null;
      renderResult(resultView, result, { strings, locale, tenant });
      revealResult();
      setView('result');
      focusHeading(resultTitle);
      track('verify_result', analyticsPropsFor(result, { tenant: tenant.id, mode: source }));
    } catch (error) {
      if (signal.aborted) return;
      const kind: TransportErrorKind = error instanceof ApiError ? error.kind : 'network';
      if (kind === 'aborted') return;
      showError(kind, code, source);
    } finally {
      if (controller === current) controller = null;
      if (!signal.aborted) hide(netRetrying);
    }
  }

  function clearVerification(): void {
    const lookupUrl = new URL(location.href);
    lookupUrl.searchParams.delete('c');
    history.replaceState(null, '', lookupUrl);
    window.dispatchEvent(new Event('traza:lookup-context'));
    controller?.abort();
    controller = null;
    pendingCode = null;
    lastResult = null;
    lastError = null;
    report.close(true);
    hide(netRetrying);
    setView('idle');
  }

  function resetToIdle(): void {
    stopReaders();
    clearImageFeedback();
    clearVerification();
    input.value = '';
    clearManualError();
    input.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Reporte de discrepancia                                             */
  /* ------------------------------------------------------------------ */

  const report = initReportForm({
    region: reportRegion,
    strings,
    locale,
    api,
    getTenant: () => tenant,
    isSimulatedOffline: () => simulatedOffline,
    onClose: () => {
      setView(view);
      if (view === 'result') focusHeading(resultTitle);
    },
  });

  function openReport(): void {
    if (!lastResult) return;
    hide(resultView);
    root.dataset.state = 'report';
    report.open(lastResult);
  }

  /* ------------------------------------------------------------------ */
  /* Conectividad real y simulada                                        */
  /* ------------------------------------------------------------------ */

  function goOffline(): void {
    show(netOffline);
    hide(netRecovered);
  }

  let recoveredTimer: number | undefined;

  function recover(): void {
    hide(netOffline);
    const shouldRetry = view === 'error' && lastError === 'offline' && !!pendingCode && !isTransportCode(pendingCode);
    show(netRecovered);
    toggle(netRetrying, shouldRetry);
    // Aviso de estado, no de error: se retira solo pasados unos segundos.
    if (recoveredTimer !== undefined) window.clearTimeout(recoveredTimer);
    recoveredTimer = window.setTimeout(() => hide(netRecovered), 10000);
    if (shouldRetry && pendingCode) {
      track('verify_retry', { mode: 'auto', tenant: tenant.id });
      void verifyCode(pendingCode, 'auto');
    }
  }

  window.addEventListener('offline', goOffline);
  window.addEventListener('online', () => {
    if (!simulatedOffline) recover();
  });
  netToggle.addEventListener('change', () => {
    simulatedOffline = netToggle.checked;
    if (simulatedOffline) goOffline();
    else if (navigator.onLine !== false) recover();
  });
  if (typeof navigator !== 'undefined' && navigator.onLine === false) goOffline();

  /* ------------------------------------------------------------------ */
  /* Escáner: haz simulado y cámara real                                 */
  /* ------------------------------------------------------------------ */

  function setScanHeight(): void {
    viewer.style.setProperty('--scan-height', `${Math.max(0, viewer.clientHeight - 2)}px`);
  }

  function setDeviceState(state: DeviceState | null): void {
    deviceViews.forEach((v) => toggle(v, v.dataset.device === state));
    if (state) {
      scanner.dataset.camera = state;
      setText(scannerStatus, strings.scanner[state].title);
    } else if (!camera.isActive && !simulating) {
      scanner.dataset.camera = 'idle';
      setText(scannerStatus, strings.scanner.idle);
    }
  }

  const camera = new CameraController(
    { video },
    {
      onActive(hasDetector) {
        setDeviceState(null);
        scanner.dataset.camera = 'active';
        show(video);
        setScanHeight();
        viewer.classList.add('is-scanning');
        setText(scannerStatus, hasDetector ? strings.scanner.activeHint : strings.scanner.noDetectorHint);
        hide(useCameraBtn);
        show(stopCameraBtn);
        if (document.activeElement === useCameraBtn || document.activeElement === document.body) stopCameraBtn.focus();
      },
      onDetected(rawValue) {
        clearImageFeedback();
        input.value = normalizeCode(rawValue);
        clearManualError();
        void verifyCode(rawValue, 'scan');
      },
      onFailure(kind) {
        show(useCameraBtn);
        hide(stopCameraBtn);
        setDeviceState(kind);
      },
      onUnreadable() {
        setDeviceState('unreadable');
      },
      onStopped() {
        const hadFocus = document.activeElement === stopCameraBtn;
        hide(video);
        viewer.classList.remove('is-scanning');
        scanner.dataset.camera = 'idle';
        show(useCameraBtn);
        hide(stopCameraBtn);
        setText(scannerStatus, strings.scanner.idle);
        if (hadFocus) useCameraBtn.focus();
      },
    },
  );

  function startCamera(): void {
    if (camera.isBusy) return;
    clearImageFeedback();
    stopSimulation();
    clearVerification();
    setDeviceState(null);
    scanner.dataset.camera = 'starting';
    setText(scannerStatus, strings.scanner.startingHint);
    hide(useCameraBtn);
    show(stopCameraBtn);
    stopCameraBtn.focus();
    void camera.start();
  }

  function stopSimulation(): void {
    if (!simulating) return;
    if (simulateTimer !== undefined) window.clearTimeout(simulateTimer);
    simulateTimer = undefined;
    simulating = false;
    viewer.classList.remove('is-scanning');
    simulateBtn.removeAttribute('aria-disabled');
    scanner.dataset.camera = 'idle';
    setText(scannerStatus, strings.scanner.idle);
  }

  function cancelImageRead(): void {
    if (!imageController) return;
    imageController.abort();
    imageController = null;
    imageReader.setAttribute('aria-busy', 'false');
    readExampleBtn.removeAttribute('aria-disabled');
    setText(imageStatus, strings.scanner.image.cancelled);
    show(imageStatus);
  }

  function stopReaders(): void {
    camera.stop();
    cancelImageRead();
    stopSimulation();
  }

  function clearImageFeedback(): void {
    cancelImageRead();
    hide(imageStatus);
    hide(imageError);
  }

  async function readImage(getFile: (signal: AbortSignal) => Promise<Blob>): Promise<void> {
    stopReaders();
    clearVerification();
    clearManualError();
    setDeviceState(null);
    const current = new AbortController();
    imageController = current;
    imageReader.setAttribute('aria-busy', 'true');
    readExampleBtn.setAttribute('aria-disabled', 'true');
    hide(imageError);
    setText(imageStatus, strings.scanner.image.reading);
    show(imageStatus);
    const timeout = window.setTimeout(() => current.abort(new QrImageError('timeout')), 20000);
    try {
      const file = await getFile(current.signal);
      if (current.signal.aborted) throw current.signal.reason;
      const raw = await decodeQrFile(file, current.signal);
      if (current.signal.aborted || imageController !== current) return;
      imageController = null;
      input.value = normalizeCode(raw);
      setText(imageStatus, strings.scanner.image.success);
      void verifyCode(raw, 'scan');
    } catch (error) {
      if (imageController !== current) return;
      if (current.signal.aborted) {
        const timedOut = current.signal.reason instanceof QrImageError && current.signal.reason.kind === 'timeout';
        if (timedOut) {
          hide(imageStatus);
          setText(imageError, strings.scanner.image.timeout);
          show(imageError);
        } else setText(imageStatus, strings.scanner.image.cancelled);
      } else {
        const kind = error instanceof QrImageError ? error.kind : 'unavailable';
        hide(imageStatus);
        setText(imageError, strings.scanner.image[kind]);
        show(imageError);
      }
    } finally {
      window.clearTimeout(timeout);
      if (imageController === current || imageController === null) {
        if (imageController === current) imageController = null;
        imageReader.setAttribute('aria-busy', 'false');
        readExampleBtn.removeAttribute('aria-disabled');
      }
    }
  }

  imageInput.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    imageInput.value = '';
    if (file) void readImage(async () => file);
  });
  readExampleBtn.addEventListener('click', () => {
    if (readExampleBtn.getAttribute('aria-disabled') === 'true') return;
    void readImage(async (signal) => {
      const response = await fetch(exampleImage.src, { signal, credentials: 'same-origin' });
      if (!response.ok) throw new QrImageError('unavailable');
      return response.blob();
    });
  });

  function simulateScan(): void {
    if (simulating) return;
    camera.stop();
    clearImageFeedback();
    clearVerification();
    setDeviceState(null);
    simulating = true;
    scanner.dataset.camera = 'simulating';
    setScanHeight();
    viewer.classList.add('is-scanning');
    setText(scannerStatus, strings.scanner.simulatingHint);
    simulateBtn.setAttribute('aria-disabled', 'true');
    const delay = prefersReducedMotion() ? 250 : 1200;
    simulateTimer = window.setTimeout(() => {
      simulating = false;
      viewer.classList.remove('is-scanning');
      scanner.dataset.camera = 'idle';
      simulateBtn.removeAttribute('aria-disabled');
      setText(scannerStatus, strings.scanner.idle);
      input.value = selectedCode;
      clearManualError();
      void verifyCode(selectedCode, 'scan');
    }, delay);
  }

  simulateBtn.addEventListener('click', simulateScan);
  qsa<HTMLButtonElement>(root, '[data-action="camera"]').forEach((btn) => btn.addEventListener('click', startCamera));
  stopCameraBtn.addEventListener('click', () => camera.stop());
  qsa<HTMLButtonElement>(root, '[data-action="type"]').forEach((btn) =>
    btn.addEventListener('click', () => {
      stopReaders();
      clearImageFeedback();
      setDeviceState(null);
      input.focus();
    }),
  );
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stopReaders();
  });
  window.addEventListener('pagehide', stopReaders);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') stopReaders();
  });

  /* ------------------------------------------------------------------ */
  /* Entrada manual                                                      */
  /* ------------------------------------------------------------------ */

  function showManualError(message: string): void {
    setText(manualError, message);
    show(manualError);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'verify-code-hint verify-code-error');
    input.focus();
  }

  function clearManualError(): void {
    hide(manualError);
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', 'verify-code-hint');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    stopReaders();
    clearImageFeedback();
    const parsed = parseCode(input.value);
    if (!parsed.ok) {
      clearVerification();
      showManualError(parsed.reason === 'empty' ? strings.manual.errors.empty : strings.manual.errors.format);
      return;
    }
    clearManualError();
    input.value = parsed.code;
    void verifyCode(parsed.code, 'manual');
  });

  input.addEventListener('blur', () => {
    const value = input.value;
    if (!value.trim()) return;
    const normalized = normalizeCode(value);
    if (normalized !== value) {
      input.value = normalized;
      setText(manualNormalized, '');
      setText(manualNormalized, strings.manual.normalized);
    }
  });

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') clearManualError();
  });

  /* ------------------------------------------------------------------ */
  /* Códigos de ejemplo                                          */
  /* ------------------------------------------------------------------ */

  /** Código con formato válido que no sea un código especial de transporte (o null). */
  function verifiableCode(value: string): string | null {
    const parsed = parseCode(value);
    return parsed.ok && !isTransportCode(parsed.code) ? parsed.code : null;
  }

  function selectScenario(id: ScenarioId): void {
    scenarioButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scenario === id)));
  }

  function runScenario(btn: HTMLButtonElement): void {
    stopReaders();
    clearImageFeedback();
    const id = btn.dataset.scenario as ScenarioId;
    const code = btn.dataset.code;
    const trigger = btn.dataset.trigger;
    selectScenario(id);
    if (code && trigger === 'code') {
      selectedCode = code;
      setText(scannerCode, code);
    }
    switch (id) {
      case 'unreadable':
        camera.stop();
        setDeviceState('unreadable');
        return;
      case 'camera_denied':
        camera.stop();
        setDeviceState('denied');
        return;
      case 'camera_unavailable':
        camera.stop();
        setDeviceState('unavailable');
        return;
      case 'offline': {
        // Reproduce la condición del dispositivo (sin red) sobre un código real, para que la
        // recuperación automática al volver la conexión pueda demostrarse de punta a punta.
        netToggle.checked = true;
        simulatedOffline = true;
        goOffline();
        const target = verifiableCode(input.value) ?? verifiableCode(selectedCode) ?? FEATURED_UNIT_CODE;
        selectedCode = target;
        setText(scannerCode, target);
        input.value = target;
        clearManualError();
        void verifyCode(target, 'scenario');
        return;
      }
      default:
        if (code) {
          input.value = code;
          clearManualError();
          void verifyCode(code, 'scenario');
        }
    }
  }

  scenarioButtons.forEach((btn) => btn.addEventListener('click', () => runScenario(btn)));

  /* ------------------------------------------------------------------ */
  /* Acciones del resultado y del error                                  */
  /* ------------------------------------------------------------------ */

  qsa<HTMLButtonElement>(root, '[data-action="retry"]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!pendingCode) return;
      track('verify_retry', { mode: 'manual', tenant: tenant.id });
      void verifyCode(pendingCode, 'retry');
    }),
  );
  qsa<HTMLButtonElement>(root, '[data-action="another"]').forEach((btn) => btn.addEventListener('click', resetToIdle));
  qsa<HTMLButtonElement>(root, '[data-action="report"]').forEach((btn) => btn.addEventListener('click', openReport));

  /* ------------------------------------------------------------------ */
  /* Arranque                                                            */
  /* ------------------------------------------------------------------ */

  applyTenant(tenant, false);
  setView('idle');

  const linkedCode = params.get('c');
  if (linkedCode && linkedCode.trim()) {
    input.value = linkedCode.trim();
    void verifyCode(linkedCode, 'link');
  }

  window.addEventListener('beforeunload', () => {
    if (simulateTimer !== undefined) window.clearTimeout(simulateTimer);
  });
}
