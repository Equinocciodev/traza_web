/**
 * Proveedor de analítica: Google Analytics 4 con la etiqueta gtag.js.
 *
 * Es la instalación que documenta Google, con una diferencia obligada: su fragmento pega un
 * `<script>` en línea, y este sitio no admite ninguno (CSP estricta, `script-src 'self'`,
 * comprobado por tests/e2e/csp.spec.ts). Aquí las mismas tres líneas —crear `dataLayer`,
 * `gtag('js', …)` y `gtag('config', …)`— viven en este módulo, que Astro empaqueta como
 * archivo propio; lo único que se carga de fuera es `gtag.js`, declarado en la CSP.
 *
 * Antes esto usaba el SDK de Firebase, que por debajo hace exactamente lo mismo: cargar
 * gtag.js y registrar eventos. Se retiró porque no aportaba nada más y traía una dependencia
 * de 45 MB en disco y tres chunks al artefacto.
 *
 * La carga es diferida: gtag.js se pide la primera vez que hay algo que medir, así que no
 * entra en la ruta crítica de renderizado ni retrasa la primera pintura.
 */
import { env } from '@/config/env';

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loading: Promise<boolean> | null = null;

/** ¿Debe usarse este proveedor en el build actual? */
export function ga4Enabled(): boolean {
  return env.analyticsProvider === 'ga4' && Boolean(env.ga4MeasurementId);
}

/**
 * Carga gtag.js una sola vez y lo configura. Devuelve false si no se pudo cargar, para que
 * quien llame no se quede esperando: la analítica nunca rompe la experiencia.
 */
function loadGtag(): Promise<boolean> {
  if (!loading) {
    loading = new Promise<boolean>((resolve) => {
      if (!ga4Enabled()) {
        resolve(false);
        return;
      }
      const id = env.ga4MeasurementId;
      window.dataLayer = window.dataLayer ?? [];
      /*
       * `gtag` empuja el propio objeto `arguments`, no un array.
       *
       * Parece un detalle y no lo es: gtag.js reconoce las entradas de `dataLayer` por su
       * forma de objeto-arguments. Empujando un array normal la cola se acepta, gtag.js
       * arranca e incluso añade sus propias entradas, pero nunca ve el `config` y no envía
       * ni un solo evento. Por eso hace falta `function` y no una flecha: las flechas no
       * tienen `arguments`.
       */
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', id);

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      script.addEventListener('load', () => resolve(true), { once: true });
      script.addEventListener('error', () => resolve(false), { once: true });
      document.head.append(script);
    });
  }
  return loading;
}

/** Registra un evento en GA4. Silencioso si gtag.js no está disponible. */
export function trackGa4(event: string, params: Params): void {
  void loadGtag().then((ok) => {
    if (ok) window.gtag?.('event', event, params);
  });
}
