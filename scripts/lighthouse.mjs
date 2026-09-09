#!/usr/bin/env node
/**
 * Auditoría Lighthouse 13 reproducible sobre el build de producción (ver docs/09-accesibilidad-rendimiento.md).
 *
 *   npm run build && npm run preview -- --host 127.0.0.1 --port 4321   (en otra terminal)
 *   npm run lighthouse                      → móvil (preset por defecto) y escritorio, 6 páginas
 *   npm run lighthouse -- --base=http://127.0.0.1:4326 --out=.lighthouse/after --pages=/,/verificar/
 *   npm run lighthouse -- --summary=.lighthouse/after   → solo resume informes JSON ya generados
 *
 * Variables: CHROME_PATH (por defecto /opt/pw-browsers/chromium si existe; si no, el Chrome del sistema).
 * Los informes (.report.json y .report.html) se guardan en la carpeta indicada (ignorada por git).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a) => (a.startsWith('--') ? a.slice(2).split('=') : [a, true])).map(([k, v]) => [k, v ?? true]));
const base = args.base ?? 'http://127.0.0.1:4321';
const out = args.out ?? join('.lighthouse', new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'));
const pages = (args.pages ?? '/,/verificar/,/recorrido/,/institucional/,/casos/medicamentos/,/en/').split(',').filter(Boolean);
const presets = (args.presets ?? 'mobile,desktop').split(',');
const chrome = process.env.CHROME_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

function slugOf(page) {
  const s = page.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  return s || 'home';
}

function runAudits() {
  mkdirSync(out, { recursive: true });
  for (const page of pages) {
    for (const preset of presets) {
      const target = join(out, `${slugOf(page)}.${preset}`);
      const cli = [
        '--yes',
        'lighthouse@13',
        `${base}${page}`,
        ...(preset === 'desktop' ? ['--preset=desktop'] : []),
        '--chrome-flags=--headless=new --no-sandbox',
        '--output=json',
        '--output=html',
        `--output-path=${target}`,
        '--only-categories=performance,accessibility,best-practices,seo',
        '--quiet',
      ];
      process.stdout.write(`lighthouse ${page} [${preset}] … `);
      const res = spawnSync('npx', cli, { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, ...(chrome ? { CHROME_PATH: chrome } : {}) } });
      console.log(res.status === 0 ? 'ok' : `FALLO (${res.status})\n${res.stderr?.toString().slice(-800)}`);
    }
  }
}

function summarize(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.report.json')).sort();
  const ms = (v) => (v == null ? '—' : `${(v / 1000).toFixed(1)} s`);
  const rows = ['| Página | Preset | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS | Peso transferido |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  let version = '';
  for (const f of files) {
    const r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    version = r.lighthouseVersion;
    const c = r.categories;
    const a = r.audits;
    const score = (k) => (c[k] ? Math.round(c[k].score * 100) : '—');
    const preset = f.replace('.report.json', '').split('.').pop();
    rows.push(
      `| ${new URL(r.finalDisplayedUrl ?? r.requestedUrl).pathname} | ${preset} | ${score('performance')} | ${score('accessibility')} | ${score('best-practices')} | ${score('seo')} | ${ms(a['first-contentful-paint']?.numericValue)} | ${ms(a['largest-contentful-paint']?.numericValue)} | ${Math.round(a['total-blocking-time']?.numericValue ?? 0)} ms | ${(a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)} | ${((a['total-byte-weight']?.numericValue ?? 0) / 1024).toFixed(0)} KB |`,
    );
  }
  console.log(`\nLighthouse ${version} — ${files.length} informes en ${dir}\n`);
  console.log(rows.join('\n'));
}

if (args.summary) summarize(typeof args.summary === 'string' ? args.summary : out);
else {
  runAudits();
  summarize(out);
}
