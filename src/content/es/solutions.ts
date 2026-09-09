import type { SolutionsContent, SectorPageContent } from '../types';

/* ------------------------------------------------------------------ */
/* Resumen de soluciones                                               */
/* ------------------------------------------------------------------ */

export const solutions: SolutionsContent = {
  meta: {
    title: 'Soluciones para gobierno, industria y ciudadanos',
    description:
      'Identidad unitaria, trazabilidad y verificación pública para gobierno, industria y ciudadanos, sobre una capa común y con las reglas de cada programa.',
  },

  hero: {
    eyebrow: 'Soluciones',
    title: 'Una capa común, tres puntos de vista',
    subtitle:
      'Traza propone una base común para instituciones, industria y público. Esta web permite consultar unidades de ejemplo y preparar reportes locales; las integraciones se acuerdan por despliegue.',
  },

  cards: [
    {
      key: 'government',
      title: 'Gobierno y reguladores',
      body: 'Saber qué unidades están en el mercado, de dónde vienen y si lo que se vende coincide con lo registrado.',
      bullets: [
        'Registro auditable por unidad',
        'Inspección de campo dentro del despliegue',
        'Verificación pública con la marca de la institución',
      ],
      cta: { label: 'Ver soluciones para gobierno', key: 'solutionsGovernment', variant: 'secondary' },
      icon: 'government',
    },
    {
      key: 'industry',
      title: 'Industria',
      body: 'Relacionar emisión, etiquetado, activación y consultas para revisar la identidad de cada unidad.',
      bullets: [
        'Identidad emitida desde la producción o la importación',
        'Integración propuesta con gestión, producción y etiquetado',
        'Señales de inconsistencias en el registro de la unidad',
      ],
      cta: { label: 'Ver soluciones para industria', key: 'solutionsIndustry', variant: 'secondary' },
      icon: 'industry',
    },
    {
      key: 'citizens',
      title: 'Ciudadanos',
      body: 'Comparar un producto con su registro, entender el resultado y preparar una copia local si algo no coincide.',
      bullets: [
        'Sin instalar nada ni crear una cuenta',
        'Resultado explicado en lenguaje claro',
        'Preparación y descarga local de un reporte',
      ],
      cta: { label: 'Ver soluciones para ciudadanos', key: 'solutionsCitizens', variant: 'secondary' },
      icon: 'citizen',
    },
  ],

  sharedLayer: {
    title: 'Lo que comparten todas las soluciones',
    body:
      'No hay tres productos distintos, sino una plataforma con vistas y reglas diferentes para cada actor. Esto permite que un regulador, un fabricante y una persona en una tienda miren el mismo registro con el nivel de detalle que les corresponde.',
    bullets: [
      'Identidad digital unitaria firmada por el emisor',
      'Registro de emisión, etiquetado, activación, consulta, señales y cierre',
      'Verificación pública desde el navegador, sin instalación ni cuenta',
      'Reglas, marca y contexto configurables por tenant',
      'Reportes descargables para entregar por un canal de la organización',
    ],
  },

  multisector: {
    title: 'Adaptable a distintos sectores',
    body:
      'La propuesta comparte identidad unitaria, eventos del ciclo de vida y consulta pública. Cada despliegue acuerda los datos, permisos y reglas: emisión, etiquetado, activación, consulta, señales y cierre.',
    sectors: [
      'Medicamentos y productos de salud',
      'Farmacéutico',
      'Agroindustria',
      'Repuestos y partes',
      'Bienes de consumo',
      'Documentos y certificados',
    ],
    note: 'Los sectores se mencionan solo como ejemplos de adaptabilidad. No se afirman capacidades ni certificaciones sectoriales específicas.',
  },

  cta: {
    title: 'Hablemos de su caso',
    body:
      'Si su organización controla, fabrica o importa productos que necesitan una identidad verificable, podemos conversar sobre un piloto acotado.',
    primaryCta: { label: 'Contactar al equipo', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Gobierno y reguladores                                              */
/* ------------------------------------------------------------------ */

export const solutionsGovernment: SectorPageContent = {
  meta: {
    title: 'Gobierno y reguladores: control por unidad',
    description:
      'Identidad unitaria por producto, inspección de campo integrada, registro auditable de cada evento y despliegues co-brand por país o por programa de control.',
  },
  key: 'government',

  hero: {
    eyebrow: 'Soluciones · Gobierno y reguladores',
    title: 'Control por unidad y verificación pública con la marca de cada institución',
    subtitle:
      'Para reguladores y agencias de control que necesitan saber qué unidades están en el mercado, de dónde vienen y si lo que se vende coincide con lo registrado.',
    icon: 'government',
  },

  challenges: {
    title: 'Retos habituales',
    intro:
      'Los mercados regulados comparten problemas parecidos, con independencia del producto. Estos son los que Traza busca resolver.',
    items: [
      {
        title: 'Unidades sin identidad verificable',
        body: 'El control suele hacerse por lote o por documento. Sin identidad por unidad, es difícil distinguir un producto legítimo de una copia con la misma etiqueta.',
        icon: 'box',
      },
      {
        title: 'Inspección difícil de priorizar',
        body: 'Los equipos de campo son limitados. Sin señales del registro, no hay forma de decidir dónde inspeccionar primero.',
        icon: 'search',
      },
      {
        title: 'Registros dispersos',
        body: 'Producción, importación y control registran sus datos en sistemas distintos que rara vez se pueden cruzar.',
        icon: 'database',
      },
      {
        title: 'Sin canal público de verificación',
        body: 'El público no tiene una forma sencilla de comprobar un producto ni de avisar cuando algo no coincide.',
        icon: 'citizen',
      },
    ],
  },

  approach: {
    title: 'Nuestro enfoque',
    intro:
      'Proponemos una capa de identidad y registro con reglas institucionales, consulta pública e inspección. Sus integraciones y permisos se acuerdan y validan en cada despliegue.',
    items: [
      {
        title: 'Identidad unitaria firmada',
        body: 'Cada unidad recibe un identificador firmado por su emisor, bajo reglas definidas por la institución.',
        icon: 'signature',
      },
      {
        title: 'Registro auditable',
        body: 'El diseño contempla registrar emisión, etiquetado, activación, consultas, señales y cierre, con responsable y fecha para su auditoría.',
        icon: 'list',
      },
      {
        title: 'Inspección de campo dentro del despliegue',
        body: 'Los inspectores verifican en sitio, contrastan con el registro y dejan constancia de lo observado.',
        icon: 'map-pin',
      },
      {
        title: 'Co-brand por país y regulador',
        body: 'La verificación pública puede mostrar la marca de la institución junto a la de Traza, siempre con su aprobación.',
        icon: 'flag',
      },
      {
        title: 'Verificación pública',
        body: 'Cualquier persona consulta una unidad y puede preparar y descargar un reporte local. Esta web no lo envía ni modifica el registro; debe entregarse a la organización responsable.',
        icon: 'scan',
      },
    ],
  },

  flow: {
    title: 'Cómo se despliega',
    intro: 'Un despliegue institucional avanza por etapas acotadas. El orden habitual es el siguiente.',
    steps: [
      {
        label: '01',
        title: 'Definir el marco',
        body: 'La institución establece qué productos se identifican, qué datos describen una unidad, qué eventos se registran y quién puede consultarlos.',
        icon: 'settings',
      },
      {
        label: '02',
        title: 'Emitir identidades',
        body: 'Fabricantes e importadores emiten identidades firmadas para sus unidades según las reglas del marco.',
        icon: 'key',
      },
      {
        label: '03',
        title: 'Etiquetar y activar',
        body: 'El emisor confirma la impresión y, al finalizar la producción y completar la ficha, activa los códigos de las unidades producidas.',
        icon: 'link',
      },
      {
        label: '04',
        title: 'Abrir la verificación pública',
        body: 'El público consulta desde el navegador, con la marca institucional si se aprueba. En esta web puede descargar un reporte local para entregarlo por un canal de la organización.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Inspeccionar y actuar',
        body: 'El despliegue propuesto contempla revisar señales, registrar acciones y cerrar casos. Los reportes descargados en esta web no se incorporan automáticamente a esa vista.',
        icon: 'search',
      },
    ],
  },

  outcomes: {
    title: 'Resultados esperados',
    intro: 'Lo que un despliegue de este tipo busca conseguir, expresado sin cifras.',
    items: [
      'Visibilidad por unidad sobre lo que circula en el mercado regulado',
      'Inspecciones de campo mejor dirigidas gracias a las señales del registro',
      'Consulta pública y preparación local de reportes sin instalación ni cuenta',
      'Un registro auditable que facilita el control y la rendición de cuentas',
      'Una marca institucional presente en el momento de la verificación',
    ],
    note: 'Resultados esperados de carácter cualitativo. No se presentan cifras ni resultados medidos.',
  },

  perspectives: {
    title: 'Véalo en la plataforma',
    items: [
      {
        key: 'institutional',
        tag: 'Para el control',
        title: 'Vista institucional',
        body: 'Explore unidades, señales e inspecciones de ejemplo. Esta vista ilustra el trabajo de control; no recibe los reportes descargados desde la consulta pública.',
        cta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'primary' },
        icon: 'chart',
      },
      {
        key: 'verify',
        tag: 'Para el público',
        title: 'Verificación pública',
        body: 'Vea lo que vería el público al verificar una unidad, con el ejemplo de co-brand del caso de uso de medicamentos.',
        cta: { label: 'Verificar con el tenant de ejemplo', key: 'verify', suffix: '?t=medicamentos', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'Para el registro',
        title: 'Ciclo de vida de la unidad',
        body: 'Siga una unidad desde su emisión hasta sus consultas y vea qué eventos quedan registrados.',
        cta: { label: 'Ver el ciclo de vida', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nada de lo anterior afirma relación con gobiernos o agencias, certificaciones ni resultados medidos. El caso de uso de medicamentos es una propuesta de piloto.',

  cta: {
    title: 'Conversemos sobre un piloto acotado',
    body:
      'Un piloto empieza por un producto, un marco de reglas y un grupo reducido de actores. Podemos ayudar a definirlo.',
    primaryCta: { label: 'Contactar al equipo', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Conocer el caso de uso de medicamentos', key: 'caseMedicines', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Industria                                                           */
/* ------------------------------------------------------------------ */

export const solutionsIndustry: SectorPageContent = {
  meta: {
    title: 'Industria: identidad unitaria y marca protegida',
    description:
      'Identidad por unidad para fabricantes e importadores: emisión, etiquetado, activación y consulta, con integraciones propuestas para los sistemas de planta.',
  },
  key: 'industry',

  hero: {
    eyebrow: 'Soluciones · Industria',
    title: 'Identidad por unidad y evidencia de su ciclo de vida',
    subtitle:
      'Para fabricantes e importadores que quieren relacionar producción, activación y consultas, revisar inconsistencias y dar al público una forma de comparar cada unidad con su registro.',
    icon: 'industry',
  },

  challenges: {
    title: 'Retos habituales',
    intro:
      'Quien fabrica o importa un producto necesita relacionar cada unidad con su lote, etiqueta y ficha. Estos son los problemas que busca abordar la propuesta.',
    items: [
      {
        title: 'Copias y desvíos que dañan la marca',
        body: 'Una etiqueta se copia con facilidad. Sin identidad por unidad, la marca no puede demostrar qué unidades emitió y cuáles no.',
        icon: 'alert',
      },
      {
        title: 'Poca visibilidad después de la producción',
        body: 'Sin un registro por unidad, resulta difícil relacionar producción, activación y consultas públicas, o revisar si un código se consulta antes de activarse.',
        icon: 'eye',
      },
      {
        title: 'Datos en sistemas separados',
        body: 'Producción y control de calidad generan producto, lote y vencimiento, pero esos datos no siempre están vinculados a una identidad consultable por unidad.',
        icon: 'database',
      },
      {
        title: 'Público sin forma de comprobar',
        body: 'Quien compra no puede distinguir una unidad legítima de una copia, y la marca no se entera cuando hay un problema.',
        icon: 'citizen',
      },
    ],
  },

  approach: {
    title: 'Nuestro enfoque',
    intro:
      'La propuesta integra emisión, impresión, activación al finalizar la producción y consulta pública. Los conectores y controles se acuerdan y validan con cada organización.',
    items: [
      {
        title: 'Identidad por unidad, no solo por lote',
        body: 'Cada unidad recibe un identificador firmado a partir de una orden del fabricante o importador, antes de imprimirlo en su envase.',
        icon: 'fingerprint',
      },
      {
        title: 'Ciclo de vida desde sus propios sistemas',
        body: 'Los sistemas del emisor aportan orden, lote, vencimiento y cierre de producción mediante interfaces acordadas. El alcance no incluye transporte, distribución ni ventas.',
        icon: 'plug',
      },
      {
        title: 'Verificación pública con marca propia',
        body: 'El público comprueba cada unidad desde el navegador, en una experiencia con la identidad visual de la marca.',
        icon: 'scan',
      },
      {
        title: 'Alertas ante anomalías',
        body: 'Consultas repetidas del mismo código, ubicaciones inconsistentes o eventos fuera de secuencia se señalan para revisión.',
        icon: 'alert',
      },
      {
        title: 'Protección de marca',
        body: 'El registro identifica las unidades emitidas. Quien detecta una discrepancia puede descargar su reporte y entregarlo a la organización; esta web no lo envía ni confirma recepción.',
        icon: 'shield',
      },
    ],
  },

  flow: {
    title: 'Cómo se integra',
    intro: 'Un despliegue industrial se apoya en los procesos existentes. El orden habitual es el siguiente.',
    steps: [
      {
        label: '01',
        title: 'Conectar',
        body: 'Se definen los campos de identidad y los eventos relevantes, y se conectan los sistemas que ya los generan.',
        icon: 'plug',
      },
      {
        label: '02',
        title: 'Emitir',
        body: 'Las identidades se emiten por lotes a partir de las órdenes de producción o de importación, firmadas por el emisor.',
        icon: 'key',
      },
      {
        label: '03',
        title: 'Etiquetar',
        body: 'El código firmado se incorpora a la etiqueta o al precinto de cada unidad en la línea de envasado.',
        icon: 'label',
      },
      {
        label: '04',
        title: 'Activar al cerrar producción',
        body: 'El responsable confirma las unidades producidas y completa su ficha. Los códigos utilizados se activan; los restantes se anulan al cerrar la emisión.',
        icon: 'history',
      },
      {
        label: '05',
        title: 'Consultar y revisar señales',
        body: 'El público consulta y prepara reportes locales. En un despliegue acordado, la organización revisa señales y documenta acciones y cierre; las descargas de esta web no se envían automáticamente.',
        icon: 'scan',
      },
    ],
  },

  outcomes: {
    title: 'Resultados esperados',
    intro: 'Lo que un despliegue de este tipo busca conseguir, expresado sin cifras.',
    items: [
      'Capacidad de demostrar qué unidades emitió la marca y cuáles no',
      'Visibilidad de emisión, activación y consultas públicas vinculadas a cada unidad',
      'Señales tempranas de desvíos y copias a partir del registro',
      'Una experiencia de verificación pública con la identidad visual de la marca',
      'Integración con los sistemas actuales sin duplicar procesos',
    ],
    note: 'Resultados esperados de carácter cualitativo. No se presentan cifras ni resultados medidos.',
  },

  perspectives: {
    title: 'Véalo en la plataforma',
    items: [
      {
        key: 'journey',
        tag: 'Para el registro',
        title: 'Ciclo de vida de la unidad',
        body: 'Siga una unidad desde su emisión hasta sus consultas y vea cómo cada evento completa su historia.',
        cta: { label: 'Ver el ciclo de vida', key: 'journey', variant: 'primary' },
        icon: 'link',
      },
      {
        key: 'verify',
        tag: 'Para el público',
        title: 'Verificación pública',
        body: 'Vea lo que vería el público al comprobar una de sus unidades desde el navegador.',
        cta: { label: 'Verificar un producto', key: 'verify', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'institutional',
        tag: 'Para el control',
        title: 'Vista institucional',
        body: 'Explore registros y señales de ejemplo desde el punto de vista de la organización. Esta vista no recibe los reportes que se preparan y descargan en esta web.',
        cta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'secondary' },
        icon: 'chart',
      },
    ],
  },

  disclaimer:
    'Nada de lo anterior afirma relaciones comerciales, certificaciones ni resultados medidos. Las integraciones se describen de forma genérica: cada despliegue acuerda sus conectores.',

  cta: {
    title: 'Empiece por una línea de producto',
    body:
      'Un piloto industrial puede empezar por un medicamento, una línea de envasado y responsables de emisión, activación y control. Podemos ayudar a acotarlo.',
    primaryCta: { label: 'Contactar al equipo', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Conocer la plataforma', key: 'platform', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Ciudadanos                                                          */
/* ------------------------------------------------------------------ */

export const solutionsCitizens: SectorPageContent = {
  meta: {
    title: 'Ciudadanos: verificar un producto al comprarlo',
    description:
      'Consulte un producto desde el navegador, compare sus datos y prepare un reporte local descargable para entregarlo a la organización responsable, sin cuenta.',
  },
  key: 'citizens',

  hero: {
    eyebrow: 'Consulta del producto',
    title: 'Escanea. Compara. Comprende.',
    subtitle:
      'Para comparar un medicamento con su registro: escanear, leer el resultado y descargar un reporte si algo no coincide. La consulta no certifica autenticidad física.',
    icon: 'citizen',
  },

  challenges: {
    title: 'Retos habituales',
    intro: 'Verificar un producto debería ser tan fácil como mirar su etiqueta. Hoy rara vez lo es.',
    items: [
      {
        title: 'No hay una forma sencilla de comprobar',
        body: 'Las herramientas existentes exigen instalar algo, registrarse o conocer detalles técnicos del producto.',
        icon: 'search',
      },
      {
        title: 'Las etiquetas se copian',
        body: 'Un sello o un holograma se imita con facilidad. Sin un registro detrás, la etiqueta por sí sola dice poco.',
        icon: 'label',
      },
      {
        title: 'Resultados que no se entienden',
        body: 'Un aviso técnico o un color sin explicación no ayudan a decidir qué hacer a continuación.',
        icon: 'info',
      },
      {
        title: 'No se sabe a quién avisar',
        body: 'Cuando algo no coincide, no hay un canal claro para reportarlo ni certeza de que alguien lo vaya a mirar.',
        icon: 'flag',
      },
    ],
  },

  approach: {
    title: 'Nuestro enfoque',
    intro: 'Una verificación pública pensada para el punto de venta: rápida, clara y sin barreras de entrada.',
    items: [
      {
        title: 'Desde el navegador',
        body: 'Puede leer el QR con la cámara, seleccionar una imagen o escribir el código en la página de verificación.',
        icon: 'phone',
      },
      {
        title: 'Sin instalación ni cuenta',
        body: 'No hay nada que descargar ni datos personales que entregar para verificar una unidad.',
        icon: 'lock',
      },
      {
        title: 'Lenguaje claro',
        body: 'El resultado dice qué se comprobó, cuánta confianza aporta y cuál es el siguiente paso, sin jerga técnica.',
        icon: 'document',
      },
      {
        title: 'Reporte de discrepancias',
        body: 'Prepare una descripción sin datos personales y descargue el reporte en este dispositivo. No se envía ni cambia el registro; entréguelo a la organización responsable para su revisión.',
        icon: 'flag',
      },
    ],
  },

  flow: {
    title: 'Cómo se verifica',
    intro: 'Cuatro pasos que caben en el tiempo que se tarda en decidir una compra.',
    steps: [
      {
        label: '01',
        title: 'Escanear o escribir el código',
        body: 'Apunte la cámara al QR de la etiqueta, seleccione una imagen guardada o escriba el identificador.',
        icon: 'qr',
      },
      {
        label: '02',
        title: 'Leer el resultado',
        body: 'El resultado explica el estado de la identidad, los datos del registro y sus señales. Los códigos de ejemplo ilustran estas comprobaciones; no certifican el objeto físico.',
        icon: 'eye',
      },
      {
        label: '03',
        title: 'Comparar con el producto',
        body: 'Contraste producto, presentación, concentración, lote y vencimiento del registro con la etiqueta del medicamento.',
        icon: 'compare',
      },
      {
        label: '04',
        title: 'Preparar un reporte si algo no coincide',
        body: 'Describa la discrepancia y descargue el reporte. Revíselo antes de entregarlo por un canal de la organización responsable; esta web no lo envía ni confirma su recepción.',
        icon: 'flag',
      },
    ],
  },

  outcomes: {
    title: 'Qué gana quien verifica',
    intro: 'Lo que la verificación pública aporta a quien compra, expresado sin cifras.',
    items: [
      'Una respuesta clara antes de pagar, sin instalar nada ni registrarse',
      'Saber exactamente qué se comprobó y qué no',
      'Un siguiente paso concreto cuando el resultado no es favorable',
      'Una copia local de la discrepancia para entregar a la organización responsable',
      'Ningún dato personal a cambio de verificar',
    ],
    note: 'Beneficios de carácter cualitativo. No se presentan cifras ni resultados medidos.',
  },

  perspectives: {
    title: 'Véalo en la plataforma',
    items: [
      {
        key: 'verify',
        tag: 'Para el público',
        title: 'Verificación pública',
        body: 'Pruebe la verificación con códigos de ejemplo y vea distintos resultados posibles, explicados en lenguaje claro.',
        cta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'Para el registro',
        title: 'Ciclo de vida de la unidad',
        body: 'Explore el ejemplo de una solución oral de 120 ml: emisión, etiquetado, activación al finalizar producción, consulta, señales y cierre.',
        cta: { label: 'Ver el ciclo de vida', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nada de lo anterior afirma certificaciones ni resultados medidos.',

  cta: {
    title: 'Pruébelo con un código de ejemplo',
    body:
      'La verificación pública incluye varios códigos de ejemplo con resultados distintos. Es la forma más rápida de entender qué verá al escanear.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Cómo funciona', key: 'howItWorks', variant: 'secondary' },
  },
};
