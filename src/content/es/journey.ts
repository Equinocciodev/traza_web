import type { JourneyContent } from '../journey.types';

/**
 * Recorrido del producto (ES).
 * La nomenclatura de las seis etapas coincide con `home.chain.nodes`.
 */
export const journey: JourneyContent = {
  meta: {
    title: 'Recorrido del producto: seis etapas registradas',
    description:
      'Siga una unidad desde la fábrica o la aduana hasta la verificación: seis etapas con actor, lugar y fecha, y la historia que se construye por el camino.',
  },

  hero: {
    eyebrow: 'Recorrido del producto',
    title: 'De la fábrica a la verificación, paso a paso',
    subtitle:
      'Cada unidad suma eventos a medida que avanza por la cadena: quién los registra, dónde y cuándo. Esta página reconstruye ese recorrido y lo reproduce etapa por etapa.',
  },

  explorer: {
    eyebrow: 'Recorrido interactivo',
    title: 'El trazo que se completa',
    intro:
      'Elija una unidad y reproduzca su recorrido. La línea avanza por las etapas registradas y cada tarjeta muestra el evento tal como consta en el registro. Algunas unidades no llegan al final: la línea se detiene en la última etapa registrada.',
    regionLabel: 'Recorrido interactivo de una unidad',
    keyboardHint: 'Con el foco en la lista de etapas, use las flechas para avanzar o retroceder; Inicio y Fin saltan a los extremos.',
    noScript: 'Los controles de reproducción requieren JavaScript. La lista completa de eventos de la unidad de ejemplo se muestra a continuación.',
  },

  stages: [
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

  unitSelector: {
    label: 'Unidad de ejemplo',
    help: 'Cada unidad muestra un recorrido distinto: completo, en curso, con incidencias o sin registro.',
    codeLabel: 'Código',
    registryLabel: 'Registro',
    options: [
      { code: 'TRZ-7F2K-4K7Q-92FA', label: 'Ron nacional · recorrido completo con verificación pública' },
      { code: 'TRZ-7F2K-3N6D-09ZB', label: 'Whisky importado · con reporte de discrepancia e inspección' },
      { code: 'TRZ-7F2K-8L1F-63HW', label: 'Whisky importado · etiquetado pero sin activar (en revisión)' },
      { code: 'TRZ-7F2K-5R9C-77MQ', label: 'Ron nacional · lote revocado por el emisor' },
      { code: 'TRZ-7F2K-6C2A-84MZ', label: 'Café · registro de Traza (otro sector)' },
      { code: 'TRZ-7F2K-2B8X-40NE', label: 'Unidad sin recorrido registrado' },
    ],
  },

  controls: {
    play: 'Reproducir',
    pause: 'Pausar',
    replay: 'Reproducir de nuevo',
    prev: 'Anterior',
    next: 'Siguiente',
    restart: 'Reiniciar',
    stepsLabel: 'Etapas del recorrido',
    progressLabel: 'Progreso del recorrido',
    simulateError: 'Simular error de registro',
  },

  legend: {
    title: 'Leyenda',
    items: [
      { state: 'done', label: 'Etapa recorrida' },
      { state: 'active', label: 'Etapa actual' },
      { state: 'pending', label: 'Registrada, aún por recorrer' },
      { state: 'unrecorded', label: 'Sin registro para esta unidad' },
    ],
  },

  eventsSection: {
    title: 'Eventos registrados',
    intro: 'Agrupados por etapa, en el orden en que constan en el registro. Las etapas futuras se muestran atenuadas, nunca ocultas.',
  },

  story: {
    title: 'Historia de la unidad',
    fields: [
      { key: 'issuer', label: 'Fabricante / importador', icon: 'factory' },
      { key: 'product', label: 'Producto / presentación', icon: 'box' },
      { key: 'origin', label: 'Origen / lote', icon: 'map-pin' },
      { key: 'record', label: 'Registro del ciclo de vida', icon: 'history' },
    ],
  },

  states: {
    loading: 'Reconstruyendo el recorrido…',
    empty: {
      title: 'Sin recorrido registrado',
      body: 'La unidad seleccionada no tiene eventos en el registro. Ocurre, por ejemplo, cuando el identificador no fue emitido por una clave conocida o su firma no corresponde al contenido del código: sin eventos, no hay recorrido que reconstruir. La verificación pública explica por separado qué se comprobó y cuál es el siguiente paso.',
    },
    error: {
      title: 'No pudimos consultar el registro',
      body: 'El registro no respondió a la consulta. No es un problema de su parte: reintente para reconstruir el recorrido.',
      retry: 'Reintentar',
    },
  },

  explain: {
    eyebrow: 'La historia de la unidad',
    title: 'Cómo se construye una historia verificable',
    intro:
      'Un recorrido es la suma de eventos que registra cada actor de la cadena. Cada evento aporta quién lo registra, dónde, cuándo y con qué referencia documental; juntos permiten contrastar lo que dice la etiqueta con lo que consta en el registro.',
    quote: 'Traza no solo identifica productos. Construye su historia verificable.',
    fields: [
      {
        key: 'issuer',
        label: 'Fabricante / importador',
        description: 'Quién puso la unidad en el mercado y responde por ella. Emite y firma la identidad al salir de fábrica o al ingresar por aduana.',
        icon: 'factory',
      },
      {
        key: 'product',
        label: 'Producto / presentación',
        description: 'Qué es exactamente: tipo, variante, formato y contenido declarado. Es lo que la verificación compara con la etiqueta.',
        icon: 'box',
      },
      {
        key: 'origin',
        label: 'Origen / lote',
        description: 'De dónde procede y a qué lote de producción o importación pertenece. Un lote retirado afecta a todas sus unidades.',
        icon: 'map-pin',
      },
      {
        key: 'record',
        label: 'Registro del ciclo de vida',
        description: 'Cuántos eventos consta y en qué etapas. Un identificador etiquetado pero sin activar que ya se consulta en la calle es una señal a revisar.',
        icon: 'history',
      },
    ],
    note: 'Los eventos los aporta el emisor desde sus propios sistemas, o la plataforma cuando alguien consulta. El transporte y la distribución no se registran.',
  },

  cta: {
    title: 'Vea el otro lado del recorrido',
    body: 'La verificación pública compara la etiqueta con este registro y explica el resultado en lenguaje claro. La vista institucional muestra cómo lo seguiría un regulador o una empresa.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'secondary' },
  },

  runtime: {
    eventKinds: {
      import_declared: 'Importación declarada',
      identity_issued: 'Identificador emitido y firmado',
      labeled: 'Etiqueta aplicada',
      sample_approved: 'Prueba de imprenta aprobada',
      record_completed: 'Ficha del lote completada',
      activated: 'Rango activado',
      verified: 'Primera consulta pública',
      looked_up: 'Consulta posterior',
      anomaly_flagged: 'Señal abierta',
      reported: 'Reporte de discrepancia',
      inspected: 'Inspección de campo',
      reassigned: 'Ficha reasignada',
      range_voided: 'Rango anulado',
      revoked: 'Revocación de lote',
      issuance_closed: 'Emisión cerrada',
    },
    issuerRoles: { manufacturer: 'Fabricante', importer: 'Importador' },
    stageStates: {
      done: 'Recorrida',
      active: 'Etapa actual',
      pending: 'Por recorrer',
      unrecorded: 'Sin registro',
    },
    stageEmpty: 'Sin eventos registrados en esta etapa.',
    stageUnrecorded: 'Según el registro, la unidad no ha llegado a esta etapa.',
    events: {
      none: 'Sin eventos',
      one: '1 evento: {list}',
      many: '{count} eventos: {list}',
    },
    summary: {
      complete: 'Recorrido completo · última etapa: {stage}',
      inProgress: 'Recorrido en curso · última etapa registrada: {stage}',
      none: 'Sin recorrido registrado',
    },
    progress: 'Etapa {n} de {total}',
    live: {
      stage: 'Etapa {n} de {total}: {stage}. {events}.',
      playing: 'Reproduciendo el recorrido.',
      paused: 'Reproducción en pausa en {stage}.',
      ended: 'Recorrido completo. Última etapa: {stage}.',
      endedPartial: 'Fin del registro: la unidad está en {stage}. Recorrido en curso.',
      loaded: 'Recorrido reconstruido: {unit}.',
      loading: 'Reconstruyendo el recorrido…',
      empty: 'Sin recorrido registrado para esta unidad.',
      error: 'No se pudo consultar el registro. Puede reintentar.',
      unrecorded: 'No hay registro de la etapa {stage} para esta unidad.',
      restarted: 'Recorrido reiniciado en {stage}.',
    },
    story: {
      product: '{presentation} · {category}',
      origin: '{site} · {region}',
      lot: '{lot}',
      produced: 'producción {date}',
      record: '{events} eventos en {stages} de {total} etapas',
      lastLookup: 'Última consulta: {site} · {region}',
      noLastLookup: 'Sin consultas registradas',
      noRecord: 'Sin eventos registrados',
      empty: '—',
    },
    refLabel: 'Referencia',
  },
};
