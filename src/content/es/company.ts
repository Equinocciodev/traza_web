import type { CompanyContent } from '../types';

export const company: CompanyContent = {
  meta: {
    title: 'Empresa: misión, principios y contacto del equipo',
    description:
      'Traza Technology, C.A.: identidad digital y consulta de medicamentos. Conoce la misión, principios y el contacto de la empresa privada detrás de la propuesta.',
  },

  hero: {
    eyebrow: 'Empresa',
    title: 'Una empresa privada al servicio de la identidad de los medicamentos',
    subtitle:
      'Traza Technology, C.A. es una empresa privada. Su propuesta para medicamentos conecta identidad digital unitaria, registro del ciclo de vida y consulta pública, con roles y responsabilidades definidos en cada piloto.',
  },

  mission: {
    title: 'Misión',
    paragraphs: [
      'Dar a cada unidad de medicamento una identidad digital que cualquier persona pueda consultar. La ficha permite comparar producto, presentación, lote y vencimiento con el envase; no certifica su contenido físico.',
      'Diseñamos la propuesta para fabricantes, importadores, farmacias, establecimientos de salud, equipos de calidad y autoridades sanitarias. El público también necesita una respuesta clara al comparar un medicamento con su registro.',
      'Nuestra marca maestra vive en traza.technology. Cada piloto de medicamentos puede llevar la marca de la organización responsable, sujeto a aprobación y sin afirmar una relación institucional.',
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
        body: 'Un registro ordenado del ciclo de vida de cada unidad: emisión, etiquetado, activación, consulta, señales y cierre.',
        icon: 'link',
      },
      {
        title: 'Verificación pública',
        body: 'Una forma de comprobar cualquier unidad desde el navegador, sin instalar nada ni crear una cuenta, con resultados explicados.',
        icon: 'scan',
      },
      {
        title: 'Control institucional',
        body: 'Vistas de ejemplo para autoridades sanitarias y equipos de calidad: señales, reportes e inspecciones. Su operación se acuerda en cada piloto.',
        icon: 'eye',
      },
      {
        title: 'Despliegues co-brand y white-label',
        body: 'La misma plataforma con la marca, las reglas y los permisos acordados para cada programa de medicamentos.',
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
      sector: 'Tipo de organización',
      sectorOptions: [
        'Fabricantes de medicamentos',
        'Importadores de medicamentos',
        'Farmacias',
        'Establecimientos de salud',
        'Equipos de calidad',
        'Autoridades sanitarias',
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
