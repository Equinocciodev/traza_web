import type { CompanyContent } from '../types';

export const company: CompanyContent = {
  meta: {
    title: 'Empresa: misión, principios y contacto del equipo',
    description:
      'Traza Technology, C.A., empresa privada y plataforma multisector de identidad unitaria, trazabilidad y verificación. Misión, principios y contacto del equipo.',
  },

  hero: {
    eyebrow: 'Empresa',
    title: 'Una empresa privada al servicio de la confianza en los productos',
    subtitle:
      'Traza Technology, C.A. es una empresa privada y una plataforma tecnológica multisector. Presta servicios de identidad digital unitaria, trazabilidad, verificación y control a entidades del sector público y a industrias privadas.',
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
    title: '¿Qué necesitas mejorar?',
    intro: 'Una primera conversación para entender tu operación y evaluar el siguiente paso.',
    formTitle: 'Empecemos por tu contexto.',
    form: {
      name: 'Nombre',
      email: 'Correo electrónico',
      organization: 'Organización',
      sector: 'Sector',
      sectorOptions: [
        'Gobierno o regulador',
        'Medicamentos y productos de salud',
        'Farmacéutico y salud',
        'Agroindustria',
        'Repuestos y partes',
        'Bienes de consumo',
        'Documentos y certificados',
        'Otro',
      ],
      message: 'Mensaje',
      consent: 'Acepto que mis datos se usen únicamente para responder a este mensaje.',
      mailSubject: 'Contacto desde traza.technology — {name}',
      submit: 'Enviar mensaje',
      success: {
        title: 'Su mensaje está listo para enviar',
        body: 'Hemos abierto su aplicación de correo con el mensaje redactado. Revíselo y envíelo: hasta que lo haga, no nos ha llegado. Si no se abrió, escríbanos a:',
      },
      error: {
        title: 'No se pudo preparar el mensaje',
        body: 'No fue posible abrir su aplicación de correo. Copie el texto que escribió y envíelo al correo de contacto que figura en esta página.',
      },
    },
    emailLabel: 'Correo de contacto',
    emailFallback:
      'Escríbanos desde el formulario y le responderemos al correo que indique.',
    responseNote: 'El equipo responde en días hábiles.',
  },

  legal: {
    title: 'Datos de la empresa',
    items: [
      { label: 'Razón social', value: 'Traza Technology, C.A.' },
      { label: 'Marca', value: 'Traza®' },
      { label: 'Actividad', value: 'Plataforma de identidad digital unitaria, trazabilidad y verificación' },
      { label: 'Sitio', value: 'traza.technology' },
    ],
  },

  disclaimer:
    'Esta página no afirma contratos, certificaciones ni relación con gobiernos o agencias. El caso de uso de medicamentos es una propuesta de piloto.',
};
