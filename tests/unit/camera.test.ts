import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CameraController, cameraApiAvailable, classifyCameraError, type CameraHandlers } from '../../src/lib/verify/camera';
import { decodeQrPixels } from '../../src/lib/verify/qr-decoder';

vi.mock('../../src/lib/verify/qr-decoder', () => ({ decodeQrPixels: vi.fn() }));
const decode = vi.mocked(decodeQrPixels);
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const error = (name: string) => Object.assign(new Error(name), { name });
function makeStream() {
  const tracks = [0, 1].map(() => ({ stop: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  return { stream: { getTracks: () => tracks } as unknown as MediaStream, tracks };
}
let getUserMedia: ReturnType<typeof vi.fn>;
let video: HTMLVideoElement;
let handlers: CameraHandlers;
let context: { drawImage: ReturnType<typeof vi.fn>; getImageData: ReturnType<typeof vi.fn> };
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function nativeDetector(detect: ReturnType<typeof vi.fn>, formats = Promise.resolve(['qr_code'])) {
  class Detector {
    static getSupportedFormats = vi.fn(() => formats);
    detect = detect;
  }
  vi.stubGlobal('BarcodeDetector', Detector);
  return Detector;
}

beforeEach(() => {
  vi.useFakeTimers();
  getUserMedia = vi.fn();
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
  vi.stubGlobal('window', { isSecureContext: true });
  vi.stubGlobal('BarcodeDetector', undefined);
  video = { srcObject: null, readyState: 2, videoWidth: 640, videoHeight: 480, play: vi.fn().mockResolvedValue(undefined), pause: vi.fn() } as unknown as HTMLVideoElement;
  handlers = { onActive: vi.fn(), onDetected: vi.fn(), onFailure: vi.fn(), onUnreadable: vi.fn(), onStopped: vi.fn() };
  context = { drawImage: vi.fn(), getImageData: vi.fn(() => ({ width: 2, height: 2, data: new Uint8ClampedArray(16) })) };
  vi.stubGlobal('document', { createElement: vi.fn(() => ({ width: 0, height: 0, getContext: () => context })) });
  decode.mockReset().mockResolvedValue(null);
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

function controller(unreadableAfterMs = 5000) { return new CameraController({ video, detectIntervalMs: 300, unreadableAfterMs }, handlers); }

describe('camera access and lifetime', () => {
  it.each(['NotAllowedError', 'PermissionDeniedError', 'SecurityError'])('classifies %s as denied', (name) => expect(classifyCameraError(error(name))).toBe('denied'));
  it.each(['NotFoundError', 'OverconstrainedError', 'NotReadableError', 'AbortError'])('classifies %s as unavailable', (name) => expect(classifyCameraError(error(name))).toBe('unavailable'));
  it('does not request media when the API is absent or the context is insecure', async () => {
    vi.stubGlobal('navigator', {});
    expect(cameraApiAvailable()).toBe(false);
    await controller().start();
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    vi.stubGlobal('window', { isSecureContext: false });
    await controller().start();
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(handlers.onFailure).toHaveBeenCalledTimes(2);
  });
  it('does not retry denied permission or fire stopped before a stream exists', async () => {
    getUserMedia.mockRejectedValue(error('NotAllowedError'));
    const camera = controller();
    await camera.start();
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    expect(handlers.onFailure).toHaveBeenCalledWith('denied', expect.any(Error));
    expect(handlers.onStopped).not.toHaveBeenCalled();
    expect(camera.isBusy).toBe(false);
  });
  it('retries overconstrained cameras with generic video and no audio', async () => {
    const media = makeStream();
    getUserMedia.mockRejectedValueOnce(error('OverconstrainedError')).mockResolvedValueOnce(media.stream);
    const camera = controller(); await camera.start();
    expect(getUserMedia).toHaveBeenLastCalledWith({ video: true, audio: false });
    expect(video.srcObject).toBe(media.stream);
    expect(handlers.onActive).toHaveBeenCalledWith(true);
    camera.stop();
    expect(media.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true);
  });
  it('ignores duplicate starts and makes repeated stop idempotent', async () => {
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream);
    const camera = controller(); await Promise.all([camera.start(), camera.start()]);
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    camera.stop(); camera.stop();
    expect(handlers.onStopped).toHaveBeenCalledTimes(1);
    expect(video.srcObject).toBe(null);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('releases every track if playback rejects', async () => {
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream);
    vi.mocked(video.play).mockRejectedValue(error('NotSupportedError'));
    const camera = controller(); await camera.start();
    expect(handlers.onActive).not.toHaveBeenCalled();
    expect(handlers.onFailure).toHaveBeenCalledWith('unavailable', expect.any(Error));
    expect(media.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true);
    expect(video.srcObject).toBe(null);
    expect(camera.isBusy).toBe(false);
  });
  it('releases acquired tracks when playback never becomes ready', async () => {
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream);
    vi.mocked(video.play).mockImplementation(() => new Promise(() => {}));
    const camera = controller(); const start = camera.start();
    await settle(); await vi.advanceTimersByTimeAsync(5000); await start;
    expect(handlers.onFailure).toHaveBeenCalledWith('unavailable', expect.any(Error));
    expect(handlers.onActive).not.toHaveBeenCalled(); expect(video.srcObject).toBe(null);
    expect(media.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true); expect(vi.getTimerCount()).toBe(0);
  });
  it('keeps releasing tracks if an individual track.stop throws', async () => {
    const media = makeStream(); media.tracks[0]!.stop.mockImplementation(() => { throw Error('driver'); });
    getUserMedia.mockResolvedValue(media.stream); const camera = controller(); await camera.start(); camera.stop();
    expect(media.tracks[1]!.stop).toHaveBeenCalledOnce(); expect(video.srcObject).toBe(null);
  });
  it('reports camera loss and clears all resources when a live track ends', async () => {
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream); const camera = controller(); await camera.start();
    const ended = media.tracks[0]!.addEventListener.mock.calls[0]![1] as () => void;
    ended();
    expect(handlers.onFailure).toHaveBeenCalledWith('unavailable');
    expect(handlers.onStopped).toHaveBeenCalledOnce(); expect(camera.isBusy).toBe(false);
    expect(media.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true);
  });
});

describe('stale permission, playback and detection races', () => {
  it('releases an old permission result without detaching the new active stream', async () => {
    const pending = deferred<MediaStream>(); const old = makeStream(); const fresh = makeStream();
    getUserMedia.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(fresh.stream);
    const camera = controller(); const first = camera.start(); camera.stop(); await camera.start();
    pending.resolve(old.stream); await first;
    expect(old.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true);
    expect(fresh.tracks.every(t => t.stop.mock.calls.length === 0)).toBe(true);
    expect(video.srcObject).toBe(fresh.stream); expect(camera.isActive).toBe(true);
    expect(handlers.onActive).toHaveBeenCalledTimes(1);
    camera.stop();
  });
  it.each(['NotAllowedError', 'OverconstrainedError'])('suppresses an obsolete %s and never retries its constraints', async (name) => {
    const pending = deferred<MediaStream>(); const fresh = makeStream();
    getUserMedia.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(fresh.stream);
    const camera = controller(); const first = camera.start(); camera.stop(); await camera.start();
    pending.reject(error(name)); await first;
    expect(handlers.onFailure).not.toHaveBeenCalled(); expect(getUserMedia).toHaveBeenCalledTimes(2);
    expect(camera.isActive).toBe(true); camera.stop();
  });
  it.each([false, true])('old play completion/rejection (%s) cannot stop a newer playback', async (reject) => {
    const pending = deferred<void>(); const old = makeStream(); const fresh = makeStream();
    getUserMedia.mockResolvedValueOnce(old.stream).mockResolvedValueOnce(fresh.stream);
    vi.mocked(video.play).mockReturnValueOnce(pending.promise).mockResolvedValueOnce(undefined);
    const camera = controller(); const first = camera.start(); await settle(); camera.stop(); await camera.start();
    if (reject) pending.reject(error('AbortError')); else pending.resolve(); await first;
    expect(video.srcObject).toBe(fresh.stream); expect(camera.isActive).toBe(true);
    expect(fresh.tracks.every(t => t.stop.mock.calls.length === 0)).toBe(true);
    expect(handlers.onFailure).not.toHaveBeenCalled(); camera.stop();
  });
  it('a stale software QR result cannot overwrite a new camera session', async () => {
    const pending = deferred<string | null>(); const old = makeStream(); const fresh = makeStream();
    getUserMedia.mockResolvedValueOnce(old.stream).mockResolvedValueOnce(fresh.stream);
    decode.mockReturnValueOnce(pending.promise).mockResolvedValueOnce('NEW');
    const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    camera.stop(); await camera.start(); pending.resolve('OLD'); await settle();
    expect(handlers.onDetected).not.toHaveBeenCalled(); expect(video.srcObject).toBe(fresh.stream);
    await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith('NEW');
  });
  it('a stale native detection cannot publish a result or release the new stream', async () => {
    const pending = deferred<{ rawValue: string; format: string }[]>(); const old = makeStream(); const fresh = makeStream();
    nativeDetector(vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce([{ rawValue: 'NEW', format: 'qr_code' }]));
    getUserMedia.mockResolvedValueOnce(old.stream).mockResolvedValueOnce(fresh.stream);
    const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    camera.stop(); await camera.start(); pending.resolve([{ rawValue: 'OLD', format: 'qr_code' }]); await settle();
    expect(handlers.onDetected).not.toHaveBeenCalled(); expect(video.srcObject).toBe(fresh.stream);
    await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith('NEW');
  });
  it('stopping from onActive clears timers before scanning can begin', async () => {
    getUserMedia.mockResolvedValue(makeStream().stream); const camera = controller();
    handlers.onActive = () => camera.stop(); await camera.start(); await vi.advanceTimersByTimeAsync(10000);
    expect(decode).not.toHaveBeenCalled(); expect(handlers.onUnreadable).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });
  it('onStopped can start a new session without an old result firing afterwards', async () => {
    getUserMedia.mockImplementation(async () => makeStream().stream);
    decode.mockResolvedValue('OLD'); const camera = controller();
    handlers.onStopped = vi.fn(() => { void camera.start(); });
    await camera.start(); await vi.advanceTimersByTimeAsync(300);
    expect(camera.isActive).toBe(true); expect(handlers.onDetected).not.toHaveBeenCalled();
    handlers.onStopped = vi.fn(); camera.stop();
  });
});

describe('native and software QR reading', () => {
  it('detects raw URL text through software when BarcodeDetector is absent', async () => {
    const url = 'https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA';
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream); decode.mockResolvedValue(url);
    const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith(url);
    expect(video.srcObject).toBe(null); expect(camera.isBusy).toBe(false); expect(vi.getTimerCount()).toBe(0);
    expect(media.tracks.every(t => t.stop.mock.calls.length === 1)).toBe(true);
  });
  it('uses a valid native QR result without calling the software reader', async () => {
    const detect = vi.fn().mockResolvedValue([{ rawValue: 'QR', format: 'qr_code' }]); nativeDetector(detect);
    getUserMedia.mockResolvedValue(makeStream().stream); const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith('QR'); expect(decode).not.toHaveBeenCalled();
  });
  it.each(['throws', 'empty', 'other-format'])('falls back when the native reader %s', async (kind) => {
    const detect = kind === 'throws' ? vi.fn().mockRejectedValue(Error('native failure')) : vi.fn().mockResolvedValue(kind === 'empty' ? [] : [{ rawValue: 'not QR', format: 'ean_13' }]);
    nativeDetector(detect); decode.mockResolvedValue('SOFTWARE'); getUserMedia.mockResolvedValue(makeStream().stream);
    const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith('SOFTWARE');
  });
  it('falls back from an indefinitely pending native detection after 600 ms', async () => {
    nativeDetector(vi.fn(() => new Promise(() => {}))); decode.mockResolvedValue('FALLBACK');
    getUserMedia.mockResolvedValue(makeStream().stream); const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(900);
    expect(handlers.onDetected).toHaveBeenCalledExactlyOnceWith('FALLBACK'); expect(vi.getTimerCount()).toBe(0);
  });
  it('does not let a pending supported-formats query delay software scanning', async () => {
    nativeDetector(vi.fn(), new Promise(() => {})); decode.mockResolvedValue('SOFTWARE');
    getUserMedia.mockResolvedValue(makeStream().stream); const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onActive).toHaveBeenCalledWith(true); expect(handlers.onDetected).toHaveBeenCalledWith('SOFTWARE');
  });
  it('does not overlap slow software decodes and retries a rejected frame', async () => {
    const pending = deferred<string | null>(); decode.mockReturnValueOnce(pending.promise).mockResolvedValueOnce('OK');
    getUserMedia.mockResolvedValue(makeStream().stream); const camera = controller(); await camera.start(); await vi.advanceTimersByTimeAsync(900);
    expect(decode).toHaveBeenCalledTimes(1); pending.reject(Error('frame error')); await settle(); await vi.advanceTimersByTimeAsync(300);
    expect(handlers.onDetected).toHaveBeenCalledWith('OK');
  });
  it('skips frames without current video data and stops on the unreadable deadline', async () => {
    const media = makeStream(); getUserMedia.mockResolvedValue(media.stream); Object.defineProperty(video, 'readyState', { value: 1 });
    const camera = controller(1000); await camera.start(); await vi.advanceTimersByTimeAsync(1000);
    expect(decode).not.toHaveBeenCalled(); expect(handlers.onUnreadable).toHaveBeenCalledOnce();
    expect(handlers.onStopped).toHaveBeenCalledOnce(); expect(video.srcObject).toBe(null); expect(vi.getTimerCount()).toBe(0);
  });
  it('retries transient canvas errors without leaking the camera or claiming success', async () => {
    getUserMedia.mockResolvedValue(makeStream().stream); context.getImageData.mockImplementationOnce(() => { throw Error('unavailable frame'); });
    const camera = controller(700); await camera.start(); await vi.advanceTimersByTimeAsync(700);
    expect(handlers.onDetected).not.toHaveBeenCalled(); expect(handlers.onUnreadable).toHaveBeenCalledOnce(); expect(video.srcObject).toBe(null);
  });
});
