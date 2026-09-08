import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'Cómo funciona',
    description:
      'Paso a paso: emisión de la identidad, etiquetado, eventos de cadena y verificación pública por señales separadas, con sus posibles resultados explicados.',
  },

  hero: {
    eyebrow: 'Cómo funciona',
    title: 'Del código en la etiqueta al resultado en pantalla',
    subtitle:
      'Traza sigue un principio sencillo: cada unidad tiene una identidad firmada, cada movimiento deja un evento y cualquier persona puede comprobar ambos. Así ocurre, paso a paso.',
  },

  steps: {
    title: 'Cinco pasos',
    intro:
      'Desde que una unidad recibe su identidad hasta que alguien la verifica en un comercio, el proceso pasa por cinco momentos.',
    items: [
      {
        label: '01',
        title: 'Emisión de la identidad',
        body: 'El fabricante o importador genera un identificador único para cada unidad y lo firma con sus propias claves. Ese identificador recoge los cuatro campos de la historia: fabricante o importador, producto y presentación, origen y lote, y destino previsto.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Etiquetado',
        body: 'El identificador firmado se imprime como código en la etiqueta o el precinto. A partir de ahí, la unidad física y su identidad digital viajan juntas.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Registro de eventos',
        body: 'Cada actor de la cadena —aduana, transporte, distribución, comercio— reporta un evento cuando la unidad pasa por sus manos. El registro los conserva en orden, con fecha y responsable.',
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
        id: 'origin',
        label: 'Fábrica / aduana',
        description: 'Punto de emisión: la unidad recibe su identidad al salir de producción o al ingresar al país.',
        icon: 'factory',
      },
      {
        id: 'labeling',
        label: 'Etiquetado',
        description: 'El código firmado se incorpora a la etiqueta o al precinto de la unidad.',
        icon: 'label',
      },
      {
        id: 'transport',
        label: 'Transporte',
        description: 'Cada traslado se registra con origen, destino y fecha.',
        icon: 'truck',
      },
      {
        id: 'distribution',
        label: 'Distribución',
        description: 'Los centros de distribución confirman recepción y salida hacia el comercio.',
        icon: 'warehouse',
      },
      {
        id: 'commerce',
        label: 'Comercio',
        description: 'El punto de venta registra la llegada; la unidad queda a disposición del público.',
        icon: 'store',
      },
      {
        id: 'verification',
        label: 'Verificación',
        description: 'La verificación final compara la etiqueta con el registro y explica el resultado.',
        icon: 'scan',
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
        body: 'Contrasta los datos de la etiqueta con los del registro: producto, presentación, lote y destino.',
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
        body: 'La firma es válida, pero el registro muestra algo que conviene revisar: por ejemplo, consultas repetidas del mismo código o un movimiento fuera de la ruta prevista. El siguiente paso es contrastar con la unidad y, si procede, reportar.',
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
      'La demostración de verificación incluye códigos simulados que muestran cada uno de los resultados posibles.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Ver el recorrido', key: 'journey', variant: 'secondary' },
  },
};
