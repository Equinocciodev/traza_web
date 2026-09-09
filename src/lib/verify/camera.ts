/** Camera sessions and QR decoding stay entirely on the visitor's device. */
import { decodeQrPixels } from './qr-decoder';

export type CameraFailure = 'denied' | 'unavailable';

export interface CameraHandlers {
  /** Camera playback is active. Automatic decoding includes the software fallback. */
  onActive(hasDetector: boolean): void;
  /** Raw QR text; tracks have already been released. */
  onDetected(rawValue: string): void;
  onFailure(kind: CameraFailure, error?: unknown): void;
  onUnreadable(): void;
  onStopped(): void;
}

export interface CameraOptions {
  video: HTMLVideoElement;
  detectIntervalMs?: number;
  unreadableAfterMs?: number;
}

interface DetectedBarcode { rawValue: string; format?: string }
interface BarcodeDetectorLike { detect(source: HTMLVideoElement): Promise<DetectedBarcode[]> }
interface BarcodeDetectorCtor {
  new (options?: { formats: string[] }): BarcodeDetectorLike;
  getSupportedFormats?(): Promise<string[]>;
}
interface CameraSession {
  version: number;
  cancelNative?: () => void;
  cancelPlayback?: () => void;
  detachTracks?: () => void;
  stream: MediaStream | null;
  active: boolean;
  detecting: boolean;
  detector: BarcodeDetectorLike | null;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  detectTimer?: ReturnType<typeof setInterval>;
  unreadableTimer?: ReturnType<typeof setTimeout>;
}

const DENIED_ERRORS = new Set(['NotAllowedError', 'PermissionDeniedError', 'SecurityError']);
const CONSTRAINT_ERRORS = new Set(['OverconstrainedError', 'ConstraintNotSatisfiedError']);
const errorName = (error: unknown): string => typeof error === 'object' && error !== null && 'name' in error ? String(error.name) : '';

export function classifyCameraError(error: unknown): CameraFailure {
  return DENIED_ERRORS.has(errorName(error)) ? 'denied' : 'unavailable';
}

export function cameraApiAvailable(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function';
}

