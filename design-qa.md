# Traza v2 — QA visual y funcional

final result: passed

Fecha de cierre: 2026-09-06. Alcance: portada v2 ES/EN, los dos relatos interactivos, consulta pública y humo de las tres demostraciones heredadas. La v1 permanece intacta.

## Referencia y comparación

- Referencia seleccionada: `../references/approved-v2.png`, 1058 × 1487 px.
- Capturas finales: `../qa/home-final-1058.png`, `../qa/story-final-1058.png`, `../qa/home-en-1440.png`, `../qa/story-program-mobile-360.png`, `../qa/story-lookup-final-desktop.png`, `../qa/story-lookup-details-mobile-360.png`, `../qa/verification-final2-mobile390.png` y `../qa/story-final2-mobile390.png`.
- Comparaciones 1:1: `../qa/comparison-final.png`, `../qa/comparison-hero-final.png` y `../qa/comparison-story-final.png`. Fuente a la izquierda, implementación a la derecha.
- Las capturas antiguas con `fullPage` produjeron segmentos repetidos y no se consideran evidencia de fidelidad.

## Hallazgos corregidos durante la iteración

- P1: el contador global sustituía capítulos al usar `data-count`. Se aisló como `data-chapter-count`; cuatro y seis capítulos permanecen visibles.
- P2: el identificador del registro usa Roboto Mono y no desborda.
- P2: el texto activo se separó de la fotografía con una columna navy opaca; los cuatro límites son legibles en escritorio y móvil.
- P2: se retiraron expresiones heredadas como «Verificación superada» y «Escanea. Verifica. Confía.» de la consulta e inspección. El estado es «Ejemplo sin alertas» y conserva sus límites.
- P2: ayudas de Firma/Registro/Datos/Señales a 16 px; términos técnicos y auxiliares a 14 px como mínimo. Captura y estilo computado verificados a 390 px.

## Cinco superficies

- Tipografía: Space Grotesk para jerarquía, Roboto para cuerpo y Roboto Mono para identificadores. Código crítico y ayudas no bajan de 16 px; auxiliares del relato no bajan de 14 px.
- Espaciado: hero y comienzo del relato conservan la composición de la referencia; el contenido activo refluye sin solaparse.
- Color: navy `#07152b`, cobalto `#1f4fd8` y cian como acento. El estado no depende solo del color.
- Imagen: los envases y la botella del relato son activos separados; no se rasterizó la página.
- Contenido: fixture `TRZ-DEMO-4K7Q-92FA`; datos y programas rotulados como simulación o propuesta. Firma de datos no equivale a anticopia física; registro no demuestra ubicación; la persona compara datos; ausencia de alertas no significa ausencia de riesgo.

## Pruebas finales

- 196/196 pruebas unitarias pasadas.
- Astro check: 173 archivos, 0 errores, 0 advertencias y 0 hints.
- Build estática: 30 páginas.
- Portada y relatos inspeccionados a 360, 390, 768, 1058 y 1440 px; sin desbordamiento horizontal en los tamaños medidos.
- Relatos: flechas, Home y End; capítulos, anterior/siguiente/reinicio; reproducción a petición, pausa al salir del componente y final sin bucle. Con movimiento reducido, el avance manual y el contenido completo permanecen disponibles.
- Sin JavaScript, ambos relatos y sus transcripciones permanecen en el HTML servido.
- Consulta: deeplink con fixture; estado encontrado, formato no válido, escenarios, fallo de red y reintento automático. Sin conexión no se presenta como veredicto sobre el producto.
- Recorrido: avance de evento y estado sin recorrido.
- Vista institucional: rol observador, filtro de alertas, detalle y restricción de permiso.
- Consola: sin errores en portada, recorrido, vista institucional y consulta durante el humo realizado.
- Enlaces: 88 destinos/anclas de portada ES/EN revisados sin destinos internos faltantes.

## Límites conocidos, no bloqueantes

- Verificado en Chromium local; no se probó un lector de pantalla real, Safari, Firefox ni hardware móvil físico.
- Cámara real y desconexión del sistema operativo no se ejercieron: se probaron sus estados simulados y la entrada manual.
- El vídeo de diez segundos es un clip de control separado, no una película narrativa completa ni un elemento publicado.
- La equivalencia visual es editorial, no píxel por píxel: los datos de la referencia se sustituyeron por el fixture real y la fotografía final conserva continuidad con la portada.
- P3 opcional: el botón del relato usa el icono de flecha del sistema existente en vez del play circular del mock. No afecta comprensión, teclado ni contraste.

No hay P0, P1 o P2 abiertos confirmados en el alcance probado.
