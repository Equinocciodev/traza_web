import type { SecurityContent } from '../types';

export const security: SecurityContent = {
  meta: {
    title: 'Seguridad y confianza: qué se comprueba y qué no',
    description:
      'Una firma por unidad, verificación por señales separadas, datos mínimos y transparencia sobre los límites de lo que una comprobación digital demuestra.',
  },

  hero: {
    eyebrow: 'Seguridad y confianza',
    title: 'Confianza que se explica, no que se promete',
    subtitle:
      'La seguridad de una plataforma de verificación se mide por lo que comprueba y por la claridad con la que dice lo que no puede comprobar. Estos son los principios y límites de la arquitectura objetivo. Esta web consulta datos de ejemplo; no valida firmas reales ni opera los controles descritos.',
  },

  principles: {
    title: 'Principios',
    intro: 'Cinco principios guían el diseño objetivo de la plataforma. Su descripción no acredita que estos controles estén implementados en esta web.',
    items: [
      {
        title: 'Identidad unitaria firmada',
        body: 'El diseño prevé un identificador por unidad, firmado con claves gestionadas por el emisor, para comprobar el origen de la identidad. Esta web no realiza esa validación criptográfica.',
        icon: 'signature',
      },
      {
        title: 'Verificación por señales separadas',
        body: 'Firma, estado en el registro, coincidencia de datos y anomalías se evalúan de forma independiente. El resultado muestra cada una, no un veredicto único.',
        icon: 'compare',
      },
      {
        title: 'Mínima recolección de datos',
        body: 'Consultar no exige identificarse. El reporte de discrepancia se prepara en este dispositivo y solo se guarda si se descarga; esta web no lo envía. Las identidades no contienen datos personales ni tributarios.',
        icon: 'lock',
      },
      {
        title: 'Transparencia sobre los límites',
        body: 'Cada resultado dice qué se comprobó, qué confianza aporta y qué queda fuera. Lo que no está respaldado, no se afirma.',
        icon: 'info',
      },
      {
        title: 'Registro auditable',
        body: 'Los eventos se conservan en orden, con responsable y fecha, y pueden exportarse para que un tercero los revise.',
        icon: 'list',
      },
    ],
  },

  target: {
    title: 'Arquitectura objetivo',
    intro:
      'Los mecanismos que la plataforma propone para sostener esos principios. Se describen como objetivo de diseño, no como controles implementados o auditados.',
    items: [
      {
        title: 'Firmas ECDSA P-256',
        body: 'Para el caso de uso de medicamentos propuesto a un regulador, las identidades se firmarían con ECDSA sobre la curva P-256, un estándar ampliamente documentado.',
        icon: 'key',
      },
      {
        title: 'Claves gestionadas por el emisor',
        body: 'Cada fabricante o importador custodia sus propias claves de firma. La plataforma verifica con la clave pública; no necesita la privada.',
        icon: 'fingerprint',
      },
      {
        title: 'Verificación pública sin cuenta',
        body: 'El servicio de verificación no requiere registro ni datos personales. Responde a cualquier consulta con un resultado explicado.',
        icon: 'globe',
      },
      {
        title: 'Registro de eventos',
        body: 'Un registro ordenado de los eventos de cada unidad, con quién los reportó y cuándo, que permite reconstruir la historia y detectar inconsistencias.',
        icon: 'database',
      },
      {
        title: 'Detección de anomalías',
        body: 'Consultas repetidas del mismo código en lugares distintos, eventos fuera de secuencia o ubicaciones inconsistentes se señalan para revisión.',
        icon: 'alert',
      },
    ],
    note: 'Arquitectura objetivo del producto: esta página no implementa ni afirma una certificación de seguridad. Los controles descritos requerirían implementación y auditoría en cada despliegue.',
  },

  antiCloning: {
    title: 'Contra la copia trabajan varias capas, y ninguna basta sola',
    intro:
      'La firma criptográfica permite comprobar el origen de una identidad, pero no impide copiar un código válido. Las siguientes capas forman parte del diseño objetivo; esta web no ejecuta analítica anticopia ni comprueba materiales de seguridad.',
    items: [
      {
        title: 'Analítica de duplicados',
        body: 'En la arquitectura objetivo, una frecuencia o un patrón de consultas incompatible con el uso esperado de una unidad podría generar una señal para revisión. Esta web no cambia el estado del registro ni abre un caso operativo.',
        icon: 'chart',
      },
      {
        title: 'Comparación humana',
        body: 'Compare el lote, la presentación de 120 ml y la fecha de vencimiento del medicamento con lo impreso en el envase. Una diferencia requiere revisión; una coincidencia no acredita el contenido ni el estado físico de la unidad.',
        icon: 'compare',
      },
      {
        title: 'Vinculación al serial',
        body: 'Para el medicamento de ejemplo, la etiqueta muestra el identificador unitario y el lote. Compárelos con la consulta; la vinculación entre el identificador y cada unidad física tendría que establecerse durante el etiquetado del despliegue.',
        icon: 'fingerprint',
      },
      {
        title: 'Primera consulta visible',
        body: 'El diseño prevé mostrar la primera consulta y su frecuencia para revisar un historial inesperado. Los datos de ejemplo de esta web no constituyen un historial de consultas reales de una unidad física.',
        icon: 'history',
      },
      {
        title: 'Etiqueta destructible',
        body: 'En fase 2 se evaluaría un sustrato que se rompa al despegarlo para dificultar el traslado de una etiqueta entre unidades. La estampilla mostrada en esta web no acredita esa propiedad física.',
        icon: 'label',
      },
      {
        title: 'Activación en dos tiempos',
        body: 'En el diseño objetivo, una consulta de un identificador emitido y etiquetado, pero todavía sin activar al finalizar producción, sería una señal para revisión. Esta web explica ese estado con datos de ejemplo; no activa unidades.',
        icon: 'check',
      },
    ],
    note: 'La fase 2 contempla evaluar patrones de alta entropía y elementos materiales anticopia, sujetos a validación e integración. La cámara de esta web lee códigos QR; no evalúa esos patrones ni certifica una etiqueta física. Ninguna capa basta por sí sola.',
  },

  keyCustody: {
    title: 'Quién puede usar las claves de firma',
    intro:
      'La arquitectura objetivo exige custodiar las claves de firma en un módulo de seguridad de hardware y restringir su uso al flujo autorizado. Los requisitos siguientes describen ese diseño; esta web no opera dicho módulo ni acredita su implementación.',
    items: [
      {
        title: 'El material no sale del módulo',
        body: 'La clave maestra es una clave nativa del módulo, no exportable por diseño. La derivación de las claves de cada emisión ocurre dentro; a la memoria del servicio solo llegan claves de emisión concretas.',
        icon: 'key',
      },
      {
        title: 'Administrar no es usar',
        body: 'Quien puede rotar o deshabilitar una clave tiene denegado su uso, y quien la usa es un único rol de servicio. Son permisos distintos y deliberadamente incompatibles.',
        icon: 'lock',
      },
      {
        title: 'Políticas que atan también al administrador',
        body: 'Prohibido el material exportable, prohibido tocar el registro de auditoría, y los cambios de política solo por la tubería de despliegue. Nadie queda por encima de la regla.',
        icon: 'shield-check',
      },
      {
        title: 'Un solo camino a producción',
        body: 'Nadie despliega a mano. El código criptográfico, los permisos y la infraestructura de claves exigen doble aprobación, con commits e imágenes firmadas. Exfiltrar exige cómplice.',
        icon: 'settings',
      },
      {
        title: 'Huella imborrable',
        body: 'Todo uso de clave queda en un registro replicado a un archivo que los administradores no pueden escribir ni borrar, con alertas de uso anómalo y copia al espejo del organismo supervisor.',
        icon: 'document',
      },
      {
        title: 'Ceremonias con quórum',
        body: 'Crear o rotar la clave maestra de una época exige varias personas con credenciales partidas y tokens físicos, y un testigo del organismo supervisor.',
        icon: 'user',
      },
    ],
    residualRisk:
      'Queda un riesgo en pie, y es más honesto escribirlo que omitirlo: la colusión de dos personas con permisos complementarios. Las capas anteriores no la vuelven imposible; la vuelven detectable y atribuible. Hay además un canario de fondo: consultas sobre rangos que nunca se descargaron significan una firma filtrada en uso. Y el cierre de emisión acota el daño — cuando una emisión se cierra, los correlativos que no se usaron se anulan, de modo que un código forjado sobre ella cae en «no registrado» o «en revisión», nunca en «verificado».',
  },

  degradation: {
    title: 'Qué tiene que seguir funcionando cuando algo falla',
    intro:
      'Un sistema de identificación que detiene una línea de producción o una caja de comercio ha causado más daño que el fraude que perseguía. Los requisitos siguientes son restricciones de la arquitectura objetivo; no describen servicios operativos de esta web.',
    items: [
      {
        title: 'Imprimir no depende de la conexión',
        body: 'El rango de identificadores se descarga una vez y un proceso local alimenta la impresora, con su propia cola y reporte diferido al reconectar. La planta no espera a la red.',
        icon: 'offline',
      },
      {
        title: 'La consulta y la emisión no comparten camino',
        body: 'Son planos separados que se comunican por eventos. La consulta pública tiene que seguir respondiendo aunque la emisión esté en mantenimiento, y una generación masiva no compite con quien está frente a un anaquel.',
        icon: 'layers',
      },
      {
        title: 'Abierto al leer, cerrado al escribir',
        body: 'Si el limitador de tasa se degrada, la consulta se sirve: más vale responder que negar. Las escrituras y la autenticación, al contrario, fallan cerradas.',
        icon: 'network',
      },
      {
        title: 'Los rechazos son telemetría',
        body: 'En la arquitectura objetivo, los picos de rechazo por origen y por prefijo alimentarían la analítica y podrían abrir un caso para revisar intentos de enumerar códigos. Esta web no ejecuta ese flujo operativo.',
        icon: 'alert',
      },
    ],
    note: 'Nada de esto es una promesa de disponibilidad. Es la lista de lo que debe seguir en pie cuando algo se cae, que es una pregunta distinta y más útil de responder por escrito.',
  },

  verificationHonesty: {
    title: 'Por qué nunca decimos «auténtico»',
    body:
      'Es tentador resumir una verificación en una palabra tranquilizadora. No lo hacemos, porque sería inexacto. Una firma válida demuestra que una identidad fue emitida por el emisor esperado; no demuestra nada sobre el líquido, el envase o la etiqueta que se tiene delante.',
    bullets: [
      'Una firma válida indica emisión, no impide que una etiqueta legítima se copie y se pegue en otra unidad.',
      'El estado en el registro y las anomalías completan el cuadro: un código emitido puede estar revocado o aparecer consultado en lugares incompatibles.',
      'La coincidencia de datos es responsabilidad de quien verifica: comparar producto, presentación, lote y fecha de vencimiento con lo que tiene en la mano.',
      'La inspección física sigue siendo necesaria. La plataforma orienta dónde mirar; no sustituye el ojo de quien inspecciona.',
      'Por eso cada resultado dice qué se comprobó, qué confianza aporta y cuál es el siguiente paso.',
    ],
  },

  privacy: {
    title: 'Privacidad',
    body:
      'La plataforma se diseña para que verificar no cueste datos personales. Este sitio aplica el mismo criterio.',
    bullets: [
      'Sin cookies publicitarias ni rastreadores de terceros. Las únicas cookies del sitio son las de medición de audiencia, descritas en el aviso de privacidad.',
      'Sin datos personales en la verificación pública: consultar un código no exige identificarse.',
      'Reportes de discrepancia preparados localmente: no se envían ni modifican el registro. Descargue la copia antes de cerrar el reporte y entréguela por separado a la organización responsable.',
      'Las identidades de las unidades no contienen datos personales ni tributarios.',
      'Medición de audiencia agregada, sin identificar a las personas y respetando «Do Not Track».',
    ],
  },

  transparency: {
    title: 'Lo que no afirmamos',
    intro:
      'Decir con claridad lo que no está respaldado es parte de la confianza. Este sitio no afirma nada de lo siguiente.',
    items: [
      'Certificaciones de seguridad, de calidad o de cumplimiento normativo.',
      'Niveles de disponibilidad (uptime) ni compromisos de servicio.',
      'Auditorías externas de código, de infraestructura o de procesos.',
      'Clientes, contratos o despliegues en producción.',
      'Relación con gobiernos, reguladores o agencias: el caso de medicamentos es una propuesta de piloto.',
      'Cifras de escala, de impacto económico o de resultados.',
    ],
  },

  disclosure: {
    title: 'Reporte responsable de vulnerabilidades',
    body:
      'Si detecta un problema de seguridad en este sitio o en la plataforma, agradecemos que lo comunique de forma responsable antes de hacerlo público. Utilice el canal de contacto de la empresa; la preparación local de un reporte de discrepancia no comunica una vulnerabilidad.',
    note: 'Compruebe el canal disponible en la página de empresa. Esta página no envía reportes ni confirma su recepción; cada despliegue puede definir su propio canal.',
  },

  cta: {
    title: 'Vea cómo se explica un resultado',
    body:
      'La verificación pública muestra cada señal por separado y el siguiente paso recomendado, con códigos de ejemplo que cubren todos los resultados posibles.',
    primaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Cómo funciona', key: 'howItWorks', variant: 'secondary' },
  },
};
