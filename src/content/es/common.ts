import type { CommonContent } from '../types';

export const common: CommonContent = {
  brand: {
    name: 'traza',
    wordmarkAlt: 'traza®',
    tagline: 'Identidad digital para productos reales',
    domain: 'traza.technology',
  },

  meta: {
    siteName: 'Traza®',
    titleTemplate: '%s · Traza®',
    defaultDescription:
      'Plataforma de identidad digital unitaria, trazabilidad y verificación pública: un identificador firmado por unidad y el registro auditable de su recorrido.',
    homeTitle: 'Traza — Identidad digital verificable para productos reales',
    ogImageAlt: 'traza® — Identidad digital para productos reales.',
  },

  skipLink: 'Ir al contenido principal',

  nav: {
    ariaLabel: 'Navegación principal',
    items: [
      { key: 'home', label: 'Inicio' },
      { key: 'platform', label: 'Plataforma' },
      { key: 'howItWorks', label: 'Cómo funciona' },
      {
        key: 'solutions',
        label: 'Soluciones',
        children: [
          { key: 'solutionsGovernment', label: 'Gobierno y reguladores' },
          { key: 'solutionsIndustry', label: 'Industria' },
          { key: 'solutionsCitizens', label: 'Ciudadanos' },
          { key: 'caseSpirits', label: 'Caso de uso: licores' },
        ],
      },
      {
        key: 'security',
        label: 'Tecnología',
        children: [
          { key: 'security', label: 'Seguridad y confianza' },
          { key: 'codeSpec', label: 'La etiqueta y el código' },
          { key: 'integration', label: 'Integración' },
          { key: 'rationale', label: 'Por qué este diseño' },
        ],
      },
      { key: 'company', label: 'Empresa' },
    ],
    cta: { label: 'Verificar', key: 'verify', variant: 'primary' },
    menuOpen: 'Abrir el menú',
    menuClose: 'Cerrar el menú',
    homeLinkLabel: 'traza — ir al inicio',
  },

  languageSwitch: {
    label: 'Idioma',
    switchTo: 'English',
    switchAria: 'Cambiar a inglés',
  },

  footer: {
    columns: [
      {
        title: 'Plataforma en uso',
        links: [
          { label: 'Verificación pública', key: 'verify' },
          { label: 'Recorrido del producto', key: 'journey' },
          { label: 'Vista institucional', key: 'institutional' },
        ],
      },
      {
        title: 'Plataforma',
        links: [
          { label: 'Plataforma', key: 'platform' },
          { label: 'Cómo funciona', key: 'howItWorks' },
          { label: 'Soluciones', key: 'solutions' },
          { label: 'Caso de uso: licores', key: 'caseSpirits' },
          { label: 'Seguridad y confianza', key: 'security' },
          { label: 'La etiqueta y el código', key: 'codeSpec' },
          { label: 'Integración', key: 'integration' },
          { label: 'Por qué este diseño', key: 'rationale' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { label: 'Empresa y contacto', key: 'company' },
          { label: 'Aviso de privacidad', key: 'privacy' },
          { label: 'Instagram', href: 'https://www.instagram.com/traza.technology/', external: true, rel: 'me' },
        ],
      },
    ],
    legal: '© 2026 traza. Todos los derechos reservados.',
    disclaimer:
      'Este sitio no afirma relación alguna con gobiernos, reguladores ni certificaciones. El caso de uso de licores se presenta como propuesta de piloto; no constituye una implementación oficial.',
    privacyLabel: 'Privacidad',
    contactLabel: 'Contacto',
    languageLabel: 'Idioma',
  },

  cobrandNotice:
    'El lockup de tenant que se muestra es un ejemplo de co-brand incluido en una propuesta de piloto. Su uso está condicionado a la aprobación de la institución correspondiente y no implica relación oficial, respaldo ni aprobación.',

  a11y: {
    newWindow: 'Se abre en una ventana nueva',
    loading: 'Cargando',
    close: 'Cerrar',
    back: 'Volver',
    breadcrumbs: 'Ruta de navegación',
    toolRegion: 'Herramienta interactiva',
  },

  states: {
    loading: 'Cargando…',
    retry: 'Reintentar',
    offlineTitle: 'Sin conexión',
    offlineBody:
      'Ahora mismo no hay conexión a internet. Puede seguir leyendo esta página; las consultas se reanudarán cuando la conexión vuelva.',
    serverErrorTitle: 'No pudimos completar la consulta',
    serverErrorBody:
      'El servicio no respondió como esperábamos. No es un problema de su parte. Espere unos segundos e inténtelo de nuevo.',
    emptyTitle: 'Sin resultados',
    emptyBody: 'No encontramos información para esta consulta. Revise el código introducido o pruebe con otro.',
    recoveredTitle: 'Conexión restablecida',
    recoveredBody: 'Ya puede continuar. Si una consulta quedó pendiente, vuelva a intentarla.',
  },

  form: {
    required: 'Este campo es obligatorio.',
    invalidEmail: 'Escriba una dirección de correo válida.',
    tooShort: 'El texto es demasiado corto.',
    tooLong: 'El texto es demasiado largo.',
    submit: 'Enviar',
    sending: 'Enviando…',
    sentTitle: 'Mensaje recibido',
    sentBody: 'Gracias por escribir. Le responderemos en días hábiles.',
    errorTitle: 'No se pudo enviar',
    errorBody: 'Ocurrió un problema al procesar el formulario. Revise los campos señalados e inténtelo de nuevo.',
    optional: 'opcional',
    privacyNote:
      'Sus datos se usan únicamente para responderle. No se almacenan en este sitio ni se comparten con terceros.',
    errorSummaryTitle: 'Revise los siguientes campos',
    noScript: 'El envío del formulario requiere JavaScript. Mientras no esté disponible, escríbanos directamente al correo de contacto.',
  },
};
