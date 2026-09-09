import { describe, expect, it } from 'vitest';
import { decodeQrPixels } from '../../src/lib/verify/qr-decoder';
import { HERO_QR_PATH, HERO_QR_SIZE, HERO_QR_URL } from '../../src/brand/hero-qr';
import rawUnitQr from './fixtures/raw-unit-qr.json';

/** Rasterize fixed, previously ZXing-verified QR artwork. The decoder is not mocked. */
function raster(path: string, size: number, scale = 4): ImageData {
  const width = size * scale;
  const data = new Uint8ClampedArray(width * width * 4).fill(255);
  for (const match of path.matchAll(/M(\d+) (\d+)h1v1h-1z/g)) {
    for (let y = Number(match[2]) * scale; y < (Number(match[2]) + 1) * scale; y++) {
      for (let x = Number(match[1]) * scale; x < (Number(match[1]) + 1) * scale; x++) {
        const i = (y * width + x) * 4;
        data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
      }
    }
  }
  return { width, height: width, data } as ImageData;
}
function rotate(image: ImageData): ImageData {
  const { width, height, data } = image;
  const rotated = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const source = (y * width + x) * 4;
    const target = (x * height + height - y - 1) * 4;
    rotated.set(data.subarray(source, source + 4), target);
  }
  return { width: height, height: width, data: rotated } as ImageData;
}

describe('software QR pixel decoder', () => {
  it('returns the exact HTTPS lookup URL, not just its extracted identifier', async () => {
    const decoded = await decodeQrPixels(raster(HERO_QR_PATH, HERO_QR_SIZE));
    expect(decoded).toBe(HERO_QR_URL);
    expect(new URL(decoded!).searchParams.get('t')).toBe('medicamentos');
  });
  it('also returns the raw ID when that is what the QR encodes', async () => {
    expect(await decodeQrPixels(raster(rawUnitQr.path, rawUnitQr.size))).toBe(rawUnitQr.payload);
  });
  it.each([1, 2, 3])('reads a QR rotated %s quarter-turns', async (turns) => {
    let image = raster(HERO_QR_PATH, HERO_QR_SIZE);
    for (let i = 0; i < turns; i++) image = rotate(image);
    expect(await decodeQrPixels(image)).toBe(HERO_QR_URL);
  });
  it('reads an inverted light-on-dark QR', async () => {
    const image = raster(HERO_QR_PATH, HERO_QR_SIZE);
    for (let i = 0; i < image.data.length; i++) if (i % 4 !== 3) image.data[i] = 255 - image.data[i]!;
    expect(await decodeQrPixels(image)).toBe(HERO_QR_URL);
  });
  it('composites a transparent PNG over white without mutating the input', async () => {
    const image = raster(HERO_QR_PATH, HERO_QR_SIZE);
    for (let i = 0; i < image.data.length; i += 4) if (image.data[i] === 255) image.data.fill(0, i, i + 4);
    const before = image.data.slice();
    expect(await decodeQrPixels(image)).toBe(HERO_QR_URL);
    expect(image.data).toEqual(before);
  });
  it('finds a QR off center inside a wider image', async () => {
    const qr = raster(HERO_QR_PATH, HERO_QR_SIZE);
    const width = 480; const height = 300;
    const data = new Uint8ClampedArray(width * height * 4).fill(255);
    for (let y = 0; y < qr.height; y++) data.set(qr.data.subarray(y * qr.width * 4, (y + 1) * qr.width * 4), ((y + 39) * width + 217) * 4);
    expect(await decodeQrPixels({ width, height, data } as ImageData)).toBe(HERO_QR_URL);
  });
  it('returns null for an image with no QR', async () => {
    expect(await decodeQrPixels({ width: 100, height: 100, data: new Uint8ClampedArray(40000).fill(255) } as ImageData)).toBe(null);
  });
  it.each([
    { width: 0, height: 0, data: new Uint8ClampedArray() },
    { width: 2, height: 2, data: new Uint8ClampedArray(8) },
    { width: 2.5, height: 2, data: new Uint8ClampedArray(20) },
    { width: Number.POSITIVE_INFINITY, height: 2, data: new Uint8ClampedArray() },
  ])('rejects inconsistent image dimensions without attempting a scan', async (image) => {
    expect(await decodeQrPixels(image as ImageData)).toBe(null);
  });
});
