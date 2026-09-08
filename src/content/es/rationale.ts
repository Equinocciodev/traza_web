import type { ReferencePageContent } from '../types';

/**
 * Por qué este diseño (ES).
 *
 * Los sistemas de marcaje fiscal llevan décadas funcionando —y fracasando— en varios
 * países. Publicar de qué precedente sale cada decisión es más honesto que presentar el
 * diseño como una ocurrencia propia, y más útil para quien tiene que evaluarlo.
 */
export const rationale: ReferencePageContent = {
  meta: {
    title: 'Por qué este diseño: precedentes y lecciones',
    description:
      'De qué sistemas de marcaje fiscal ya existentes sale cada decisión de Traza, qué salió mal en los que se apagaron y los diez principios que hereda de ellos.',
  },

  hero: {
    eyebrow: 'Precedentes',
    title: 'Casi todas estas decisiones ya se probaron en otro sitio',
    subtitle:
      'El marcaje fiscal por unidad no es una idea nueva. Hay sistemas nacionales funcionando desde hace años, y hay al menos uno grande que se apagó. Conviene decir de dónde sale cada decisión.',
  },

  contentsLabel: 'En esta página',

  sections: [
    {
      id: 'sistemas',
      title: 'Los sistemas que sirven de referencia',
      intro:
        'Se citan por su nombre y por lo que aportan al diseño. Traza no tiene relación con ninguno de ellos ni con las autoridades que los gobiernan: son antecedentes públicos.',
      items: [
        {
          title: 'Chestny ZNAK',
          body: 'Marca cada unidad con un código que lleva la firma embebida, y el fabricante pide los códigos por API, imprime, activa y reporta. Valida el modelo híbrido: firma comprobable sin consultar, más estado en el registro.',
          icon: 'signature',
        },
        {
          title: 'Sistema europeo de trazabilidad de tabaco',
          body: 'Emisores de identificadores independientes de la industria, repositorio primario de la industria y repositorio secundario del regulador. De aquí salen dos ideas: el espejo de auditoría y la caducidad de los códigos que no se aplican.',
          icon: 'eye',
        },
        {
          title: 'Marcaje fiscal como servicio llave en mano',
          body: 'Código único, elemento físico de seguridad y activación en línea de producción con conteo independiente. Confirma que el modelo de operador homologado funciona; su riesgo es la dependencia del proveedor.',
          icon: 'plug',
        },
        {
          title: 'Programas que empezaron por una categoría',
          body: 'Arrancar con un solo sector y pocos emisores grandes, en lugar del universo entero. También su límite: la trazabilidad identifica lo ilegal, no lo detiene; hace falta inspección de calle.',
          icon: 'search',
        },
        {
          title: 'Un sistema de bebidas que se apagó',
          body: 'Llegó a marcar miles de millones de envases con contadores automáticos en planta, y se desactivó por conflicto de costo. La factura electrónica no sustituyó el conteo físico, y la subdeclaración reapareció.',
          icon: 'warning',
        },
        {
          title: 'Estampillas físicas con consulta pública',
          body: 'Misma identidad en tres portadores —código de barras, QR y texto— sobre una estampilla con elementos de seguridad. Su auditoría enseñó la lección central: la coincidencia digital no prueba la autenticidad física.',
          icon: 'compare',
        },
        {
          title: 'Estándares abiertos de identificación',
          body: 'El QR como URL sirve a la vez a la caja registradora, a la persona que compra y a la trazabilidad. Adoptar el formato da interoperabilidad con el comercio sin inventar un esquema propio.',
          icon: 'qr',
        },
      ],
    },
    {
      id: 'principios',
      title: 'Diez principios heredados',
      intro:
        'No son valores de marca: son restricciones que salieron de ver qué aguantó y qué no.',
      items: [
        {
          title: 'Empezar por una o dos categorías',
          body: 'Con pocos emisores grandes que coordinar, no con todo el mercado a la vez.',
          icon: 'list',
        },
        {
          title: 'Código firmado más estado en el registro',
          body: 'La firma impide inventar códigos sin consultar nada; el registro gestiona el ciclo de vida y detecta clones.',
          icon: 'signature',
        },
        {
          title: 'Identificadores no secuenciales',
          body: 'Un correlativo predecible es falsificable y además revela volúmenes a la competencia.',
          icon: 'lock',
        },
        {
          title: 'Costo por código bajo y fijado por norma',
          body: 'Calibrado al valor del producto. Un costo alto sobre un producto popular mata el sistema, y ese es exactamente lo que ocurrió en el caso que se apagó.',
          icon: 'chart',
        },
        {
          title: 'Sin dependencia del proveedor',
          body: 'Los identificadores, las claves y los datos pertenecen a la institución que encarga el despliegue, no al operador. Con depósito del material criptográfico y especificaciones públicas, aunque la operación sea privada.',
          icon: 'key',
        },
        {
          title: 'Degradación elegante obligatoria',
          body: 'El sistema nunca puede detener la producción ni el comercio: códigos descargados por adelantado, cola local y reporte diferido.',
          icon: 'offline',
        },
        {
          title: 'Caducidad de los códigos sin aplicar',
          body: 'Evita el acaparamiento y el mercado negro de etiquetas emitidas y nunca usadas.',
          icon: 'clock',
        },
        {
          title: 'Activación con conteo independiente',
          body: 'Es lo que de verdad mide: cuenta lo producido, no lo declarado.',
          icon: 'compare',
        },
        {
          title: 'La verificación ciudadana necesita un motivo',
          body: 'Donde no hubo incentivo, nadie escaneó. Donde lo hubo, la consulta pública se volvió masiva.',
          icon: 'citizen',
        },
        {
          title: 'Blindaje jurídico previo',
          body: 'Sin una norma que establezca la obligatoriedad, quién paga y las consecuencias de no marcar, el sistema se litiga o se apaga por decreto.',
          icon: 'document',
        },
      ],
    },
    {
      id: 'consecuencia',
      title: 'La lección que más se nota en el producto',
      paragraphs: [
        'La auditoría de una estampilla física con consulta pública encontró que los controles impresos y el registro digital no siempre coincidían, y que por una fotografía era imposible determinar cuál de los dos tenía razón.',
        'De ahí sale la separación que atraviesa todo el diseño: la identidad digital coincide o no coincide, y eso es comprobable; la autenticidad física exige elementos materiales o una activación observada, y eso no se comprueba con una cámara.',
        'Por eso una consulta no dice «verificado» cuando solo se probó lo primero. Un identificador emitido y etiquetado, pero cuya ficha aún no se ha cerrado, devuelve «en revisión» e invita a reportar dónde se vio. Ese estado no es un hueco del producto: es el resultado de la lección.',
      ],
      note: 'Y por eso nunca decimos que un producto sea «auténtico» porque su firma valide: una firma válida dice quién emitió el identificador y que su contenido no se alteró, no que la botella que tiene en la mano sea la que lo llevaba.',
    },
  ],

  cta: {
    title: 'Dónde sigue esto',
    body: 'Las capas que trabajan contra la copia, la custodia de las claves y lo que el sistema no promete están en Seguridad y confianza. La propuesta concreta para un regulador de licores está en el caso de uso.',
    primaryCta: { label: 'Seguridad y confianza', key: 'security', variant: 'primary' },
    secondaryCta: { label: 'Ver el caso de uso', key: 'caseSpirits', variant: 'secondary' },
  },
};
