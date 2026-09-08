import type { CaseSpiritsContent } from '../types';

export const caseSpirits: CaseSpiritsContent = {
  meta: {
    title: 'Caso de uso: licores y bebidas alcohólicas',
    description:
      'Propuesta de piloto para un regulador de licores: identidad unitaria firmada, verificación pública web e inspección de campo. Sin implementación oficial.',
  },

  hero: {
    eyebrow: 'Caso de uso · Licores',
    tag: 'Propuesta de piloto',
    title: 'Identidad unitaria y verificación pública para un mercado regulado de licores',
    subtitle:
      'El primer caso de uso de Traza plantea dar a cada botella una identidad firmada, registrar su ciclo de vida desde la emisión hasta cada consulta y permitir que cualquier persona la verifique desde el navegador.',
    disclaimer:
      'Este caso se presenta como propuesta de piloto dirigida a un regulador de licores. No describe una implementación oficial, no implica relación contractual y no afirma la participación de ninguna agencia.',
  },

  context: {
    title: 'El problema que se plantea resolver',
    paragraphs: [
      'En un mercado regulado de licores circulan unidades cuya identidad no se puede comprobar. El control suele apoyarse en documentos, precintos y lotes; una etiqueta copiada con cuidado pasa por legítima y una unidad desviada no deja rastro.',
      'La inspección de campo se enfrenta a un volumen que no puede cubrir sin señales que la orienten. Los equipos llegan donde pueden, no necesariamente donde hace falta, y lo que observan rara vez queda unido al registro de la unidad.',
      'El público, por su parte, no tiene una forma sencilla de verificar lo que compra. Las herramientas que exigen instalar algo o crear una cuenta no se usan en el momento de la compra. La propuesta parte de esa realidad: verificación web, sin instalación ni cuenta, en el punto de venta.',
    ],
  },

  scope: {
    title: 'Alcance propuesto del piloto',
    intro:
      'El piloto se plantea acotado: un conjunto de productos, un grupo reducido de actores de la cadena y un periodo definido, con inspección de campo incluida desde el inicio.',
    items: [
      {
        title: 'Identidad unitaria firmada',
        body: 'Cada unidad recibe un identificador único, firmado por el fabricante o importador que la pone en el mercado.',
        icon: 'fingerprint',
      },
      {
        title: 'Etiquetado con código verificable',
        body: 'El identificador se incorpora a la etiqueta o al precinto como código legible por la cámara de cualquier teléfono.',
        icon: 'label',
      },
      {
        title: 'Registro de eventos de cadena',
        body: 'Emisión, etiquetado, activación de la ficha del lote y cada consulta pública quedan registrados en orden.',
        icon: 'history',
      },
      {
        title: 'Verificación pública web',
        body: 'Cualquier persona verifica desde el navegador y recibe un resultado explicado por señales, con el contexto del regulador.',
        icon: 'scan',
      },
      {
        title: 'Inspección de campo',
        body: 'Los inspectores verifican en sitio, contrastan con el registro y dejan constancia de lo observado dentro del propio piloto.',
        icon: 'search',
      },
      {
        title: 'Reporte de discrepancias',
        body: 'Quien detecta una diferencia entre la unidad y el registro puede reportarla con datos mínimos y opcionales.',
        icon: 'flag',
      },
    ],
  },

  actors: {
    title: 'Quién participa',
    intro: 'La propuesta describe seis papeles. Cada uno ve el registro con el nivel de detalle que le corresponde.',
    items: [
      {
        role: 'Regulador de licores',
        body: 'Define el marco, gobierna el registro, sigue anomalías y reportes, y dirige la inspección de campo. En la propuesta, este papel corresponde al destinatario del piloto.',
        icon: 'government',
      },
      {
        role: 'Fabricantes e importadores',
        body: 'Emiten y firman las identidades de sus unidades y reportan la salida de fábrica o el ingreso por aduana.',
        icon: 'factory',
      },
      {
        role: 'Transportistas y distribuidores',
        body: 'Solicitan emisiones, aplican las etiquetas y cierran la ficha del lote, que es lo que activa los códigos.',
        icon: 'truck',
      },
      {
        role: 'Puntos de venta',
        body: 'Registran la llegada de las unidades y ponen el código a disposición del público.',
        icon: 'store',
      },
      {
        role: 'Inspectores de campo',
        body: 'Verifican en sitio, contrastan lo físico con lo registrado y dejan constancia de lo observado.',
        icon: 'map-pin',
      },
      {
        role: 'Público',
        body: 'Verifica en el punto de venta, lee un resultado claro y reporta si algo no coincide.',
        icon: 'citizen',
      },
    ],
  },

  target: {
    title: 'Arquitectura objetivo',
    intro:
      'La propuesta describe la arquitectura hacia la que se diseñaría el piloto. Se presenta como objetivo, no como sistema construido.',
    items: [
      {
        title: 'Identidad unitaria firmada con ECDSA P-256',
        body: 'Cada identificador se firma con criptografía de curva elíptica (ECDSA P-256) usando claves gestionadas por el emisor. Se propone como estándar del caso de uso.',
        icon: 'signature',
      },
      {
        title: 'Verificación pública web, sin instalación ni cuenta',
        body: 'Un servicio web evalúa firma, estado en el registro, coincidencia de datos y anomalías, y devuelve un resultado explicado.',
        icon: 'globe',
      },
      {
        title: 'Registro de eventos de cadena',
        body: 'Un registro ordenado y auditable de los eventos de cada unidad, con responsable y fecha, exportable para auditoría.',
        icon: 'database',
      },
      {
        title: 'Inspección de campo dentro del piloto',
        body: 'Herramientas para que los inspectores verifiquen en sitio y registren observaciones vinculadas a cada unidad.',
        icon: 'search',
      },
      {
        title: 'Reporte de discrepancias',
        body: 'Un canal público para reportar diferencias entre la unidad y el registro, con datos mínimos y opcionales.',
        icon: 'flag',
      },
    ],
    note: 'Arquitectura objetivo de la propuesta: no implementada todavía. Su desarrollo y su auditoría forman parte del alcance que se acordaría con la institución.',
  },

  fieldInspection: {
    title: 'La inspección de campo forma parte del piloto',
    body:
      'La propuesta no aplaza la inspección de campo a una fase posterior: la incluye desde el inicio. Las señales del registro orientan a los equipos, y lo que observan en sitio vuelve al registro.',
    bullets: [
      'Verificación en sitio con la misma página web que usa el público, con vistas adicionales para el inspector',
      'Constancia de cada inspección vinculada a la unidad y al punto de venta',
      'Priorización a partir de anomalías y de reportes de discrepancia',
      'Retroalimentación al registro: lo observado en campo actualiza el estado de la unidad',
    ],
  },

  cobrand: {
    title: 'Co-brand condicional',
    body:
      'La propuesta contempla que la verificación pública muestre la marca del regulador junto a la de Traza. Ese lockup aparece únicamente dentro de este caso de uso y de su tenant de ejemplo, como muestra de cómo se vería un despliegue co-brand.',
    lockupNote:
      'El lockup «SENIAT | TRAZA» es un ejemplo de co-brand condicional incluido en la propuesta de piloto. Se muestra en versión tipográfica, sin emblema oficial, y su uso depende de la aprobación de la institución. No implica relación oficial, respaldo ni aprobación.',
    cta: { label: 'Ver la verificación con el tenant de ejemplo', key: 'verify', suffix: '?t=licores', variant: 'secondary' },
  },

  nonClaims: {
    title: 'Lo que esta propuesta no afirma',
    intro:
      'Para evitar confusiones, dejamos por escrito lo que esta página no dice.',
    items: [
      'No afirma que exista una implementación oficial ni un sistema en funcionamiento.',
      'No afirma una relación contractual, comercial o institucional con SENIAT ni con ninguna otra agencia; SENIAT se menciona solo como destinatario de una propuesta de piloto.',
      'No presenta cifras del piloto: cantidades, plazos, costos o resultados.',
      'No afirma seguridad de producción: la arquitectura descrita es un objetivo cuya implementación se audita en cada despliegue.',
      'No ofrece conclusiones legales ni regulatorias; la propuesta no sustituye el análisis normativo que corresponda.',
      'No autoriza el uso de la marca ni del emblema de ninguna institución; el lockup mostrado es un ejemplo condicional.',
    ],
  },

  cta: {
    title: 'Vea el caso de uso en la plataforma',
    body:
      'La verificación pública con el tenant de ejemplo, el recorrido de una botella y la vista institucional muestran cómo se vería el piloto.',
    primaryCta: { label: 'Verificar con el tenant de ejemplo', key: 'verify', suffix: '?t=licores', variant: 'primary' },
    secondaryCta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'secondary' },
  },
};
