import type { PrivacyContent } from '../types';

export const privacy: PrivacyContent = {
  meta: {
    title: 'Aviso de privacidad',
    description:
      'Aviso de privacidad provisional del demo de Traza: sin cookies ni rastreadores, formularios simulados y analítica sin cookies desactivada por defecto.',
  },

  title: 'Aviso de privacidad provisional',
  updatedLabel: 'Última actualización',
  updated: '5 de septiembre de 2026',
  provisionalNote:
    'Este aviso es provisional y corresponde a una demostración conceptual. Un despliegue real de la plataforma contará con su propio aviso, adaptado a la jurisdicción y a la institución o empresa que lo gobierne.',
  intro:
    'Este sitio existe para mostrar cómo funciona Traza. Está diseñado para no recoger datos personales: no usa cookies, no incorpora rastreadores y sus formularios no envían información a ningún servidor. A continuación explicamos cada punto.',

  sections: [
    {
      title: 'Alcance de este aviso',
      paragraphs: [
        'Este aviso se aplica únicamente a esta demostración conceptual y a las páginas y demostraciones interactivas que contiene. No describe las prácticas de ningún despliegue real de la plataforma ni de ninguna institución o empresa.',
        'Todos los datos que se muestran en el sitio —códigos, unidades, eventos, organizaciones y resultados de verificación— son simulados.',
      ],
    },
    {
      title: 'Cookies y rastreadores',
      paragraphs: [
        'Este sitio no instala cookies, ni propias ni de terceros. Tampoco incorpora píxeles de seguimiento, mapas de calor ni herramientas de publicidad.',
        'El navegador puede conservar preferencias locales —por ejemplo, el idioma elegido— en su propio almacenamiento. Esa información no sale del dispositivo y puede borrarse desde el navegador en cualquier momento.',
      ],
    },
    {
      title: 'Formularios',
      paragraphs: [
        'Los formularios de este sitio, incluidos el de contacto y el de reporte de discrepancias, son simulados. Muestran cómo funcionaría el flujo, pero no envían datos a ningún servidor ni los almacenan.',
        'Le recomendamos no introducir datos personales reales en ningún formulario de esta demostración.',
      ],
    },
    {
      title: 'Analítica sin cookies',
      paragraphs: [
        'El sitio incluye una interfaz de analítica que no usa cookies ni identifica a las personas. Está desactivada por defecto en este demo.',
        'Si un despliegue la activa, solo registraría eventos anónimos y agregados —como la vista de una página o el uso de una demostración— sin direcciones IP completas, identificadores de dispositivo ni perfiles de usuario. Cualquier activación se reflejaría en este aviso.',
      ],
    },
    {
      title: 'Verificación pública',
      paragraphs: [
        'La verificación de un producto no requiere identificarse, crear una cuenta ni facilitar datos personales. En este demo, la verificación se realiza con datos simulados y no consulta ningún servicio externo.',
        'En un despliegue real, el servicio de verificación necesitaría recibir el código consultado para responder; el aviso de ese despliegue explicaría qué se conserva, durante cuánto tiempo y con qué fin.',
      ],
    },
    {
      title: 'Enlaces y servicios de terceros',
      paragraphs: [
        'Este sitio no carga recursos de terceros: las fuentes tipográficas y los recursos gráficos se sirven desde el propio sitio.',
        'Si en el futuro se incluyeran enlaces externos, las prácticas de privacidad de esos sitios serían responsabilidad de sus titulares.',
      ],
    },
    {
      title: 'Contacto',
      paragraphs: [
        'El canal de contacto para asuntos de privacidad se configura en cada despliegue. En este demo no hay un canal real habilitado; el formulario de contacto es simulado.',
      ],
    },
    {
      title: 'Cambios a este aviso',
      paragraphs: [
        'Este aviso puede actualizarse a medida que la demostración evolucione. La fecha de la última actualización figura al inicio de la página.',
      ],
    },
  ],
};
