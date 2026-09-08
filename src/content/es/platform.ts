import type { PlatformContent } from '../types';

export const platform: PlatformContent = {
  meta: {
    title: 'Plataforma de identidad, trazabilidad y control',
    description:
      'Capacidades de la plataforma Traza: identidad unitaria, registro de eventos de cadena, verificación pública, control institucional y reglas por tenant.',
  },

  hero: {
    eyebrow: 'Plataforma',
    title: 'Una capa de identidad, trazabilidad y verificación para productos reales',
    subtitle:
      'Traza une tres cosas que suelen vivir separadas: la identidad de cada unidad, el registro de su ciclo de vida y una forma pública y sencilla de comprobar ambas.',
  },

  capabilities: {
    title: 'Qué hace la plataforma',
    intro:
      'Seis capacidades que se combinan según el despliegue. Ninguna exige reemplazar los sistemas que una organización ya utiliza.',
    items: [
      {
        title: 'Identidad digital unitaria',
        body: 'Un identificador único y firmado para cada unidad, con los datos mínimos que la describen: fabricante o importador, producto y presentación, origen y lote.',
        icon: 'fingerprint',
      },
      {
        title: 'Registro de eventos de cadena',
        body: 'Cada momento del ciclo de vida —emisión, etiquetado, prueba de imprenta, activación de la ficha, consultas y cierre de la emisión— se registra como un evento con fecha, lugar y responsable.',
        icon: 'history',
      },
      {
        title: 'Verificación pública',
        body: 'Cualquier persona verifica una unidad desde el navegador, sin instalar nada ni crear una cuenta. El resultado se explica por señales y en lenguaje claro.',
        icon: 'scan',
      },
      {
        title: 'Control institucional',
        body: 'Reguladores y empresas consultan el registro, siguen anomalías, coordinan inspecciones de campo y exportan información para auditoría.',
        icon: 'eye',
      },
      {
        title: 'Reglas configurables por tenant',
        body: 'Cada despliegue define su marca, sus campos de identidad, sus tipos de evento, sus roles y el contexto que ve el público al verificar.',
        icon: 'settings',
      },
      {
        title: 'Reporte de discrepancias',
        body: 'Quien verifica puede reportar una diferencia entre lo que ve y lo que dice el registro, con datos mínimos y opcionales.',
        icon: 'flag',
      },
    ],
  },

  identity: {
    title: 'La identidad de una unidad',
    body:
      'Una identidad Traza es un registro breve y firmado que responde a cuatro preguntas sobre la unidad. No contiene datos personales. Sí identifica a la empresa emisora, incluido su identificador tributario: la responsabilidad de quien pone el producto en el mercado es pública por diseño.',
    fields: [
      {
        label: 'Fabricante / importador',
        description: 'La organización que produjo la unidad o la trajo al mercado, y que la firma como emisor.',
        icon: 'factory',
      },
      {
        label: 'Producto / presentación',
        description: 'Qué es y en qué formato: tipo, variante, envase y contenido declarado.',
        icon: 'box',
      },
      {
        label: 'Lote y vencimiento',
        description: 'El lote de producción o importación y la fecha de vencimiento, para comparar con lo impreso en el envase.',
        icon: 'label',
      },
      {
        label: 'Estado del identificador',
        description: 'Si está emitido, activado, en revisión o anulado, y desde cuándo se consulta.',
        icon: 'shield-check',
      },
    ],
    example: {
      caption: 'Ejemplo de identidad unitaria',
      code: 'TRZ-7F2K-6C2A-84MZ',
      rows: [
        { label: 'Fabricante / importador', value: 'Cafetalera Monte Azul' },
        { label: 'Producto / presentación', value: 'Café Monte Azul · tueste medio · bolsa 500 g' },
        { label: 'Lote y vencimiento', value: 'COS-MA-26-07 · consumir antes de 09/2027' },
        { label: 'Estado del identificador', value: 'Activado · con consultas registradas' },
        { label: 'Comprobaciones', value: 'Firma válida · registro activo · datos coincidentes · sin alertas' },
      ],
    },
  },

  architecture: {
    title: 'Arquitectura objetivo',
    intro:
      'El principio de diseño es separar tres planos que se comunican por eventos y nunca por consultas cruzadas: así una generación masiva de identificadores no compite jamás con la consulta de una persona frente a un anaquel. Lo que sigue es la arquitectura hacia la que se diseña.',
    layers: [
      {
        name: 'Plano de emisión',
        body: 'Deriva y firma los identificadores por orden. Las claves se custodian en un módulo de seguridad de hardware, con derivación por emisión: administrar una clave y usarla son permisos distintos.',
        icon: 'key',
      },
      {
        name: 'Plano de verificación',
        body: 'El camino caliente: resuelve la consulta pública, evalúa firma, registro, coincidencia y señales, y devuelve un resultado explicado. Debe seguir respondiendo aunque la emisión esté en mantenimiento.',
        icon: 'globe',
      },
      {
        name: 'Plano analítico y de auditoría',
        body: 'Append-only: cada emisión, descarga, activación y cambio de estado queda registrado. Sin UPDATE ni DELETE — revocar es un evento nuevo, no una corrección del anterior.',
        icon: 'database',
      },
      {
        name: 'Espejo de solo lectura',
        body: 'La institución que gobierna un despliegue recibe una copia de solo lectura para auditar sin depender del operador. Es el patrón de repositorio primario y secundario del sistema europeo de tabaco.',
        icon: 'eye',
      },
      {
        name: 'Integración',
        body: 'Interfaces para emitir y activar desde los sistemas de gestión existentes, y para exportar información hacia ellos.',
        icon: 'plug',
      },
    ],
    note: 'Arquitectura objetivo del producto. Los controles criptográficos y de seguridad se implementan y auditan en cada despliegue.',
  },

  verificationModel: {
    title: 'Qué se comprueba al verificar',
    intro:
      'Una verificación no da un veredicto único. Evalúa cuatro señales por separado y las explica, para que quien verifica sepa qué se comprobó, cuánta confianza aporta y cuál es el siguiente paso.',
    signals: [
      {
        key: 'signature',
        title: 'Firma',
        body: 'Si la identidad fue emitida por el emisor esperado y no ha sido alterada.',
        icon: 'signature',
      },
      {
        key: 'registry',
        title: 'Estado en el registro',
        body: 'Si la identidad está activa, suspendida o revocada, y qué eventos constan en ella.',
        icon: 'database',
      },
      {
        key: 'match',
        title: 'Coincidencia de datos',
        body: 'Si lo que muestra la etiqueta coincide con lo que dice el registro: producto, presentación, lote y fecha de vencimiento.',
        icon: 'compare',
      },
      {
        key: 'anomalies',
        title: 'Anomalías',
        body: 'Si hay señales que conviene revisar: consultas repetidas del mismo código, ubicaciones inconsistentes o eventos fuera de secuencia.',
        icon: 'alert',
      },
    ],
    caution:
      'Una firma válida indica que la identidad fue emitida; no describe el contenido físico ni impide que una etiqueta sea copiada. Por eso el resultado nunca se reduce a una palabra: se explica, se acompaña del siguiente paso y la inspección física sigue siendo necesaria.',
  },

  tenancy: {
    title: 'Co-brand y white-label por tenant',
    body:
      'La marca maestra vive en traza.technology. Cada despliegue —por país, regulador o industria— puede presentarse con su propia identidad visual y su propio contexto de verificación, sobre la misma plataforma.',
    bullets: [
      'Lockup de co-brand o marca propia (white-label) en cada despliegue',
      'Colores de acento, textos de contexto y siguiente paso configurables',
      'Campos de identidad y tipos de evento propios de cada sector',
      'Roles y permisos definidos por cada institución',
      'La verificación pública lee el tenant desde la URL y adapta el resultado',
    ],
    exampleNote:
      'El ejemplo que se muestra corresponde al caso de uso de licores: un lockup tipográfico de co-brand incluido en una propuesta de piloto dirigida a un regulador. Es condicional a aprobación y no implica relación oficial.',
  },

  integration: {
    title: 'Integración con sistemas existentes',
    body:
      'La plataforma está pensada para convivir con los sistemas de gestión, almacén y logística que las organizaciones ya usan, sin reemplazarlos.',
    bullets: [
      'Recepción de eventos desde sistemas de gestión y almacén (ERP, WMS) mediante interfaces documentadas',
      'Emisión de identidades por lotes a partir de órdenes de producción o de importación',
      'Exportación del registro para auditoría y análisis',
      'Autenticación del emisor y trazabilidad de quién reporta cada evento',
    ],
    note: 'Las capacidades de integración se describen de forma genérica y sin nombrar productos: cada despliegue acuerda sus conectores.',
  },

  cta: {
    title: 'Vea la plataforma en funcionamiento',
    body:
      'Las tres vistas muestran la verificación pública, el recorrido de una unidad y el panel institucional.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Cómo funciona', key: 'howItWorks', variant: 'secondary' },
  },
};
