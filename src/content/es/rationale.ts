import type { ReferencePageContent } from '../types';

/** Medicines pilot design criteria; no historical results or institutional relationships are claimed. */
export const rationale: ReferencePageContent = {
  "meta": {
    "title": "Por qué este diseño: criterios para medicamentos",
    "description": "Los criterios del piloto de medicamentos: identidad por unidad, activación tras producción, auditoría y consulta pública con límites para cada participante."
  },
  "hero": {
    "eyebrow": "Criterios de diseño",
    "title": "Una identidad por medicamento, con responsabilidades claras",
    "subtitle": "La propuesta parte de una unidad de medicamento y de quienes la identifican, consultan o revisan. Estos criterios explican qué se quiere comprobar y qué límites debe conservar cada piloto."
  },
  "contentsLabel": "En esta página",
  "sections": [
    {
      "id": "sistemas",
      "title": "Decisiones para el piloto de medicamentos",
      "intro": "Son criterios de la propuesta, sujetos a implementación y validación. No acreditan una operación, una relación institucional ni resultados de otros sistemas.",
      "items": [
        {
          "title": "Identidad vinculada a la unidad",
          "body": "El fabricante o importador describe el medicamento antes de emitir su identificador. El formato objetivo vincula la identidad firmada con el estado de la unidad en el registro.",
          "icon": "signature"
        },
        {
          "title": "Auditoría con permisos propios",
          "body": "La arquitectura propone una copia de solo lectura para el equipo autorizado. El programa debe acordar qué eventos podrá consultar y cómo contrastarlos con el registro principal.",
          "icon": "eye"
        },
        {
          "title": "Emisión, impresión y activación separadas",
          "body": "Imprimir un QR no activa la unidad. La activación se propone al finalizar producción y completar la ficha de producto, lote y vencimiento.",
          "icon": "plug"
        },
        {
          "title": "Empezar por un medicamento",
          "body": "Un piloto puede acotarse a una presentación, una línea de envasado y responsables definidos. Permite revisar cada etapa antes de ampliar el alcance.",
          "icon": "search"
        },
        {
          "title": "Costes y responsabilidades explícitos",
          "body": "Antes del piloto se deben acordar emisión, impresión, integración, soporte y revisión. La financiación y las condiciones de participación también deben acordarse.",
          "icon": "warning"
        },
        {
          "title": "Etiqueta y registro deben poder compararse",
          "body": "El QR y el identificador legible remiten a la misma unidad. La persona compara el medicamento, presentación, lote y vencimiento; la coincidencia digital no certifica el contenido físico.",
          "icon": "compare"
        },
        {
          "title": "Consulta desde el navegador",
          "body": "El QR abre una URL de consulta. También se puede escribir el identificador o leer una imagen del código, sin instalar una aplicación ni crear una cuenta.",
          "icon": "qr"
        }
      ]
    },
    {
      "id": "principios",
      "title": "Diez criterios para acordar el despliegue",
      "intro": "El piloto debe convertir estos criterios en responsabilidades y comprobaciones concretas. La web permite explorar ejemplos; no acredita su implementación operativa.",
      "items": [
        {
          "title": "Alcance acotado",
          "body": "Definir medicamento, presentación, lote y responsables del piloto, con los datos que se podrán consultar.",
          "icon": "list"
        },
        {
          "title": "Identidad y registro separados",
          "body": "La arquitectura objetivo combina una firma para comprobar emisor e integridad con un registro que conserva estados y señales. La consulta de esta web usa datos de ejemplo.",
          "icon": "signature"
        },
        {
          "title": "Identificadores no secuenciales",
          "body": "La propuesta evita que el identificador exponga un contador de producción. El formato definitivo requiere validación; no se atribuye seguridad a su apariencia.",
          "icon": "lock"
        },
        {
          "title": "Coste acordado antes de operar",
          "body": "Definir quién asume impresión, integración y soporte, y cómo se evaluarán los costes del piloto. Los importes se acuerdan por programa.",
          "icon": "chart"
        },
        {
          "title": "Custodia y salida definidas",
          "body": "Acordar titularidad, acceso, custodia de claves y exportación de datos antes del despliegue. No se atribuyen automáticamente al operador ni a una autoridad.",
          "icon": "key"
        },
        {
          "title": "Continuidad con estados explícitos",
          "body": "La arquitectura debe definir cómo trabajar ante una interrupción y recuperar eventos pendientes, sin mostrar como activadas unidades cuya ficha no se ha completado.",
          "icon": "offline"
        },
        {
          "title": "Cierre de códigos sin utilizar",
          "body": "Acordar cómo anular los códigos sobrantes al cerrar una emisión y cómo registrar esa decisión sin borrar el historial.",
          "icon": "clock"
        },
        {
          "title": "Activación tras producción",
          "body": "Completar producto, lote y vencimiento y confirmar qué códigos se utilizaron antes de activar las unidades. Una impresión por sí sola no acredita la activación.",
          "icon": "compare"
        },
        {
          "title": "Consulta útil para las personas",
          "body": "Mostrar qué comparar con el envase y qué hacer ante una diferencia. En esta web el reporte se prepara y descarga localmente; entregarlo requiere un canal de la organización.",
          "icon": "citizen"
        },
        {
          "title": "Autorización y límites previos",
          "body": "Definir permisos y responsabilidades del piloto. Los elementos físicos anticopia y la validación tributaria pertenecen a una fase 2 y requieren integración autorizada; no están disponibles aquí.",
          "icon": "document"
        }
      ]
    },
    {
      "id": "consecuencia",
      "title": "La diferencia que debe quedar clara al consultar",
      "paragraphs": [
        "Una ficha digital describe una unidad declarada. Al consultar un medicamento, la persona debe comparar los datos con el envase; una fotografía o una coincidencia en el registro no prueban su contenido físico.",
        "El registro propuesto sigue emisión, etiquetado, activación, consulta, señales y cierre. No registra transporte, distribución ni ventas. La activación exige finalizar producción y completar la ficha.",
        "Un identificador emitido y etiquetado con activación pendiente requiere revisión. Esta web explica el estado con registros de ejemplo y permite preparar un reporte local, sin enviarlo ni modificar el registro."
      ],
      "note": "Nunca decimos que un medicamento sea «auténtico» porque su firma valide: el objetivo de la firma es comprobar emisor e integridad de los datos, no el contenido físico del frasco."
    }
  ],
  "cta": {
    "title": "Dónde sigue esto",
    "body": "Seguridad y confianza explica las capas propuestas, la custodia de claves y sus límites. El caso de medicamentos concreta el alcance del piloto y sus responsabilidades.",
    "primaryCta": {
      "label": "Seguridad y confianza",
      "key": "security",
      "variant": "primary"
    },
    "secondaryCta": {
      "label": "Ver el caso de uso",
      "key": "caseMedicines",
      "variant": "secondary"
    }
  }
};
