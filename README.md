# Traza® — sitio web

Sitio web de **Traza Technology, C.A.**, empresa privada y plataforma tecnológica multisector de
identidad digital unitaria, trazabilidad, verificación y control. Español en la raíz, inglés bajo `/en/`.

- **Demo pública:** <https://traza.technology> (GitHub Pages, desplegado por Actions en cada push a `main`).
- **Stack:** Astro estático, sin framework de UI, sin scripts inline (compatible con CSP estricta).

Esta versión es una demo pública para presentaciones, no un lanzamiento comercial.
El caso de uso de medicamentos se presenta como **propuesta de piloto**: no es una implementación
oficial ni afirma relación institucional. Los guardarraíles de contenido que sostienen esa distinción
están automatizados en `tests/unit/guardrails.test.ts`.

## Qué contiene

- Sitio corporativo: Inicio · Plataforma · Soluciones (Gobierno / Industria / Ciudadanos) · Cómo funciona · Caso de uso: Medicamentos · Seguridad y confianza · Empresa/Contacto · Privacidad · 404.
- Tres vistas interactivas:
  - **Verificación pública** (`/verificar/`): lectura real por cámara (detector nativo y respaldo jsQR), foto local con búsqueda por zonas, QR de ejemplo descargable y código manual, cuatro comprobaciones separadas (firma emitida, estado en registro, coincidencia de datos, anomalías), veredictos *superada / con advertencias / no válida / no verificable*, todos los estados obligatorios (carga, vacío, duplicado, revocado, cámara denegada o no disponible, QR ilegible, sin conexión, error de servidor, tiempo de espera, reintento y recuperación) y preparación local de un reporte de discrepancia con folio, sin envío ni cambio del registro. Sensible al tenant (`?t=medicamentos`) y con enlace profundo (`?c=CÓDIGO`).
  - **Recorrido del producto** (`/recorrido/`): ciclo de vida emisión → impresión → activación al finalizar producción → consulta → señales → cierre, con selector de unidad, controles de reproducción y navegación por pasos (equivalente estático con `prefers-reduced-motion`).
  - **Vista institucional** (`/institucional/`): riesgos/alertas, casos, inspecciones de campo y cronología de auditoría con permisos por rol (analista, inspector de campo, observador sin permisos).
- Capa de **tenant/co-brand**: marca maestra `traza` y tenant de ejemplo `medicamentos` (lockup tipográfico "EMPRESA PÚBLICA Y/O PRIVADA | TRAZA" rotulado como propuesta de piloto, desactivable con `PUBLIC_SHOW_COBRAND_EXAMPLE=false`).
- SEO (metadatos, Open Graph, `hreflang`, JSON-LD, sitemap, robots), 404, plan de CSP y cabeceras, analítica desactivada por defecto en local; GA4 habilitado por el workflow de producción, aviso de privacidad y documentación de despliegue.

## Ver la versión compilada en local

`npm run build` genera `dist/`. Para servirlo con las cabeceras reales:

```bash
node scripts/serve-static.mjs dist 4351 --headers public/_headers
```

Abre `http://127.0.0.1:4351`. Solo funciona en la computadora que lo ejecuta; no publica nada en Internet.

## Requisitos y arranque

```bash
# Node ≥ 22.12 y npm ≥ 10.8.2
npm ci
cp .env.example .env      # opcional; cada variable está documentada en el propio archivo
npm run dev               # http://localhost:4321
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run check` | `astro check` (tipos y plantillas) |
| `npm run test` | Pruebas unitarias (Vitest): motor de verificación, adaptador de API, fixtures, i18n, paridad ES/EN, guardarraíles de contenido |
| `npm run build` | Build de producción estático en `dist/` |
| `npm run preview` | Sirve `dist/` |
| `npm run test:e2e` | Playwright (proyectos `desktop`, `mobile`, `a11y`, `screenshots`) sobre `astro preview` |
| `npm run test:a11y` | Solo el barrido de accesibilidad (axe-core + comprobaciones de teclado, foco, reflow, zoom, reduced motion) |
| `npm run screenshots` | Capturas responsive en `docs/capturas/` (local, sin seguimiento) |
| `npm run lighthouse -- --base=http://127.0.0.1:4321 --out=.lighthouse/run` | Lighthouse móvil y escritorio sobre un servidor en marcha |
| `npm run og` | Regenera la imagen Open Graph y todo el juego de iconos (favicon, apple-touch, manifiesto) |
| `node scripts/responsive-images.mjs` | Regenera las variantes de ancho de las imágenes del hero y del relato |
| `npm run verify` | check + test + build + e2e |

## Estructura

