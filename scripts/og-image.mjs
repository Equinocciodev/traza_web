#!/usr/bin/env node
/**
 * Genera los recursos raster de marca a partir de SVG:
 *   - public/og/default.png (1200×630): fondo azul marino, wordmark "traza®" con subrayado cian,
 *     tagline "Identidad digital para productos reales", QR público real y neón del asset de marca.
 *     Sin texto ni emblemas de agencias.
 *   - public/apple-touch-icon.png (180×180): desde public/favicon.svg, aplanado sobre azul marino.
 *   - public/icon-192.png, icon-512.png y icon-512-maskable.png: iconos del manifiesto (PWA/Android).
 *     El maskable deja el 20 % de margen que exige la máscara de Android.
 *
 * Usa sharp. La marca y el monograma son contornos vectoriales comunes, independientes de fuentes
 * del sistema. Solo el tagline y dominio usan la pila tipográfica indicada más abajo.
 *
 * Uso: node scripts/og-image.mjs
 */
import { WORDMARK } from '../src/brand/wordmark.mjs';
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

/* Tokens (mismos valores que src/styles/tokens.css) */
const NAVY_900 = '#0b1f3f';
const CYAN_400 = '#19c8ff';
const CYAN_300 = '#5edbff';
const WHITE = '#ffffff';

const WIDTH = 1200;
const HEIGHT = 630;
const FONT = "'Poppins', 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif";

/** Consume the same canonical QR geometry re-exported by src/brand/unit-qr.ts.
 * Transpile this data-only TS module so npm run og also supports Node 22.12.
 */
async function loadUnitQr() {
  const ts = await import('typescript');
  const source = await readFile(path.join(ROOT, 'src/brand/hero-qr.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  const shared = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  return { path: shared.HERO_QR_PATH, size: shared.HERO_QR_SIZE, url: shared.HERO_QR_URL };
}

function ogSvg({ domain, neonData, qr }) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const code = new URL(qr.url).searchParams.get('c');
  if (!code || !qr.path || !Number.isInteger(qr.size)) throw new Error('Invalid shared unit QR');
  // Six pixels per shared QR module, including its four-module quiet zone.
  const qrPixels = qr.size * 6;
  const qrCenter = 973;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY_900}"/>
  <defs>
    <linearGradient id="neon-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="black"/><stop offset="0.25" stop-color="white"/></linearGradient>
    <mask id="neon-mask"><rect x="570" width="945" height="630" fill="url(#neon-fade)"/></mask>
  </defs>
  <image href="${neonData}" x="570" y="0" width="945" height="630" opacity="0.8" mask="url(#neon-mask)"/>
  <g transform="translate(96 138) scale(1.65)" fill="${WHITE}">
    ${WORDMARK.paths.map((d) => `<path d="${d}"/>`).join('')}
    <path d="${WORDMARK.registered}"/>
    <rect x="${WORDMARK.underline.x}" y="${WORDMARK.underline.y}" width="${WORDMARK.underline.width}" height="${WORDMARK.underline.height}" fill="${CYAN_400}"/>
  </g>
  <text x="96" y="388" font-family="${FONT}" font-size="46" font-weight="500" fill="${WHITE}" opacity="0.94"><tspan x="96">Identidad digital para</tspan><tspan x="96" dy="58">productos reales</tspan></text>
  <text x="96" y="510" font-family="${FONT}" font-size="26" font-weight="400" fill="${CYAN_300}">${escape(domain)}</text>
  <svg x="${qrCenter - qrPixels / 2}" y="${408 - qrPixels}" width="${qrPixels}" height="${qrPixels}" viewBox="0 0 ${qr.size} ${qr.size}" shape-rendering="crispEdges">
    <rect width="${qr.size}" height="${qr.size}" fill="${WHITE}"/>
    <path d="${qr.path}" fill="#000000"/>
  </svg>
  <rect x="815" y="424" width="316" height="42" rx="6" fill="${NAVY_900}"/>
  <text x="973" y="452" text-anchor="middle" font-family="${FONT}" font-size="21" fill="${WHITE}">${escape(code)}</text>
</svg>`;
}

async function main() {
  const { default: sharp } = await import('sharp');

  const qr = await loadUnitQr();
  const neon = await sharp(path.join(ROOT, 'public/images/brand/neon-loop-v3.webp')).png().toBuffer();
  const og = ogSvg({
    domain: 'traza.technology',
    neonData: `data:image/png;base64,${neon.toString('base64')}`,
    qr,
  });

  await mkdir(path.dirname(OUT_OG), { recursive: true });
  await sharp(Buffer.from(og)).resize(WIDTH, HEIGHT).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(OUT_OG);

  // Monogram from the same Poppins outline as the wordmark, never a separate font rendering.
  const favicon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="${NAVY_900}"/><g transform="translate(16 -1) scale(.63)" fill="${WHITE}"><path d="${WORDMARK.paths[0]}"/></g><rect x="18" y="55" width="28" height="3" fill="${CYAN_400}"/></svg>`);
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