async function createQrDetector(): Promise<BarcodeDetectorLike | null> {
  const ctor = (globalThis as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
  if (!ctor) return null;
  try {
    const formats = typeof ctor.getSupportedFormats === 'function' ? await ctor.getSupportedFormats() : ['qr_code'];
    return formats.includes('qr_code') ? new ctor({ formats: ['qr_code'] }) : null;
  } catch {
    return null;
  }
}

export class CameraController {
  private current: CameraSession | null = null;
  private version = 0;
  private released = new WeakSet<MediaStream>();

  constructor(private readonly opts: CameraOptions, private readonly handlers: CameraHandlers) {}

  get isActive(): boolean { return this.current?.active === true; }
  get isBusy(): boolean { return this.current !== null; }

  async start(): Promise<void> {
    if (this.isBusy) return;
    if (!cameraApiAvailable() || (typeof window !== 'undefined' && window.isSecureContext === false)) {
      this.handlers.onFailure('unavailable');
      return;
    }
    const session: CameraSession = { version: ++this.version, stream: null, active: false, detecting: false, detector: null, canvas: null, context: null };
    this.current = session;
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
        });
      } catch (error) {
        // Retry only a constraint mismatch, never a denied permission or a cancelled session.
        if (this.current !== session || !CONSTRAINT_ERRORS.has(errorName(error))) throw error;
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      if (this.current !== session) {
        this.releaseStream(stream);
        return;
      }
      session.stream = stream;
      const ended = () => {
        if (this.current !== session) return;
        this.finish(session);
        if (this.version === session.version && !this.current) this.handlers.onFailure('unavailable');
      };
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.addEventListener?.('ended', ended));
      session.detachTracks = () => tracks.forEach((track) => track.removeEventListener?.('ended', ended));
      const { video } = this.opts;
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await this.playVideo(session);
      if (this.current !== session) {
        this.releaseStream(stream);
        return;
      }
      session.active = true;
      // A slow/broken native capability query must not delay software scanning or playback.
      void createQrDetector().then((detector) => {
        if (this.current === session) session.detector = detector;
      });
      const interval = this.positiveDuration(this.opts.detectIntervalMs, 300);
      const limit = this.positiveDuration(this.opts.unreadableAfterMs, 8000);
      session.detectTimer = setInterval(() => void this.detectOnce(session), interval);
      session.unreadableTimer = setTimeout(() => {
        if (this.current !== session) return;
        this.finish(session);
        // onStopped may synchronously start another session; never overwrite it with an old error.
        if (this.version === session.version && !this.current) this.handlers.onUnreadable();
      }, limit);
      this.handlers.onActive(true);
    } catch (error) {
      if (this.current !== session) {
        if (session.stream) this.releaseStream(session.stream);
        return;
      }
      this.finish(session, false);
      this.handlers.onFailure(classifyCameraError(error), error);
    }
  }

  private playVideo(session: CameraSession): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const complete = (error?: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        session.cancelPlayback = undefined;
        if (error) reject(error); else resolve();
      };
      const timer = setTimeout(() => complete(new Error('Camera playback did not become ready')), 5000);
      session.cancelPlayback = () => complete();
      try { void this.opts.video.play().then(() => complete(), complete); } catch (error) { complete(error); }
    });
  }

  private positiveDuration(value: number | undefined, fallback: number): number {
    return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
  }

  private async detectOnce(session: CameraSession): Promise<void> {
    if (this.current !== session || !session.active || session.detecting || this.opts.video.readyState < 2) return;
    session.detecting = true;
    try {
      let rawValue: string | null = null;
      if (session.detector) {
        try {
          const codes = await this.detectNative(session);
          rawValue = codes.find((code) => (!code.format || code.format === 'qr_code') && code.rawValue?.trim())?.rawValue ?? null;
        } catch {
          session.detector = null;
        }
      }
      if (this.current !== session) return;
      if (!rawValue) {
        const pixels = this.readFrame(session);
        if (pixels) rawValue = await decodeQrPixels(pixels);
      }
      if (rawValue && this.current === session) {
        this.finish(session);
        if (this.version === session.version && !this.current) this.handlers.onDetected(rawValue);
      }
    } catch {
      // Missing frames, transient canvas errors or an unavailable decoder chunk can be retried.
      // The session timeout remains active and releases the camera if no QR can be read.
    } finally {
      session.detecting = false;
    }
  }

  private detectNative(session: CameraSession): Promise<DetectedBarcode[]> {
    const detector = session.detector!;
    return new Promise((resolve) => {
      let settled = false;
      const complete = (codes: DetectedBarcode[], failed = false) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        session.cancelNative = undefined;
        if (failed) session.detector = null;
        resolve(codes);
      };
      const timer = setTimeout(() => complete([], true), 600);
      session.cancelNative = () => complete([]);
      // Both a synchronous implementation error and a hanging detection reach software fallback.
      void Promise.resolve().then(() => detector.detect(this.opts.video)).then((codes) => complete(codes), () => complete([], true));
    });
  }

  private readFrame(session: CameraSession): ImageData | null {
    const { video } = this.opts;
    if (!video.videoWidth || !video.videoHeight || typeof document === 'undefined') return null;
    if (!session.canvas) {
      session.canvas = document.createElement('canvas');
      session.context = session.canvas.getContext('2d', { willReadFrequently: true });
    }
    if (!session.context) return null;
    const scale = Math.min(1, 1920 / Math.max(video.videoWidth, video.videoHeight));
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    if (session.canvas.width !== width) session.canvas.width = width;
    if (session.canvas.height !== height) session.canvas.height = height;
    session.context.drawImage(video, 0, 0, width, height);
    return session.context.getImageData(0, 0, width, height);
  }

  private releaseStream(stream: MediaStream): void {
    if (!this.released.has(stream)) {
      this.released.add(stream);
      for (const track of stream.getTracks()) {
        try { track.stop(); } catch { /* Attempt every track even if one device driver fails. */ }
      }
    }
    const { video } = this.opts;
    if (video.srcObject === stream) {
      try { video.pause(); } catch { /* Some browsers reject pause before playback. */ }
      video.srcObject = null;
    }
  }

  private finish(session: CameraSession, notify = true): void {
    if (this.current !== session) return;
    this.current = null;
    session.active = false;
    session.cancelNative?.();
    session.cancelPlayback?.();
    session.detachTracks?.();
    if (session.detectTimer !== undefined) clearInterval(session.detectTimer);
    if (session.unreadableTimer !== undefined) clearTimeout(session.unreadableTimer);
    if (session.stream) this.releaseStream(session.stream);
    session.canvas = null;
    session.context = null;
    if (notify) this.handlers.onStopped();
  }

  stop(): void {
    if (this.current) this.finish(this.current);
  }
}
