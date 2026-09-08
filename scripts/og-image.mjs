#!/usr/bin/env node
/**
 * Genera los recursos raster de marca a partir de SVG:
 *   - public/og/default.png (1200×630): fondo azul marino, wordmark "traza®" con subrayado cian,
 *     tagline "Identidad digital para productos reales", motivo QR discreto y acento de circuito.
 *     Sin texto ni emblemas de agencias.
 *   - public/apple-touch-icon.png (180×180): desde public/favicon.svg, aplanado sobre azul marino.
 *   - public/icon-192.png, icon-512.png y icon-512-maskable.png: iconos del manifiesto (PWA/Android).
 *     El maskable deja el 20 % de margen que exige la máscara de Android.
 *
 * Usa `sharp` (dependencia opcional de Astro presente en node_modules); el texto se renderiza con
 * la fuente Poppins instalada en el sistema (fallback a sans-serif si no está disponible).
 *
 * Uso: node scripts/og-image.mjs
 */
import { mkdir, readFile, stat } from 'node:fs/promises';
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
const NAVY_800 = '#10294f';
const CYAN_400 = '#19c8ff';
const CYAN_300 = '#5edbff';
const WHITE = '#ffffff';

const WIDTH = 1200;
const HEIGHT = 630;
const FONT = "'Poppins', 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif";

/** Motivo QR: finder patterns + módulos dispersos (misma geometría que QrMotif.astro), 24×24 unidades. */
function qrMotif(x, y, size, opacity) {
  const u = size / 24;
  const modules = [
    [2, 9], [4, 11], [6, 9], [3, 14], [8, 12], [10, 2], [13, 4], [11, 8], [15, 10], [17, 6], [12, 14], [16, 15], [19, 12], [9, 17],
    [14, 18], [20, 17], [18, 2], [21, 4], [5, 5], [7, 16], [2, 19], [11, 11], [13, 1], [19, 9], [17, 19], [21, 20], [1, 6], [6, 20], [16, 3], [20, 7],
  ];
  const finder = (fx, fy) =>
    `<path fill-rule="evenodd" d="M${fx} ${fy}h${7 * u}v${7 * u}h-${7 * u}z M${fx + u} ${fy + u}v${5 * u}h${5 * u}v-${5 * u}z"/>` +
    `<rect x="${fx + 2 * u}" y="${fy + 2 * u}" width="${3 * u}" height="${3 * u}"/>`;
  const rects = modules.map(([mx, my]) => `<rect x="${x + mx * u}" y="${y + my * u}" width="${u}" height="${u}"/>`).join('');
  return `<g fill="${WHITE}" opacity="${opacity}">${finder(x, y)}${finder(x + 17 * u, y)}${finder(x, y + 17 * u)}${rects}</g>`;
}

/** Acento de circuito: líneas finas con nodos (solo en el hero / OG). */
function circuit() {
  return `
    <g fill="none" stroke="${CYAN_400}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45">
      <path d="M1200 456 H1060 L1020 496 H880"/>
      <path d="M1200 540 H1110 L1070 580 H930"/>
      <path d="M700 596 H820 L860 556 H960"/>
      <path d="M0 610 H180"/>
    </g>
    <g fill="${NAVY_900}" stroke="${CYAN_400}" stroke-width="1.5" opacity="0.9">
      <circle cx="1060" cy="456" r="4.5"/>
      <circle cx="1110" cy="540" r="4.5"/>
      <circle cx="820" cy="596" r="4.5"/>
      <circle cx="180" cy="610" r="4.5"/>
    </g>
    <g fill="${CYAN_400}">
      <circle cx="880" cy="496" r="3.5"/>
      <circle cx="930" cy="580" r="3.5"/>
      <circle cx="960" cy="556" r="3.5"/>
    </g>`;
}

function ogSvg({ tagline, domain }) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY_900}"/>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${NAVY_800}" opacity="0"/>
  ${qrMotif(880, -40, 420, 0.09)}
  ${circuit()}
  <!-- Wordmark tipográfico "traza®" con subrayado cian -->
  <g font-family="${FONT}" fill="${WHITE}">
    <text x="96" y="268" font-size="148" font-weight="700" letter-spacing="-6">traza</text>
    <text x="482" y="182" font-size="44" font-weight="600">®</text>
  </g>
  <rect x="100" y="292" width="176" height="14" rx="3" fill="${CYAN_400}"/>
  <text x="96" y="392" font-family="${FONT}" font-size="46" font-weight="500" fill="${WHITE}" opacity="0.94">${escape(tagline)}</text>
  <text x="96" y="450" font-family="${FONT}" font-size="26" font-weight="400" fill="${CYAN_300}">${escape(domain)}</text>
</svg>`;
}

async function main() {
  const { default: sharp } = await import('sharp');

  const og = ogSvg({
    tagline: 'Identidad digital para productos reales',
    domain: 'traza.technology',
  });

  await mkdir(path.dirname(OUT_OG), { recursive: true });
  await sharp(Buffer.from(og)).resize(WIDTH, HEIGHT).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(OUT_OG);

  const favicon = await readFile(FAVICON);
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
