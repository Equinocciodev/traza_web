import type { CaseMedicinesContent } from '../types';

export const caseMedicines: CaseMedicinesContent = {
  meta: {
    title: 'Medicamentos: identidad y verificación por unidad',
    description:
      'Identidad digital por unidad de medicamento: impresión del QR, activación al finalizar la producción, consulta pública y control. Propuesta de piloto acotado.',
  },

  hero: {
    eyebrow: 'Caso de uso · Medicamentos',
    tag: 'Propuesta de piloto',
    title: 'El QR nace con el medicamento',
    subtitle:
      'Cada frasco de solución oral de 120 ml lleva un QR único desde el envase. Se emite la identidad, se imprime y se activa al finalizar la producción; después, cada consulta contrasta la unidad con su registro.',
    disclaimer:
      'Este caso se presenta como propuesta de piloto dirigida a un regulador de medicamentos. No describe una implementación oficial, no implica relación contractual y no afirma la participación de ninguna agencia.',
  },

  context: {
    title: 'El problema que se plantea resolver',
    paragraphs: [
      'Un lote identifica un conjunto; el QR de Traza identifica cada unidad. El frasco y su caja permiten contrastar producto, concentración, forma farmacéutica, fabricante o importador, registro sanitario, lote y vencimiento. Los datos del ejemplo no corresponden a un medicamento autorizado.',
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
        title: 'Impresión directa en el envase',
        body: 'El QR se imprime en la caja, etiqueta o precinto durante el acondicionamiento. Cada unidad conserva su identificador; no se reutiliza un código para todo el lote.',
        icon: 'label',
      },
      {
        title: 'Registro del ciclo de vida',
        body: 'Emisión → impresión → activación al finalizar producción → consulta y control. El cierre de la ficha del lote activa solo las unidades efectivamente producidas.',
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
        role: 'Regulador de medicamentos',
        body: 'Define el marco, gobierna el registro, sigue anomalías y reportes, y dirige la inspección de campo. En la propuesta, este papel corresponde al destinatario del piloto.',
        icon: 'government',
      },
      {
        role: 'Fabricantes e importadores',
        body: 'Solicitan identidades para sus unidades y completan producto, concentración, forma farmacéutica, registro sanitario, lote y vencimiento. Responden por los datos declarados.',
        icon: 'factory',
      },
      {
        role: 'Producción y acondicionamiento',
        body: 'Imprimen los identificadores en los envases, comprueban su lectura y cierran la ficha al terminar la producción. Esa confirmación activa los códigos utilizados.',
        icon: 'label',
      },
      {
        role: 'Farmacias y puntos de dispensación',
        body: 'Ponen el código a disposición del público y contrastan el envase con el registro. El piloto no registra ventas, transporte ni distribución.',
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
        title: 'Registro del ciclo de vida',
        body: 'Registro de emisión, impresión, activación, consultas, señales y cierre, con responsable y fecha. No requiere registrar movimientos logísticos.',
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
      { title: 'Anticopia y validación tributaria · fase 2', body: 'Las medidas físicas anticopia y la validación del pago de tributos se evaluarían en una fase posterior. La validación tributaria depende de la integración y autorización de la autoridad competente; no está disponible en este ejemplo. Una firma digital por sí sola no impide copiar la etiqueta.', icon: 'shield' },
    ],
    note: 'Arquitectura objetivo de la propuesta: no implementada todavía. Su desarrollo y su auditoría forman parte del alcance que se acordaría con la institución.',
  },

  fieldInspection: {
    title: 'La inspección de campo forma parte del piloto',
    body:
      'La propuesta no aplaza la inspección de campo a una fase posterior: la incluye desde el inicio. Las señales del registro orientan a los equipos, y lo que observan en sitio vuelve al registro. Lo que llega más tarde es la aplicación específica para inspectores; al principio se trabaja con la misma web y las vistas institucionales.',
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
      'La propuesta permite que una empresa pública y/o privada presente la verificación junto a Traza. La franja y el ejemplo usan la paleta de Traza; la marca de cada participante requiere autorización.',
    lockupNote:
      'El lockup «EMPRESA PÚBLICA Y/O PRIVADA | TRAZA» es un ejemplo de co-brand condicional incluido en la propuesta de piloto. Se muestra en versión tipográfica, sin emblema oficial, y su uso depende de la aprobación de la institución. No implica relación oficial, respaldo ni aprobación.',
    cta: { label: 'Ver la verificación con el tenant de ejemplo', key: 'verify', suffix: '?t=medicamentos', variant: 'secondary' },
  },

  nonClaims: {
    title: 'Lo que esta propuesta no afirma',
    intro:
      'Para evitar confusiones, dejamos por escrito lo que esta página no dice.',
    items: [
      'No afirma que exista una implementación oficial ni un sistema en funcionamiento.',
      'No afirma una relación contractual, comercial o institucional con ninguna empresa, autoridad o agencia.',
      'No presenta cifras del piloto: cantidades, plazos, costos o resultados.',
      'No afirma seguridad de producción: la arquitectura descrita es un objetivo cuya implementación se audita en cada despliegue.',
      'No ofrece conclusiones legales ni regulatorias; la propuesta no sustituye el análisis normativo que corresponda.',
      'No autoriza el uso de la marca ni del emblema de ninguna institución; el lockup mostrado es un ejemplo condicional.',
    ],
  },

  cta: {
    title: 'Vea el caso de uso en la plataforma',
    body:
      'La verificación pública con el tenant de ejemplo, el ciclo de vida de un frasco y la vista institucional muestran cómo se vería el piloto.',
    primaryCta: { label: 'Verificar con el tenant de ejemplo', key: 'verify', suffix: '?t=medicamentos', variant: 'primary' },
    secondaryCta: { label: 'Abrir la vista institucional', key: 'institutional', variant: 'secondary' },
  },
};
