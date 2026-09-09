import { afterEach, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { decodeQrFile } from '../../src/lib/verify/qr-image';

// Independent checked-in PNG; this does not import the production QR generator
// or replace jsQR. Only browser raster I/O is supplied in this Node test.
const fixture = new URL('../e2e/fixtures/qr/panorama-small-qr.png', import.meta.url);
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('decodes a real 164px QR in a 6000×1000 PNG after the global scales lose it', async () => {
  const png = await readFile(fixture);
  const { data: pixels, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect([info.width, info.height]).toEqual([6000, 1000]);
  const scaled = new Map<string, Buffer>();
  for (const width of [1600, 1000, 640]) {
    const height = Math.round(info.height * width / info.width);
    scaled.set(`${width}:${height}`, await sharp(png).resize(width, height, { kernel: 'linear' }).ensureAlpha().raw().toBuffer());
  }
  let imageSource = '';
  class RasterImage {
    naturalWidth = info.width;
    naturalHeight = info.height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(value: string) {
      imageSource = value;
      if (value) void Promise.resolve().then(() => this.onload?.());
    }
  }
  let draw: number[] = [];
  const drawImage = vi.fn((_image: unknown, ...coordinates: number[]) => { draw = coordinates; });
  const canvas = { width: 0, height: 0, getContext: () => ({
    fillRect: () => {}, drawImage,
    getImageData: () => {
      const width = canvas.width, height = canvas.height;
      let data: Uint8ClampedArray;
      if (draw.length === 4) {
        const raster = scaled.get(`${width}:${height}`);
        if (!raster) throw new Error('Unexpected global raster dimensions');
        data = new Uint8ClampedArray(raster);
      } else {
        const [x, y, sourceWidth, sourceHeight] = draw as [number, number, number, number];
        if (width !== sourceWidth || height !== sourceHeight) throw new Error('Native crop must not rescale');
        data = new Uint8ClampedArray(width * height * 4);
        for (let row = 0; row < height; row++) {
          const from = ((y + row) * info.width + x) * 4;
          data.set(pixels.subarray(from, from + width * 4), row * width * 4);
        }
      }
      return { width, height, data } as ImageData;
    },
  }) };
  vi.stubGlobal('Image', RasterImage);
  vi.stubGlobal('document', { createElement: () => canvas });
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:panorama-fixture');
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const payload = await decodeQrFile(new Blob([new Uint8Array(png)], { type: 'image/png' }));
  expect(payload).toBe('https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA');
  // Real decoding returned null for all three global rasters, then succeeded
  // from the first center crop. This is the original loss-of-resolution case.
  expect(drawImage.mock.calls).toHaveLength(4);
  expect(drawImage.mock.calls.slice(0, 3).every(call => call.length === 5)).toBe(true);
  expect(drawImage.mock.calls[3]).toHaveLength(9);
  expect(imageSource).toBe('');
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
  expect(revoke).toHaveBeenCalledExactlyOnceWith('blob:panorama-fixture');
}, 15000);
