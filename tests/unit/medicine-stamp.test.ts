import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { STAMP } from '../../src/content/stamp';
import { UNIT_BY_CODE, FEATURED_UNIT_CODE } from '../../src/fixtures/units';
import { EXAMPLE_UNIT_ID, UNIT_QR_PATH, UNIT_QR_SIZE, UNIT_QR_URL, STAMP_PRINT_BARCODE } from '../../src/brand/unit-qr';
import { HERO_QR_URL } from '../../src/brand/hero-qr';
import { decodeQrPixels } from '../../src/lib/verify/qr-decoder';
import { WORDMARK } from '../../src/brand/wordmark.mjs';

function qrRaster(scale: number): ImageData {
  const width = UNIT_QR_SIZE * scale;
  const data = new Uint8ClampedArray(width * width * 4).fill(255);
  for (const module of UNIT_QR_PATH.matchAll(/M(\d+) (\d+)h1v1h-1z/g)) {
    for (let y = +module[2]! * scale; y < (+module[2]! + 1) * scale; y++) {
      for (let x = +module[1]! * scale; x < (+module[1]! + 1) * scale; x++) {
        const pixel = (y * width + x) * 4;
        data[pixel] = data[pixel + 1] = data[pixel + 2] = 0;
      }
    }
  }
  return { width, height: width, data } as ImageData;
}

describe('medicine stamp: reference fields, data and public lookup', () => {
  it.each(['es', 'en'] as const)('retains all twelve concepts in %s and derives unit data from its fixture', locale => {
    const c = STAMP[locale], unit = UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!;
    expect(c.features).toHaveLength(12);
    expect(Object.keys(c.labels)).toEqual(['qr', 'identifier', 'territory', 'domain', 'sequence', 'barcode', 'volume', 'product', 'medicine', 'responsible', 'issuedAt', 'batch']);
    expect(c.serial).toBe(unit.code);
    expect(c.product).toBe(unit.product.name);
    expect(c.manufacturer).toBe(unit.issuer.name);
    expect(c.registration).toBe(unit.product.healthRegistration);
    expect(c.batch).toBe(unit.origin.lot);
    expect(unit.product.presentation).toContain(c.volume);
    expect(c.concentration).toBe(locale === 'es' ? 'No indicada' : 'Not stated');
    expect(c.issuedAt).toBe(unit.signature.issuedAt.slice(0, 10));
    expect(c.sequence).toBe(STAMP_PRINT_BARCODE.value);
    expect(c.sequence).not.toBe(c.serial);
    expect(c.domain).toBe(new URL(UNIT_QR_URL).hostname);
  });
  it('keeps every displayed field independently numbered once, including the lot', () => {
    const template = readFileSync(new URL('../../src/components/ui/MedicineStamp.astro', import.meta.url), 'utf8');
    const fields = [...template.matchAll(/data-stamp-field="(\d+)"/g)].map(match => Number(match[1])).sort((a,b) => a-b);
    expect(fields).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(template).not.toContain('c.closure');
  });
  it('keeps the territory conditional and sequence explicitly an example in both languages', () => {
    expect(STAMP.es.territory).toBe('Por definir en cada implementación');
    expect(STAMP.en.territory).toBe('Defined for each implementation');
    expect(STAMP.es.sequenceNote).toMatch(/ejemplo/);
    expect(STAMP.en.sequenceNote).toMatch(/Example/);
    expect(STAMP.en.concentration).not.toMatch(/EJEMPLO/);
  });
  it('uses the same public URL as the hero and the same ID as the displayed record', () => {
    expect(EXAMPLE_UNIT_ID).toBe(FEATURED_UNIT_CODE);
    expect(UNIT_QR_URL).toBe(HERO_QR_URL);
    expect(new URL(UNIT_QR_URL).searchParams.get('c')).toBe(STAMP.es.serial);
    expect(new URL(UNIT_QR_URL).searchParams.get('t')).toBe(UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!.tenant);
    expect(new URL(UNIT_QR_URL).protocol).toBe('https:');
  });
  it('matches the downloadable PNG payload, including the medicines-pilot context', async () => {
    const { default: sharp } = await import('sharp');
    const png = readFileSync(new URL('../../public/images/qr/ejemplo-traza.png', import.meta.url));
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(await decodeQrPixels({ width: info.width, height: info.height, data: new Uint8ClampedArray(data) } as ImageData)).toBe(UNIT_QR_URL);
  });
  it.each([3, 4])('decodes the public URL at %s pixels per QR module with a real decoder', async scale => {
    expect(await decodeQrPixels(qrRaster(scale))).toBe(UNIT_QR_URL);
  });
  it('preserves at least four quiet modules around every QR edge', () => {
    const modules = [...UNIT_QR_PATH.matchAll(/M(\d+) (\d+)h1v1h-1z/g)];
    for (const [, x, y] of modules) {
      expect(Number(x)).toBeGreaterThanOrEqual(4);
      expect(Number(y)).toBeGreaterThanOrEqual(4);
      expect(Number(x)).toBeLessThan(UNIT_QR_SIZE - 4);
      expect(Number(y)).toBeLessThan(UNIT_QR_SIZE - 4);
    }
  });
  it('keeps ten quiet modules on both sides of the generated Code 128', () => {
    const bars = [...STAMP_PRINT_BARCODE.path.matchAll(/M(\d+) 0h(\d+)v/g)];
    expect(bars.length).toBeGreaterThan(0);
    expect(Number(bars[0]![1])).toBeGreaterThanOrEqual(10);
    const last = bars.at(-1)!;
    expect(STAMP_PRINT_BARCODE.width - Number(last[1]) - Number(last[2])).toBeGreaterThanOrEqual(10);
  });
  it('aligns the underline beneath za using the five contours of source reference 16', () => {
    expect(WORDMARK.paths).toHaveLength(5);
    expect(WORDMARK.underline.x).toBeCloseTo((660 - 190) * 289 / 880, 1);
    expect(WORDMARK.underline.x + WORDMARK.underline.width).toBeCloseTo((1012 - 190) * 289 / 880, 1);
  });
});
