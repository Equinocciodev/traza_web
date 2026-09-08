/**
 * Controlador de cámara para el escáner de verificación (solo navegador).
 *
 * - Pide la cámara con getUserMedia de forma guardada: sin API → "unavailable"; permiso denegado → "denied";
 *   sin dispositivo o restricciones imposibles → "unavailable".
 * - Si el navegador ofrece BarcodeDetector con formato qr_code, decodifica cada ~300 ms y avisa al leer.
 * - Si no hay decodificador, mantiene el video visible y lo indica (la UI ofrece la entrada manual).
 * - Tras `unreadableAfterMs` sin lectura, detiene la cámara y avisa "unreadable".
 * - `stop()` libera todos los tracks. Nada de la imagen sale del dispositivo.
 */

export type CameraFailure = 'denied' | 'unavailable';

export interface CameraHandlers {
  /** La cámara está activa. `hasDetector` indica si se decodifica automáticamente. */
  onActive(hasDetector: boolean): void;
  /** Se leyó un código QR (valor bruto). La cámara ya está detenida. */
  onDetected(rawValue: string): void;
  /** No se pudo activar la cámara. */
  onFailure(kind: CameraFailure, error?: unknown): void;
  /** Pasó el tiempo límite sin lectura. La cámara ya está detenida. */
  onUnreadable(): void;
  /** La cámara se detuvo (por el usuario, por lectura o por tiempo límite). */
  onStopped(): void;
}

export interface CameraOptions {
  video: HTMLVideoElement;
  detectIntervalMs?: number;
  unreadableAfterMs?: number;
}

interface DetectedBarcode {
  rawValue: string;
  format: string;
}

interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorCtor {
  new (options?: { formats: string[] }): BarcodeDetectorLike;
  getSupportedFormats(): Promise<string[]>;
}

const DENIED_ERRORS = new Set(['NotAllowedError', 'PermissionDeniedError', 'SecurityError']);

export function classifyCameraError(error: unknown): CameraFailure {
  const name = typeof error === 'object' && error !== null && 'name' in error ? String((error as { name: unknown }).name) : '';
  return DENIED_ERRORS.has(name) ? 'denied' : 'unavailable';
}

export function cameraApiAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
}

async function createQrDetector(): Promise<BarcodeDetectorLike | null> {
  const ctor = (globalThis as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
  if (!ctor) return null;
  try {
    const formats = typeof ctor.getSupportedFormats === 'function' ? await ctor.getSupportedFormats() : ['qr_code'];
    if (!formats.includes('qr_code')) return null;
    return new ctor({ formats: ['qr_code'] });
  } catch {
    return null;
  }
}

export class CameraController {
  private stream: MediaStream | null = null;
  private detectTimer: number | undefined;
  private unreadableTimer: number | undefined;
  private starting = false;
  private active = false;
  private detecting = false;

  constructor(
    private readonly opts: CameraOptions,
    private readonly handlers: CameraHandlers,
  ) {}

  get isActive(): boolean {
    return this.active;
  }

  get isBusy(): boolean {
    return this.active || this.starting;
  }

  async start(): Promise<void> {
    if (this.isBusy) return;
    if (!cameraApiAvailable() || (typeof window !== 'undefined' && window.isSecureContext === false)) {
      this.handlers.onFailure('unavailable');
      return;
    }
    this.starting = true;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
    } catch (error) {
      this.starting = false;
      this.handlers.onFailure(classifyCameraError(error), error);
      return;
    }
    if (!this.starting) {
      // Se pidió detener mientras esperábamos el permiso.
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    this.stream = stream;
    const { video } = this.opts;
    video.srcObject = stream;
    try {
      await video.play();
    } catch (error) {
      this.releaseStream();
      this.starting = false;
      this.handlers.onFailure('unavailable', error);
      return;
    }
    const detector = await createQrDetector();
    if (!this.starting) {
      this.releaseStream();
      return;
    }
    this.starting = false;
    this.active = true;
    this.handlers.onActive(detector !== null);

    if (detector) {
      const interval = this.opts.detectIntervalMs ?? 300;
      this.detectTimer = window.setInterval(() => void this.detectOnce(detector), interval);
    }
    const limit = this.opts.unreadableAfterMs ?? 8000;
    this.unreadableTimer = window.setTimeout(() => {
      if (!this.active) return;
      this.stop();
      this.handlers.onUnreadable();
    }, limit);
  }

  private async detectOnce(detector: BarcodeDetectorLike): Promise<void> {
    if (this.detecting || !this.active) return;
    const { video } = this.opts;
    if (video.readyState < 2) return; // HAVE_CURRENT_DATA
    this.detecting = true;
    try {
      const codes = await detector.detect(video);
      const hit = codes.find((c) => c.rawValue && c.rawValue.trim().length > 0);
      if (hit && this.active) {
        this.stop();
        this.handlers.onDetected(hit.rawValue);
      }
    } catch {
      /* fotograma no disponible todavía; se reintenta en el siguiente tick */
    } finally {
      this.detecting = false;
    }
  }

  private releaseStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    const { video } = this.opts;
    try {
      video.pause();
    } catch {
      /* ignorar */
    }
    video.srcObject = null;
  }

  stop(): void {
    const wasBusy = this.isBusy;
    this.starting = false;
    this.active = false;
    if (this.detectTimer !== undefined) window.clearInterval(this.detectTimer);
    if (this.unreadableTimer !== undefined) window.clearTimeout(this.unreadableTimer);
    this.detectTimer = undefined;
    this.unreadableTimer = undefined;
    this.releaseStream();
    if (wasBusy) this.handlers.onStopped();
  }
}
