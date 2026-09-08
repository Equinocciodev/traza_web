#!/usr/bin/env node
/**
 * Genera variantes de ancho para las imágenes grandes de `public/images/v2/`.
 *
 * El hero se muestra a ~70 % del ancho del contenedor en escritorio y a un máximo de 40 rem
 * en móvil: servir el original de 1448 px a un teléfono de 390 px desperdicia ancho de banda
 * y es lo que penaliza «properly sized images» en PageSpeed. Con `srcset` el navegador elige.
 *
 * Uso: node scripts/responsive-images.mjs
 */
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'images', 'v2');

/** Cada entrada: fichero base y los anchos a generar (el original se conserva intacto). */
const TARGETS = [
  { file: 'hero-products.webp', widths: [480, 768, 1024] },
  { file: 'story-bottle.webp', widths: [384, 512, 768] },
];

async function main() {
  const { default: sharp } = await import('sharp');
  for (const { file, widths } of TARGETS) {
    const src = path.join(DIR, file);
    const base = file.replace(/\.webp$/, '');
    const meta = await sharp(src).metadata();
    console.log(`${file} → original ${meta.width}×${meta.height}`);
    for (const w of widths) {
      if (meta.width && w >= meta.width) continue;
      const out = path.join(DIR, `${base}-${w}.webp`);
      await sharp(src).resize(w).webp({ quality: 82, effort: 6 }).toFile(out);
      const size = (await stat(out)).size;
      console.log(`  ${base}-${w}.webp (${(size / 1024).toFixed(1)} KB)`);
    }
  }
}

main().catch((error) => {
  console.error('[responsive-images] Error:', error);
  process.exitCode = 1;
});
