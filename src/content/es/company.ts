import type { CompanyContent } from '../types';

export const company: CompanyContent = {
  meta: {
    title: 'Empresa',
    description:
      'Traza es una empresa privada y plataforma multisector de identidad digital unitaria, trazabilidad y verificación. Misión, principios y contacto del equipo.',
  },

  hero: {
    eyebrow: 'Empresa',
    title: 'Una empresa privada al servicio de la confianza en los productos',
    subtitle:
      'Traza es una empresa privada y una plataforma tecnológica multisector. Presta servicios de identidad digital unitaria, trazabilidad, verificación y control a entidades del sector público y a industrias privadas.',
  },

  mission: {
    title: 'Misión',
    paragraphs: [
      'Dar a los productos reales una identidad digital que cualquier persona pueda comprobar. Creemos que la confianza en lo que se compra, se distribuye o se regula no debería depender de una etiqueta difícil de imitar, sino de una historia verificable que acompaña a cada unidad.',
      'Diseñamos la plataforma para reguladores, agencias de control e industrias privadas que necesitan saber qué unidades circulan, de dónde vienen y si lo que se vende coincide con lo registrado. Y para el público, que merece una respuesta clara en el momento de la compra.',
      'Nuestra marca maestra vive en traza.technology. Cada despliegue puede llevar la marca de la institución o la empresa que lo gobierna, por país, regulador o industria, sobre la misma plataforma.',
    ],
  },

  whatWeDo: {
    title: 'Qué hacemos',
    items: [
      {
        title: 'Identidad digital unitaria',
        body: 'Un identificador único y firmado para cada unidad, con los datos que la describen y sin datos personales.',
        icon: 'fingerprint',
      },
      {
        title: 'Trazabilidad',
        body: 'Un registro ordenado y auditable de los eventos de cada unidad a lo largo de la cadena.',
        icon: 'link',
      },
      {
        title: 'Verificación pública',
        body: 'Una forma de comprobar cualquier unidad desde el navegador, sin instalar nada ni crear una cuenta, con resultados explicados.',
        icon: 'scan',
      },
      {
        title: 'Control institucional',
        body: 'Vistas para reguladores y empresas: seguimiento de anomalías, reportes de discrepancia e inspección de campo.',
        icon: 'eye',
      },
      {
        title: 'Despliegues co-brand y white-label',
        body: 'La misma plataforma con la marca, las reglas y el contexto de cada institución o empresa, por país y por sector.',
        icon: 'layers',
      },
    ],
  },

  principles: {
    title: 'Principios',
    items: [
      {
        title: 'Precisión',
        body: 'Decimos exactamente qué se comprobó y qué no. Preferimos una explicación a una promesa.',
        icon: 'check',
      },
      {
        title: 'Calma',
        body: 'Un resultado de verificación debe ayudar a decidir, no alarmar. Diseñamos para el punto de venta y para la lectura rápida.',
        icon: 'clock',
      },
      {
        title: 'Servicio público y privado',
        body: 'La plataforma está pensada para instituciones y para empresas por igual. La misma capa sirve al control y a la protección de marca.',
        icon: 'globe',
      },
      {
        title: 'Apertura a la auditoría',
        body: 'El registro se diseña para que un tercero pueda revisarlo. Lo que no podemos demostrar, no lo afirmamos.',
        icon: 'document',
      },
    ],
  },

  contact: {
    title: 'Contacto',
    intro:
      'Si su organización estudia un piloto, una integración o simplemente quiere entender mejor la plataforma, escríbanos.',
    form: {
      name: 'Nombre',
      email: 'Correo electrónico',
      organization: 'Organización',
      sector: 'Sector',
      sectorOptions: [
        'Gobierno o regulador',
        'Bebidas y alimentos',
        'Farmacéutico y salud',
        'Agroindustria',
        'Repuestos y partes',
        'Bienes de consumo',
        'Documentos y certificados',
        'Otro',
      ],
      message: 'Mensaje',
      consent: 'Entiendo que este formulario es una simulación y que no se enviará ni almacenará ningún dato.',
      submit: 'Enviar mensaje',
      success: {
        title: 'Mensaje recibido',
        body: 'Gracias por escribir. En este demo el envío es simulado: no se ha transmitido ni guardado ningún dato.',
      },
      error: {
        title: 'No se pudo enviar',
        body: 'Ocurrió un problema al procesar el formulario. Revise los campos señalados e inténtelo de nuevo.',
      },
    },
    emailLabel: 'Correo de contacto',
    emailFallback:
      'El correo público de contacto se configura en cada despliegue. En este demo no hay un correo real habilitado.',
    responseNote: 'En un despliegue real, el equipo responde en días hábiles.',
  },

  disclaimer:
    'Demostración conceptual. Esta página no afirma clientes, contratos, certificaciones ni relación con gobiernos o agencias. El caso de uso de licores es una propuesta de piloto y el formulario de contacto es simulado.',
};
