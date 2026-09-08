# Traza® — demo web conceptual

Demostración interactiva de **Traza®**, empresa privada y plataforma tecnológica multisector de identidad digital unitaria, trazabilidad, verificación y control. Español primero, inglés bajo `/en/`. **Todo lo que se muestra es simulado**: unidades, organizaciones, personas, lugares, lotes, alertas, casos y resultados. El caso de uso licores/SENIAT se presenta como **propuesta de piloto**, no como implementación oficial ni relación institucional.

> Estado: listo para revisión y aprobación interna. **No está publicado ni conectado a ningún dominio.** La URL canónica por defecto (`https://traza-demo.example`) es un marcador de posición que se cambia por variable de entorno en cada despliegue.

Revisión R2: base construida por Claude, correcciones locales y auditoría independiente de Codex, con contraste de los hallazgos por Claude Opus 5 Max. `docs/13-revision-codex.md` distingue la revisión actual de los informes históricos R1. No equivale a un backend listo para producción.

## Qué contiene

- Sitio corporativo: Inicio · Plataforma · Soluciones (Gobierno / Industria / Ciudadanos) · Cómo funciona · Caso de uso: Licores · Seguridad y confianza · Empresa/Contacto · Privacidad · 404.
- Tres demostraciones interactivas:
  - **A · Verificación pública** (`/verificar/`): escaneo simulado o cámara real (con detección de QR cuando el navegador la soporta), código manual, cuatro comprobaciones separadas (firma emitida, estado en registro, coincidencia de datos, anomalías), veredictos *superada / con advertencias / no válida / no verificable*, todos los estados obligatorios (carga, vacío, duplicado, revocado, cámara denegada o no disponible, QR ilegible, sin conexión, error de servidor, tiempo de espera, reintento y recuperación) y reporte de discrepancia con folio. Sensible al tenant (`?t=licores`) y con enlace profundo (`?c=CÓDIGO`).
  - **B · Recorrido del producto** (`/recorrido/`): traza animada fábrica/aduana → etiquetado → transporte → distribución → comercio → verificación, con selector de unidad, controles de reproducción y navegación por pasos (equivalente estático con `prefers-reduced-motion`).
  - **C · Vista institucional** (`/institucional/`): riesgos/alertas, casos, inspecciones de campo y cronología de auditoría con roles simulados (analista, inspector de campo, observador sin permisos), siempre rotulada como demostración.
- Capa de **tenant/co-brand**: marca maestra `traza` y tenant de ejemplo `licores` (lockup tipográfico "SENIAT | TRAZA" rotulado como propuesta de piloto, desactivable con `PUBLIC_SHOW_COBRAND_EXAMPLE=false`).
- SEO (metadatos, Open Graph, `hreflang`, JSON-LD, sitemap, robots), 404, plan de CSP y cabeceras, interfaz de analítica sin cookies (desactivada por defecto), aviso de privacidad provisional y documentación de despliegue.

## Ver la versión compilada

La carpeta `dist/` ya contiene el demo. Si solo necesitas revisarlo en una computadora con Node instalado, desde esta carpeta ejecuta:

```bash
node scripts/serve-static.mjs dist 4351 --headers public/_headers
```

Abre `http://127.0.0.1:4351`. No necesitas instalar dependencias para esta vista previa estática. Solo funciona en la computadora que la ejecuta; no publica el sitio en Internet. Para modificar y recompilar el proyecto, utiliza los requisitos siguientes.

## Requisitos y arranque

```bash
# Node ≥ 22.12 y npm ≥ 10.8.2
npm ci
cp .env.example .env      # opcional; ver variables en docs/06-despliegue.md
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
| `npm run screenshots` | Capturas responsive en `docs/capturas/` |
| `npm run lighthouse -- --base=http://127.0.0.1:4321 --out=.lighthouse/run` | Lighthouse móvil y escritorio sobre un servidor en marcha |
| `npm run og` | Regenera `public/og/default.png` y `public/apple-touch-icon.png` |
| `npm run verify` | check + test + build + e2e |

## Estructura

