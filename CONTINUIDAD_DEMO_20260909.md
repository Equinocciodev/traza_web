# Continuidad de la demo pública de Traza — 9 de septiembre de 2026

## Alcance de esta entrega

Publicación autorizada por el propietario como demo para presentaciones, no como lanzamiento comercial. Repositorio canónico: `Equinocciodev/traza_web`; dominio existente: https://traza.technology/. Este candidato parte de `45ba280d543e772c4f42bb16fdbcfa397e6aeeb4` e integra la versión local revisada, conservando el workflow de GitHub Pages y el CNAME existentes.

Incluye diseño de medicamentos y navegación ES/EN, recursos visuales locales, ejemplo de medicamento de 120 ml, lectura de QR por imagen y cámara con entrada manual alternativa, comprobación por código, recorrido, vista institucional, descarga local de reporte y contacto. Las pantallas y datos de ejemplo son ilustrativos. La fecha de fabricación, que representa un día de calendario, se formatea en UTC para evitar que el 12 de julio aparezca como 11 de julio en zonas horarias occidentales.

## Validación realizada antes del push

- Instalación con `npm ci` completada.
- 295 pruebas unitarias aprobadas.
- Astro check: 225 archivos, cero errores, advertencias o sugerencias.
- Build: 38 páginas generado correctamente.
- Batería de navegador: 622 casos; 616 aprobados, 2 omitidos y 4 fallos en la ejecución inicial con seis workers.
- Los ocho casos nuevos de smoke pasaron en escritorio/móvil y ES/EN: fecha correcta y portada → consulta → lectura del QR de ejemplo → recorrido → vista institucional.
- Regresión de fecha: cuatro casos fallaron contra la versión anterior por mostrar el día 11 y pasaron en el candidato mostrando el 12.
- Revisión independiente del candidato sin bloqueantes dentro del alcance examinado; no se alteraron el dominio ni el workflow, ni se incluyeron originales privados.

### Cuatro fallos iniciales y su estado real

| Caso | Ejecución inicial | Repetición focalizada, un worker |
|---|---|---|
| Privacidad, móvil | Timeout al pulsar reconocimiento de alerta; elemento inestable/fuera del viewport | Aprobado |
| Botones visibles de `/verificar/`, móvil | Timeout al pulsar lectura de QR y falta de efecto observado en Verificar | Aprobado |
| `signature_invalid`, móvil | Se perdió la observación transitoria de `aria-busy=true` | Aprobado |
| Teclado del recorrido, accesibilidad | Lectura de índice tras End obtuvo 0 | Aprobado |

La repetición terminó con **4/4 aprobadas en 56,3 segundos**, sin cambios de código. Por tanto no hay cuatro fallos reproducidos pendientes, pero queda documentada la inestabilidad observada con concurrencia. No se afirma que se haya repetido íntegra la batería de 622 casos. El propietario pidió cerrar las mejoras y hacer commit/push sin más pruebas.

El build local usó analítica desactivada y el servidor local aplicó `dist/_headers`. El workflow público conserva su configuración de analítica existente. GitHub Pages no aplica ese archivo de cabeceras: las comprobaciones locales de privacidad/CSP no certifican por sí solas el entorno público.

## Entrega de Cloud deliberadamente no integrada

No se aplicó la entrega completa del PR de Cloud, sus parches ni su bundle. Esa entrega solapa numerosos archivos del candidato y tenía validación E2E pendiente o fallida; tampoco se integraron sus nuevas propuestas visuales sin validar. Los informes, renders y propuestas quedan como referencias para una revisión posterior, sin reemplazar este código publicado. También se dejaron fuera tres componentes locales no utilizados: MiniPanel, Matrix y Faq.

## Originales recuperados y pendientes

Se recuperaron y verificaron el manifiesto `codex-zips.sha256` y `codex-00-README-y-manifiesto.zip` (15.058 bytes, SHA-256 `9805e619ea710fe34935a6a7f1144fd7dc3c7fbdec0feec926786302cca8782a`). El ZIP contiene README y manifiesto; se verificaron hash, CRC y rutas de extracción.

Pendientes: `codex-01-propuesta.zip`, `codex-02-codigo.zip`, `codex-03-evidencia-docs.zip`, `codex-04-originales-juan.zip`, `codex-05-capturas.zip` y el PDF original completo. Es decir, 1 de 6 ZIP verificado y 2 de 7 archivos de la entrega recibidos, contando el manifiesto. Los originales y sus copias de Drive permanecen fuera de este repositorio público. No son requisitos para presentar los cinco flujos verificados.

## Continuación para otro agente

1. Partir del commit que contiene este documento, después de consultar el estado remoto; no sobrescribirlo con el worktree local anterior ni aplicar el bundle de Cloud completo.
2. Consultar la ejecución de GitHub Pages asociada al push y comprobar el sitio público. Al redactar este documento todavía no se había hecho el push, por lo que no se certifica aquí el despliegue ni la prueba pública posterior.
3. Mantener separados los ejemplos de demo y cualquier afirmación de capacidad comercial real.
4. Si se retoma QA, investigar las cuatro intermitencias bajo concurrencia y completar la comprobación pública de los cinco flujos; no ocultar los resultados iniciales.
5. Recuperar únicamente los originales faltantes mediante canales autorizados, verificar sus hashes y revisar Cloud por cambios concretos, con pruebas, antes de integrar.
6. Conservar los worktrees originales y la documentación de continuidad de Drive. No publicar archivos privados, sesiones ni secretos.

En caso de necesitar retirar esta entrega, revertir su commit mediante un nuevo commit (sin force push). La versión pública anterior corresponde a `45ba280d543e772c4f42bb16fdbcfa397e6aeeb4`.
