import type { VerifyContent } from '../verify.types';

/**
 * Verificación pública (ES).
 * Lenguaje claro y calmado. Nunca "auténtico": el resultado describe lo comprobado.
 */
export const verify: VerifyContent = {
  meta: {
    title: 'Verificar un producto con el código de su etiqueta',
    description:
      'Escanee o escriba el código de la unidad y vea qué se comprobó, qué confianza aporta cada señal y cuál es el siguiente paso que conviene dar en la mano.',
  },

  hero: {
    eyebrow: 'Verificación pública',
    title: 'Verificar un producto',
    subtitle:
      'Escanee el código de la etiqueta o escríbalo a mano. El resultado explica qué declara el registro y qué debe comparar la persona con el producto. Esta consulta no certifica autenticidad física.',
    mantra: 'Escanea. Compara. Comprende.',
    requirement: 'Sin instalación ni cuenta: solo un navegador.',
  },

  tenant: {
    regionLabel: 'Contexto de la verificación',
    contextLabel: 'Ámbito',
    registryLabel: 'Registro consultado',
    statusLabel: 'Estado del despliegue',
    switchLabel: 'Ver esta página como',
    options: [
      { id: 'traza', label: 'Marca maestra Traza' },
      { id: 'licores', label: 'Piloto de licores (ejemplo de co-brand)' },
    ],
    lockupCaption: 'Lockup tipográfico de ejemplo · propuesta de piloto · co-brand condicional',
  },

  scanner: {
    title: 'Escanear el código',
    intro: 'Apunte la cámara al código QR de la etiqueta. También puede introducir el código a mano si la cámara no está disponible.',
    viewerLabel: 'Visor de escaneo',
    simulate: 'Simular escaneo',
    simulating: 'Escaneando…',
    useCamera: 'Usar la cámara',
    stopCamera: 'Detener la cámara',
    typeInstead: 'Escribir el código',
    retryCamera: 'Intentar de nuevo',
    idle: 'Visor listo. Simule un escaneo o active la cámara de su dispositivo.',
    simulatingHint: 'Leyendo el código de ejemplo…',
    activeHint: 'Cámara activa. Encuadre el código QR dentro del visor.',
    noDetectorHint:
      'Este navegador no puede decodificar el QR automáticamente. Puede escribir el código que aparece bajo el QR.',
    denied: {
      title: 'Cámara denegada',
      body: 'El permiso de cámara fue denegado. No es necesario para verificar: escriba el código que aparece bajo el QR o permita el acceso desde la configuración del navegador e inténtelo de nuevo.',
    },
    unavailable: {
      title: 'Cámara no disponible',
      body: 'Este dispositivo o navegador no ofrece una cámara utilizable en este contexto. Puede escribir el código que aparece bajo el QR.',
    },
    unreadable: {
      title: 'QR ilegible',
      body: 'No se logró leer el código. Limpie la etiqueta, mejore la luz o acérquese un poco. Si el código está dañado, escríbalo a mano.',
    },
    privacyNote: 'La imagen de la cámara se procesa en su dispositivo y no se envía a ningún servidor.',
  },

  manual: {
    title: 'O escriba el código',
    label: 'Código del producto',
    placeholder: 'TRZ-XXXX-XXXX-XXXX',
    hint: 'Está impreso bajo el código QR. Puede escribirlo con o sin guiones; las mayúsculas se ajustan solas.',
    submit: 'Verificar',
    errors: {
      empty: 'Escriba el código impreso bajo el QR para verificar.',
      format: 'El código no tiene el formato esperado: TRZ seguido de tres bloques de cuatro letras o cifras (por ejemplo, TRZ-7F2K-4K7Q-92FA).',
    },
    normalized: 'Código ajustado al formato TRZ-XXXX-XXXX-XXXX.',
    noscript:
      'La verificación necesita JavaScript o el enlace del código QR. Si su navegador lo bloquea, utilice el enlace impreso junto al código o pruebe desde otro dispositivo.',
  },

  scenarios: {
    title: 'Códigos de ejemplo',
    intro: 'Cada botón rellena un código de ejemplo y ejecuta la verificación, o reproduce una condición del dispositivo o de la red.',
    groups: { code: 'Por código de ejemplo', transport: 'Condiciones de red', device: 'Condiciones del dispositivo' },
    codeLabel: 'Código',
    selected: 'Seleccionado',
    network: {
      title: 'Estado de la red',
      toggle: 'Simular que no hay conexión',
      hint: 'Con esta opción activa, las consultas fallan como si el dispositivo estuviera sin red. Al desactivarla, la verificación pendiente se reintenta sola. El estado real del navegador también se detecta.',
    },
  },

  states: {
    idle: {
      title: 'Todavía no hay resultado',
      body: 'Escanee un código, escríbalo o elija uno de los ejemplos. El resultado aparecerá aquí con sus cuatro comprobaciones explicadas.',
    },
    loading: {
      title: 'Consultando el registro…',
      body: 'Comprobando firma, registro, datos y señales. La consulta no inspecciona el producto físico.',
    },
    verifiedAtLabel: 'Consulta realizada el',
    codeLabel: 'Código',
    registryLabel: 'Registro consultado',
    otherTenantNote: 'Este identificador pertenece a otro despliegue: {registry}.',
    offlineBanner: {
      title: 'Sin conexión',
      body: 'Ahora mismo no hay red. Puede seguir escribiendo el código; la consulta se reintentará sola cuando la conexión vuelva.',
    },
    recovered: {
      title: 'Conexión restablecida',
      body: 'Ya hay red.',
    },
    retryingPending: 'Reintentando la verificación pendiente…',
    errors: {
      offline: {
        title: 'Sin conexión: no se pudo verificar',
        body: 'La consulta al registro necesita red. Esto no es un veredicto sobre el producto: el código queda pendiente.',
      },
      server: {
        title: 'El registro no respondió correctamente',
        body: 'El servicio devolvió un error. No es un problema de su parte ni un veredicto sobre el producto. Espere unos segundos y reintente.',
      },
      timeout: {
        title: 'El registro tardó demasiado',
        body: 'Se agotó el tiempo de espera de la consulta. No es un veredicto sobre el producto: reintente en unos segundos.',
      },
      network: {
        title: 'No se pudo completar la consulta',
        body: 'Hubo un problema de red durante la consulta. Reintente en unos segundos.',
      },
      aborted: {
        title: 'Consulta cancelada',
        body: 'La consulta se interrumpió antes de terminar.',
      },
    },
    pendingCodeLabel: 'Código pendiente',
    autoRetryNote: 'Cuando la conexión vuelva, se reintentará automáticamente.',
    transportCodeNote:
      'Este código reproduce siempre esta condición. Para ver la recuperación automática, active y desactive «Simular que no hay conexión» con cualquier otro código.',
    retry: 'Reintentar',
    typeAnother: 'Escribir otro código',
    nothingChecked: 'No se realizó ninguna de las cuatro comprobaciones.',
    statusLabel: 'Estado',
  },

  verdicts: {
    valid: {
      label: 'Ejemplo sin alertas',
      confidence:
        'El registro declara una firma válida, un registro activo, coincidencia de datos y ninguna alerta. La persona debe comparar la información con el producto: estas comprobaciones no certifican autenticidad física ni ausencia de riesgos.',
    },
    warning: {
      label: 'Ejemplo con advertencias',
      confidence:
        'El registro incluye una advertencia. Describe una señal que requiere revisión; no demuestra fraude ni permite concluir que el producto físico coincide con sus datos.',
    },
    invalid: {
      label: 'Ejemplo no válido',
      confidence:
        'La consulta no reconoce una identidad vigente para este código, o el resultado es desfavorable. No es una comprobación del objeto físico.',
    },
    unverifiable: {
      label: 'Consulta no disponible',
      confidence:
        'Sin veredicto: no fue posible consultar el registro o el código no tiene el formato esperado. Esto no dice nada sobre el producto.',
    },
  },

  reasons: {
    all_checks_passed: {
      title: 'Resultados disponibles',
      body: 'Este ejemplo declara una firma válida, un identificador activo, coincidencia de datos y ninguna alerta registrada. La coincidencia no se ha comprobado con su producto: compare la información mostrada con la unidad física.',
    },
    anomalies_detected: {
      title: 'El ejemplo incluye señales que conviene revisar',
      body: 'Firma y registro son favorables, pero el historial incluye un patrón para revisar. Una señal no prueba fraude; contraste la información con el producto.',
    },
    data_partial: {
      title: 'Coincidencia parcial declarada en el ejemplo',
      body: 'Los datos coinciden solo en parte. La página no ha inspeccionado la etiqueta ni el producto físico; la persona debe comparar sus datos con el registro.',
    },
    registry_suspended: {
      title: 'Identidad suspendida en el registro de ejemplo',
      body: 'Este identificador permanece en revisión aunque declara una firma válida. No constituye una verificación del producto físico.',
    },
    signature_invalid: {
      title: 'Firma no válida',
      body: 'El ejemplo representa una firma que no corresponde al contenido del código. La consulta se detiene en esa señal; no se ha comprobado una firma real ni determinado una manipulación física.',
    },
    signature_malformed: {
      title: 'Firma ilegible',
      body: 'El ejemplo representa una firma que no se puede interpretar. No permite concluir que el código o el producto físico hayan sido manipulados.',
    },
    not_registered: {
      title: 'Identidad no encontrada en el registro de ejemplo',
      body: 'El código tiene el formato esperado, pero no corresponde a ninguna identidad conocida en el registro. Esto no verifica ni determina el estado de un producto físico.',
    },
    revoked: {
      title: 'Identidad revocada en el registro de ejemplo',
      body: 'El ejemplo declara una firma válida y una identidad revocada. Muestra que firma y estado son lecturas distintas; no comprueba la unidad física.',
    },
    data_mismatch: {
      title: 'Discrepancia de datos declarada en el ejemplo',
      body: 'El registro incluye una discrepancia de datos. La persona debe comparar el producto y su etiqueta con la información mostrada; esta página no los ha inspeccionado.',
    },
    registry_unavailable: {
      title: 'El registro no está disponible',
      body: 'No se pudo consultar el estado de este identificador. No es un veredicto sobre el producto.',
    },
    offline: {
      title: 'Sin conexión',
      body: 'La consulta al registro necesita red.',
    },
    server_error: {
      title: 'El registro no respondió correctamente',
      body: 'El servicio devolvió un error. Reintente en unos segundos.',
    },
    timeout: {
      title: 'El registro tardó demasiado',
      body: 'Se agotó el tiempo de espera. Reintente en unos segundos.',
    },
    unknown_format: {
      title: 'El texto leído no es un identificador de Traza',
      body: 'Lo que se leyó no tiene el formato TRZ-XXXX-XXXX-XXXX. Puede ser otro código QR o una lectura incompleta. No es un veredicto sobre el producto.',
    },
  },

  checks: {
    title: 'Cuatro lecturas y sus límites',
    intro: 'Resultados separados por tipo de evidencia. No certifica autenticidad física.',
    outcomes: {
      pass: 'Favorable',
      warn: 'Advertencia',
      fail: 'Desfavorable',
      skipped: 'No realizada',
    },
    signature: {
      title: 'Firma',
      help: 'Emisor e integridad de los datos firmados. No evita copias físicas.',
      status: {
        valid: 'El ejemplo declara una firma válida y una clave de emisor conocida.',
        invalid: 'El ejemplo representa una firma que no corresponde al contenido del código.',
        malformed: 'El ejemplo representa una firma que no se puede interpretar.',
        unknown_key: 'El ejemplo no reconoce la clave de emisor declarada.',
        not_checked: 'No se comprobó.',
      },
      algorithmLabel: 'Algoritmo objetivo',
      issuedAtLabel: 'Emitida el',
      keyIdLabel: 'Clave de emisor',
    },
    registry: {
      title: 'Estado en registro',
      help: 'Existencia del identificador y estado declarado en el registro de ejemplo. No demuestra ubicación física.',
      status: {
        active: 'Identificador encontrado; estado activo declarado en el ejemplo.',
        not_found: 'Identificador no encontrado en el registro de ejemplo.',
        revoked: 'Estado revocado declarado en el ejemplo.',
        suspended: 'Estado suspendido declarado en el ejemplo (en revisión).',
        unavailable: 'El registro no estuvo disponible.',
        not_checked: 'No se consultó.',
      },
      registryLabel: 'Registro',
      registeredAtLabel: 'Registrado el',
      revokedAtLabel: 'Revocado el',
      reasonLabel: 'Motivo',
    },
    dataMatch: {
      title: 'Datos para comparar',
      help: 'Información para comparar. La persona revisa su coincidencia con el producto.',
      status: {
        match: 'Coincidencia declarada en el ejemplo; no comprobada con su producto físico.',
        partial: 'Coincidencia parcial declarada en el ejemplo; requiere comparación física.',
        mismatch: 'Discrepancia declarada en el ejemplo; requiere comparación física.',
        not_checked: 'No se comparó.',
      },
    },
    anomalies: {
      title: 'Señales',
      help: 'Patrones en registros disponibles. Sin alertas no significa sin riesgos.',
      none: 'No hay alertas declaradas en este historial; no implica ausencia de riesgos.',
      skipped: 'No se analizaron.',
      detectedAtLabel: 'Detectada el',
      severity: { info: 'Informativa', warning: 'Advertencia', critical: 'Crítica' },
      codes: {
        duplicate_scans: 'Verificaciones duplicadas',
        geo_inconsistent: 'Ubicación inconsistente',
        pending_activation: 'Pendiente de activación',
        lot_withdrawn: 'Lote retirado',
        reported: 'Reporte de discrepancia abierto',
        expired: 'Identificador vencido',
      },
    },
  },

  unit: {
    title: 'Datos declarados de la unidad',
    product: 'Producto',
    presentation: 'Presentación',
    brand: 'Marca',
    category: 'Categoría',
    issuer: 'Emisor',
    issuerRoles: { manufacturer: 'fabricante', importer: 'importador' },
    lot: 'Lote',
    origin: 'Origen',
    producedAt: 'Producido el',
    stage: 'Etapa del ciclo de vida',
    stages: {
      issuance: 'Emisión',
      labeling: 'Etiquetado',
      activation: 'Activación',
      lookup: 'Consulta pública',
      signals: 'Señales',
      closure: 'Cierre',
    },
    lastLookupPlace: 'Lugar de la última consulta',
    lastEvent: 'Último evento',
    eventKinds: {
      import_declared: 'Importación declarada',
      identity_issued: 'Identificador emitido',
      labeled: 'Etiqueta aplicada',
      sample_approved: 'Prueba de imprenta aprobada',
      record_completed: 'Ficha del lote completada',
      activated: 'Rango activado',
      verified: 'Primera consulta pública',
      looked_up: 'Consulta posterior',
      anomaly_flagged: 'Señal abierta',
      reported: 'Reporte de discrepancia',
      inspected: 'Inspección de campo',
      reassigned: 'Ficha reasignada',
      range_voided: 'Rango anulado',
      revoked: 'Revocación',
      issuance_closed: 'Emisión cerrada',
    },
    scans: 'Verificaciones previas',
    scansValue: '{total} en {regions} región(es)',
    lastScan: 'Última verificación',
    noScans: 'Ninguna registrada',
    hiddenNote: 'Los datos de la unidad no se muestran cuando la firma no es válida o la identidad no está reconocida.',
  },

  meaning: {
    title: 'Qué significa este resultado',
    confidenceLabel: 'Alcance de esta consulta',
    nextStepTitle: 'Siguiente paso',
    steps: {
      keep_receipt: 'Conserve el comprobante de compra junto con el código.',
      compare_physical: 'Contraste el producto físico con los datos registrados: nombre, presentación, lote y sello.',
      report: 'Si algo no coincide, puede reportar la discrepancia desde esta página.',
      do_not_purchase: 'No compre ni consuma la unidad hasta aclarar la situación.',
      contact_seller: 'Pregunte al vendedor por el origen de la unidad y conserve el comprobante.',
      retry: 'Reintente la verificación en unos segundos.',
      type_code: 'Escriba el código impreso bajo el QR en la entrada manual.',
      check_connection: 'Compruebe la conexión de su dispositivo.',
    },
    tenantHintLabel: 'En este despliegue',
  },

  actions: {
    report: 'Reportar una discrepancia',
    another: 'Verificar otro código',
    backToResult: 'Volver al resultado',
  },

  report: {
    title: 'Reportar una discrepancia',
    intro: 'Describa qué no coincide entre el producto y el resultado. No se piden datos personales; el correo es opcional.',
    codeLabel: 'Código verificado',
    kindLabel: 'Tipo de discrepancia',
    kindPlaceholder: 'Seleccione una opción',
    kinds: {
      label_mismatch: 'La etiqueta no coincide con los datos registrados',
      seal_damaged: 'Sello o precinto dañado',
      suspected_copy: 'Sospecha de copia del código',
      wrong_location: 'Ubicación distinta a la registrada',
      already_scanned: 'El código ya figuraba como verificado',
      other: 'Otra situación',
    },
    descriptionLabel: 'Descripción',
    descriptionHint: 'Entre 10 y 600 caracteres. Qué observó, dónde y cuándo.',
    counter: '{count} de {max} caracteres',
    locationLabel: 'Ubicación',
    locationHint: 'Comercio o lugar donde tiene la unidad, si desea indicarlo.',
    emailLabel: 'Correo de contacto',
    emailHint: 'Solo si desea recibir seguimiento. No es obligatorio.',
    dataNote: 'Datos mínimos: no se solicitan nombre, documento ni datos tributarios.',
    submit: 'Enviar reporte',
    sending: 'Enviando…',
    cancel: 'Cancelar',
    errors: {
      kind: 'Seleccione el tipo de discrepancia.',
      descriptionShort: 'La descripción debe tener al menos 10 caracteres.',
      descriptionLong: 'La descripción no puede superar los 600 caracteres.',
      email: 'Escriba una dirección de correo válida o deje el campo vacío.',
    },
    success: {
      title: 'Reporte enviado',
      folioLabel: 'Folio',
      receivedAtLabel: 'Recibido el',
      body: 'Gracias. El reporte quedó asociado al código verificado con el folio indicado.',
      nextTitle: 'Qué ocurre después',
      next: [
        'El registro marca el código con un reporte abierto: las próximas verificaciones lo mostrarán como anomalía.',
        'En el piloto propuesto, un inspector de campo puede dar seguimiento y registrar lo observado en sitio.',
        'Si dejó un correo, recibiría el resultado de la revisión.',
      ],
      proposalNote: 'El seguimiento de un reporte depende de las reglas de cada despliegue.',
      done: 'Volver al resultado',
    },
    failure: {
      offline: {
        title: 'Sin conexión: el reporte no se envió',
        body: 'Conserve lo escrito; cuando la conexión vuelva, pulse «Reintentar».',
      },
      server: {
        title: 'No se pudo enviar el reporte',
        body: 'El servicio devolvió un error. Lo escrito se conserva; reintente en unos segundos.',
      },
      timeout: {
        title: 'El envío tardó demasiado',
        body: 'Se agotó el tiempo de espera. Lo escrito se conserva; reintente en unos segundos.',
      },
      network: {
        title: 'No se pudo enviar el reporte',
        body: 'Hubo un problema de red. Lo escrito se conserva; reintente en unos segundos.',
      },
      aborted: {
        title: 'Envío cancelado',
        body: 'El envío se interrumpió antes de terminar.',
      },
    },
    retry: 'Reintentar',
  },

  a11y: {
    toolRegion: 'Verificación pública de una unidad',
    scannerRegion: 'Escáner y entrada del código',
    resultRegion: 'Resultado de la verificación',
    reportRegion: 'Reporte de discrepancia',
    skeleton: 'Cargando el resultado',
    verdictIconLabels: {
      valid: 'Sin alertas',
      warning: 'Con advertencias',
      invalid: 'No válido',
      unverifiable: 'Consulta no disponible',
    },
    outcomeIconLabels: {
      pass: 'Favorable',
      warn: 'Advertencia',
      fail: 'Desfavorable',
      skipped: 'No realizada',
    },
  },
};
