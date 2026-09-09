# Cierre funcional de la demo pública de Traza

Corte: 9 de septiembre de 2026. Sitio: https://traza.technology/. Base revisada: `7f5e2d648a4efe2072b2d78ccd40664cdec64559`. Este informe distingue comportamiento ejecutable, datos de ejemplo y servicios no implementados. No certifica ausencia universal de defectos ni una operación sanitaria real.

## Correcciones de esta revisión

1. El cambio ES ↔ EN conserva el código de unidad y el ámbito `t`, tanto desde el QR como después de una entrada manual o lectura de imagen. Solo se conserva un identificador Traza válido; un QR ajeno no se abre ni se añade a la URL.
2. La ficha, el teléfono ilustrativo y las vistas de producto usan Solución oral Traza, marca Traza y frasco de 120 ml, en coherencia con el envase aprobado. La concentración no visible se declara **no indicada**, sin inventar un valor impreso. El fabricante y la referencia sanitaria siguen siendo datos de ejemplo del registro, no acreditados por la imagen ni por una autoridad.
3. La cronología de ALR-2026-026 coincide con su alerta: consulta el 13 de julio a las 09:05 UTC, activación a las 10:00 y cierre a las 10:05. Se retiraron de esa historia las referencias residuales a recepción comercial/logística.
4. Los errores del reporte hablan de preparación local y conservan el texto para reintento. No anuncian un envío inexistente.
5. El neón conserva composición y transparencia. Variantes WebP proporcionales de 480/768/1024 px evitan servir siempre 1536 px. Los originales siguen intactos; procedimiento y huellas están en `src/brand/asset-provenance.json`.
6. La configuración GA4 desactiva el `page_view` automático porque la página ya lo emite explícitamente. Sigue respetando Do Not Track; en el dominio público se observaron cero peticiones a Google y cero cookies en un contexto nuevo con DNT=1. Cloudflare todavía inyecta su propio beacon, independiente de GA4. El fallo del proveedor no impide usar el sitio. La [documentación de Google](https://developers.google.com/analytics/devguides/collection/ga4/views) sustenta el ajuste para evitar vistas duplicadas. No se comprobó recepción en la cuenta de Analytics.
7. El comando de Lighthouse apunta al caso de medicamentos vigente.

## Inventario funcional finito

Las rutas inglesas equivalentes forman parte del mismo alcance.

| Función / requisito | Ruta | Estado | Evidencia y límite pendiente |
|---|---|---|---|
| Marca azul/orbital, medicamentos, siete composiciones integrales | `/`, `/plataforma/`, `/empresa/`, `/etiqueta/` | Operativo | Manifest de assets, revisión visual escritorio/móvil. Logo de interfaz independiente; ninguna superposición nueva sobre fotografías. |
| Navegación corporativa y pública, ES/EN | Todas las rutas | Operativo | Header, rutas y regresión `lookup-continuity.spec.ts`; el cambio de idioma mantiene unidad/ámbito. |
| QR público separado del envase | `/`, `/etiqueta/` | Operativo | URL HTTPS con `c` y `t`; raster/PNG y código manual equivalentes. Una fotografía del envase no es un QR escaneable. |
| Entrada manual / QR en imagen | `/verificar/` | Operativo sobre datos de ejemplo | Parser, decodificador portable, imagen invertida/rotada/panorámica, archivo corrupto/sin QR/grande, cancelación, URL ajena y recuperación. No se suben las imágenes. |
| Cámara | `/verificar/` | Implementado; validación física pendiente | Permiso denegado/tardío, vídeo de canvas con QR y liberación de tracks probados. Falta prueba con cámara de teléfono real, luz y distancia de uso. |
| Consulta / estados y errores | `/verificar/` | Motor ejecutable, registro simulado | Válido/advertencia/no válido/no verificable, firma, vigencia, datos, anomalías, código desconocido, offline/servidor/timeout/reintento. No consulta autoridades ni una base de producción. |
| Reporte de discrepancia | `/verificar/` | Preparación y descarga local operativas | JSON con datos escritos; sin envío, persistencia de servidor ni modificación del registro. Se pierde la copia en memoria al cerrar la página. |
| Recorrido por seis etapas | `/recorrido/` | Interactivo con eventos de ejemplo | Emisión, etiquetado, activación, consulta, señales, cierre. Reproduce hasta la última etapa realmente presente en el fixture; no completa eventos inexistentes. Reproducir/pausar/reiniciar/pasos/teclado, error/reintento y movimiento reducido. No incluye transporte, distribución ni ventas. |
| Roles, filtros, casos, inspecciones y auditoría | `/institucional/` | Simulado en sesión | Analista/inspector/observador y restricciones de interfaz verificadas. No hay autenticación, autorización de servidor ni guardado real. ALR-026 reconciliada con su ficha. |
| Contacto | `/empresa/`, `/en/company/` | Validación y preparación de `mailto:` operativas | Genera destinatario, asunto y cuerpo codificados. El usuario debe enviar desde su aplicación. No hay endpoint de envío, recepción confirmada ni CRM. No se enviaron mensajes de prueba. |
| Referencias de plataforma, integración y seguridad | `/plataforma/`, `/integracion/`, `/seguridad/` | Contenido/propuesta | No acreditan API desplegada, validación tributaria, certificación, anticopia física ni acuerdos institucionales. |
| Responsive y accesibilidad | Rutas principales ES/EN | Verificado en laboratorio | Escritorio/móvil, 320 px, zoom 200 %, foco, teclado, contraste comprobable y movimiento reducido. No sustituye pruebas con usuarios ni todos los dispositivos. |
| Analítica y cabeceras | Todas | Parcial / límite externo | GA4 configurado, DNT probado. Cloudflare añade cabecera report-only e inyección propias; ver pendiente administrativo abajo. |
| PDF y ZIP de BrandIA | Fuentes históricas | Recuperación parcial | ZIP00 verificado y fuentes parciales recuperadas. PDF y ZIP01–05 no recibidos; no bloquean estos flujos web, sí el cotejo histórico exhaustivo. |

## Los doce conceptos de la estampilla

No se equipara la imagen conceptual a un arte de imprenta. Los doce datos están en controles independientes, derivados de la misma unidad que abre el QR.

| Concepto original | Resolución actual / consistencia |
|---|---|
| 1. QR | URL pública `https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA&t=medicamentos`. |
| 2. Identificador único | `TRZ-7F2K-4K7Q-92FA`, idéntico en QR, estampilla y resultado. |
| 3. Territorio de destino | Por definir en cada implementación; no se inventa jurisdicción. |
| 4. Sitio de consulta | `traza.technology`, extraído de la URL funcional. |
| 5. Consecutivo de impresión | Campo independiente del ID; valor de ejemplo compartido con el código de barras. |
| 6. Código de barras | Code 128 del consecutivo; no se afirma identificación GS1 ni validez fiscal. |
| 7. Contenido neto | 120 ml, coincide con envase y presentación de la ficha. |
| 8. Nombre del producto | Solución oral Traza, coherente con marca y denominación visibles. |
| 9. Forma / concentración | Solución oral; concentración no indicada en el envase de ejemplo. Sustituye el grado alcohólico de la referencia, sin inventar dosificación. |
| 10. Fabricante / RIF | Se conserva responsable fabricante/importador y referencia sanitaria `RS-EJEMPLO`. No se publica un RIF ficticio ni se afirma validación tributaria. Es una adaptación explícita al alcance farmacéutico, no cumplimiento literal fiscal. |
| 11. Fecha de emisión | Derivada de la emisión de identidad de esa unidad; distinta de fabricación, activación y vencimiento. |
| 12. Lote | `LOTE-VS-26-012`, compartido con la ficha y la vista ilustrativa. |

`medicine-stamp.test.ts` contrasta código, lote, fabricante, volumen, emisión, barras y QR con el registro. Los textos de concentración se adaptaron al envase aprobado; no se suprimió el campo ni su comprobación.

## Mapeo de pedidos recuperados R01–R14

La fuente es el inventario recuperado de los mensajes y 16 adjuntos de BrandIA; se distinguen decisiones posteriores vigentes de estados históricos.

| Pedido | Resultado / límite |
|---|---|
| R01 repo, imágenes, auditoría y coordinación | Repo correcto y revisión independiente de uso; tres P2 integrados. Uso de Fable no acreditado; no se presenta como método ejecutado. |
| R02 retirar autoridad anterior | Co-brand condicional «Empresa Pública y/o Privada», medicamentos, sin atribuir relación institucional. |
| R03 recursos con Claude Design | Ejecución de Claude Design no acreditada. Método vigente autorizado: siete recursos integrales con ImageGen y derivados proporcionales documentados. |
| R04 y R06 informar avances | Informe con resultados, mediciones y pendientes verificables. |
| R05 identidad Traza | Dominio y repo de Traza, sin confundirlos con BrandIA B2B. |
| R07 mejoras en línea tras auditoría | Publicación autorizada y comprobación en dominio; cotejo de los 30 tramos del PDF pendiente porque faltan sus bytes. |
| R08 medicamentos y estampilla | Caso farmacéutico, QR desde producción, doce conceptos conciliados en la tabla anterior; campos fiscales/integraciones condicionados. |
| R09 logo también en ejemplos | Marca común en interfaz y composiciones; ficha de producto alineada en esta revisión. |
| R10 inspiración visual | Navy, azul orbital, neón, jerarquía, blanco y menta conservados. No implica implementar logística de las maquetas. |
| R11 logo y estilo | Siete composiciones e identidad aprobadas conservadas; neón optimizado sin reconstrucción creativa. |
| R12 reanudación | Trabajo continuado desde HEAD verificado, sin sobrescribir cambios concurrentes. |
| R13 apoyo y coordinación | Integrador único y auditor independiente; evidencia compartida con la tarea coordinadora. |
| R14 revisar avances antes de seguir | Base publicada y fuentes recuperadas revisadas antes de corregir; archivos ausentes identificados, no supuestos. |

## Medición y validación

Medición con Chrome headless instalado en macOS, contextos nuevos, viewport 1366×844 y 390×844, DPR1, sin limitación artificial de CPU o red. Tres muestras por ruta y ancho. DNS/CDN y la carga de esta Mac pueden variar; las muestras no son datos de usuarios reales. `scripts/measure-site.mjs` observa cuatro segundos después de `load`; LCP/CLS corresponden a esa ventana y sin interacción. TTFB mide requestStart→responseStart, no renderizado. Peso es encodedBodySize conocido: el navegador puede ocultar tamaños de terceros; imágenes lazy fuera del viewport no se cuentan hasta cargarlas.

Medianas de la base pública `7f5e2d6` (36 muestras):

| Ancho | Ruta | TTFB mediana | FCP | LCP | load | CLS | Imágenes | JS propio |
|---|---|---|---|---|---|---|---|---|
| 1366 | `/` | 107 ms | 0.880 s | 0.880 s | 1.011 s | 0.0004 | 168.1 KiB | 10.7 KiB |
| 1366 | `/verificar/` | 94 ms | 0.816 s | 0.816 s | 1.117 s | 0.0004 | 2.2 KiB | 27.7 KiB |
| 1366 | `/recorrido/` | 104 ms | 0.644 s | 0.644 s | 0.887 s | 0.0005 | 0.0 KiB | 19.0 KiB |
| 1366 | `/institucional/` | 87 ms | 0.448 s | 0.448 s | 0.591 s | 0.0158 | 0.0 KiB | 30.1 KiB |
| 1366 | `/empresa/` | 94 ms | 1.312 s | 1.312 s | 1.501 s | 0.0004 | 225.8 KiB | 19.3 KiB |
| 1366 | `/en/` | 130 ms | 0.740 s | 0.740 s | 0.914 s | 0.0004 | 168.1 KiB | 10.7 KiB |
| 390 | `/` | 73 ms | 0.712 s | 0.712 s | 0.807 s | 0.0000 | 147.4 KiB | 10.7 KiB |
| 390 | `/verificar/` | 99 ms | 0.652 s | 0.652 s | 0.775 s | 0.0000 | 2.2 KiB | 27.7 KiB |
| 390 | `/recorrido/` | 76 ms | 0.596 s | 0.596 s | 0.687 s | 0.0002 | 0.0 KiB | 19.0 KiB |
| 390 | `/institucional/` | 83 ms | 0.668 s | 0.668 s | 0.783 s | 0.0000 | 0.0 KiB | 30.1 KiB |
| 390 | `/empresa/` | 78 ms | 0.648 s | 0.808 s | 0.788 s | 0.0000 | 225.8 KiB | 19.3 KiB |
| 390 | `/en/` | 80 ms | 0.728 s | 0.768 s | 0.849 s | 0.0000 | 158.6 KiB | 10.7 KiB |

Comparación posterior: pendiente de publicación verificada del candidato. Datos brutos en `.lighthouse/closure-before.json` y `.lighthouse/closure-after.json`, reproducibles con el script versionado. No se presenta reducción de bytes como igual porcentaje de rapidez.

Interacciones del candidato en servidor estático local, 3 muestras por ancho, sin throttling: consulta manual 0,868 s (1366 px) / 0,868 s (390 px); lectura del QR de ejemplo hasta resultado 0,777 / 1,010 s; recorrido automático 5,874 / 5,883 s hasta la cuarta etapa (última registrada de esta unidad). El cronómetro Playwright incluye acción y espera de visibilidad, no es INP ni latencia de backend. La API local introduce 450–900 ms de espera artificial; el recorrido usa 900 ms de trazo y 700 ms de pausa, hasta unos 9,4 s para seis etapas registradas. Estos tiempos de interacción locales no se mezclan con los tiempos públicos de red.

## Validación del candidato

Astro: cero errores, advertencias e indicaciones. Unitarias: **300/300**. Build: **38 rutas**. Se verificaron las regresiones de idioma, datos de medicamento, coherencia temporal y analítica. Las pruebas de QR conservan lectura real de píxeles, aislamiento de archivos, controles de cámara y registro CSP; las de contacto comprueban `mailto:` sin envío real.

La primera pasada afectada obtuvo 177/182: detectó y permitió corregir la regresión del QR ajeno; el build de prueba carecía de destinatario de contacto y la prueba móvil debía abrir el menú. Se corrigieron la aplicación y esas condiciones, manteniendo las aserciones. La repetición quedó detenida al cambiar de archivo/grupo sin finalizar; se ejecutaron solo los casos pendientes en procesos acotados con salida temporal. No se atribuye ese bloqueo del ejecutor a la web ni se declara una pasada completa inexistente. **Resultado final: 96/96 casos afectados con resultado aprobado, en tandas (45 + 3 de escritorio; 26 + 22 de móvil), sin reintentos automáticos.** Se mantuvo la instrumentación de violaciones CSP; las tandas finales prescindieron del archivo de traza de red. La preparación de correo quedó validada con los mismos destinatarios públicos que el workflow.

## Pendientes externos y mínima acción humana

- **Cloudflare:** el dominio devuelve una CSP `Report-Only` que no contiene `blob:` en imágenes, añade `upgrade-insecure-requests` (Chrome lo ignora en report-only) e inyecta `static.cloudflareinsights.com`, ausente de su `script-src`. Es distinta de `public/_headers`; GitHub Pages no aplica ese archivo. La comprobación del panel quedó en Turnstile «Verify you are human». Juan/administrador debe completar esa verificación para localizar la regla y alinear cabecera e inyección autorizadas; todavía no se confirmó la regla exacta ni se cambió seguridad/DNS. Los fallos DNS de Google/Cloudflare observados en esta Mac se documentan aparte, sin atribuirlos a todos los visitantes.
- **Cámara e impresión:** probar una vez con el teléfono y la pieza física que se usarán en la presentación. El lector y el QR digital están implementados; no se afirma certificación física ni lectura universal bajo cualquier iluminación.
- **Histórico:** Chrome muestra «Error: Bloqueados» para el PDF. Juan/administrador debe revisar ese bloqueo y autorizar la entrega del PDF y ZIP pendientes por el canal privado acordado. No se repitieron descargas ni se eludió la política. No aprobar una tarjeta `unsubscribe PR` como si fuera subida de archivos.
- **Backend:** no es un pendiente para mostrar esta demo; sería un proyecto posterior con API, identidad/roles reales, persistencia, servicios de contacto e integraciones autorizadas. No se estima como una corrección cosmética ni se afirma que esté instalado.
