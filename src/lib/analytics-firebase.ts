/**
 * Proveedor de analítica Firebase (Google Analytics 4).
 *
 * El SDK se instala como dependencia y Astro lo empaqueta con el resto del cliente: no se carga
 * ningún `<script>` desde gstatic ni se inyecta código en línea, así que `script-src 'self'` sigue
 * bastando para nuestro propio bundle. Firebase Analytics sí inyecta por su cuenta `gtag.js` desde
 * googletagmanager.com y envía las medidas a google-analytics.com: esos dos orígenes están
 * declarados en `public/_headers`. Si esas cabeceras se aplican y los orígenes faltan, la medición
 * se bloquea en silencio; no rompe la página.
 *
 * A diferencia del proveedor `beacon`, este proveedor SÍ usa cookies (`_ga`, `_ga_<id>`) y envía
 * datos a Google. El aviso de privacidad lo declara.
 *
 * Carga diferida: el SDK se importa dinámicamente la primera vez que se mide algo, de modo que
 * no entra en la ruta crítica de renderizado.
 */
import { env, firebaseConfig, firebaseConfigured } from '@/config/env';

type Params = Record<string, string | number | boolean>;

/** Promesa única de inicialización: se comparte entre todas las llamadas. */
let analyticsReady: Promise<((event: string, params: Params) => void) | null> | null = null;

function initAnalytics(): Promise<((event: string, params: Params) => void) | null> {
  if (!analyticsReady) {
    analyticsReady = (async () => {
      // Comprobar el proveedor ANTES del import dinámico: `env.analyticsProvider` es una constante
      // de build (astro:env), así que con otro proveedor el bundler puede descartar el SDK entero
      // en lugar de emitir un chunk que nunca se pide.
      if (!firebaseAnalyticsEnabled()) return null;
      try {
        const [{ initializeApp, getApps }, { getAnalytics, logEvent, isSupported }] = await Promise.all([
          import('firebase/app'),
          import('firebase/analytics'),
        ]);
        // `isSupported()` es falso en navegadores sin IndexedDB o en modos restringidos.
        if (!(await isSupported())) return null;
        const app = getApps()[0] ?? initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        return (event: string, params: Params) => logEvent(analytics, event, params);
      } catch {
        // La analítica nunca rompe la experiencia.
        return null;
      }
    })();
  }
  return analyticsReady;
}

/** ¿Debe usarse este proveedor en el build actual? */
export function firebaseAnalyticsEnabled(): boolean {
  return env.analyticsProvider === 'firebase' && firebaseConfigured;
}

/** Registra un evento en GA4. Silencioso si el SDK no está disponible o no es compatible. */
export function trackFirebase(event: string, params: Params): void {
  void initAnalytics().then((log) => log?.(event, params));
}