```
astro.config.ts          Configuración (estático, i18n, sitemap, variables de entorno tipadas)
src/
  config/                env.ts (entorno), tenants.ts (co-brand), sectors.ts (sectores de ejemplo)
  content/               Contrato de contenido (types.ts) y diccionarios es/ y en/ (una clave por página)
  fixtures/              Datos del registro: unidades y eventos, escenarios de verificación, vista institucional
  i18n/                  Idiomas, rutas por clave (slugs traducidos), formato de fechas/números
  lib/verify/            Motor de verificación por señales y su presentación
  lib/api/               Adaptador de API: mock (por defecto) y esqueleto remoto para endpoints futuros
  lib/analytics.ts       Interfaz de analítica (none | console | beacon | ga4)
  lib/motion.ts          Primitivas de motion ("el trazo que se completa") con reduced-motion
  styles/                tokens.css (tokens de diseño), base.css, motion.css
  layouts/Base.astro     Layout con SEO, hreflang, iconos, JSON-LD (Organization/WebSite/WebPage) y skip link
  components/            ui/ (sistema), site/ (cabecera, pie, formularios), verify/, journey/, institutional/
  templates/             Plantillas de página (una por ruta, reciben `locale`)
  pages/                 Rutas ES en la raíz y EN bajo en/ (solo montan la plantilla)
tests/unit/              Vitest · tests/e2e/  Playwright (flujos, a11y, CSP, privacidad, capturas)
scripts/                 lighthouse.mjs, og-image.mjs, serve-static.mjs
public/                  favicon, manifest, og/, _headers (ejemplo de cabeceras y CSP), nojs.css
docs/                    Documentación interna, en local y fuera del repositorio (.gitignore)
```

## Documentación interna

La documentación de trabajo del proyecto —briefs, decisiones, matriz fuente→afirmación,
informes de QA y accesibilidad, handoff de auditoría— **no se publica en este repositorio**.
Describe el proyecto en su etapa de demostración y este repositorio es público.

Vive en `docs/` en local, excluida por `.gitignore`, con copia en `~/TRAZA/web-docs`.
Las especificaciones vigentes del producto están en `~/TRAZA`.

## Guardarraíles de contenido (resumen)

- Nada se afirma como hecho sin fuente aprobada; la seguridad física y la integración tributaria del caso de medicamentos se presentan como fase 2 condicionada o arquitectura objetivo.
- Ninguna relación con gobiernos, agencias, clientes, certificaciones, escala, uptime o impacto económico se presenta como hecho.
- Nunca se llama "auténtico" a un producto porque una firma sea sintácticamente válida: el resultado explica qué se comprobó, qué confianza aporta y cuál es el siguiente paso.
- Las fotos del lector se procesan localmente y el registro usa datos de ejemplo. En local y en pruebas la analítica está desactivada; el despliegue configura GA4 y respeta Do Not Track. No atribuir a producción la ausencia de rastreadores comprobada solo en local.
- El correo de contacto vive en `PUBLIC_CONTACT_EMAIL`, nunca en los diccionarios de contenido.
- El vocabulario de demostración ("demo", "simulado", "ficticio") está vetado en el contenido y
  comprobado por `tests/unit/guardrails.test.ts`.

## Licencias de terceros

Astro (MIT), @astrojs/sitemap (MIT), Space Grotesk, Roboto, Roboto Mono y Poppins mediante @fontsource; consultar las licencias incluidas en los paquetes de fuentes. La marca ahora usa contornos vectorizados automáticamente de la referencia raster 16 de Juan; su original orbital se conserva sin modificar. Las siete imágenes de producto, etiqueta, empaque, relato, seguridad, ambiente y vista previa social son composiciones completas de ImageGen; los códigos escaneables se presentan como controles independientes de la interfaz. La procedencia, los prompts y las limitaciones de los recursos están en `src/brand/asset-provenance.json`. Vitest (MIT), Playwright (Apache 2.0), axe-core (MPL 2.0, solo en pruebas).

## Probar el lector QR

En `/verificar/` o `/en/verify/`, «Leer esta imagen» decodifica el PNG visible antes de consultar la unidad `TRZ-7F2K-4K7Q-92FA`. El PNG descargable puede abrirse en otra pantalla para apuntarle con la cámara; también se puede elegir desde las fotos. «Consultar ejemplo» consulta directamente el escenario seleccionado y no sustituye la lectura de imagen.

La cámara requiere un contexto seguro (HTTPS o localhost) y permiso del navegador. Las fotos se procesan localmente: hasta 10 MiB y 40 millones de píxeles, con intentos globales y recortes nativos solapados, cancelación y presupuesto de lectura. Un QR ajeno muestra un resultado no verificable y no abre su URL. `public/_headers` permite `blob:` únicamente como fuente de imagen para esta lectura.

La verificación de registro de esta configuración utiliza las unidades de ejemplo del sitio. Las pruebas de cámara con vídeo de canvas comprueban el flujo del navegador; no certifican cámara, enfoque ni permisos nativos de un teléfono físico. La suite `tests/e2e/qr-reader.spec.ts` cubre imágenes reales, cámara, errores, cancelación, ES/EN y pantallas pequeñas; debe ejecutarse sobre un build fijo con las cabeceras de publicación.
