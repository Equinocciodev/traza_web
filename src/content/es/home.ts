import type { HomeContent } from '../types';

export const home: HomeContent = {
  meta: {
    title: 'Identidad digital para productos reales',
    description:
      'Traza da a cada unidad una identidad firmada, registra su recorrido por la cadena y permite comprobarla desde el navegador, sin cuenta y señal por señal.',
  },

  hero: {
    eyebrow: 'Para industria y organismos públicos',
    title: 'Identidad digital para productos reales',
    subtitle:
      'Traza asigna a cada unidad una identidad digital firmada, registra su ciclo de vida —emisión, activación y cada consulta— y permite comprobarla desde cualquier navegador, sin instalar nada ni crear una cuenta.',
    mantra: 'Escanea. Verifica. Confía.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Hablar con el equipo', key: 'company', suffix: '#contact-title', variant: 'secondary' },
    unitPreview: {
      caption: 'Identidad de una unidad',
      code: 'TRZ-7F2K-4K7Q-92FA',
      fields: [
        { label: 'Fabricante / importador', value: 'Destilería Cerro Alto' },
        { label: 'Producto / presentación', value: 'Ron Añejo Cerro Alto 7 años · botella 750 ml' },
        { label: 'Lote / vencimiento', value: 'LOTE-VS-26-012 · vence 03/2031' },
        { label: 'Estado del identificador', value: 'Activado · con consultas registradas' },
      ],
      statusLabel: 'Verificado · firma y registro coinciden',
    },
  },

  chain: {
    eyebrow: 'La cadena',
    title: 'De la fábrica al punto de venta, cada paso deja un registro',
    intro:
      'Cada unidad recibe su identidad en origen y suma eventos a medida que avanza. La verificación final compara lo que dice la etiqueta con lo que consta en el registro.',
    nodes: [
      {
        id: 'origin',
        label: 'Fábrica / aduana',
        description: 'La unidad recibe su identidad digital al salir de fábrica o al ingresar por aduana.',
        icon: 'factory',
      },
      {
        id: 'labeling',
        label: 'Etiquetado',
        description: 'El código firmado se imprime en la etiqueta de cada unidad.',
        icon: 'label',
      },
      {
        id: 'transport',
        label: 'Transporte',
        description: 'Cada traslado queda registrado como un evento con fecha, origen y destino.',
        icon: 'truck',
      },
      {
        id: 'distribution',
        label: 'Distribución',
        description: 'Los centros de distribución confirman la recepción y la salida de las unidades.',
        icon: 'warehouse',
      },
      {
        id: 'commerce',
        label: 'Comercio',
        description: 'El punto de venta registra la llegada y la unidad queda lista para su verificación.',
        icon: 'store',
      },
      {
        id: 'verification',
        label: 'Verificación',
        description: 'Cualquier persona verifica la unidad desde el navegador y compara lo que ve con el registro.',
        icon: 'scan',
      },
    ],
    cta: { label: 'Ver el recorrido completo', key: 'journey', variant: 'link' },
  },

  pillars: {
    title: 'Cuatro servicios sobre una misma capa',
    intro:
      'Identidad, trazabilidad, verificación y control comparten el mismo registro. Lo que cambia en cada despliegue son los datos, las reglas y quién puede consultarlos.',
    items: [
      {
        title: 'Identidad digital unitaria',
        body: 'Cada unidad —no solo cada lote— recibe un identificador único, derivado y firmado en el momento de la emisión.',
        icon: 'fingerprint',
      },
      {
        title: 'Trazabilidad',
        body: 'Emisión, activación y consultas quedan en un registro append-only, en orden y con contexto: quién, cuándo y con qué resultado.',
        icon: 'link',
      },
      {
        title: 'Verificación pública',
        body: 'Cualquier persona comprueba una unidad desde el navegador, sin instalar nada ni crear una cuenta.',
        icon: 'scan',
      },
      {
        title: 'Control institucional',
        body: 'Reguladores y empresas consultan el registro, siguen anomalías y coordinan la inspección de campo.',
        icon: 'eye',
      },
    ],
  },

  story: {
    eyebrow: 'La historia de la unidad',
    title: 'Más que un código: una historia que se puede comprobar',
    body:
      'Cada identidad reúne los datos que importan para reconocer una unidad: quién la produjo o importó, qué es, de qué lote viene, cuándo vence y en qué estado está su identificador. Pocos, claros y comparables con el envase.',
    quote: 'Traza no solo identifica productos. Construye su historia verificable.',
    fields: [
      {
        label: 'Fabricante / importador',
        description: 'Quién puso la unidad en el mercado y responde por ella.',
        icon: 'factory',
      },
      {
        label: 'Producto / presentación',
        description: 'Qué es exactamente: tipo, variante, formato y contenido declarado.',
        icon: 'box',
      },
      {
        label: 'Origen / lote',
        description: 'De dónde procede y a qué lote de producción o importación pertenece.',
        icon: 'map-pin',
      },
      {
        label: 'Movimientos / destino',
        description: 'Por dónde ha pasado y hacia dónde iba según el registro.',
        icon: 'truck',
      },
    ],
  },

  audiences: {
    title: 'Para quién',
    intro:
      'La misma plataforma responde a necesidades distintas: controlar un mercado, proteger una marca o saber qué se está comprando.',
    items: [
      {
        key: 'government',
        title: 'Gobierno y reguladores',
        body: 'Registro auditable, inspección de campo y verificación pública con la marca de cada institución.',
        bullets: [
          'Control por unidad, no solo por lote',
          'Inspección de campo dentro del despliegue',
          'Co-brand por país y regulador',
        ],
        cta: { label: 'Soluciones para gobierno', key: 'solutionsGovernment', variant: 'link' },
        icon: 'government',
      },
      {
        key: 'industry',
        title: 'Industria',
        body: 'Protección de marca, visibilidad de la cadena e integración con los sistemas que ya se usan.',
        bullets: [
          'Identidad emitida desde la producción o la importación',
          'Eventos de cadena desde sistemas de gestión y almacén',
          'Verificación pública con marca propia',
        ],
        cta: { label: 'Soluciones para industria', key: 'solutionsIndustry', variant: 'link' },
        icon: 'industry',
      },
      {
        key: 'citizens',
        title: 'Ciudadanos',
        body: 'Verificar en el punto de venta, entender el resultado y reportar una discrepancia en pocos pasos.',
        bullets: [
          'Sin instalar nada ni crear una cuenta',
          'Resultado explicado en lenguaje claro',
          'Reporte de discrepancias con datos mínimos',
        ],
        cta: { label: 'Soluciones para ciudadanos', key: 'solutionsCitizens', variant: 'link' },
        icon: 'citizen',
      },
    ],
  },

  perspectives: {
    eyebrow: 'La plataforma en uso',
    title: 'Tres formas de verlo en funcionamiento',
    intro:
      'Cada vista muestra una parte de la plataforma desde el punto de vista de quien la usa: el público, quien sigue una unidad y la institución que controla.',
    items: [
      {
        key: 'verify',
        tag: 'Para el público',
        title: 'Verificación pública',
        body: 'Escanee o escriba el código de una unidad y lea un resultado explicado por señales: firma, registro, coincidencia y anomalías.',
        cta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'Para la cadena',
        title: 'Recorrido del producto',
        body: 'Siga una unidad desde la fábrica o la aduana hasta el comercio, evento por evento, y vea cómo se construye su historia.',
        cta: { label: 'Ver el recorrido', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
      {
        key: 'institutional',
        tag: 'Para el control',
        title: 'Vista institucional',
        body: 'Consulte el registro como lo haría un regulador o una empresa: unidades, anomalías, discrepancias e inspección de campo.',
        cta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'secondary' },
        icon: 'chart',
      },
    ],
    note: 'Las tres vistas trabajan sobre el mismo registro: lo que cambia es qué puede ver y hacer cada rol.',
  },

  useCase: {
    eyebrow: 'Primer caso de uso',
    tag: 'Propuesta de piloto',
    title: 'Licores: identidad unitaria y verificación pública para un regulador',
    body:
      'El primer caso de uso de Traza es una propuesta de piloto dirigida a un regulador de licores. Plantea identificar cada unidad con una firma digital, registrar su recorrido y ofrecer verificación pública desde el navegador, con inspección de campo incluida en el piloto.',
    bullets: [
      'Identidad unitaria firmada (arquitectura objetivo: ECDSA P-256)',
      'Verificación pública web, sin instalación ni cuenta',
      'Inspección de campo dentro del piloto',
      'Co-brand condicional con el regulador',
    ],
    cta: { label: 'Conocer el caso de uso', key: 'caseSpirits', variant: 'secondary' },
    disclaimer:
      'Propuesta de piloto. No implica una implementación oficial, una relación contractual ni la participación de ninguna agencia.',
  },

  multisector: {
    title: 'Una misma capa para distintos sectores',
    body:
      'La plataforma no depende del tipo de producto. Combina identidad unitaria, eventos de cadena, verificación pública y reglas configurables por tenant; lo que cambia en cada sector son los datos de la identidad, los eventos relevantes y quién puede consultarlos.',
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

  trust: {
    title: 'Seguridad y confianza, con los límites a la vista',
    intro:
      'Preferimos explicar con precisión qué se comprueba y qué no, antes que prometer garantías absolutas.',
    items: [
      {
        title: 'Firma por unidad',
        body: 'Cada identidad se firma con claves que gestiona el emisor. Una firma válida indica emisión; no describe el contenido físico.',
        icon: 'signature',
      },
      {
        title: 'Verificación por señales',
        body: 'Firma, estado en el registro, coincidencia de datos y anomalías se evalúan por separado y se explican en lenguaje claro.',
        icon: 'compare',
      },
      {
        title: 'Datos mínimos',
        body: 'La verificación pública no requiere datos personales. Los reportes piden solo lo necesario, y de forma opcional.',
        icon: 'lock',
      },
      {
        title: 'Transparencia',
        body: 'Decimos lo que está respaldado y señalamos lo que no. Sin certificaciones, auditorías ni resultados que no tengan fuente.',
        icon: 'info',
      },
    ],
    cta: { label: 'Leer sobre seguridad y confianza', key: 'security', variant: 'link' },
  },

  finalCta: {
    title: 'Empiece por verificar una unidad',
    body:
      'La mejor forma de entender Traza es usarla: escanee o escriba un código de ejemplo y lea el resultado. Si desea conversar sobre un piloto o una integración, el equipo está disponible.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Contactar al equipo', key: 'company', variant: 'secondary' },
  },
};
