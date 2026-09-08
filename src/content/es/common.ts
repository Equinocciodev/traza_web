import type { CommonContent } from '../types';

export const common: CommonContent = {
  brand: {
    name: 'traza',
    wordmarkAlt: 'traza®',
    tagline: 'Identidad digital para productos reales',
    domain: 'traza.technology',
  },

  meta: {
    siteName: 'traza',
    titleTemplate: '%s · traza',
    defaultDescription:
      'Traza es una plataforma de identidad digital unitaria, trazabilidad y verificación pública para productos reales. Demostración conceptual con datos simulados.',
    ogImageAlt: 'traza® — Identidad digital para productos reales. Demostración conceptual con datos simulados.',
  },

  demoBadge: {
    long: 'Demostración conceptual — datos simulados',
    short: 'Demo · datos simulados',
    explain:
      'Este sitio es una demostración conceptual. Los códigos, unidades, eventos, resultados y organizaciones que muestra son simulados; nada de ello corresponde a una implementación real ni implica relación con ninguna institución.',
  },

  skipLink: 'Ir al contenido principal',

  nav: {
    ariaLabel: 'Navegación principal',
    items: [
      { key: 'home', label: 'Inicio' },
      { key: 'platform', label: 'Plataforma' },
      {
        key: 'solutions',
        label: 'Soluciones',
        children: [
          { key: 'solutionsGovernment', label: 'Gobierno y reguladores' },
          { key: 'solutionsIndustry', label: 'Industria' },
          { key: 'solutionsCitizens', label: 'Ciudadanos' },
        ],
      },
      { key: 'howItWorks', label: 'Cómo funciona' },
      { key: 'caseSpirits', label: 'Caso: Licores' },
      { key: 'security', label: 'Seguridad y confianza' },
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
        title: 'Demostraciones',
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
          { label: 'Caso: Licores', key: 'caseSpirits' },
          { label: 'Seguridad y confianza', key: 'security' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { label: 'Empresa y contacto', key: 'company' },
          { label: 'Aviso de privacidad', key: 'privacy' },
        ],
      },
    ],
    legal: '© 2026 traza. Todos los derechos reservados.',
    disclaimer:
      'Demostración conceptual con datos simulados. Este sitio no afirma relación alguna con gobiernos, reguladores, clientes ni certificaciones. El caso de uso de licores se presenta como propuesta de piloto; nada de lo mostrado constituye una implementación oficial.',
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
    demoRegion: 'Demostración interactiva con datos simulados',
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
    sentBody: 'Gracias. En este demo el envío es simulado: no se ha transmitido ni guardado ningún dato.',
    errorTitle: 'No se pudo enviar',
    errorBody: 'Ocurrió un problema al procesar el formulario. Revise los campos señalados e inténtelo de nuevo.',
    optional: 'opcional',
    privacyNote:
      'Este formulario es simulado: no envía datos a ningún servidor ni los almacena. Solo muestra cómo funcionaría el flujo.',
    errorSummaryTitle: 'Revise los siguientes campos',
    noScript: 'El envío simulado requiere JavaScript. Mientras no esté disponible, el botón está deshabilitado y sus datos no se envían.',
  },
};
