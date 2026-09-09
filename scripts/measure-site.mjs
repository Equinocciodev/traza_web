import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// Laboratory observations, not field Web Vitals. Fresh browser contexts, no network/CPU emulation.
const base = process.env.MEASURE_BASE ?? 'https://traza.technology';
const out = process.env.MEASURE_OUT ?? '.lighthouse/closure-before.json';
const paths = (process.env.MEASURE_PATHS ?? '/,/verificar/,/recorrido/,/institucional/,/empresa/,/en/').split(',');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const rows = [];
for (const width of [1366, 390]) for (const path of paths) for (let run = 1; run <= 3; run++) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [], failed = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  page.on('requestfailed', req => failed.push({ url: req.url(), error: req.failure()?.errorText }));
  await page.addInitScript(() => {
    window.__lab = { lcp: null, cls: 0, violations: [], longTasks: [] };
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.__lab.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__lab.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.__lab.longTasks.push(e.duration); }).observe({ type: 'longtask', buffered: true });
    document.addEventListener('securitypolicyviolation', e => window.__lab.violations.push({ directive: e.effectiveDirective, blocked: e.blockedURI, source: e.sourceFile }));
  });
  const response = await page.goto(base + path, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(4000);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return { ttfb: nav.responseStart - nav.requestStart, navigationToResponse: nav.responseStart,
      domContentLoaded: nav.domContentLoadedEventEnd, load: nav.loadEventEnd,
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      ...window.__lab, overflow: document.documentElement.scrollWidth > innerWidth,
      resources: performance.getEntriesByType('resource').map(r => ({ url: r.name, type: r.initiatorType, transfer: r.transferSize, encoded: r.encodedBodySize, duration: r.duration })),
      images: [...document.images].filter(i => i.currentSrc).map(i => ({ src: i.currentSrc, width: i.clientWidth, naturalWidth: i.naturalWidth, loading: i.loading })),
    };
  });
  rows.push({ width, path, run, status: response.status(), headers: await response.allHeaders(), metrics, errors, failed });
  console.log(JSON.stringify({ width, path, run, lcp: metrics.lcp, cls: metrics.cls, errors: errors.length, violations: metrics.violations.length }));
  await context.close();
}
await browser.close();
mkdirSync(out.substring(0, out.lastIndexOf('/')), { recursive: true });
writeFileSync(out, JSON.stringify({ date: new Date().toISOString(), base, condition: 'Chrome headless macOS, fresh context, DPR1, no CPU/network throttle, observed 4s after load; cross-origin sizes may be unavailable', rows }, null, 2));
console.log(out);
