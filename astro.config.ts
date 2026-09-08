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
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://traza.technology' }),
      PUBLIC_API_MODE: envField.enum({ context: 'client', access: 'public', values: ['mock', 'remote'], default: 'mock' }),
      PUBLIC_API_BASE_URL: envField.string({ context: 'client', access: 'public', default: '' }),
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({ context: 'client', access: 'public', values: ['none', 'console', 'beacon', 'firebase'], default: 'none' }),
      /*
       * Configuración web de Firebase del proyecto de Traza, con sus valores por defecto.
       *
       * Estos valores son públicos por diseño: viajan en el bundle del cliente y cualquiera
       * puede leerlos en el navegador. No son un secreto y no tiene sentido tratarlos como
       * tal. Lo que sí protege el proyecto es restringir la clave por referente HTTP en
       * Google Cloud → Credenciales, de modo que solo funcione desde traza.technology.
       *
       * Van aquí como defaults —y no en variables del repositorio— para que el build no
       * dependa de una configuración externa: quien clone y compile obtiene el mismo sitio.
       * Cualquiera de ellos se puede sobreescribir por entorno si hace falta otro proyecto.
       */
      PUBLIC_FIREBASE_API_KEY: envField.string({ context: 'client', access: 'public', default: 'AIzaSyAboJLHGfXvvN04PdeR1V-WM8AnwDpfO_o' }),
      PUBLIC_FIREBASE_AUTH_DOMAIN: envField.string({ context: 'client', access: 'public', default: 'traza-76fd9.firebaseapp.com' }),
      PUBLIC_FIREBASE_PROJECT_ID: envField.string({ context: 'client', access: 'public', default: 'traza-76fd9' }),
      PUBLIC_FIREBASE_STORAGE_BUCKET: envField.string({ context: 'client', access: 'public', default: 'traza-76fd9.firebasestorage.app' }),
      PUBLIC_FIREBASE_MESSAGING_SENDER_ID: envField.string({ context: 'client', access: 'public', default: '399504041936' }),
      PUBLIC_FIREBASE_APP_ID: envField.string({ context: 'client', access: 'public', default: '1:399504041936:web:032b8a5edf9a729e9d7bd5' }),
      PUBLIC_FIREBASE_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', default: 'G-CT7KNQL12G' }),
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
