# CLAUDE.md

Guía para trabajar en este repositorio. Léela antes de tocar contenido o plantillas: el proyecto
tiene contratos automatizados que fallan si se escribe "a ojo".

## Qué es esto

Sitio web corporativo de **Traza Technology, C.A.** (marca **Traza®**): identidad digital unitaria,
trazabilidad y verificación pública de productos. Astro estático, español en la raíz e inglés bajo
`/en/`. Publicado en <https://traza.technology> por GitHub Pages.

**No es un demo.** El sitio se presenta como producto real. Existió una etapa previa en la que cada
página llevaba el rótulo "Demostración conceptual — datos simulados"; se eliminó por completo, y
`tests/unit/guardrails.test.ts` impide que ese vocabulario vuelva a entrar. Si necesitas describir
datos de ejemplo, di "ejemplo", nunca "demo", "simulado" ni "ficticio".

**El registro es de ciclo de vida, no logístico.** La decisión D9 de las especificaciones retiró
del alcance la trazabilidad de venta: la plataforma no registra transporte ni distribución. Las
seis etapas (`CHAIN_STAGES`) son `issuance · labeling · activation · lookup · signals · closure`,
y las tres vistas —inicio, «cómo funciona» y `/recorrido/`— deben usar ese mismo orden. Si vuelves
a escribir «cada actor de la cadena reporta un evento», estás describiendo la fase 3.

## Comandos

```bash
npm run dev          # servidor de desarrollo en :4321
npm run check        # astro check — tipos y plantillas (debe quedar en 0 errores)
npm test             # Vitest: 200 pruebas (motor, API, fixtures, i18n, paridad ES/EN, guardarraíles)
npm run build        # build estático en dist/ (36 páginas)
npm run test:e2e     # Playwright sobre astro preview
npm run verify       # check + test + build + e2e
npm run og           # regenera la imagen OG y todo el juego de iconos
```

Antes de dar por terminado un cambio de contenido: `npm run check && npm test && npm run build`.

## Arquitectura: dónde vive cada cosa

El contenido está **totalmente separado** de las plantillas. Nunca escribas texto visible dentro de
un `.astro`.

```
src/content/types.ts            Contrato de contenido (interfaces). Cambiar aquí obliga a cambiar ES y EN.
src/content/es/*.ts             Diccionario español, una clave por página
src/content/en/*.ts             Diccionario inglés, estructura idéntica (la paridad es un test)
src/content/{es,en}/code-spec.ts · integration.ts · rationale.ts
                                Las tres páginas de referencia: comparten `ReferencePageContent`
                                y una sola plantilla (`src/templates/ReferencePage.astro`)
src/content/v2-home.ts          Copy de la portada v2 (ES y EN en el mismo módulo)
src/content/v2-narrative.ts     Copy del relato interactivo de la portada
src/fixtures/                   Datos del registro: unidades, eventos, escenarios, vista institucional
src/config/env.ts               Variables de entorno tipadas (astro:env)
src/config/tenants.ts           Marca maestra y tenant de ejemplo (co-brand)
src/lib/verify/                 Motor de verificación por señales + presentación
src/lib/api/                    Adaptador: modo `mock` (fixtures locales) y esqueleto `remote`
src/layouts/Base.astro          SEO, hreflang, iconos, JSON-LD, skip link
src/templates/                  Una plantilla por ruta; recibe `locale` y lee el diccionario
src/pages/                      Rutas ES en la raíz, EN bajo en/; solo montan la plantilla
```

Añadir texto = editar `src/content/`. Añadir una página = plantilla en `src/templates/` + rutas en
`src/pages/` y `src/pages/en/` + clave en `src/i18n/` + entrada en ambos diccionarios.

## Contratos que fallan si los ignoras

1. **Paridad ES ↔ EN** (`tests/unit/content-parity.test.ts`): las dos estructuras deben ser
   idénticas — mismas claves, mismos tipos, mismos identificadores. Si añades una clave en español,
   añádela en inglés en el mismo sitio.
2. **Longitudes de metadatos** (`content-parity`): descripción de 150–160 caracteres y `<title>`
   renderizado (título de página + ` · Traza®`) de 50–60, únicos por página y en los dos idiomas.
   Fuera de rango el test falla; corrige el texto, no el test.
