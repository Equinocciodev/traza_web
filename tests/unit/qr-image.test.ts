import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { decodeQrFile, QrImageError, QR_IMAGE_MAX_BYTES } from '../../src/lib/verify/qr-image';
import { decodeQrPixels } from '../../src/lib/verify/qr-decoder';

vi.mock('../../src/lib/verify/qr-decoder', () => ({ decodeQrPixels: vi.fn() }));
const decode = vi.mocked(decodeQrPixels);
let size: { width: number; height: number };
let load: 'ok' | 'error' | 'pending';
let image: { src: string; onload: (() => void) | null; onerror: (() => void) | null };
let canvas: { width: number; height: number; getContext: ReturnType<typeof vi.fn> };
let context: { fillRect: ReturnType<typeof vi.fn>; drawImage: ReturnType<typeof vi.fn>; getImageData: ReturnType<typeof vi.fn> };
let revoke: Mock<(url: string) => void>;
const file = () => new Blob(['image'], { type: 'image/png' });
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

beforeEach(() => {
  vi.useFakeTimers();
  size = { width: 6000, height: 1000 };
  load = 'ok';
  class FakeImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    get naturalWidth() { return size.width; }
    get naturalHeight() { return size.height; }
    value = '';
    get src() { return this.value; }
    set src(value: string) {
      this.value = value;
      if (value) void Promise.resolve().then(() => load === 'ok' ? this.onload?.() : load === 'error' ? this.onerror?.() : undefined);
    }
    constructor() { image = this; }
  }
  vi.stubGlobal('Image', FakeImage);
  context = { fillRect: vi.fn(), drawImage: vi.fn(), getImageData: vi.fn(() => ({ width: canvas.width, height: canvas.height, data: new Uint8ClampedArray(0) })) };
  canvas = { width: 0, height: 0, getContext: vi.fn(() => context) };
  vi.stubGlobal('document', { createElement: vi.fn(() => canvas) });
  revoke = vi.fn();
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:local-qr');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(url => { revoke(url); });
  decode.mockReset().mockResolvedValue(null);
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const run = async (signal?: AbortSignal) => {
  // Attach handlers before advancing fake timers so expected errors are handled.
  const result = decodeQrFile(file(), signal).then(value => ({ value }), error => ({ error }));
  await vi.runAllTimersAsync();
  return result;
};
function expectReleased() {
  expect(image.src).toBe('');
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
  expect(revoke).toHaveBeenCalledExactlyOnceWith('blob:local-qr');
  expect(vi.getTimerCount()).toBe(0);
}

describe('local QR image lifetime and bounded native search', () => {
  it('returns the unmodified QR payload and releases the image, canvas and blob', async () => {
    decode.mockResolvedValue('https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA');
    expect(await run()).toEqual({ value: 'https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA' });
    expect(context.drawImage).toHaveBeenCalledTimes(1);
    expectReleased();
  });
  it('tries native center crops after whole-image scales fail', async () => {
    decode.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValue('unit');
    expect(await run()).toEqual({ value: 'unit' });
    const crop = context.drawImage.mock.calls[3]!;
    expect(crop).toEqual([image, 2688, 0, 1600, 1000, 0, 0, 1600, 1000]);
    expectReleased();
  });
  it('includes both edges and overlapping native crops before reporting no QR', async () => {
    expect(await run()).toMatchObject({ error: { kind: 'noQr' } });
    const crops = context.drawImage.mock.calls.filter(call => call.length === 9);
    const xs = crops.map(call => call[1] as number).sort((a, b) => a - b);
    expect(xs[0]).toBe(0);
    expect(xs.at(-1)! + 1600).toBe(6000);
    for (let i = 1; i < xs.length; i++) expect(xs[i]! - xs[i - 1]!).toBeLessThanOrEqual(1344);
    expect(crops.every(call => call[3] === 1600 && call[4] === 1000)).toBe(true);
    expectReleased();
  });
  it('does not repeat native crops when a small image already had a full resolution attempt', async () => {
    size = { width: 400, height: 300 };
    expect(await run()).toMatchObject({ error: { kind: 'noQr' } });
    expect(context.drawImage.mock.calls.every(call => call.length === 5)).toBe(true);
    expectReleased();
  });
  it('reports timeout rather than noQr when the time budget runs out', async () => {
    const now = vi.spyOn(performance, 'now').mockReturnValue(0);
    decode.mockImplementation(async () => { now.mockReturnValue(8001); return null; });
    expect(await run()).toMatchObject({ error: { kind: 'timeout' } });
    expect(decode).toHaveBeenCalledOnce();
    expectReleased();
  });
  it('bounds extreme aspect ratios to 64 native crops without allocating every position', async () => {
    size = { width: 40_000_000, height: 1 };
    vi.spyOn(performance, 'now').mockReturnValue(0);
    expect(await run()).toMatchObject({ error: { kind: 'timeout' } });
    expect(context.drawImage.mock.calls.filter(call => call.length === 9)).toHaveLength(64);
    expectReleased();
  });
  it('honors cancellation delivered during the yield between crops', async () => {
    const controller = new AbortController();
    decode.mockImplementation(async () => {
      if (decode.mock.calls.length === 4) setTimeout(() => controller.abort(), 0);
      return null;
    });
    expect(await run(controller.signal)).toMatchObject({ error: { kind: 'cancelled' } });
    expect(decode).toHaveBeenCalledTimes(4);
    expectReleased();
  });
  it('does not deliver a successful decode after cancellation while the decoder is pending', async () => {
    const controller = new AbortController();
    let resolve!: (value: string) => void;
    decode.mockReturnValue(new Promise(yes => { resolve = yes; }));
    const result = decodeQrFile(file(), controller.signal).catch(error => error);
    await settle();
    controller.abort();
    resolve('late result');
    await vi.runAllTimersAsync();
    expect(await result).toMatchObject({ kind: 'cancelled' });
    expectReleased();
  });
  it('releases resources immediately when cancelled during a stalled decoder import', async () => {
    const controller = new AbortController();
    decode.mockReturnValue(new Promise(() => {}));
    const result = decodeQrFile(file(), controller.signal).catch(error => error);
    await settle();
    controller.abort();
    expect(await result).toMatchObject({ kind: 'cancelled' });
    expectReleased();
  });
  it('times out a stalled decoder import without waiting for it to settle', async () => {
    decode.mockReturnValue(new Promise(() => {}));
    expect(await run()).toMatchObject({ error: { kind: 'timeout' } });
    expectReleased();
  });
  it('keeps independent image reads isolated when a cancelled read finishes late', async () => {
    const firstController = new AbortController();
    let resolve!: (value: string) => void;
    decode.mockReturnValueOnce(new Promise(yes => { resolve = yes; })).mockResolvedValue('new result');
    const first = decodeQrFile(file(), firstController.signal).catch(error => error);
    await settle();
    firstController.abort();
    const second = decodeQrFile(file());
    await vi.runAllTimersAsync();
    expect(await second).toBe('new result');
    resolve('old result');
    await vi.runAllTimersAsync();
    expect(await first).toMatchObject({ kind: 'cancelled' });
    expect(revoke).toHaveBeenCalledTimes(2);
  });
  it('cancels a pending image load and preserves a caller timeout reason', async () => {
    load = 'pending';
    const controller = new AbortController();
    const result = decodeQrFile(file(), controller.signal).catch(error => error);
    await settle();
    controller.abort(new QrImageError('timeout'));
    expect(await result).toMatchObject({ kind: 'timeout' });
    expect(decode).not.toHaveBeenCalled();
    expectReleased();
  });
  it('times out stalled image loading, releasing its object URL', async () => {
    load = 'pending';
    expect(await run()).toMatchObject({ error: { kind: 'timeout' } });
    expectReleased();
  });
  it('reports invalid raster data and releases resources', async () => {
    load = 'error';
    expect(await run()).toMatchObject({ error: { kind: 'invalidFile' } });
    expectReleased();
  });
  it('releases resources when canvas access or decoding throws', async () => {
    context.getImageData.mockImplementation(() => { throw new Error('canvas'); });
    expect(await run()).toMatchObject({ error: { kind: 'unavailable' } });
    expectReleased();
  });
  it('rejects photos above 40 MP before allocating image pixels to canvas', async () => {
    size = { width: 8000, height: 6000 };
    expect(await run()).toMatchObject({ error: { kind: 'tooLarge' } });
    expect(context.drawImage).not.toHaveBeenCalled();
    expectReleased();
  });
  it('rejects empty, non-image and over-10MiB files without object URLs', async () => {
    for (const blob of [new Blob(), new Blob(['text'], { type: 'text/plain' })]) {
      await expect(decodeQrFile(blob)).rejects.toMatchObject({ kind: 'invalidFile' });
    }
    await expect(decodeQrFile(new Blob([new Uint8Array(QR_IMAGE_MAX_BYTES + 1)]))).rejects.toMatchObject({ kind: 'tooLarge' });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
