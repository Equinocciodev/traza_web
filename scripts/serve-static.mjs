#!/usr/bin/env node
/**
 * Servidor estático mínimo para QA: `node scripts/serve-static.mjs <dir> <puerto> [--headers <archivo>]`.
 * - `/ruta/` → `<dir>/ruta/index.html`; `/ruta` sin barra → redirección 301 a `/ruta/` (como Netlify/Cloudflare).
 * - Recurso inexistente → 404 con `<dir>/404.html`.
 * - `--headers public/_headers` aplica las cabeceras del archivo (formato Netlify: patrón `/…` y líneas `Nombre: valor`),
 *   lo que permite verificar la CSP estricta con cabeceras reales en Playwright.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const [dir = 'dist', port = '4327', ...rest] = process.argv.slice(2);
const root = resolve(dir);
const headersFile = rest[0] === '--headers' && rest[1] ? resolve(rest[1]) : null;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.woff': 'font/woff', '.woff2': 'font/woff2', '.map': 'application/json',
};

/** [{ match: (path) => boolean, headers: [[name, value]] }] a partir del formato Netlify. */
function parseHeaders(file) {
  const rules = [];
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.replace(/#.*$/, '').trimEnd();
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) {
      const pattern = line.trim();
      const re = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
      rules.push({ match: (p) => re.test(p), headers: [] });
    } else if (rules.length) {
      const i = line.indexOf(':');
      if (i > 0) rules[rules.length - 1].headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}
const rules = headersFile ? parseHeaders(headersFile) : [];

function send(res, status, file, urlPath) {
  const ext = extname(file);
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
  for (const rule of rules) if (rule.match(urlPath)) for (const [k, v] of rule.headers) res.setHeader(k, v);
  res.writeHead(status);
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, safe);
  if (!file.startsWith(root)) return send(res, 404, join(root, '404.html'), urlPath);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!urlPath.endsWith('/')) {
      res.writeHead(301, { Location: `${urlPath}/` });
      return res.end();
    }
    file = join(file, 'index.html');
  }
  if (!existsSync(file) || statSync(file).isDirectory()) return send(res, 404, join(root, '404.html'), urlPath);
  return send(res, 200, file, urlPath);
}).listen(Number(port), '127.0.0.1', () => console.log(`serve-static: ${root} → http://127.0.0.1:${port}${headersFile ? ` (cabeceras: ${headersFile})` : ''}`));