```
astro.config.ts          Configuración (estático, i18n, sitemap, variables de entorno tipadas)
src/
  config/                env.ts (entorno), tenants.ts (co-brand), sectors.ts (sectores de ejemplo)
  content/               Contrato de contenido (types.ts) y diccionarios es/ y en/ (una clave por página)
  fixtures/              Datos simulados: unidades y eventos, escenarios de verificación, vista institucional
  i18n/                  Idiomas, rutas por clave (slugs traducidos), formato de fechas/números
  lib/verify/            Motor de verificación SIMULADO (sin criptografía) y presentación
  lib/api/               Adaptador de API: mock (por defecto) y esqueleto remoto para endpoints futuros
  lib/analytics.ts       Interfaz de analítica sin cookies (none | console | beacon)
  lib/motion.ts          Primitivas de motion ("el trazo que se completa") con reduced-motion
  styles/                tokens.css (tokens de diseño), base.css, motion.css
  layouts/Base.astro     Layout con SEO, hreflang, JSON-LD, skip link, indicador de demo
  components/            ui/ (sistema), site/ (cabecera, pie, formularios), verify/, journey/, institutional/
  templates/             Plantillas de página (una por ruta, reciben `locale`)
  pages/                 Rutas ES en la raíz y EN bajo en/ (solo montan la plantilla)
tests/unit/              Vitest · tests/e2e/  Playwright (flujos, a11y, CSP, privacidad, capturas)
scripts/                 lighthouse.mjs, og-image.mjs, serve-static.mjs
public/                  favicon, manifest, og/, _headers (ejemplo de cabeceras y CSP), nojs.css
docs/                    Evidencia, decisiones, matriz fuente→afirmación, supuestos, inventario, QA, a11y, motion, despliegue, handoff, capturas
```

## Documentación

| Documento | Contenido |
|---|---|
| `docs/00-brief-equipo.md` | Brief compartido del equipo: producto, fuentes, conceptos superados, guardarraíles, sistema visual, convenciones |
| `docs/01-hito-evidencia-y-plan.md` | Hito 1: inventario de fuentes, hechos, conflictos, supuestos, arquitectura, stack, sitemap, tokens, motion, plan, riesgos |
| `docs/02-decisiones-arquitectura-diseno.md` | Decisiones de arquitectura y diseño con alternativas descartadas |
| `docs/03-matriz-fuente-afirmacion.md` | Matriz fuente → afirmación: cada afirmación del sitio con su origen y su tratamiento |
| `docs/04-supuestos-contradicciones.md` | Registro de supuestos y contradicciones resueltas |
| `docs/05-inventario-componentes-estados.md` | Inventario de componentes y de estados de las tres demos |
| `docs/06-despliegue.md` | Despliegue, variables de entorno, CSP y cabeceras, endpoints futuros |
| `docs/07-fixtures.md` | Fixtures: unidades, escenarios, alertas, casos, cronología |
| `docs/08-informe-qa.md` | Informe de QA con los resultados reales de check, build, unit y e2e |
| `docs/09-accesibilidad-rendimiento.md` | Auditoría de accesibilidad (axe, teclado, reflow, zoom, reduced motion) y rendimiento (Lighthouse, presupuesto de peso) |
| `docs/10-motion.md` | Sistema de motion e inventario de animaciones |
| `docs/11-informe-equipo.md` | Equipo real: número y roles de especialistas que trabajaron y qué produjo cada uno |
| `docs/12-handoff-auditoria.md` | Handoff de auditoría: qué revisar, dónde y cómo |
| `docs/capturas/` | Capturas de escritorio y móvil |

## Guardarraíles de contenido (resumen)

- Nada se afirma como hecho sin fuente aprobada; la arquitectura de seguridad y las cantidades del caso licores son "propuesta de piloto" / "arquitectura objetivo".
- Ninguna relación con gobiernos, agencias, clientes, certificaciones, escala, uptime o impacto económico se presenta como hecho.
- Nunca se llama "auténtico" a un producto porque una firma sea sintácticamente válida: el resultado explica qué se comprobó, qué confianza aporta y cuál es el siguiente paso.
- Sin datos personales ni tributarios; sin cookies ni rastreadores; sin criptografía real en el frontend.
- Indicador persistente "Demostración conceptual — datos simulados".

## Licencias de terceros

Astro (MIT), @astrojs/sitemap (MIT), Space Grotesk, Roboto, Roboto Mono y Poppins mediante @fontsource; consultar las licencias incluidas en los paquetes de fuentes. Poppins se limita al wordmark tipográfico provisional; títulos, cuerpo y metadatos siguen las familias identificadas en el PDF Rev. B. Vitest (MIT), Playwright (Apache 2.0), axe-core (MPL 2.0, solo en pruebas).
