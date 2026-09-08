import type { ReferencePageContent } from '../types';

/**
 * La etiqueta y el código (ES).
 *
 * Es la página más técnica del sitio y existe por una razón concreta: el formato del
 * identificador y las especificaciones de impresión son comprobables, y publicarlas es
 * lo que distingue una propuesta de ingeniería de un folleto.
 */
export const codeSpec: ReferencePageContent = {
  meta: {
    title: 'La etiqueta y el código: formato y especificaciones',
    description:
      'Cómo está formado el identificador de una unidad, por qué cabe en un QR pequeño, qué debe cumplir la impresión y por qué el código es su propio índice.',
  },

  hero: {
    eyebrow: 'Referencia técnica',
    title: 'Un código corto, firmado y comprobable a simple vista',
    subtitle:
      'El identificador de una unidad tiene que sobrevivir a una etiqueta pequeña, a una cámara mediocre y a que alguien lo escriba a mano. Esto es lo que se le exige y cómo está construido.',
  },

  contentsLabel: 'En esta página',

  sections: [
    {
      id: 'requisitos',
      title: 'Cinco requisitos que fijan el diseño',
      intro:
        'El formato no es una elección estética: cada requisito descarta alternativas. Los cinco juntos dejan muy pocas opciones posibles.',
      items: [
        {
          title: 'Único a gran escala, sin coordinación central',
          body: 'Varios procesos deben poder generar identificadores en paralelo sin consultarse entre sí ni arriesgar una colisión.',
          icon: 'fingerprint',
        },
        {
          title: 'No adivinable',
          body: 'Conocer un código no debe permitir derivar otros. Un correlativo simple sería enumerable: alguien imprimiría códigos válidos «futuros».',
          icon: 'lock',
        },
        {
          title: 'Comprobable sin consultar la base de datos',
          body: 'La firma se valida sola. Así un código inventado se descarta en microsegundos de CPU y el registro solo atiende códigos que existen.',
          icon: 'signature',
        },
        {
          title: 'Corto',
          body: 'Tiene que caber en un QR pequeño con corrección de errores suficiente para tolerar roces, humedad y una etiqueta curva.',
          icon: 'qr',
        },
        {
          title: 'Legible por una persona',
          body: 'Si la cámara falla, el código se escribe a mano en la página de consulta. Eso obliga a agrupar caracteres y a incluir un dígito de control.',
          icon: 'user',
        },
      ],
    },
    {
      id: 'anatomia',
      title: 'Anatomía del identificador',
      intro:
        'El contenido que viaja en el código son veinte bytes con cuatro partes. Cada una responde a uno de los requisitos anteriores.',
      diagram: 'payload',
      specs: [
        { label: 'Versión', value: '1 byte', note: 'Permite cambiar el formato más adelante sin invalidar lo ya impreso.' },
        { label: 'Época de clave', value: '1 byte', note: 'Direcciona la clave con la que se firmó. Rotar claves no invalida el histórico.' },
        { label: 'Identificador único', value: '10 bytes', note: 'La emisión y la posición dentro de ella, cifradas para no revelar orden ni volumen.' },
        { label: 'Firma truncada', value: '8 bytes', note: 'Lo que hace que un código inventado no pase el primer filtro.' },
      ],
      note: 'La firma protege contra la invención de códigos, no contra la copia: un código copiado es válido. Contra la copia trabajan otras capas, explicadas en Seguridad y confianza.',
    },
    {
      id: 'representacion',
      title: 'De veinte bytes a algo que se pueda leer y teclear',
      intro:
        'El texto usa Base32 Crockford, un alfabeto que evita los caracteres que la gente confunde y que trae su propio dígito de control.',
      code: {
        caption: 'Forma textual, agrupada para lectura manual',
        lines: [
          'TRZ-9FXK-2M4Q-J8TV-QH3N-7WPD-BL5R-XCK',
          '',
          'URL en el QR (mayúsculas, modo alfanumérico):',
          'HTTPS://T.EXAMPLE/V/9FXK2M4QJ8TVQH3N7WPDBL5RXCK',
        ],
      },
      paragraphs: [
        'El dígito de control se valida en el navegador, antes de llamar a ningún servicio: un error de tecleo se avisa al instante y no gasta una consulta.',
        'La URL va en mayúsculas a propósito. El modo alfanumérico de QR codifica más información por módulo que el modo byte, así que el mismo contenido cabe en un QR una o dos versiones más pequeño: escanea antes y tolera más daño. El esquema y el dominio no distinguen mayúsculas, y el servidor acepta la ruta en mayúsculas.',
        'Un dominio corto también importa: menos caracteres son menos módulos, y menos módulos permiten imprimir más pequeño con el mismo nivel de corrección de errores.',
      ],
    },
    {
      id: 'indice',
      title: 'El código es su propio índice',
      intro: 'De aquí sale el rendimiento, y es la parte del diseño que más se aparta de lo habitual.',
      paragraphs: [
        'La época direcciona la clave, así que no hay que probar claves. La firma descarta la basura sin tocar almacenamiento. La emisión embebida apunta directamente al único registro que contiene el pasaporte. Y la posición dentro de la emisión es la clave exacta de la fila.',
        'Nada busca; todo direcciona. Esa es la diferencia entre un identificador aleatorio —que obliga a consultar la base de datos incluso para descartar basura— y uno firmado, que decide válido o inventado antes de preguntar nada.',
        'La validez de un código la prueba la derivación, no una fila guardada. Al emitir una orden se escribe un registro con su tamaño y su estado; las etiquetas existen matemáticamente desde ese momento. La fila de una etiqueta concreta nace en su primera consulta, de modo que solo las unidades que alguien mira ocupan espacio.',
      ],
      note: 'Consecuencia práctica: reimprimir un tramo años después produce exactamente los mismos bytes. No existen códigos perdidos, y un tramo archivado que alguien consulte vuelve a la vida sin romper la consulta.',
    },
    {
      id: 'impresion',
      title: 'Especificaciones de impresión',
      intro:
        'No hay hardware propietario: cada emisor imprime con su propia infraestructura. Lo que se fija es el mínimo que hace que el código se lea en una tienda con luz mala.',
      specs: [
        { label: 'Simbología', value: 'QR modelo 2', note: 'El estándar más extendido en cámaras de teléfono.' },
        { label: 'Corrección de errores', value: 'Nivel M mínimo, Q recomendado', note: 'Tolera roces y suciedad sin dejar de decodificar.' },
        { label: 'Tamaño del módulo', value: '≥ 0,33 mm', note: 'Por debajo, las cámaras de gama baja empiezan a fallar.' },
        { label: 'Zona quieta', value: '4 módulos', note: 'El margen en blanco es parte del código, no decoración.' },
        { label: 'Tamaño impreso', value: '≥ 22 × 22 mm', note: 'Suficiente para una botella; obliga a que el contenido sea corto.' },
        { label: 'Contraste', value: '≥ 40 %', note: 'Medido sobre el sustrato real, no sobre la pantalla del diseñador.' },
        { label: 'Junto al código', value: 'Últimos caracteres legibles', note: 'El respaldo cuando la cámara no coopera.' },
      ],
      note: 'Antes de la corrida, el emisor sube una muestra impresa y el sistema la comprueba: decodifica el QR, mide zona quieta y contraste y confirma que el código legible coincide. La muestra aprobada queda ligada a esa emisión.',
    },
    {
      id: 'plantillas',
      title: 'Plantillas y salidas de impresión',
      intro:
        'El emisor elige una plantilla del sistema y no edita el layout: el sistema inyecta los datos. Así una etiqueta impresa hoy y otra dentro de un año son comparables.',
      items: [
        {
          title: 'Render determinista',
          body: 'El mismo código con la misma versión de plantilla produce un archivo idéntico byte a byte. No hace falta almacenar artes: se vuelven a generar.',
          icon: 'refresh',
        },
        {
          title: 'Para imprenta',
          body: 'PDF vectorial de imposición, con marcas de corte y registro y sangrado, para tirar pliegos completos.',
          icon: 'document',
        },
        {
          title: 'Para línea de producción',
          body: 'Lenguaje nativo de impresora térmica, para etiquetar en línea a la velocidad de la máquina.',
          icon: 'factory',
        },
        {
          title: 'Para sobreimpresión',
          body: 'Salida de solo capa variable, si el fondo de seguridad ya viene preimpreso en offset.',
          icon: 'layers',
        },
      ],
      note: 'La impresión no depende de la conexión: el rango se descarga una vez y un proceso local alimenta la impresora, con cola propia y reporte diferido al reconectar.',
    },
  ],

  cta: {
    title: 'Lo que sigue',
    body: 'Si le interesa cómo se pide una emisión y cómo se activa desde sus propios sistemas, la referencia de integración lo describe endpoint por endpoint. Si prefiere verlo funcionando, la consulta pública está abierta.',
    primaryCta: { label: 'Ver la integración', key: 'integration', variant: 'primary' },
    secondaryCta: { label: 'Probar la consulta', key: 'verify', variant: 'secondary' },
  },
};
