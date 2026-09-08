import type { SecurityContent } from '../types';

export const security: SecurityContent = {
  meta: {
    title: 'Seguridad y confianza',
    description:
      'Principios de seguridad y confianza de Traza: una firma por unidad, verificación por señales separadas, datos mínimos y transparencia explícita sobre los límites de lo que una comprobación digital puede demostrar.',
  },

  hero: {
    eyebrow: 'Seguridad y confianza',
    title: 'Confianza que se explica, no que se promete',
    subtitle:
      'La seguridad de una plataforma de verificación se mide por lo que comprueba y por la claridad con la que dice lo que no puede comprobar. Estos son nuestros principios y nuestros límites.',
  },

  principles: {
    title: 'Principios',
    intro: 'Cinco principios guían el diseño de la plataforma y el lenguaje con el que presenta cada resultado.',
    items: [
      {
        title: 'Identidad unitaria firmada',
        body: 'Cada unidad tiene un identificador propio, firmado con claves que gestiona el emisor. Nadie más puede emitir identidades en su nombre.',
        icon: 'signature',
      },
      {
        title: 'Verificación por señales separadas',
        body: 'Firma, estado en el registro, coincidencia de datos y anomalías se evalúan de forma independiente. El resultado muestra cada una, no un veredicto único.',
        icon: 'compare',
      },
      {
        title: 'Mínima recolección de datos',
        body: 'Verificar no exige identificarse. Los reportes piden solo lo necesario y de forma opcional. No se guardan datos personales ni tributarios en las identidades.',
        icon: 'lock',
      },
      {
        title: 'Transparencia sobre los límites',
        body: 'Cada resultado dice qué se comprobó, qué confianza aporta y qué queda fuera. Lo que no está respaldado, no se afirma.',
        icon: 'info',
      },
      {
        title: 'Registro auditable',
        body: 'Los eventos se conservan en orden, con responsable y fecha, y pueden exportarse para que un tercero los revise.',
        icon: 'list',
      },
    ],
  },

  target: {
    title: 'Arquitectura objetivo',
    intro:
      'Los mecanismos que la plataforma propone para sostener esos principios. Se describen como objetivo de diseño, no como controles implementados o auditados.',
    items: [
      {
        title: 'Firmas ECDSA P-256',
        body: 'Para el caso de uso de licores propuesto a un regulador, las identidades se firmarían con ECDSA sobre la curva P-256, un estándar ampliamente documentado.',
        icon: 'key',
      },
      {
        title: 'Claves gestionadas por el emisor',
        body: 'Cada fabricante o importador custodia sus propias claves de firma. La plataforma verifica con la clave pública; no necesita la privada.',
        icon: 'fingerprint',
      },
      {
        title: 'Verificación pública sin cuenta',
        body: 'El servicio de verificación no requiere registro ni datos personales. Responde a cualquier consulta con un resultado explicado.',
        icon: 'globe',
      },
      {
        title: 'Registro de eventos',
        body: 'Un registro ordenado de los eventos de cada unidad, con quién los reportó y cuándo, que permite reconstruir la historia y detectar inconsistencias.',
        icon: 'database',
      },
      {
        title: 'Detección de anomalías',
        body: 'Consultas repetidas del mismo código en lugares distintos, eventos fuera de secuencia o ubicaciones inconsistentes se señalan para revisión.',
        icon: 'alert',
      },
    ],
    note: 'Arquitectura objetivo del producto: esta página no implementa ni afirma una certificación de seguridad. Los controles descritos se implementan y auditan en cada despliegue.',
  },

  verificationHonesty: {
    title: 'Por qué nunca decimos «auténtico»',
    body:
      'Es tentador resumir una verificación en una palabra tranquilizadora. No lo hacemos, porque sería inexacto. Una firma válida demuestra que una identidad fue emitida por el emisor esperado; no demuestra nada sobre el líquido, el envase o la etiqueta que se tiene delante.',
    bullets: [
      'Una firma válida indica emisión, no impide que una etiqueta legítima se copie y se pegue en otra unidad.',
      'El estado en el registro y las anomalías completan el cuadro: un código emitido puede estar revocado o aparecer consultado en lugares incompatibles.',
      'La coincidencia de datos es responsabilidad de quien verifica: comparar producto, presentación, lote y destino con lo que tiene en la mano.',
      'La inspección física sigue siendo necesaria. La plataforma orienta dónde mirar; no sustituye el ojo de quien inspecciona.',
      'Por eso cada resultado dice qué se comprobó, qué confianza aporta y cuál es el siguiente paso.',
    ],
  },

  privacy: {
    title: 'Privacidad',
    body:
      'La plataforma se diseña para que verificar no cueste datos personales. Este sitio aplica el mismo criterio.',
    bullets: [
      'Sin cookies publicitarias ni rastreadores de terceros. Las únicas cookies del sitio son las de medición de audiencia, descritas en el aviso de privacidad.',
      'Sin datos personales en la verificación pública: consultar un código no exige identificarse.',
      'Reportes de discrepancia con datos mínimos y opcionales; quien reporta decide qué comparte.',
      'Las identidades de las unidades no contienen datos personales ni tributarios.',
      'Medición de audiencia agregada, sin identificar a las personas y respetando «Do Not Track».',
    ],
  },

  transparency: {
    title: 'Lo que no afirmamos',
    intro:
      'Decir con claridad lo que no está respaldado es parte de la confianza. Este sitio no afirma nada de lo siguiente.',
    items: [
      'Certificaciones de seguridad, de calidad o de cumplimiento normativo.',
      'Niveles de disponibilidad (uptime) ni compromisos de servicio.',
      'Auditorías externas de código, de infraestructura o de procesos.',
      'Clientes, contratos o despliegues en producción.',
      'Relación con gobiernos, reguladores o agencias: el caso de licores es una propuesta de piloto.',
      'Cifras de escala, de impacto económico o de resultados.',
    ],
  },

  disclosure: {
    title: 'Reporte responsable de vulnerabilidades',
    body:
      'Si detecta un problema de seguridad en este sitio o en la plataforma, agradecemos que lo comunique de forma responsable antes de hacerlo público. Nos comprometemos a acusar recibo, a mantener la conversación abierta y a reconocer la contribución si así se desea.',
    note: 'Los reportes de seguridad se reciben en el correo de contacto de la empresa. Cada despliegue puede definir además su propio canal.',
  },

  cta: {
    title: 'Vea cómo se explica un resultado',
    body:
      'La verificación pública muestra cada señal por separado y el siguiente paso recomendado, con códigos de ejemplo que cubren todos los resultados posibles.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Cómo funciona', key: 'howItWorks', variant: 'secondary' },
  },
};
