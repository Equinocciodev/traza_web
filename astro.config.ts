import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Configuración de Astro para el demo de Traza®.
 *
 * - Salida estática por defecto (desplegable en cualquier hosting estático).
 *   Para SSR/APIs futuras basta con añadir un adaptador (node, cloudflare, vercel, netlify…)
 *   sin reescribir páginas.
 * - La URL pública y los endpoints se configuran por entorno (ver .env.example);
 *   no se fija proveedor ni dominio en el código.
 * - i18n: español en la raíz, inglés bajo /en/.
 * - Sin scripts inline: el HTML resultante es compatible con una CSP estricta (ver public/_headers).
 */
const site = process.env.PUBLIC_SITE_URL || 'https://traza.technology';
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  build: {
    // CSS siempre como archivos externos: permite `style-src 'self'` sin hashes.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Astro también inserta scripts pequeños por debajo de este umbral.
      // Mantenerlos externos permite que el menú funcione con script-src 'self'.
      assetsInlineLimit: 0,
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
      filter: (page) => !['/404', '/casos/licores', '/en/cases/spirits'].some((legacy) => new URL(page).pathname.includes(legacy)),
    }),
  ],
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://traza.technology' }),
      PUBLIC_API_MODE: envField.enum({ context: 'client', access: 'public', values: ['mock', 'remote'], default: 'mock' }),
      PUBLIC_API_BASE_URL: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({ context: 'client', access: 'public', values: ['none', 'console', 'beacon', 'ga4'], default: 'none' }),
      /*
       * Identificador de medición de Google Analytics 4.
       *
       * Es público por diseño: viaja en el bundle y se ve en la URL de gtag.js. Va aquí como
       * valor por defecto para que el build no dependa de configuración externa; quien clone
       * y compile obtiene el mismo sitio. La analítica solo se activa si además
       * PUBLIC_ANALYTICS_PROVIDER es «ga4», lo que el workflow hace únicamente en producción.
       */
      PUBLIC_GA4_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', default: 'G-CT7KNQL12G' }),
      PUBLIC_ANALYTICS_ENDPOINT: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_DEFAULT_TENANT: envField.string({ context: 'client', access: 'public', default: 'traza' }),
      // Correo público de contacto, uno por idioma: quien escribe en inglés recibe respuesta
      // del buzón en inglés. Vacío = la página de empresa muestra solo el formulario.
      PUBLIC_CONTACT_EMAIL: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_CONTACT_EMAIL_EN: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_SHOW_COBRAND_EXAMPLE: envField.boolean({ context: 'client', access: 'public', default: true }),
    },
  },
});
