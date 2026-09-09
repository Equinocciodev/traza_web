#!/usr/bin/env node
/**
 * Exporta la composición OG integral y los iconos de identidad:
 *   - public/og/default.png (1200×630): fondo azul marino, wordmark "traza®" con subrayado cian,
 *     composición médica ImageGen completa, sin capas añadidas.
 *     Sin texto ni emblemas de agencias.
 *   - public/apple-touch-icon.png (180×180): desde public/favicon.svg, aplanado sobre azul marino.
 *   - public/icon-192.png, icon-512.png y icon-512-maskable.png: iconos del manifiesto (PWA/Android).
 *     El maskable deja el 20 % de margen que exige la máscara de Android.
 *
 * Usa sharp únicamente para convertir y redimensionar la composición OG completa.
 * Los iconos de aplicación derivan de la referencia original 16, conservada intacta.
 *
 * Uso: node scripts/og-image.mjs
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_OG = path.join(ROOT, 'public', 'og', 'default.png');
const OUT_APPLE = path.join(ROOT, 'public', 'apple-touch-icon.png');
const OUT_32 = path.join(ROOT, 'public', 'favicon-32.png');
const OUT_192 = path.join(ROOT, 'public', 'icon-192.png');
const OUT_512 = path.join(ROOT, 'public', 'icon-512.png');
const OUT_MASKABLE = path.join(ROOT, 'public', 'icon-512-maskable.png');
const FAVICON = path.join(ROOT, 'public', 'favicon.svg');

const NAVY_900 = '#0b1f3f';
const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  const { default: sharp } = await import('sharp');

  await mkdir(path.dirname(OUT_OG), { recursive: true });
  // Complete ImageGen composition; only resize/encode, never add logo, QR or line overlays.
  await sharp(path.join(ROOT, 'public/images/integral-20260909/og.webp'))
    .resize(WIDTH, HEIGHT, { fit: 'contain', background: '#07152b' })
    .png({ compressionLevel: 9 }).toFile(OUT_OG);

  // The app icon embeds the unmodified original raster supplied by Juan (reference 16).
  const original = await readFile(path.join(ROOT, 'public/images/brand/traza-orbit-original.jpg'));
  const favicon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254" width="1254" height="1254"><image width="1254" height="1254" href="data:image/jpeg;base64,${original.toString('base64')}"/></svg>`);
  await writeFile(FAVICON, favicon);
  await sharp(favicon, { density: 600 })
    .resize(180, 180, { fit: 'contain', background: NAVY_900 })
    .flatten({ background: NAVY_900 })
    .png({ compressionLevel: 9 })
    .toFile(OUT_APPLE);

  for (const [file, size] of [[OUT_32, 32], [OUT_192, 192], [OUT_512, 512]]) {
    await sharp(favicon, { density: 600 })
      .resize(size, size, { fit: 'contain', background: NAVY_900 })
      .flatten({ background: NAVY_900 })
      .png({ compressionLevel: 9 })
      .toFile(file);
  }

  // Maskable: el glifo ocupa el 60 % central para sobrevivir al recorte circular de Android.
  const pad = Math.round(512 * 0.2);
  const inner = 512 - pad * 2;
  await sharp(favicon, { density: 600 })
    .resize(inner, inner, { fit: 'contain', background: NAVY_900 })
    .flatten({ background: NAVY_900 })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: NAVY_900 })
    .png({ compressionLevel: 9 })
    .toFile(OUT_MASKABLE);

  for (const file of [OUT_OG, OUT_APPLE, OUT_32, OUT_192, OUT_512, OUT_MASKABLE]) {
    const info = await sharp(file).metadata();
    const size = (await stat(file)).size;
    console.log(`${path.relative(ROOT, file)} → ${info.width}×${info.height} ${info.format} (${(size / 1024).toFixed(1)} KB)`);
  }
}

main().catch((error) => {
  console.error('[og-image] Error:', error);
  process.exitCode = 1;
});
