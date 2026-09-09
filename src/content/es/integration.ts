import type { ReferencePageContent } from '../types';

/**
 * Integración (ES). Página para quien va a conectar la plataforma con sus sistemas:
 * endpoints propuestos, reglas de cada operación y formatos previstos de entrega.
 */
export const integration: ReferencePageContent = {
  meta: {
    title: 'Integración: emitir, activar y consultar por API',
    description:
      'Los endpoints de emisión, activación, vinculación y consulta, con idempotencia, webhooks, formatos de entrega y los permisos por rol de cada identidad.',
  },

  hero: {
    eyebrow: 'Referencia de integración',
    title: 'Conecta tus sistemas. Conserva el contexto.',
    subtitle:
      'Esta es la arquitectura objetivo de integración: consola y API aplicarían las mismas reglas. Los endpoints descritos no están disponibles en esta web; su implementación y validación se acuerdan en cada despliegue.',
  },

  contentsLabel: 'En esta página',

  sections: [
    {
      id: 'emision',
      title: 'Emitir y activar',
      intro:
        'Son dos tiempos porque la fábrica funciona así: los códigos se imprimen mientras se produce, y los datos definitivos del lote solo existen cuando la corrida termina.',
      code: {
        caption: 'Endpoints propuestos del ciclo de emisión',
        lines: [
          'POST /v1/issuances',
          '     Genera identificadores para un producto. Activación conjunta solo',
          '     con producción finalizada, impresión confirmada y ficha completa.',
          '',
          'POST /v1/issuances/{id}/activate',
          '     Completa la ficha, que es lo que activa los códigos. Cuatro modos:',
          '     rango declarado · límites escaneados · sesión de escaneo · total',
          '',
          'POST /v1/issuances/{id}/reassign',
          '     Corrige la ficha de un rango. Queda en auditoría.',
          '',
          'GET  /v1/issuances/{id}/labels',
          '     Descarga paginada, o continua para tiradas grandes.',
        ],
      },
      paragraphs: [
        'La operación conjunta de emisión y activación se contempla solo para producto cuya producción ya terminó, con impresión confirmada y ficha completa de lote y vencimiento. Conocer esos datos por adelantado no permite activar unidades antes de terminar la producción.',
        'Emitir exige una cabecera de idempotencia. Un reintento por corte de red no genera una segunda tirada ni consume el saldo dos veces: devuelve exactamente la misma emisión.',
      ],
    },
    {
      id: 'activacion',
      title: 'Cuatro formas de activar, ordenadas por certeza',
      intro:
        'La asignación entre códigos y lote asume que la planta consumió las etiquetas en orden, y el mundo físico mezcla rollos. Por eso hay más de un método.',
      items: [
        {
          title: 'Rango declarado',
          body: 'Se declara desde dónde hasta dónde, con su lote y su vencimiento. Funciona en plantas con consumo ordenado, bajo responsabilidad declarada.',
          icon: 'list',
        },
        {
          title: 'Límites escaneados · recomendado',
          body: 'Al abrir la corrida se lee la etiqueta de la primera unidad; al cerrarla, la de la última. El sistema deriva el rango realmente observado y absorbe los desfases y las mermas.',
          icon: 'scan',
        },
        {
          title: 'Sesión de escaneo',
          body: 'Se abre una sesión para un lote y todo código leído durante ella queda asignado. La asignación deja de ser una suposición y pasa a ser una observación.',
          icon: 'clock',
        },
        {
          title: 'Auditoría de muestreo',
          body: 'Como control de cierre de producción, se escanean unidades al azar de cada lote y se compara la ficha asignada con lo impreso. Las diferencias quedan para revisión del responsable.',
          icon: 'compare',
        },
      ],
      note: 'Corregir la ficha es libre mientras el rango no tenga consultas públicas: el error se queda en fábrica. Si ya se consultó en el mercado, la corrección exige aprobación y abre un caso, porque el pasaporte ya mostró datos y el cambio debe ser defendible.',
    },
    {
      id: 'consulta',
      title: 'Consultar y vincular',
      code: {
        caption: 'Endpoints de consulta y de modo serial',
        lines: [
          'GET  /v1/verify/{code}',
          '     Consulta pública: estado y pasaporte. Anónima, con límite de tasa.',
          '     Prevista para integradores: farmacias y equipos de control.',
          '',
          'GET  /v1/labels/{code}',
          '     Consulta una etiqueta propia, con más detalle que la pública.',
          '',
          'POST /v1/labels/bind',
          '     Modo serial: vincula un código con el serial del fabricante, 1 a 1.',
          '',
          'POST /v1/labels/void',
          '     Anula rangos, con motivo. Queda en auditoría.',
          '',
          'Webhooks: issuance.issued · label.alert',
        ],
      },
      paragraphs: [
        'En modo serial, un serial repetido dentro del mismo producto, o un segundo intento de vincular el mismo código, se rechaza y abre una señal. El índice inverso de serial a código es lo que después permite una garantía por unidad o una retirada quirúrgica.',
        'La especificación completa se publica como OpenAPI, y la versión va en la ruta: lo que funciona hoy seguirá funcionando cuando aparezca la siguiente.',
      ],
    },
    {
      id: 'entrega',
      title: 'Cómo llega el resultado',
      specs: [
        { label: 'Recibo de emisión', value: 'Emisión, rango, estado de la ficha, su referencia y una huella del contenido', note: 'La huella permite comprobar la integridad de lo que recibió la imprenta.' },
        { label: 'Su propia referencia', value: 'El número de orden o de corrida que usted use', note: 'Viaja en la emisión y es filtrable: la conciliación con su sistema de gestión es directa.' },
        { label: 'Descarga', value: 'CSV · XLSX · imágenes · PDF de imposición', note: 'Toda descarga queda en auditoría: las etiquetas son identidades unitarias.' },
        { label: 'Línea de producción', value: 'Lenguaje nativo de impresora térmica', note: 'Para etiquetar a la velocidad de la máquina, sin pasar por un PDF.' },
        { label: 'Correlativo visible', value: 'Un número por producto', note: 'Internamente el código lleva emisión y posición; en pantalla se habla en un correlativo que no se repite.' },
      ],
    },
    {
      id: 'permisos',
      title: 'Identidades y permisos',
      intro:
        'La cuenta de un emisor autoriza la creación de identidades unitarias. La asimetría con el público es deliberada.',
      items: [
        {
          title: 'El público no tiene cuenta',
          body: 'Consultar y preparar un reporte local no piden cuenta. Esta web permite descargar código, tipo y descripción, sin correo ni ubicación. No envía el reporte ni modifica el registro; entréguelo a la organización responsable.',
          icon: 'citizen',
        },
        {
          title: 'La consola exige segundo factor',
          body: 'Correo corporativo y contraseña con segundo factor obligatorio, y clave de acceso opcional para quien quiera resistencia a suplantación. Nadie entra con solo una contraseña.',
          icon: 'key',
        },
        {
          title: 'Sin inicio de sesión social',
          body: 'La identidad de un emisor es corporativa. Un correo personal no debe controlar una cuenta que emite.',
          icon: 'shield-check',
        },
        {
          title: 'Identidad de máquina',
          body: 'Las integraciones usan clave de API con firma de la solicitud, alcances concretos y rotación. Revocable por clave y por dispositivo.',
          icon: 'plug',
        },
      ],
    },
    {
      id: 'degradacion',
      title: 'Qué sigue funcionando cuando algo falla',
      intro:
        'Un sistema de identificación no puede detener la producción ni el comercio. Eso deja de ser una aspiración y se convierte en un requisito de diseño.',
      items: [
        {
          title: 'Imprimir no depende de la conexión',
          body: 'El rango se descarga una vez y el proceso local alimenta la impresora, con cola propia y reporte de consumo al reconectar.',
          icon: 'offline',
        },
        {
          title: 'La consulta pública y la emisión son planos separados',
          body: 'La consulta debe seguir respondiendo aunque la emisión esté en mantenimiento. No comparten camino.',
          icon: 'layers',
        },
        {
          title: 'Abierto al leer, cerrado al escribir',
          body: 'Si el limitador de tasa se degrada, la consulta se sirve. Las escrituras y la autenticación, al contrario, fallan cerradas.',
          icon: 'lock',
        },
      ],
    },
  ],

  cta: {
    title: 'Antes de integrar',
    body: 'El formato del identificador y las especificaciones de impresión están en la referencia de la etiqueta. Si quiere entender por qué el diseño toma estas decisiones, la página de precedentes recorre los sistemas que ya lo intentaron.',
    primaryCta: { label: 'Ver la etiqueta y el código', key: 'codeSpec', variant: 'primary' },
    secondaryCta: { label: 'Por qué este diseño', key: 'rationale', variant: 'secondary' },
  },
};
