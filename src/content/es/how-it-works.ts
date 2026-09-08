import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'Cómo funciona: de la identidad a la consulta',
    description:
      'Paso a paso: emisión de la identidad, etiquetado, eventos de la cadena y verificación pública por señales separadas, con cada resultado y sus límites.',
  },

  hero: {
    eyebrow: 'Cómo funciona',
    title: 'Del código en la etiqueta al resultado en pantalla',
    subtitle:
      'Traza sigue un principio sencillo: cada unidad tiene una identidad firmada, cada momento de su ciclo de vida deja un evento y cualquier persona puede comprobar ambos. Así ocurre, paso a paso.',
  },

  steps: {
    title: 'Cinco pasos',
    intro:
      'Desde que una unidad recibe su identidad hasta que alguien la comprueba frente a un anaquel, el proceso pasa por cinco momentos.',
    items: [
      {
        label: '01',
        title: 'Emisión de la identidad',
        body: 'El fabricante o importador solicita una emisión y la plataforma deriva y firma un identificador único por unidad, con las claves bajo su custodia. Ese identificador recoge los cuatro campos de la historia: quién emite, qué es el producto, de qué lote viene y cuándo vence.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Etiquetado',
        body: 'El identificador firmado se imprime como código en la etiqueta, con la infraestructura de la propia planta y tras aprobar una prueba de imprenta. A partir de ahí, la unidad física y su identidad digital viajan juntas.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Registro de eventos',
        body: 'Al cerrar el lote, el emisor completa la ficha —lote y fecha de vencimiento, o serial— y en ese momento los códigos quedan activados. Un código emitido que se consulta sin estar activado no dice «verificado»: dice «en revisión».',
        icon: 'history',
      },
      {
        label: '04',
        title: 'Verificación pública',
        body: 'Quien tiene la unidad delante escanea el código o lo escribe en la página de verificación. El servicio evalúa cuatro señales y devuelve un resultado explicado.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Control e inspección',
        body: 'Reguladores y empresas siguen anomalías y reportes de discrepancia, priorizan inspecciones de campo y registran lo observado en sitio.',
        icon: 'search',
      },
    ],
  },

  chain: {
    title: 'La cadena, nodo a nodo',
    intro:
      'La historia de una unidad se construye con los eventos de estos nodos. No todos los despliegues usan los mismos; cada tenant define los que le importan.',
    nodes: [
      {
        id: 'issuance',
        label: 'Emisión',
        description: 'La plataforma deriva y firma el identificador de cada unidad, dentro de la orden solicitada.',
        icon: 'signature',
      },
      {
        id: 'labeling',
        label: 'Etiquetado',
        description: 'El código firmado se imprime y se aplica a la unidad, con la infraestructura de la propia planta.',
        icon: 'label',
      },
      {
        id: 'activation',
        label: 'Activación',
        description: 'Al cerrar el lote se completa la ficha —lote y vencimiento, o serial— y los códigos quedan activados.',
        icon: 'check',
      },
      {
        id: 'lookup',
        label: 'Consulta pública',
        description: 'Cualquier persona comprueba la unidad desde el navegador y compara lo que ve con el registro.',
        icon: 'scan',
      },
      {
        id: 'signals',
        label: 'Señales',
        description: 'Cada consulta suma contexto: cuándo fue la primera, cuántas van y si el patrón es imposible para una sola unidad.',
        icon: 'chart',
      },
      {
        id: 'closure',
        label: 'Cierre',
        description: 'Al terminar la activación, los correlativos que no se usaron se anulan por rango.',
        icon: 'lock',
      },
    ],
    cta: { label: 'Ver el recorrido interactivo', key: 'journey', variant: 'link' },
  },

  verification: {
    title: 'Qué ocurre al verificar',
    intro:
      'El resultado de una verificación no es una sola palabra. Se construye con cuatro señales independientes, cada una con su explicación.',
    signals: [
      {
        key: 'signature',
        title: 'Firma',
        body: 'Comprueba que la identidad fue emitida por el emisor esperado y que no ha sido alterada desde entonces.',
        icon: 'signature',
      },
      {
        key: 'registry',
        title: 'Estado en el registro',
        body: 'Consulta si la identidad está activa, suspendida o revocada, y qué eventos constan en su historia.',
        icon: 'database',
      },
      {
        key: 'match',
        title: 'Coincidencia de datos',
        body: 'Contrasta los datos de la etiqueta con los del registro: producto, presentación, lote y fecha de vencimiento.',
        icon: 'compare',
      },
      {
        key: 'anomalies',
        title: 'Anomalías',
        body: 'Busca patrones que conviene revisar: el mismo código consultado en lugares distintos, eventos fuera de secuencia o ubicaciones inconsistentes.',
        icon: 'alert',
      },
    ],
    outcomes: [
      {
        status: 'valid',
        title: 'Firma emitida y datos coincidentes',
        body: 'La identidad fue emitida por el emisor esperado, está activa en el registro, sus datos coinciden con la etiqueta y no hay anomalías. Es una señal sólida; contrastar con la unidad física sigue siendo el complemento.',
      },
      {
        status: 'warning',
        title: 'Con advertencias',
        body: 'La firma es válida, pero el registro muestra algo que conviene revisar: por ejemplo, el mismo código consultado desde lugares que una sola unidad no puede recorrer en ese tiempo. El siguiente paso es contrastar con la unidad y, si procede, reportar.',
      },
      {
        status: 'invalid',
        title: 'Firma no válida o identidad no reconocida',
        body: 'El código no corresponde a una identidad emitida, o el registro indica que fue revocada. No trate la unidad como verificada y utilice el reporte de discrepancias.',
      },
      {
        status: 'unverifiable',
        title: 'No se pudo verificar',
        body: 'No fue posible consultar el registro —por ejemplo, sin conexión— o el código no se pudo leer. No es un veredicto sobre la unidad: inténtelo de nuevo cuando sea posible.',
      },
    ],
    caution:
      'Una firma válida indica que la identidad fue emitida; no describe el contenido físico ni impide que una etiqueta se copie. Por eso el resultado siempre explica qué se comprobó, qué confianza aporta y cuál es el siguiente paso.',
  },

  requirements: {
    title: 'Qué hace falta para verificar',
    intro: 'Muy poco. La verificación pública se diseñó para funcionar en el punto de venta con lo que cualquier persona ya lleva encima.',
    items: [
      {
        title: 'Un navegador actual',
        body: 'La verificación se abre como una página web en el teléfono o en un equipo de escritorio.',
        icon: 'phone',
      },
      {
        title: 'Sin instalación ni cuenta',
        body: 'No hay nada que descargar ni que registrar. Tampoco se piden datos personales para verificar.',
        icon: 'lock',
      },
      {
        title: 'Conexión para consultar el registro',
        body: 'El estado en el registro y las anomalías requieren conexión. Sin ella, el resultado se marca como no verificable y se puede reintentar.',
        icon: 'offline',
      },
      {
        title: 'Un código legible',
        body: 'El código de la etiqueta se escanea con la cámara o se escribe a mano si está dañado.',
        icon: 'qr',
      },
    ],
  },

  cta: {
    title: 'Véalo con un código de ejemplo',
    body:
      'La verificación pública incluye códigos de ejemplo que muestran cada uno de los resultados posibles.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Ver el recorrido', key: 'journey', variant: 'secondary' },
  },
};
