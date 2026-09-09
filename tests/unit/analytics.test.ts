import { afterEach, expect, test, vi } from 'vitest';

vi.mock('@/config/env', () => ({ env: { analyticsProvider: 'ga4', ga4MeasurementId: 'G-EXAMPLE' } }));

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

function browser(dnt: string) {
  const scripts: EventTarget[] = [];
  const win = { location: { pathname: '/verificar/' }, dataLayer: [] as unknown[] };
  vi.stubGlobal('window', win);
  vi.stubGlobal('navigator', { doNotTrack: dnt });
  vi.stubGlobal('document', {
    documentElement: { lang: 'es' },
    createElement: () => new EventTarget(),
    head: { append: (script: EventTarget) => scripts.push(script) },
  });
  return { win, scripts };
}

test('una vista explícita no duplica el page_view automático de GA4', async () => {
  const { win, scripts } = browser('0');
  const { track } = await import('@/lib/analytics');
  track('page_view');
  track('cta_click');
  expect(scripts).toHaveLength(1);
  scripts[0]!.dispatchEvent(new Event('load'));
  await Promise.resolve();
  const queue = win.dataLayer.map(args => Array.from(args as ArrayLike<unknown>));
  expect(queue.find(args => args[0] === 'config')?.[2]).toEqual({ send_page_view: false });
  expect(queue.filter(args => args[0] === 'event' && args[1] === 'page_view')).toHaveLength(1);
  expect(queue.filter(args => args[0] === 'event' && args[1] === 'cta_click')).toHaveLength(1);
});

test('Do Not Track evita cargar GA4 incluso en configuración de producción', async () => {
  const { win, scripts } = browser('1');
  const { track } = await import('@/lib/analytics');
  track('page_view');
  expect(scripts).toHaveLength(0);
  expect(win.dataLayer).toEqual([]);
});

test('un fallo de carga de GA4 no lanza ni transmite eventos', async () => {
  const { win, scripts } = browser('0');
  const { track } = await import('@/lib/analytics');
  track('page_view');
  scripts[0]!.dispatchEvent(new Event('error'));
  await Promise.resolve();
  expect(win.dataLayer.map(args => Array.from(args as ArrayLike<unknown>)).some(args => args[0] === 'event')).toBe(false);
});
