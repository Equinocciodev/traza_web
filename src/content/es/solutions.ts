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
      'Gobiernos y reguladores, industria y ciudadanos usan la misma plataforma con necesidades distintas. Aquí explicamos qué aporta a cada uno.',
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
      body: 'Proteger la marca, ganar visibilidad sobre la cadena y dar al público una forma de comprobar cada unidad.',
      bullets: [
        'Identidad emitida desde la producción o la importación',
        'Integración con sistemas de gestión y almacén',
        'Alertas ante anomalías en la cadena',
      ],
      cta: { label: 'Ver soluciones para industria', key: 'solutionsIndustry', variant: 'secondary' },
      icon: 'industry',
    },
    {
      key: 'citizens',
      title: 'Ciudadanos',
      body: 'Comprobar un producto en el punto de venta, entender el resultado y avisar si algo no coincide.',
      bullets: [
        'Sin instalar nada ni crear una cuenta',
        'Resultado explicado en lenguaje claro',
        'Reporte de discrepancias en pocos pasos',
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
      'Registro de eventos de cadena, ordenado y auditable',
      'Verificación pública desde el navegador, sin instalación ni cuenta',
      'Reglas, marca y contexto configurables por tenant',
      'Reporte de discrepancias con datos mínimos',
    ],
  },

  multisector: {
    title: 'Adaptable a distintos sectores',
    body:
      'La adaptabilidad no viene de módulos por industria, sino de la misma capa: identidad unitaria, eventos de cadena, verificación pública y reglas configurables por tenant. Cada sector define qué datos describen una unidad, qué eventos importan y quién puede consultarlos.',
    sectors: [
      'Bebidas y alimentos',
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
      'Si su organización controla, produce o distribuye productos que necesitan una identidad verificable, podemos conversar sobre un piloto acotado.',
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
      'Identidad unitaria por producto, inspección de campo integrada, registro auditable de cada evento y despliegues co-brand por país o por programa fiscal.',
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
        body: 'Producción, importación, transporte y comercio registran sus datos en sistemas distintos que rara vez se pueden cruzar.',
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
      'Una capa de identidad y registro que la institución gobierna, con verificación pública abierta e inspección de campo como parte del despliegue.',
    items: [
      {
        title: 'Identidad unitaria firmada',
        body: 'Cada unidad recibe un identificador firmado por su emisor, bajo reglas definidas por la institución.',
        icon: 'signature',
      },
      {
        title: 'Registro auditable',
        body: 'Los eventos de cadena se conservan en orden, con responsable y fecha, y pueden exportarse para auditoría.',
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
        body: 'Cualquier persona comprueba una unidad desde el navegador y puede reportar discrepancias que llegan al registro.',
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
        title: 'Registrar la cadena',
        body: 'Los actores de la cadena reportan eventos: etiquetado, transporte, distribución y llegada al comercio.',
        icon: 'link',
      },
      {
        label: '04',
        title: 'Abrir la verificación pública',
        body: 'El público verifica desde el navegador, con la marca de la institución si así se aprueba, y reporta discrepancias.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Inspeccionar y actuar',
        body: 'La institución sigue anomalías y reportes, prioriza inspecciones de campo y deja constancia de lo actuado.',
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
      'Un canal público de verificación y reporte que no exige instalación ni cuenta',
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
        body: 'Consulte el registro como lo haría una agencia de control: unidades, anomalías, discrepancias e inspección de campo.',
        cta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'primary' },
        icon: 'chart',
      },
      {
        key: 'verify',
        tag: 'Para el público',
        title: 'Verificación pública',
        body: 'Vea lo que vería el público al verificar una unidad, con el ejemplo de co-brand del caso de uso de licores.',
        cta: { label: 'Verificar con el tenant de ejemplo', key: 'verify', suffix: '?t=licores', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'Para la cadena',
        title: 'Recorrido del producto',
        body: 'Siga una unidad desde la fábrica o la aduana hasta el comercio y vea qué eventos quedan registrados.',
        cta: { label: 'Ver el recorrido', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nada de lo anterior afirma relación con gobiernos o agencias, certificaciones ni resultados medidos. El caso de uso de licores es una propuesta de piloto.',

  cta: {
    title: 'Conversemos sobre un piloto acotado',
    body:
      'Un piloto empieza por un producto, un marco de reglas y un grupo reducido de actores. Podemos ayudar a definirlo.',
    primaryCta: { label: 'Contactar al equipo', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Conocer el caso de uso de licores', key: 'caseSpirits', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Industria                                                           */
/* ------------------------------------------------------------------ */

export const solutionsIndustry: SectorPageContent = {
  meta: {
    title: 'Industria: identidad unitaria y marca protegida',
    description:
      'Identidad unitaria, trazabilidad y protección de marca para fabricantes, importadores y distribuidores, integradas con los sistemas que ya usa la planta.',
  },
  key: 'industry',

  hero: {
    eyebrow: 'Soluciones · Industria',
    title: 'Identidad por unidad, visibilidad de la cadena y protección de marca',
    subtitle:
      'Para fabricantes, importadores y distribuidores que quieren saber dónde están sus unidades, detectar desvíos y dar al público una forma de comprobarlas.',
    icon: 'industry',
  },

  challenges: {
    title: 'Retos habituales',
    intro:
      'Quien pone un producto en el mercado responde por él mucho después de que salió del almacén. Estos son los problemas más frecuentes.',
    items: [
      {
        title: 'Copias y desvíos que dañan la marca',
        body: 'Una etiqueta se copia con facilidad. Sin identidad por unidad, la marca no puede demostrar qué unidades emitió y cuáles no.',
        icon: 'alert',
      },
      {
        title: 'Poca visibilidad más allá del almacén',
        body: 'Una vez despachada, la unidad desaparece de los sistemas propios. Lo que ocurre en transporte y comercio queda fuera de vista.',
        icon: 'eye',
      },
      {
        title: 'Datos en sistemas separados',
        body: 'Producción, almacén y logística ya generan datos útiles, pero en sistemas que no se hablan entre sí.',
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
      'Emitir la identidad desde los procesos que ya existen, registrar la cadena con los datos que ya se generan y abrir la verificación al público con la marca propia.',
    items: [
      {
        title: 'Identidad por unidad, no solo por lote',
        body: 'Cada unidad recibe un identificador firmado con las claves del fabricante o importador, al salir de producción o al ingresar por aduana.',
        icon: 'fingerprint',
      },
      {
        title: 'Eventos de cadena desde sus propios sistemas',
        body: 'Los sistemas de gestión y almacén (ERP, WMS) reportan eventos mediante interfaces documentadas, sin duplicar el trabajo.',
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
        body: 'El registro deja constancia de qué unidades emitió la marca; las discrepancias reportadas llegan a quien puede actuar.',
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
        title: 'Mover y registrar',
        body: 'Transporte, distribución y comercio reportan eventos que completan la historia de cada unidad.',
        icon: 'truck',
      },
      {
        label: '05',
        title: 'Verificar y escuchar',
        body: 'El público verifica y reporta; la marca recibe las señales y decide dónde actuar.',
        icon: 'scan',
      },
    ],
  },

  outcomes: {
    title: 'Resultados esperados',
    intro: 'Lo que un despliegue de este tipo busca conseguir, expresado sin cifras.',
    items: [
      'Capacidad de demostrar qué unidades emitió la marca y cuáles no',
      'Visibilidad sobre transporte, distribución y comercio con datos que antes se perdían',
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
        tag: 'Para la cadena',
        title: 'Recorrido del producto',
        body: 'Siga una unidad desde la fábrica hasta el comercio y vea cómo cada evento completa su historia.',
        cta: { label: 'Ver el recorrido', key: 'journey', variant: 'primary' },
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
        body: 'Consulte el registro, las anomalías y las discrepancias reportadas desde el punto de vista de la organización.',
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
      'Un piloto industrial suele empezar por un producto, una línea de envasado y un canal de distribución. Podemos ayudar a acotarlo.',
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
      'Verificar un producto en el punto de venta desde el navegador, sin instalar nada ni crear una cuenta, con resultados claros y reporte de discrepancias.',
  },
  key: 'citizens',

  hero: {
    eyebrow: 'Soluciones · Ciudadanos',
    title: 'Comprobar lo que se compra, en el momento y sin complicaciones',
    subtitle:
      'Para cualquier persona que quiera saber si un producto es el que dice ser: escanear, leer un resultado claro y avisar si algo no coincide.',
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
        body: 'Basta con escanear el código con la cámara del teléfono o escribirlo en la página de verificación.',
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
        body: 'Si lo que ve no coincide con el registro, puede reportarlo en pocos pasos y con datos mínimos y opcionales.',
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
        body: 'Apunte la cámara al código de la etiqueta o escriba el identificador en la página de verificación.',
        icon: 'qr',
      },
      {
        label: '02',
        title: 'Leer el resultado',
        body: 'La página muestra qué se comprobó: firma, estado en el registro, coincidencia de datos y anomalías.',
        icon: 'eye',
      },
      {
        label: '03',
        title: 'Comparar con el producto',
        body: 'Contraste los datos del registro —producto, presentación, lote, destino— con lo que tiene en la mano.',
        icon: 'compare',
      },
      {
        label: '04',
        title: 'Reportar si algo no coincide',
        body: 'Envíe un reporte de discrepancia. Llega a quien puede revisarlo y ayuda a proteger a otras personas.',
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
      'Un canal para reportar discrepancias que llega al registro',
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
        tag: 'Para la cadena',
        title: 'Recorrido del producto',
        body: 'Descubra qué hay detrás del código: el camino que una unidad recorre antes de llegar a sus manos.',
        cta: { label: 'Ver el recorrido', key: 'journey', variant: 'secondary' },
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
