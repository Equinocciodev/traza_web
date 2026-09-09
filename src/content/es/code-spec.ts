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
      'Esta página distingue el código de consulta que funciona en la web del formato objetivo de producción. El esquema de veinte bytes requiere implementación y auditoría criptográfica; la consulta de ejemplo no valida firmas reales.',
  },

  contentsLabel: 'En esta página',

  sections: [
    {
      id: 'requisitos',
      title: 'Cinco requisitos que fijan el diseño',
      intro:
        'El ejemplo consultable usa el formato TRZ-XXXX-XXXX-XXXX y datos de un registro local. Los requisitos siguientes corresponden al diseño objetivo; no describen comprobaciones criptográficas ejecutadas por esta web.',
      code: { caption: 'Código consultable de esta web · datos de ejemplo', lines: ['TRZ-7F2K-4K7Q-92FA', 'https://traza.technology/verificar/?c=TRZ-7F2K-4K7Q-92FA&t=medicamentos'] },
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
          body: 'El objetivo es validar la firma antes de consultar el registro. El esquema, las claves, su seguridad y el rendimiento deberán comprobarse en la implementación; esta web no ejecuta esa validación.',
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
        'El formato objetivo reserva veinte bytes en cuatro partes. Es una propuesta de diseño pendiente de validación; no es el formato de doce caracteres de los códigos consultables en esta web.',
      diagram: 'payload',
      specs: [
        { label: 'Versión', value: '1 byte', note: 'Permite cambiar el formato más adelante sin invalidar lo ya impreso.' },
        { label: 'Época de clave', value: '1 byte', note: 'Direcciona la clave con la que se firmó. Rotar claves no invalida el histórico.' },
        { label: 'Identificador único', value: '10 bytes', note: 'La emisión y la posición dentro de ella, cifradas para no revelar orden ni volumen.' },
        { label: 'Firma truncada', value: '8 bytes', note: 'Campo previsto para un autenticador. El esquema criptográfico y su seguridad requieren validación independiente.' },
      ],
      note: 'La distribución de bytes no demuestra seguridad ni constituye una firma ECDSA verificada. Una copia conserva el mismo identificador y no crea otra unidad. El formato definitivo y las medidas anticopia requieren validación en cada despliegue.',
    },
    {
      id: 'representacion',
      title: 'De veinte bytes a algo que se pueda leer y teclear',
      intro:
        'La representación objetivo propone Base32 Crockford con control de errores de escritura. El bloque siguiente es ilustrativo: no es un vector criptográfico de prueba ni un código reconocido por el registro de esta web.',
      code: {
        caption: 'Formato objetivo ilustrativo · no consultable en esta web',
        lines: [
          'TRZ-9FXK-2M4Q-J8TV-QH3N-7WPD-BL5R-XCK',
          '',
          'URL en el QR (mayúsculas, modo alfanumérico):',
          'HTTPS://T.EXAMPLE/V/9FXK2M4QJ8TVQH3N7WPDBL5RXCK',
        ],
      },
      paragraphs: [
        'En el formato objetivo, el dígito de control se comprobaría antes de consultar un servicio. El lector de esta web comprueba el formato del identificador de ejemplo; no implementa ese algoritmo ni valida una firma criptográfica.',
        'La URL va en mayúsculas a propósito. El modo alfanumérico de QR codifica más información por módulo que el modo byte, así que el mismo contenido cabe en un QR una o dos versiones más pequeño: escanea antes y tolera más daño. El esquema y el dominio no distinguen mayúsculas, y el servidor acepta la ruta en mayúsculas.',
        'Un dominio corto también importa: menos caracteres son menos módulos, y menos módulos permiten imprimir más pequeño con el mismo nivel de corrección de errores.',
      ],
    },
    {
      id: 'indice',
      title: 'El código es su propio índice',
      intro: 'La arquitectura objetivo propone direccionar el registro desde el identificador. Los beneficios descritos requieren implementación y medición; no son resultados comprobados por esta web.',
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
        { label: 'Tamaño impreso', value: '≥ 22 × 22 mm', note: 'Referencia para el frasco de medicamento; se valida sobre el envase y sustrato elegidos.' },
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
    body: 'La referencia de integración describe la API objetivo. La consulta pública permite explorar los códigos de ejemplo disponibles en esta web, con sus resultados y límites explicados.',
    primaryCta: { label: 'Ver la integración', key: 'integration', variant: 'primary' },
    secondaryCta: { label: 'Probar la consulta', key: 'verify', variant: 'secondary' },
  },
};
