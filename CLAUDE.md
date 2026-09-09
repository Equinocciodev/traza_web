# CLAUDE.md

Guía para trabajar en este repositorio. Léela antes de tocar contenido o plantillas: el proyecto
tiene contratos automatizados que fallan si se escribe "a ojo".

## Qué es esto

Sitio web corporativo de **Traza Technology, C.A.** (marca **Traza®**): identidad digital unitaria,
trazabilidad y verificación pública de productos. Astro estático, español en la raíz e inglés bajo
`/en/`. Publicado en <https://traza.technology> por GitHub Pages.

**Demo pública para presentación, por indicación vigente de Juan (9 septiembre de 2026).**
No se debe presentar como un producto comercial terminado ni como un lanzamiento. Los flujos usan
registros y cifras de ejemplo; no acreditan una operación real. En las pantallas se conserva el
vocabulario «ejemplo» y «propuesta de piloto». La instrucción anterior que lo declaraba producto real
queda sustituida por esta indicación. No hacer publicidad externa ni desplegar sin autorización.

**El registro es de ciclo de vida, no logístico.** La decisión D9 de las especificaciones retiró
del alcance la trazabilidad de venta: la plataforma no registra transporte ni distribución. Las
seis etapas (`CHAIN_STAGES`) son `issuance · labeling · activation · lookup · signals · closure`,
y las tres vistas —inicio, «cómo funciona» y `/recorrido/`— deben usar ese mismo orden. Si vuelves
a escribir «cada actor de la cadena reporta un evento», estás describiendo la fase 3.

## Comandos

```bash
npm run dev          # servidor de desarrollo en :4321
npm run check        # astro check — tipos y plantillas (debe quedar en 0 errores)
npm test             # Vitest: pruebas unitarias (motor, API, fixtures, i18n, paridad ES/EN, guardarraíles)
npm run build        # build estático en dist/ (38 rutas)
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
   - caso de uso y ejemplos centrados en **medicamentos** (solución oral de 120 ml); sin referencias
     a licores ni a su autoridad anterior en contenido, fixtures o configuración;
   - co-brand **EMPRESA PÚBLICA Y/O PRIVADA | TRAZA**, siempre condicional y sin afirmar relaciones;
   - el QR nace con cada unidad: emisión → impresión → activación al finalizar producción → consulta/control;
   - medidas físicas anticopia y validación tributaria solo como fase 2, pendiente de integración autorizada;
   - sin menciones de jurisdicciones como hecho (Venezuela, Estados Unidos…);
   - sin correos, teléfonos ni documentos de identidad en el contenido: el correo de contacto viaja
     en `PUBLIC_CONTACT_EMAIL`, no en los diccionarios;
   - las páginas corporativas no llevan cifras de escala o impacto.
4. **Sin scripts inline** (`tests/e2e/csp.spec.ts`): el único bloque inline permitido es el JSON-LD.
   No añadas `<script>` con código, ni atributos `style`/`on*` en el HTML servido. Los estilos que
   las islas necesitan en runtime se aplican por CSSOM.
5. **Códigos de unidad**: formato `TRZ-XXXX-XXXX-XXXX`. Los del registro usan el bloque `7F2K`
   (`TRZ-7F2K-4K7Q-92FA`…). No reintroduzcas el bloque `DEMO`.
6. **Navegación**: cuatro entradas corporativas: `Soluciones · Plataforma · Recursos · Empresa`,
   más el selector de idioma y el CTA `Solicitar presentación`. `Recursos` agrupa Cómo funciona,
   La etiqueta y el código, Integración, Seguridad y confianza y Por qué este diseño.
   Verificar y Ciudadanos usan la variante pública: `Verificar un producto · Ayuda`, selector
   de idioma y sin CTA comercial. Añadir una página significa colgarla de `Soluciones` o de
   `Recursos`, no crear una quinta entrada — y darla de alta en `src/i18n/index.ts`, en el pie
   y en `PAGE_KEYS` de las pruebas. Mantener las variantes equivalentes en ES y EN.

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
- **El hero de Inicio presenta el software; el QR real está en la sección de producto siguiente.**
  La fotografía conserva el nombre `public/images/v2/hero-products.webp`; `HomePage.astro`
  superpone el SVG de `src/brand/hero-qr.ts`, que codifica
  `https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA&t=medicamentos`, coherente con el lector y la
  estampilla. Si cambia la fotografía, el QR o su composición, comprobar la lectura sobre
  capturas de la página servida a los anchos y DPR correspondientes, no solo sobre el bitmap.
- **La analítica solo corre en producción.** El proveedor `ga4` (gtag.js) se activa en el
  workflow de despliegue; en local y en las pruebas queda en `none`, que es lo que espera
  `tests/e2e/privacy.spec.ts` al comprobar que no se crean cookies. El identificador de
  medición es el valor por defecto de `astro.config.ts`: es público por diseño, viaja en el
  bundle y se ve en la URL de gtag.js. La configuración de gtag vive en
  `src/lib/analytics-ga4.ts`, en un módulo propio y no en un script en línea, porque la CSP no
  admite ninguno. Y se respeta «Do Not Track»: un visitante que la tenga activada no se mide.
