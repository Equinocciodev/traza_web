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
 * - Sin scripts inline: el HTML resultante es compatible con una CSP estricta (ver docs/06-despliegue.md).
 */
const site = process.env.PUBLIC_SITE_URL || 'https://traza-demo.example';
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
      filter: (page) => !page.includes('/404'),
    }),
  ],
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://traza-demo.example' }),
      PUBLIC_API_MODE: envField.enum({ context: 'client', access: 'public', values: ['mock', 'remote'], default: 'mock' }),
      PUBLIC_API_BASE_URL: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({ context: 'client', access: 'public', values: ['none', 'console', 'beacon'], default: 'none' }),
      PUBLIC_ANALYTICS_ENDPOINT: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_DEFAULT_TENANT: envField.string({ context: 'client', access: 'public', default: 'traza' }),
      PUBLIC_CONTACT_EMAIL: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_SHOW_COBRAND_EXAMPLE: envField.boolean({ context: 'client', access: 'public', default: true }),
    },
  },
});
