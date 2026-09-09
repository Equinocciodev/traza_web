import type { PlatformContent } from '../types';

export const platform: PlatformContent = {
  "meta": {
    "title": "Plataforma de identidad, trazabilidad y control",
    "description": "Capacidades de la plataforma Traza: identidad unitaria, registro del ciclo de vida, verificación pública, control institucional y reglas por cada tenant."
  },
  "hero": {
    "eyebrow": "Plataforma",
    "title": "Cada producto. Todo su contexto.",
    "subtitle": "Traza une tres cosas que suelen vivir separadas: la identidad de cada unidad, el registro de su ciclo de vida y una forma pública y sencilla de comprobar ambas.",
    "titleLines": [
      "Cada producto.",
      "Todo su contexto."
    ],
    "cta": {
      "label": "Explorar una unidad",
      "key": "verify",
      "suffix": "?t=medicamentos&c=TRZ-7F2K-4K7Q-92FA"
    }
  },
  "capabilities": {
    "title": "Identidad que conecta. Evidencia que se entiende.",
    "intro": "Seis capacidades que se combinan según el despliegue. Ninguna exige reemplazar los sistemas que una organización ya utiliza.",
    "items": [
      {
        "title": "Identidad digital unitaria",
        "body": "Un identificador único y firmado para cada unidad, con los datos mínimos que la describen: fabricante o importador, producto y presentación, origen y lote.",
        "icon": "fingerprint",
        "key": "codeSpec"
      },
      {
        "title": "Registro del ciclo de vida",
        "body": "Emisión, impresión y activación al finalizar producción. Después, consultas, señales y cierre: cada evento conserva su fuente y su fecha.",
        "icon": "history",
        "key": "journey"
      },
      {
        "title": "Verificación pública",
        "body": "Cualquier persona verifica una unidad desde el navegador, sin instalar nada ni crear una cuenta. El resultado se explica por señales y en lenguaje claro.",
        "icon": "scan",
        "key": "verify"
      },
      {
        "title": "Control institucional",
        "body": "Reguladores y empresas consultan el registro, siguen anomalías, coordinan inspecciones de campo y exportan información para auditoría.",
        "icon": "eye",
        "key": "institutional"
      },
      {
        "title": "Reglas configurables por tenant",
        "body": "Cada despliegue define su marca, sus campos de identidad, sus tipos de evento, sus roles y el contexto que ve el público al verificar.",
        "icon": "settings",
        "key": "solutions"
      },
      {
        "title": "Reporte de discrepancias",
        "body": "Quien verifica puede preparar un reporte de diferencias para compartirlo con la organización responsable. En esta web se descarga localmente.",
        "icon": "flag",
        "key": "verify"
      }
    ],
    "eyebrow": "Una plataforma, seis capacidades"
  },
  "identity": {
    "title": "La identidad de una unidad",
    "body": "Cada unidad vincula fabricante o importador, presentación, concentración, lote y vencimiento con su identificador. El registro sanitario mostrado es un campo de ejemplo: no acredita una autorización.",
    "fields": [
      {
        "label": "Fabricante / importador",
        "description": "La organización que produjo la unidad o la trajo al mercado, y que la firma como emisor.",
        "icon": "factory"
      },
      {
        "label": "Producto / presentación",
        "description": "Qué es y en qué formato: tipo, variante, envase y contenido declarado.",
        "icon": "box"
      },
      {
        "label": "Lote y vencimiento",
        "description": "El lote de producción o importación y la fecha de vencimiento, para comparar con lo impreso en el envase.",
        "icon": "label"
      },
      {
        "label": "Estado del identificador",
        "description": "Si está emitido, activado, en revisión o anulado, y desde cuándo se consulta.",
        "icon": "shield-check"
      }
    ],
    "example": {
      "caption": "Ejemplo de identidad unitaria",
      "code": "TRZ-7F2K-4K7Q-92FA",
      "rows": [
        {
          "label": "Fabricante / importador",
          "value": "Laboratorio Cerro Alto"
        },
        {
          "label": "Producto / presentación",
          "value": "Solución oral · frasco 120 ml"
        },
        {
          "label": "Concentración",
          "value": "No indicada · EJEMPLO"
        },
        {
          "label": "Registro sanitario",
          "value": "RS-EJEMPLO"
        },
        {
          "label": "Estado del identificador",
          "value": "Activado"
        }
      ]
    }
  },
  "architecture": {
    "title": "Arquitectura objetivo",
    "intro": "La arquitectura objetivo separa emisión, consulta y auditoría para que cada función tenga permisos y responsabilidades definidos. Los controles se implementan y validan en cada despliegue.",
    "layers": [
      {
        "name": "Plano de emisión",
        "body": "Deriva y firma los identificadores por orden. Las claves se custodian en un módulo de seguridad de hardware, con derivación por emisión: administrar una clave y usarla son permisos distintos.",
        "icon": "key"
      },
      {
        "name": "Plano de verificación",
        "body": "El camino caliente: resuelve la consulta pública, evalúa firma, registro, coincidencia y señales, y devuelve un resultado explicado. Debe seguir respondiendo aunque la emisión esté en mantenimiento.",
        "icon": "globe"
      },
      {
        "name": "Plano analítico y de auditoría",
        "body": "Append-only: cada emisión, descarga, activación y cambio de estado queda registrado. Sin UPDATE ni DELETE — revocar es un evento nuevo, no una corrección del anterior.",
        "icon": "database"
      },
      {
        "name": "Espejo de solo lectura",
        "body": "La arquitectura propone una copia de solo lectura para el equipo autorizado de auditoría. Permite contrastar los eventos de los medicamentos con el registro principal; su acceso, alcance y sincronización se acuerdan en cada despliegue.",
        "icon": "eye"
      },
      {
        "name": "Integración",
        "body": "Interfaces para emitir y activar desde los sistemas de gestión existentes, y para exportar información hacia ellos.",
        "icon": "plug"
      }
    ],
    "note": "Arquitectura objetivo del producto. Los controles criptográficos y de seguridad se implementan y auditan en cada despliegue."
  },
  "verificationModel": {
    "title": "Qué se comprueba al verificar",
    "intro": "Una verificación no da un veredicto único. Evalúa cuatro señales por separado y las explica, para que quien verifica sepa qué se comprobó, cuánta confianza aporta y cuál es el siguiente paso.",
    "signals": [
      {
        "key": "signature",
        "title": "Firma",
        "body": "Si la identidad fue emitida por el emisor esperado y no ha sido alterada.",
        "icon": "signature"
      },
      {
        "key": "registry",
        "title": "Estado en el registro",
        "body": "Si la identidad está activa, suspendida o revocada, y qué eventos constan en ella.",
        "icon": "database"
      },
      {
        "key": "match",
        "title": "Coincidencia de datos",
        "body": "Si lo que muestra la etiqueta coincide con lo que dice el registro: producto, presentación, lote y fecha de vencimiento.",
        "icon": "compare"
      },
      {
        "key": "anomalies",
        "title": "Anomalías",
        "body": "Si hay señales que conviene revisar: consultas repetidas del mismo código, ubicaciones inconsistentes o eventos fuera de secuencia.",
        "icon": "alert"
      }
    ],
    "caution": "Una firma válida indica que la identidad fue emitida; no describe el contenido físico ni impide que una etiqueta sea copiada. Por eso el resultado nunca se reduce a una palabra: se explica, se acompaña del siguiente paso y la inspección física sigue siendo necesaria."
  },
  "tenancy": {
    "title": "Tu organización. Una base compartida.",
    "body": "La marca maestra vive en traza.technology. Cada programa de medicamentos puede presentarse con la identidad visual de la organización responsable y su propio contexto de consulta, sujeto a aprobación.",
    "bullets": [
      "Lockup de co-brand o marca propia (white-label) en cada despliegue",
      "Colores de acento, textos de contexto y siguiente paso configurables",
      "Datos del medicamento y eventos de su ciclo de vida acordados por programa",
      "Roles y permisos definidos por cada institución",
      "La verificación pública lee el tenant desde la URL y adapta el resultado"
    ],
    "exampleNote": "EMPRESA PÚBLICA Y/O PRIVADA | TRAZA: co-brand de ejemplo, sujeto a aprobación. No afirma una relación institucional.",
    "eyebrow": "Marca y permisos"
  },
  "integration": {
    "title": "Integración con sistemas existentes",
    "body": "Conecta emisión, activación y consulta con los sistemas existentes. Cada implementación define sus interfaces, permisos y criterios de validación.",
    "bullets": [
      "Órdenes de producción e identidades por unidad",
      "Activación al finalizar producción",
      "Exportación del registro para auditoría"
    ],
    "note": "Las capacidades de integración se describen de forma genérica y sin nombrar productos: cada despliegue acuerda sus conectores.",
    "eyebrow": "Integraciones",
    "intro": "Conecta emisión, activación y consulta con los sistemas existentes. Cada implementación define sus interfaces, permisos y criterios de validación.",
    "diagramAlt": "Esquema conceptual: gestión, producción, calidad y analítica se conectan con Traza.",
    "diagramLabel": "Esquema conceptual de integración",
    "nodes": [
  {
    "name": "ERP / Gestión",
    "body": "Catálogos y lotes"
  },
  {
    "name": "Calidad / Cumplimiento",
    "body": "Señales y reportes"
  },
  {
    "name": "Producción / Etiquetado",
    "body": "Impresión y activación"
  },
  {
    "name": "Analítica",
    "body": "Exportación e informes"
  }
],
    "scope": {
      "eyebrow": "Alcance de la conexión",
      "title": "Definir. Conectar. Validar.",
      "steps": [
        {
          "title": "Acordar el alcance",
          "body": "Datos, responsables y permisos de cada sistema."
        },
        {
          "title": "Conectar la operación",
          "body": "Emisión e impresión; activación al finalizar producción."
        },
        {
          "title": "Validar con evidencia",
          "body": "Pruebas de lectura, datos y trazabilidad de cambios."
        }
      ]
    },
    "cta": {
      "label": "Ver integración y alcance",
      "key": "integration"
    }
  },
  "cta": {
    "title": "Vea la plataforma en funcionamiento",
    "body": "Las tres vistas muestran la verificación pública, el recorrido de una unidad y el panel institucional.",
    "primaryCta": {
      "label": "Verificar un producto",
      "key": "verify",
      "variant": "primary"
    },
    "secondaryCta": {
      "label": "Cómo funciona",
      "key": "howItWorks",
      "variant": "secondary"
    }
  },
  "productView": {
    "eyebrow": "Vista de producto",
    "title": "Todo su contexto. A un clic de distancia.",
    "intro": "Una misma unidad, tres formas de entender la evidencia: su ficha, los eventos registrados y las comprobaciones que explican el resultado.",
    "tabsLabel": "Secciones de la vista de producto",
    "tabs": [
      {
        "href": "#pasaporte",
        "label": "Pasaporte digital"
      },
      {
        "href": "#historial",
        "label": "Historial"
      },
      {
        "href": "#senales",
        "label": "Señales"
      }
    ],
    "passport": {
      "kicker": "Pasaporte digital",
      "exampleLabel": "Ejemplo",
      "title": "Solución oral Traza",
      "presentation": "Frasco 120 ml",
      "status": "Identificador activado",
      "codeLabel": "Identificador de unidad",
      "code": "TRZ-7F2K-4K7Q-92FA",
      "rows": [
        {
          "label": "Fabricante / importador",
          "value": "Laboratorio Cerro Alto"
        },
        {
          "label": "Producto / presentación",
          "value": "Solución oral · frasco 120 ml"
        },
        {
          "label": "Concentración",
          "value": "No indicada · EJEMPLO"
        },
        {
          "label": "Registro sanitario",
          "value": "RS-EJEMPLO"
        },
        {
          "label": "Estado del identificador",
          "value": "Activado"
        }
      ],
      "note": "Datos de ejemplo. Compare siempre el resultado con la etiqueta y la unidad física.",
      "cta": {
        "label": "Explorar una unidad",
        "key": "verify",
        "suffix": "?t=medicamentos&c=TRZ-7F2K-4K7Q-92FA"
      }
    },
    "history": {
      "kicker": "Historial de la unidad",
      "exampleLabel": "Ejemplo",
      "title": "Cada evento. Una fuente.",
      "items": [
        {
          "tone": "success",
          "title": "Identidad emitida",
          "source": "Emisor · orden de producción",
          "status": "Registrado"
        },
        {
          "tone": "success",
          "title": "QR impreso por unidad",
          "source": "Planta · prueba de impresión",
          "status": "Registrado"
        },
        {
          "tone": "success",
          "title": "Activación al finalizar producción",
          "source": "Emisor · cierre de ficha",
          "status": "Activado"
        },
        {
          "tone": "neutral",
          "title": "Consulta pública",
          "source": "Persona · comparación con etiqueta",
          "status": "Consultado"
        }
      ]
    },
    "gaps": {
      "title": "Lo que se conoce. Lo que falta.",
      "body": "La evidencia disponible se distingue de lo que requiere una revisión. Un QR legible o una firma válida no certifican por sí solos el contenido del envase."
    }
  },
  "roles": {
    "eyebrow": "Experiencias por rol",
    "title": "Un registro común. Una vista para cada responsabilidad.",
    "intro": "El acceso y las acciones dependen de los permisos acordados en cada despliegue.",
    "items": [
      {
        "title": "Consulta pública",
        "who": "Personas",
        "body": "Escanea y compara sin crear una cuenta."
      },
      {
        "title": "Operación",
        "who": "Fabricantes e importadores",
        "body": "Emite identidades y activa las unidades al finalizar producción."
      },
      {
        "title": "Control",
        "who": "Equipos autorizados",
        "body": "Revisa señales, consulta eventos y prepara inspecciones."
      }
    ],
    "mockCaption": "Vista de ejemplo · explore la consulta y el registro desde los enlaces."
  }
};
