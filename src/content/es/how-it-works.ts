import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'Cómo funciona: del QR a la consulta de la unidad',
    description:
      'Cómo nace el QR de cada medicamento: emisión, impresión y activación al cerrar producción, seguidas de consulta pública y control con resultados explicados.',
  },

  hero: {
    eyebrow: 'Cómo funciona',
    title: 'Del medicamento al registro, paso a paso',
    subtitle:
      'Cada frasco de medicamento tiene su propia identidad. El QR se imprime durante la producción y se activa al finalizarla, cuando el responsable completa la ficha. Después, la consulta permite comparar la unidad con su registro.',
  },

  steps: {
    title: 'Cinco pasos',
    intro:
      'El recorrido conecta la orden de producción con el envase, su activación y la consulta pública. Registra el ciclo de vida del identificador, sin requerir eventos de transporte, distribución o venta.',
    items: [
      {
        label: '01',
        title: 'Emisión de la identidad',
        body: 'El fabricante o importador solicita una emisión asociada a su orden. Se genera un identificador firmado y diferente para cada unidad. La ficha se vincula al producto; lote y vencimiento se completan al terminar la producción, antes de activar.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Impresión por unidad',
        body: 'El QR y su identificador legible se imprimen en la caja, etiqueta o precinto de cada medicamento. Una prueba de imprenta comprueba lectura, contraste y zona libre. La impresión por sí sola no activa el código.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Activación al finalizar producción',
        body: 'Al finalizar la corrida, el responsable completa lote y vencimiento y confirma las unidades producidas. Se activan los códigos utilizados; los sobrantes se anulan al cerrar la emisión. Una consulta anterior a la activación queda en revisión.',
        icon: 'history',
      },
      {
        label: '04',
        title: 'Verificación pública',
        body: 'La persona escanea el QR o escribe el identificador. La consulta separa firma, registro, datos y señales; la persona compara nombre, presentación de 120 ml, concentración, registro sanitario, lote y vencimiento con el envase.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Control e inspección',
        body: 'La organización responsable revisa señales y discrepancias para orientar la inspección de campo. En esta web se puede preparar y descargar un reporte; su entrega y seguimiento se realizan por el canal de la organización.',
        icon: 'search',
      },
    ],
  },

  chain: {
    title: 'El ciclo de vida, nodo a nodo',
    intro:
      'Estas etapas ordenan lo que sabe el registro. Emisión, impresión y activación preceden a la consulta; señales y cierre documentan la revisión o la retirada cuando corresponda. No representan una ruta logística.',
    nodes: [
      {
        id: 'issuance',
        label: 'Emisión',
        description: 'La plataforma deriva y firma el identificador de cada unidad, dentro de la orden solicitada.',
        icon: 'signature',
      },
      {
        id: 'labeling',
        label: 'Impresión',
        description: 'El QR único se imprime en el envase y se comprueba su lectura antes de la activación.',
        icon: 'label',
      },
      {
        id: 'activation',
        label: 'Activación',
        description: 'Al finalizar producción se completan lote y vencimiento y se confirman los códigos utilizados; solo entonces quedan activos.',
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
        description: 'Cada consulta suma contexto: cuándo fue la primera, cuántas van y qué patrones requieren revisión. Una señal no prueba una copia.',
        icon: 'chart',
      },
      {
        id: 'closure',
        label: 'Cierre',
        description: 'El cierre conserva la historia y documenta los identificadores anulados o retirados. No equivale al registro de una venta.',
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
        body: 'Muestra los datos registrados para que la persona los contraste con el envase. El sitio no inspecciona la etiqueta ni el contenido físico.',
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
        title: 'Registro sin alertas',
        body: 'El registro declara firma válida, identidad activa y ninguna alerta. La persona debe contrastar los datos con el envase: el resultado no certifica su contenido ni confirma que la etiqueta no sea una copia.',
      },
      {
        status: 'warning',
        title: 'Con advertencias',
        body: 'El registro declara una firma válida y una señal que requiere revisión: por ejemplo, consultas repetidas o un código aún sin activar. Se compara la unidad y, si procede, se prepara un reporte para la organización responsable.',
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
      'Una firma válida no certifica el contenido físico ni impide copiar la etiqueta. Las medidas físicas anticopia y la validación tributaria se contemplan en fase 2. Validar pagos depende de la integración y autorización de la autoridad competente; esta función no está disponible en el ejemplo.',
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