3. **Guardarraíles de contenido** (`tests/unit/guardrails.test.ts`), que recorren *todo* el contenido,
   los fixtures y la configuración:
   - vetado el vocabulario de demostración: `demo`, `demostración`, `simulado`, `ficticio`
     (se admite un control que diga "Simular…": describe lo que hace un botón, no el dato);
   - "auténtico" solo aparece en la frase que explica por qué no se usa;
   - nada de `blockchain`, `token`, `smart contract`, `SLA`, `uptime`, `99,9 %`, garantías absolutas;
   - ninguna afirmación de clientes, contratos ni certificaciones;
   - **SENIAT** solo dentro del caso de licores y del tenant de ejemplo, siempre enmarcado como
     propuesta de piloto y con la negación de relación oficial;
   - sin menciones de jurisdicciones como hecho (Venezuela, Estados Unidos…);
   - sin correos, teléfonos ni documentos de identidad en el contenido: el correo de contacto viaja
     en `PUBLIC_CONTACT_EMAIL`, no en los diccionarios;
   - las páginas corporativas no llevan cifras de escala o impacto.
4. **Sin scripts inline** (`tests/e2e/csp.spec.ts`): el único bloque inline permitido es el JSON-LD.
   No añadas `<script>` con código, ni atributos `style`/`on*` en el HTML servido. Los estilos que
   las islas necesitan en runtime se aplican por CSSOM.
5. **Códigos de unidad**: formato `TRZ-XXXX-XXXX-XXXX`. Los del registro usan el bloque `7F2K`
   (`TRZ-7F2K-4K7Q-92FA`…). No reintroduzcas el bloque `DEMO`.
6. **Navegación**: cinco entradas de primer nivel más el CTA. Añadir una página significa
   colgarla de `Soluciones` o de `Tecnología`, no crear una sexta entrada — y darla de alta en
   `src/i18n/index.ts`, en el pie y en `PAGE_KEYS` de las pruebas.

## Entorno y despliegue

`astro.config.ts` lee la URL y el base path del entorno, así que el mismo build sirve para cualquier
dominio o subdirectorio:

| Variable | Uso |
|---|---|
| `PUBLIC_SITE_URL` | canonical, hreflang, Open Graph, sitemap, robots |
| `PUBLIC_BASE_PATH` | prefijo cuando el sitio no vive en la raíz |
| `PUBLIC_CONTACT_EMAIL` | correo público de la página de empresa y del JSON-LD |
| `PUBLIC_API_MODE` | `mock` (fixtures locales, sin red) o `remote` |
| `PUBLIC_SHOW_COBRAND_EXAMPLE` | muestra u oculta el lockup de co-brand |

`.github/workflows/deploy.yml` obtiene `PUBLIC_SITE_URL` y `PUBLIC_BASE_PATH` de
`actions/configure-pages`, normalizando el origen a `https://`. Cambiar de dominio no requiere
tocar el código: se cambia en los ajustes de Pages.

`public/CNAME` fija el dominio en el artefacto para que un despliegue por Actions no vacíe el
ajuste de Pages.

## Cosas que sorprenden

- **`public/_headers` no se aplica.** El archivo lleva la CSP estricta y las cabeceras de seguridad
  en formato Netlify/Cloudflare Pages, pero GitHub Pages no envía cabeceras propias: hoy el sitio se
  sirve **sin** esas cabeceras. No asumas que la CSP está activa en producción.
- **Cloudflare está delante del dominio.** El proxy está activo, así que su "managed robots.txt"
  puede añadir bloqueos de rastreadores de IA por delante de nuestro `robots.txt`, y su caché puede
  servir HTML antiguo tras un despliegue. Ese comportamiento se configura en el panel, no aquí.
- **Las imágenes del hero y del relato tienen `srcset`** generado por
  `scripts/responsive-images.mjs`. Si reemplazas `public/images/v2/*.webp`, vuelve a ejecutarlo y
  revisa los anchos declarados en `sizes`.
- **`alt=""` en la botella del relato es correcto**: el contenedor es `aria-hidden` y la descripción
  la aporta un párrafo `story__sr-only`.
- **`docs/` ya no se publica.** Es documentación interna de la etapa de demostración y este
  repositorio es público: está en disco pero excluida por `.gitignore`, con copia en
  `~/TRAZA/web-docs`. Trátala como historia, no como especificación vigente. Las
  especificaciones vigentes del producto viven en `~/TRAZA`. No la vuelvas a añadir al índice
  de git ni la enlaces desde el README.
  Nota: sigue estando en el historial de git de los commits anteriores; retirarla de ahí
  exigiría reescribir el historial y un push forzado.
- **El QR de la etiqueta del hero es real.** `public/images/v2/hero-products.webp` lleva
  compuesto el QR de `HTTPS://T.EXAMPLE/V/7F2K4K7Q92FA` y decodifica en las tres variantes de
  ancho. Si reemplazas la fotografía, vuelve a componerlo y vuelve a comprobar que decodifica.
- **La analítica está cableada pero inerte.** El proveedor `firebase` solo se activa si existen
  las variables de Actions (`PUBLIC_ANALYTICS_PROVIDER` y las siete `PUBLIC_FIREBASE_*`). Sin
  ellas no se descarga el SDK ni se instala ninguna cookie.
