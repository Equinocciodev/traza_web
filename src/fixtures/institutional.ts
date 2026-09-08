/**
 * Fixtures de la DEMO C · Vista institucional (alertas, casos, inspecciones de campo, cronología de auditoría y KPIs).
 *
 * TODO es ficticio y simulado: personas, organizaciones, sitios, regiones, folios, fechas y cifras.
 * Ningún dato personal ni tributario. Las regiones son las regiones ficticias de `units.ts`.
 * Nada de lo aquí descrito corresponde a una implementación real ni a una entidad de control real.
 */
import type { LocalizedText, Severity } from './types';
import { ORGANIZATIONS } from './units';

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type AlertType = 'duplicate_scans' | 'geo_inconsistent' | 'chain_gap' | 'lot_withdrawn' | 'reported' | 'partial_match' | 'suspended';

export const ALERT_TYPES: readonly AlertType[] = [
  'reported',
  'lot_withdrawn',
  'duplicate_scans',
  'geo_inconsistent',
  'partial_match',
  'suspended',
  'chain_gap',
] as const;

export type AlertStatus = 'open' | 'acknowledged' | 'closed';
export const ALERT_STATUSES: readonly AlertStatus[] = ['open', 'acknowledged', 'closed'] as const;
export const SEVERITIES: readonly Severity[] = ['critical', 'warning', 'info'] as const;

export type CaseStatus = 'open' | 'in_review' | 'closed';
export type InspectionStatus = 'scheduled' | 'done';

/** Rol de quien actúa en la cronología. `observer` solo aparece en acciones simuladas de la sesión. */
export type ActorRole = 'system' | 'analyst' | 'inspector' | 'supervisor' | 'issuer' | 'observer';
export const ACTOR_ROLES: readonly ActorRole[] = ['system', 'analyst', 'inspector', 'supervisor', 'issuer', 'observer'] as const;

export type AuditAction =
  | 'alert_created'
  | 'alert_acknowledged'
  | 'alert_closed'
  | 'case_opened'
  | 'case_note'
  | 'case_closed'
  | 'inspection_scheduled'
  | 'inspection_completed'
  | 'lot_revoked'
  | 'report_received'
  | 'issuer_requested'
  | 'access_requested'
  | 'summary_exported';

export interface DemoPerson {
  id: string;
  /** Nombre ficticio, siempre rotulado como tal. */
  name: string;
  role: ActorRole;
}

export interface InstitutionalAlert {
  /** ALR-2026-0xx */
  id: string;
  type: AlertType;
  severity: Severity;
  /** Código de unidad de `units.ts`. */
  unitCode: string;
  /** Región ficticia desde la que se detectó. */
  region: string;
  /** Fecha-hora ISO 8601 (UTC). */
  detectedAt: string;
  status: AlertStatus;
  summary: LocalizedText;
  /** Qué se detectó, qué confianza aporta y cuál es el siguiente paso. */
  explanation: LocalizedText;
  /** Caso vinculado, si existe. */
  caseId?: string;
  /** Inspector ficticio asignado (id de `PEOPLE`). */
  assignedTo?: string;
}

export interface CaseAction {
  id: string;
  at: string;
  actorId: string;
  description: LocalizedText;
}

export interface InstitutionalCase {
  /** CASO-2026-01xx */
  id: string;
  title: LocalizedText;
  status: CaseStatus;
  alertIds: string[];
  inspectorId: string;
  openedAt: string;
  actions: CaseAction[];
  outcome?: LocalizedText;
}

export interface FieldInspection {
  /** INS-2026-0xx */
  id: string;
  caseId: string;
  status: InspectionStatus;
  site: string;
  region: string;
  /** Fecha programada o realizada (UTC). */
  at: string;
  inspectorId: string;
  result?: LocalizedText;
}

export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  action: AuditAction;
  /** Objeto sobre el que se actúa: alerta, caso, inspección, lote o reporte. */
  object: string;
  result: LocalizedText;
  description: LocalizedText;
}

export interface InstitutionalKpis {
  unitsRegistered: number;
  verificationsPeriod: number;
  alertsOpen: number;
  casesInProgress: number;
}

/* ------------------------------------------------------------------ */
/* Personas y organizaciones ficticias                                 */
/* ------------------------------------------------------------------ */

export const PEOPLE: readonly DemoPerson[] = [
  { id: 'sys-rules', name: 'Motor de reglas (simulado)', role: 'system' },
  { id: 'ana-quintero', name: 'Lucía Quintero (demo)', role: 'analyst' },
  { id: 'insp-salcedo', name: 'Rodrigo Salcedo (demo)', role: 'inspector' },
  { id: 'insp-ibarra', name: 'Mariana Ibarra (demo)', role: 'inspector' },
  { id: 'sup-montiel', name: 'Andrés Montiel (demo)', role: 'supervisor' },
  { id: 'issuer-cerro-alto', name: ORGANIZATIONS.distillery, role: 'issuer' },
  { id: 'issuer-bahia-norte', name: ORGANIZATIONS.importer, role: 'issuer' },
] as const;

export const PERSON_BY_ID: ReadonlyMap<string, DemoPerson> = new Map(PEOPLE.map((p) => [p.id, p]));

/** Identidad que asume el rol "Inspector de campo (demo)": solo ve lo asignado a esta persona ficticia. */
export const DEMO_INSPECTOR_ID = 'insp-salcedo';

/** Prefijo del actor para las acciones que ejecuta la sesión de demostración. */
export const DEMO_SESSION_ACTOR_PREFIX = 'demo:';

/* ------------------------------------------------------------------ */
/* Alertas (ordenadas de más reciente a más antigua)                   */
/* ------------------------------------------------------------------ */

export const ALERTS: readonly InstitutionalAlert[] = [
  {
    id: 'ALR-2026-035',
    type: 'chain_gap',
    severity: 'info',
    unitCode: 'TRZ-DEMO-8L1F-63HW',
    region: 'Región Norte',
    detectedAt: '2026-09-02T12:20:00Z',
    status: 'open',
    summary: {
      es: 'Verificación en comercio sin despacho registrado desde distribución.',
      en: 'Verified at retail with no dispatch recorded from distribution.',
    },
    explanation: {
      es: 'El último evento registrado para esta unidad es la recepción en el Centro de distribución Sierra Verde; no consta el despacho a comercio, pero la verificación pública se hizo desde un punto de venta. Con frecuencia se trata de un retraso en el registro del distribuidor. Confianza como indicio de irregularidad: baja. Siguiente paso: confirmar con el distribuidor si el despacho ocurrió y regularizar el evento.',
      en: 'The last recorded event for this unit is receipt at the Sierra Verde distribution center; no dispatch to retail is on record, yet the public verification came from a point of sale. This is often a recording delay on the distributor side. Confidence as a sign of irregularity: low. Next step: confirm with the distributor whether the dispatch happened and regularise the event.',
    },
  },
  {
    id: 'ALR-2026-034',
    type: 'suspended',
    severity: 'warning',
    unitCode: 'TRZ-DEMO-1V5J-26PT',
    region: 'Región Centro',
    detectedAt: '2026-09-01T10:05:00Z',
    status: 'open',
    summary: {
      es: 'Identificador suspendido en el registro a petición del emisor (revisión del lote IMP-BN-26-031).',
      en: 'Identifier suspended in the registry at the issuer’s request (review of lot IMP-BN-26-031).',
    },
    explanation: {
      es: 'El emisor pidió suspender temporalmente este identificador mientras revisa el lote IMP-BN-26-031, al que también pertenece la unidad reportada por sello dañado (RPT-2026-000418). La firma es válida y los datos coinciden: la suspensión es una medida preventiva, no una conclusión sobre la unidad. Siguiente paso: esperar el dictamen del emisor y mantener la unidad fuera de venta mientras tanto.',
      en: 'The issuer asked to temporarily suspend this identifier while it reviews lot IMP-BN-26-031, which also includes the unit reported for a damaged seal (RPT-2026-000418). The signature is valid and the data match: the suspension is a precaution, not a conclusion about the unit. Next step: wait for the issuer’s statement and keep the unit off the shelf meanwhile.',
    },
    caseId: 'CASO-2026-0144',
    assignedTo: 'insp-ibarra',
  },
  {
    id: 'ALR-2026-033',
    type: 'partial_match',
    severity: 'warning',
    unitCode: 'TRZ-DEMO-9P4T-55RD',
    region: 'Región Centro',
    detectedAt: '2026-08-30T11:02:00Z',
    status: 'open',
    summary: {
      es: 'La presentación impresa (1 L) no coincide con la registrada (750 ml).',
      en: 'The printed presentation (1 L) does not match the registered one (750 ml).',
    },
    explanation: {
      es: 'La etiqueta escaneada indica una presentación de 1 L, pero el registro asocia este identificador a una botella de 750 ml. Firma y registro son correctos, así que el identificador fue emitido; la discrepancia puede deberse a un error de etiquetado o a una etiqueta reutilizada en otro envase. Siguiente paso: comprobar físicamente la unidad en el comercio y contrastarla con el lote LOTE-VS-26-015.',
      en: 'The scanned label reads 1 L, but the registry links this identifier to a 750 ml bottle. Signature and registry are correct, so the identifier was issued; the discrepancy may come from a labelling error or a label reused on another container. Next step: physically check the unit at the retailer and compare it with lot LOTE-VS-26-015.',
    },
  },
  {
    id: 'ALR-2026-032',
    type: 'geo_inconsistent',
    severity: 'warning',
    unitCode: 'TRZ-DEMO-7H2M-31LC',
    region: 'Región Sur',
    detectedAt: '2026-08-29T20:12:00Z',
    status: 'open',
    summary: {
      es: 'Verificaciones desde regiones distintas a la del comercio de destino (Región Norte).',
      en: 'Verifications from regions other than the destination retailer’s (Región Norte).',
    },
    explanation: {
      es: 'El comercio de destino registrado es Licorería El Faro (Región Norte), pero varias verificaciones proceden de la Región Sur y de la Región Centro. Junto con la alerta de verificaciones repetidas, sugiere que el mismo código podría estar impreso en más de una etiqueta. No confirma por sí sola una copia. Siguiente paso: inspección en el punto de destino y en los puntos desde los que se verificó.',
      en: 'The registered destination retailer is Licorería El Faro (Región Norte), but several verifications come from Región Sur and Región Centro. Together with the repeated-verification alert, it suggests the same code may be printed on more than one label. On its own it does not confirm a copy. Next step: inspection at the destination and at the points where the verifications were made.',
    },
    caseId: 'CASO-2026-0143',
    assignedTo: 'insp-salcedo',
  },
  {
    id: 'ALR-2026-031',
    type: 'duplicate_scans',
    severity: 'warning',
    unitCode: 'TRZ-DEMO-7H2M-31LC',
    region: 'Región Norte',
    detectedAt: '2026-08-29T20:10:00Z',
    status: 'acknowledged',
    summary: {
      es: '14 verificaciones en 3 regiones distintas en 48 horas.',
      en: '14 verifications across 3 regions within 48 hours.',
    },
    explanation: {
      es: 'Un mismo identificador se verificó 14 veces en 3 regiones distintas en menos de 48 horas. La firma es válida y el registro está activo: el identificador fue emitido, pero una sola botella no suele moverse así. Puede tratarse de etiquetas copiadas o de comparaciones repetidas en tienda. Siguiente paso: comprobar la unidad en el comercio de destino y revisar la distribución geográfica de las verificaciones.',
      en: 'The same identifier was verified 14 times across 3 regions in under 48 hours. The signature is valid and the registry is active: the identifier was issued, but a single bottle does not usually move like that. It may be copied labels or repeated comparisons in store. Next step: check the unit at the destination retailer and review the geographic spread of the verifications.',
    },
    caseId: 'CASO-2026-0143',
    assignedTo: 'insp-salcedo',
  },
  {
    id: 'ALR-2026-030',
    type: 'reported',
    severity: 'critical',
    unitCode: 'TRZ-DEMO-3N6D-09ZB',
    region: 'Región Centro',
    detectedAt: '2026-08-28T16:45:00Z',
    status: 'acknowledged',
    summary: {
      es: 'Reporte de discrepancia RPT-2026-000418 por sello dañado.',
      en: 'Discrepancy report RPT-2026-000418 for a damaged seal.',
    },
    explanation: {
      es: 'Una persona que verificó la unidad en Supermercado La Plaza envió un reporte de discrepancia por sello dañado. Firma, registro y datos son correctos, de modo que la anomalía se refiere al estado físico del envase, no al identificador. Siguiente paso: inspección de campo dentro del piloto, retención de la unidad y consulta al emisor.',
      en: 'A person who verified the unit at Supermercado La Plaza submitted a discrepancy report for a damaged seal. Signature, registry and data are correct, so the anomaly concerns the physical state of the container, not the identifier. Next step: field inspection within the pilot, retention of the unit and a query to the issuer.',
    },
    caseId: 'CASO-2026-0142',
    assignedTo: 'insp-salcedo',
  },
  {
    id: 'ALR-2026-029',
    type: 'duplicate_scans',
    severity: 'info',
    unitCode: 'TRZ-DEMO-9P4T-55RD',
    region: 'Región Centro',
    detectedAt: '2026-08-30T10:25:00Z',
    status: 'closed',
    summary: {
      es: '2 verificaciones en 40 minutos desde el mismo punto de venta.',
      en: '2 verifications within 40 minutes from the same point of sale.',
    },
    explanation: {
      es: 'Dos verificaciones consecutivas desde el mismo comercio, dentro del margen habitual de comparación en tienda. Se cerró automáticamente sin acción.',
      en: 'Two consecutive verifications from the same retailer, within the usual margin for in-store comparison. Closed automatically without action.',
    },
  },
  {
    id: 'ALR-2026-028',
    type: 'lot_withdrawn',
    severity: 'critical',
    unitCode: 'TRZ-DEMO-5R9C-77MQ',
    region: 'Región Sur',
    detectedAt: '2026-08-20T10:00:00Z',
    status: 'closed',
    summary: {
      es: 'Lote LOTE-VS-26-009 retirado por el emisor; el identificador figura como revocado.',
      en: 'Lot LOTE-VS-26-009 withdrawn by the issuer; the identifier is listed as revoked.',
    },
    explanation: {
      es: 'El emisor publicó la revocación del lote LOTE-VS-26-009 (RET-2026-004) tras una revisión interna de calidad simulada. Toda verificación de este identificador muestra el estado revocado. Siguiente paso: confirmar que las unidades del lote salieron de los puntos de venta.',
      en: 'The issuer published the revocation of lot LOTE-VS-26-009 (RET-2026-004) after a simulated internal quality review. Every verification of this identifier shows the revoked state. Next step: confirm that the lot’s units have left the points of sale.',
    },
    caseId: 'CASO-2026-0139',
    assignedTo: 'insp-ibarra',
  },
  {
    id: 'ALR-2026-026',
    type: 'chain_gap',
    severity: 'info',
    unitCode: 'TRZ-DEMO-4K7Q-92FA',
    region: 'Región Norte',
    detectedAt: '2026-07-22T11:05:00Z',
    status: 'closed',
    summary: {
      es: 'Recepción en comercio registrada 27 h después del despacho (umbral del piloto: 24 h).',
      en: 'Retail receipt recorded 27 h after dispatch (pilot threshold: 24 h).',
    },
    explanation: {
      es: 'El comercio registró la recepción con retraso respecto al umbral del piloto. El evento llegó ese mismo día y la cadena quedó completa. Cerrada automáticamente.',
      en: 'The retailer recorded the receipt later than the pilot threshold. The event arrived the same day and the chain was completed. Closed automatically.',
    },
  },
];

export const ALERT_BY_ID: ReadonlyMap<string, InstitutionalAlert> = new Map(ALERTS.map((a) => [a.id, a]));

/* ------------------------------------------------------------------ */
/* Casos                                                               */
/* ------------------------------------------------------------------ */

export const CASES: readonly InstitutionalCase[] = [
  {
    id: 'CASO-2026-0144',
    title: {
      es: 'Revisión preventiva del lote IMP-BN-26-031',
      en: 'Precautionary review of lot IMP-BN-26-031',
    },
    status: 'open',
    alertIds: ['ALR-2026-034'],
    inspectorId: 'insp-ibarra',
    openedAt: '2026-09-01T11:30:00Z',
    actions: [
      {
        id: 'C144-01',
        at: '2026-09-01T11:30:00Z',
        actorId: 'sup-montiel',
        description: {
          es: 'Caso abierto por la suspensión preventiva solicitada por el emisor para el lote IMP-BN-26-031.',
          en: 'Case opened after the precautionary suspension requested by the issuer for lot IMP-BN-26-031.',
        },
      },
      {
        id: 'C144-02',
        at: '2026-09-01T11:35:00Z',
        actorId: 'sys-rules',
        description: {
          es: 'Suspensión del identificador confirmada en el registro por Importadora Bahía Norte (demo).',
          en: 'Identifier suspension confirmed in the registry by Importadora Bahía Norte (fictitious).',
        },
      },
      {
        id: 'C144-03',
        at: '2026-09-04T16:00:00Z',
        actorId: 'insp-ibarra',
        description: {
          es: 'Inspección INS-2026-013 programada en el Centro de distribución Sierra Verde para revisar las unidades del lote aún en almacén.',
          en: 'Inspection INS-2026-013 scheduled at the Sierra Verde distribution center to review the lot’s units still in storage.',
        },
      },
    ],
  },
  {
    id: 'CASO-2026-0143',
    title: {
      es: 'Verificaciones repetidas del código TRZ-DEMO-7H2M-31LC en tres regiones',
      en: 'Repeated verifications of code TRZ-DEMO-7H2M-31LC across three regions',
    },
    status: 'open',
    alertIds: ['ALR-2026-031', 'ALR-2026-032'],
    inspectorId: 'insp-salcedo',
    openedAt: '2026-08-30T08:15:00Z',
    actions: [
      {
        id: 'C143-01',
        at: '2026-08-30T08:15:00Z',
        actorId: 'ana-quintero',
        description: {
          es: 'Caso abierto a partir de las alertas ALR-2026-031 y ALR-2026-032.',
          en: 'Case opened from alerts ALR-2026-031 and ALR-2026-032.',
        },
      },
      {
        id: 'C143-02',
        at: '2026-09-01T14:00:00Z',
        actorId: 'insp-salcedo',
        description: {
          es: 'Contacto con Licorería El Faro (destino registrado): la unidad está en anaquel con el sello intacto. Las verificaciones de otras regiones no corresponden a esa botella.',
          en: 'Contacted Licorería El Faro (registered destination): the unit is on the shelf with the seal intact. Verifications from other regions do not correspond to that bottle.',
        },
      },
      {
        id: 'C143-03',
        at: '2026-09-03T15:10:00Z',
        actorId: 'insp-salcedo',
        description: {
          es: 'Inspección INS-2026-012 programada en Bodega Del Valle (Región Sur), origen de la mayoría de verificaciones fuera de región.',
          en: 'Inspection INS-2026-012 scheduled at Bodega Del Valle (Región Sur), where most out-of-region verifications came from.',
        },
      },
    ],
  },
  {
    id: 'CASO-2026-0142',
    title: {
      es: 'Reporte RPT-2026-000418: sello dañado en Supermercado La Plaza',
      en: 'Report RPT-2026-000418: damaged seal at Supermercado La Plaza',
    },
    status: 'in_review',
    alertIds: ['ALR-2026-030'],
    inspectorId: 'insp-salcedo',
    openedAt: '2026-08-28T17:30:00Z',
    actions: [
      {
        id: 'C142-01',
        at: '2026-08-28T17:30:00Z',
        actorId: 'ana-quintero',
        description: {
          es: 'Caso abierto a partir del reporte de discrepancia RPT-2026-000418 (sello dañado).',
          en: 'Case opened from discrepancy report RPT-2026-000418 (damaged seal).',
        },
      },
      {
        id: 'C142-02',
        at: '2026-08-29T09:05:00Z',
        actorId: 'insp-salcedo',
        description: {
          es: 'Inspección de campo INS-2026-011 programada para el 31 de agosto en Supermercado La Plaza.',
          en: 'Field inspection INS-2026-011 scheduled for 31 August at Supermercado La Plaza.',
        },
      },
      {
        id: 'C142-03',
        at: '2026-08-31T11:50:00Z',
        actorId: 'insp-salcedo',
        description: {
          es: 'Visita realizada: sello dañado confirmado, unidad retenida y muestra enviada al emisor para revisión. Acta simulada adjunta.',
          en: 'Visit completed: damaged seal confirmed, unit retained and sample sent to the issuer for review. Simulated record attached.',
        },
      },
      {
        id: 'C142-04',
        at: '2026-09-02T08:40:00Z',
        actorId: 'ana-quintero',
        description: {
          es: 'Solicitud de dictamen enviada a Importadora Bahía Norte (demo). A la espera de respuesta.',
          en: 'Statement requested from Importadora Bahía Norte (fictitious). Awaiting reply.',
        },
      },
    ],
  },
  {
    id: 'CASO-2026-0139',
    title: {
      es: 'Lote LOTE-VS-26-009 retirado: verificación de salida del anaquel',
      en: 'Lot LOTE-VS-26-009 withdrawn: shelf removal check',
    },
    status: 'closed',
    alertIds: ['ALR-2026-028'],
    inspectorId: 'insp-ibarra',
    openedAt: '2026-08-20T10:30:00Z',
    actions: [
      {
        id: 'C139-01',
        at: '2026-08-20T10:30:00Z',
        actorId: 'ana-quintero',
        description: {
          es: 'Caso abierto tras la revocación del lote publicada por el emisor (RET-2026-004).',
          en: 'Case opened after the lot revocation published by the issuer (RET-2026-004).',
        },
      },
      {
        id: 'C139-02',
        at: '2026-08-20T11:10:00Z',
        actorId: 'insp-ibarra',
        description: {
          es: 'Inspección INS-2026-009 programada en Bodega Del Valle (Región Sur).',
          en: 'Inspection INS-2026-009 scheduled at Bodega Del Valle (Región Sur).',
        },
      },
      {
        id: 'C139-03',
        at: '2026-08-23T12:05:00Z',
        actorId: 'insp-ibarra',
        description: {
          es: 'Visita realizada: 3 unidades del lote encontradas y retiradas del punto de venta; sin indicios de manipulación de etiquetas.',
          en: 'Visit completed: 3 units of the lot found and removed from the point of sale; no signs of label tampering.',
        },
      },
      {
        id: 'C139-04',
        at: '2026-08-24T09:00:00Z',
        actorId: 'sup-montiel',
        description: {
          es: 'Caso cerrado con resultado: retiro confirmado.',
          en: 'Case closed with outcome: removal confirmed.',
        },
      },
    ],
    outcome: {
      es: 'Retiro confirmado. 3 unidades del lote retiradas del punto de venta; sin indicios de manipulación de etiquetas.',
      en: 'Removal confirmed. 3 units of the lot removed from the point of sale; no signs of label tampering.',
    },
  },
];

export const CASE_BY_ID: ReadonlyMap<string, InstitutionalCase> = new Map(CASES.map((c) => [c.id, c]));

/* ------------------------------------------------------------------ */
/* Inspecciones de campo del piloto                                    */
/* ------------------------------------------------------------------ */

export const INSPECTIONS: readonly FieldInspection[] = [
  {
    id: 'INS-2026-013',
    caseId: 'CASO-2026-0144',
    status: 'scheduled',
    site: 'Centro de distribución Sierra Verde',
    region: 'Región Norte',
    at: '2026-09-09T09:00:00Z',
    inspectorId: 'insp-ibarra',
  },
  {
    id: 'INS-2026-012',
    caseId: 'CASO-2026-0143',
    status: 'scheduled',
    site: 'Bodega Del Valle',
    region: 'Región Sur',
    at: '2026-09-08T14:00:00Z',
    inspectorId: 'insp-salcedo',
  },
  {
    id: 'INS-2026-011',
    caseId: 'CASO-2026-0142',
    status: 'done',
    site: 'Supermercado La Plaza',
    region: 'Región Centro',
    at: '2026-08-31T09:30:00Z',
    inspectorId: 'insp-salcedo',
    result: {
      es: 'Sello dañado confirmado; unidad retenida para revisión del emisor.',
      en: 'Damaged seal confirmed; unit retained for the issuer’s review.',
    },
  },
  {
    id: 'INS-2026-009',
    caseId: 'CASO-2026-0139',
    status: 'done',
    site: 'Bodega Del Valle',
    region: 'Región Sur',
    at: '2026-08-23T10:15:00Z',
    inspectorId: 'insp-ibarra',
    result: {
      es: '3 unidades del lote retiradas; acta firmada por el comercio (simulada).',
      en: '3 units of the lot removed; record signed by the retailer (simulated).',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Cronología de auditoría (de más reciente a más antigua)             */
/* ------------------------------------------------------------------ */

const OK: LocalizedText = { es: 'Correcto', en: 'OK' };

export const AUDIT_LOG: readonly AuditEntry[] = [
  {
    id: 'AUD-2026-0227',
    at: '2026-09-05T08:00:00Z',
    actorId: 'sup-montiel',
    action: 'summary_exported',
    object: 'RESUMEN-S36',
    result: OK,
    description: { es: 'Resumen semanal del piloto exportado (simulado).', en: 'Weekly pilot summary exported (simulated).' },
  },
  {
    id: 'AUD-2026-0226',
    at: '2026-09-04T16:00:00Z',
    actorId: 'insp-ibarra',
    action: 'inspection_scheduled',
    object: 'INS-2026-013',
    result: { es: 'Programada para el 9 sep', en: 'Scheduled for 9 Sep' },
    description: { es: 'Inspección programada en el Centro de distribución Sierra Verde (caso CASO-2026-0144).', en: 'Inspection scheduled at the Sierra Verde distribution center (case CASO-2026-0144).' },
  },
  {
    id: 'AUD-2026-0225',
    at: '2026-09-03T15:10:00Z',
    actorId: 'insp-salcedo',
    action: 'inspection_scheduled',
    object: 'INS-2026-012',
    result: { es: 'Programada para el 8 sep', en: 'Scheduled for 8 Sep' },
    description: { es: 'Inspección programada en Bodega Del Valle (caso CASO-2026-0143).', en: 'Inspection scheduled at Bodega Del Valle (case CASO-2026-0143).' },
  },
  {
    id: 'AUD-2026-0224',
    at: '2026-09-02T12:20:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-035',
    result: { es: 'Creada · informativa', en: 'Created · info' },
    description: { es: 'Brecha de cadena detectada en TRZ-DEMO-8L1F-63HW.', en: 'Chain gap detected on TRZ-DEMO-8L1F-63HW.' },
  },
  {
    id: 'AUD-2026-0223',
    at: '2026-09-02T08:40:00Z',
    actorId: 'ana-quintero',
    action: 'issuer_requested',
    object: 'CASO-2026-0142',
    result: { es: 'Enviada', en: 'Sent' },
    description: { es: 'Solicitud de dictamen enviada a Importadora Bahía Norte (demo).', en: 'Statement requested from Importadora Bahía Norte (fictitious).' },
  },
  {
    id: 'AUD-2026-0222',
    at: '2026-09-01T14:00:00Z',
    actorId: 'insp-salcedo',
    action: 'case_note',
    object: 'CASO-2026-0143',
    result: OK,
    description: { es: 'Nota añadida: contacto con el comercio de destino; unidad en anaquel con sello intacto.', en: 'Note added: destination retailer contacted; unit on shelf with seal intact.' },
  },
  {
    id: 'AUD-2026-0221',
    at: '2026-09-01T11:30:00Z',
    actorId: 'sup-montiel',
    action: 'case_opened',
    object: 'CASO-2026-0144',
    result: { es: 'Abierto · asignado a M. Ibarra', en: 'Opened · assigned to M. Ibarra' },
    description: { es: 'Revisión preventiva del lote IMP-BN-26-031 a raíz de la suspensión pedida por el emisor.', en: 'Precautionary review of lot IMP-BN-26-031 following the suspension requested by the issuer.' },
  },
  {
    id: 'AUD-2026-0220',
    at: '2026-09-01T10:05:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-034',
    result: { es: 'Creada · advertencia', en: 'Created · warning' },
    description: { es: 'Identificador TRZ-DEMO-1V5J-26PT suspendido en el registro.', en: 'Identifier TRZ-DEMO-1V5J-26PT suspended in the registry.' },
  },
  {
    id: 'AUD-2026-0219',
    at: '2026-08-31T11:50:00Z',
    actorId: 'insp-salcedo',
    action: 'inspection_completed',
    object: 'INS-2026-011',
    result: { es: 'Sello dañado confirmado', en: 'Damaged seal confirmed' },
    description: { es: 'Visita realizada en Supermercado La Plaza; unidad retenida y muestra enviada al emisor.', en: 'Visit completed at Supermercado La Plaza; unit retained and sample sent to the issuer.' },
  },
  {
    id: 'AUD-2026-0218',
    at: '2026-08-30T11:02:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-033',
    result: { es: 'Creada · advertencia', en: 'Created · warning' },
    description: { es: 'Coincidencia parcial de datos en TRZ-DEMO-9P4T-55RD (1 L frente a 750 ml).', en: 'Partial data match on TRZ-DEMO-9P4T-55RD (1 L vs 750 ml).' },
  },
  {
    id: 'AUD-2026-0217',
    at: '2026-08-30T10:40:00Z',
    actorId: 'sys-rules',
    action: 'alert_closed',
    object: 'ALR-2026-029',
    result: { es: 'Cerrada automáticamente', en: 'Closed automatically' },
    description: { es: 'Dos verificaciones desde el mismo punto de venta, dentro de tolerancia.', en: 'Two verifications from the same point of sale, within tolerance.' },
  },
  {
    id: 'AUD-2026-0216',
    at: '2026-08-30T10:25:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-029',
    result: { es: 'Creada · informativa', en: 'Created · info' },
    description: { es: 'Verificaciones repetidas en TRZ-DEMO-9P4T-55RD.', en: 'Repeated verifications on TRZ-DEMO-9P4T-55RD.' },
  },
  {
    id: 'AUD-2026-0215',
    at: '2026-08-30T08:20:00Z',
    actorId: 'ana-quintero',
    action: 'alert_acknowledged',
    object: 'ALR-2026-031',
    result: { es: 'Reconocida', en: 'Acknowledged' },
    description: { es: 'Alerta de verificaciones repetidas reconocida y vinculada al caso CASO-2026-0143.', en: 'Repeated-verification alert acknowledged and linked to case CASO-2026-0143.' },
  },
  {
    id: 'AUD-2026-0214',
    at: '2026-08-30T08:15:00Z',
    actorId: 'ana-quintero',
    action: 'case_opened',
    object: 'CASO-2026-0143',
    result: { es: 'Abierto · asignado a R. Salcedo', en: 'Opened · assigned to R. Salcedo' },
    description: { es: 'Caso abierto a partir de las alertas ALR-2026-031 y ALR-2026-032.', en: 'Case opened from alerts ALR-2026-031 and ALR-2026-032.' },
  },
  {
    id: 'AUD-2026-0213',
    at: '2026-08-29T20:12:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-032',
    result: { es: 'Creada · advertencia', en: 'Created · warning' },
    description: { es: 'Incoherencia geográfica en TRZ-DEMO-7H2M-31LC.', en: 'Geographic inconsistency on TRZ-DEMO-7H2M-31LC.' },
  },
  {
    id: 'AUD-2026-0212',
    at: '2026-08-29T20:10:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-031',
    result: { es: 'Creada · advertencia', en: 'Created · warning' },
    description: { es: '14 verificaciones en 3 regiones para TRZ-DEMO-7H2M-31LC.', en: '14 verifications across 3 regions for TRZ-DEMO-7H2M-31LC.' },
  },
  {
    id: 'AUD-2026-0211',
    at: '2026-08-29T09:05:00Z',
    actorId: 'insp-salcedo',
    action: 'inspection_scheduled',
    object: 'INS-2026-011',
    result: { es: 'Programada para el 31 ago', en: 'Scheduled for 31 Aug' },
    description: { es: 'Inspección programada en Supermercado La Plaza (caso CASO-2026-0142).', en: 'Inspection scheduled at Supermercado La Plaza (case CASO-2026-0142).' },
  },
  {
    id: 'AUD-2026-0210',
    at: '2026-08-28T17:32:00Z',
    actorId: 'ana-quintero',
    action: 'alert_acknowledged',
    object: 'ALR-2026-030',
    result: { es: 'Reconocida', en: 'Acknowledged' },
    description: { es: 'Alerta de reporte reconocida y vinculada al caso CASO-2026-0142.', en: 'Report alert acknowledged and linked to case CASO-2026-0142.' },
  },
  {
    id: 'AUD-2026-0209',
    at: '2026-08-28T17:30:00Z',
    actorId: 'ana-quintero',
    action: 'case_opened',
    object: 'CASO-2026-0142',
    result: { es: 'Abierto · asignado a R. Salcedo', en: 'Opened · assigned to R. Salcedo' },
    description: { es: 'Caso abierto a partir del reporte RPT-2026-000418.', en: 'Case opened from report RPT-2026-000418.' },
  },
  {
    id: 'AUD-2026-0208',
    at: '2026-08-28T16:45:00Z',
    actorId: 'sys-rules',
    action: 'report_received',
    object: 'RPT-2026-000418',
    result: { es: 'Alerta ALR-2026-030 creada · crítica', en: 'Alert ALR-2026-030 created · critical' },
    description: { es: 'Reporte de discrepancia recibido desde la verificación pública (sello dañado).', en: 'Discrepancy report received from public verification (damaged seal).' },
  },
  {
    id: 'AUD-2026-0207',
    at: '2026-08-24T09:01:00Z',
    actorId: 'ana-quintero',
    action: 'alert_closed',
    object: 'ALR-2026-028',
    result: { es: 'Cerrada', en: 'Closed' },
    description: { es: 'Alerta cerrada al cerrarse el caso CASO-2026-0139.', en: 'Alert closed together with case CASO-2026-0139.' },
  },
  {
    id: 'AUD-2026-0206',
    at: '2026-08-24T09:00:00Z',
    actorId: 'sup-montiel',
    action: 'case_closed',
    object: 'CASO-2026-0139',
    result: { es: 'Cerrado · retiro confirmado', en: 'Closed · removal confirmed' },
    description: { es: 'Caso cerrado tras la inspección INS-2026-009.', en: 'Case closed after inspection INS-2026-009.' },
  },
  {
    id: 'AUD-2026-0205',
    at: '2026-08-23T12:05:00Z',
    actorId: 'insp-ibarra',
    action: 'inspection_completed',
    object: 'INS-2026-009',
    result: { es: '3 unidades retiradas', en: '3 units removed' },
    description: { es: 'Visita realizada en Bodega Del Valle; unidades del lote retiradas del anaquel.', en: 'Visit completed at Bodega Del Valle; lot units removed from the shelf.' },
  },
  {
    id: 'AUD-2026-0204',
    at: '2026-08-20T11:10:00Z',
    actorId: 'insp-ibarra',
    action: 'inspection_scheduled',
    object: 'INS-2026-009',
    result: { es: 'Programada para el 23 ago', en: 'Scheduled for 23 Aug' },
    description: { es: 'Inspección programada en Bodega Del Valle (caso CASO-2026-0139).', en: 'Inspection scheduled at Bodega Del Valle (case CASO-2026-0139).' },
  },
  {
    id: 'AUD-2026-0203',
    at: '2026-08-20T10:30:00Z',
    actorId: 'ana-quintero',
    action: 'case_opened',
    object: 'CASO-2026-0139',
    result: { es: 'Abierto · asignado a M. Ibarra', en: 'Opened · assigned to M. Ibarra' },
    description: { es: 'Caso abierto tras la revocación del lote LOTE-VS-26-009.', en: 'Case opened after the revocation of lot LOTE-VS-26-009.' },
  },
  {
    id: 'AUD-2026-0202',
    at: '2026-08-20T10:00:05Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-028',
    result: { es: 'Creada · crítica', en: 'Created · critical' },
    description: { es: 'Lote retirado: identificador TRZ-DEMO-5R9C-77MQ marcado como revocado.', en: 'Lot withdrawn: identifier TRZ-DEMO-5R9C-77MQ marked as revoked.' },
  },
  {
    id: 'AUD-2026-0201',
    at: '2026-08-20T10:00:00Z',
    actorId: 'issuer-cerro-alto',
    action: 'lot_revoked',
    object: 'LOTE-VS-26-009',
    result: { es: 'Publicada (RET-2026-004)', en: 'Published (RET-2026-004)' },
    description: { es: 'Revocación de lote publicada en el registro por el emisor.', en: 'Lot revocation published in the registry by the issuer.' },
  },
  {
    id: 'AUD-2026-0188',
    at: '2026-07-22T17:30:00Z',
    actorId: 'sys-rules',
    action: 'alert_closed',
    object: 'ALR-2026-026',
    result: { es: 'Cerrada automáticamente', en: 'Closed automatically' },
    description: { es: 'Evento de recepción en comercio recibido; cadena completa.', en: 'Retail receipt event received; chain complete.' },
  },
  {
    id: 'AUD-2026-0187',
    at: '2026-07-22T11:05:00Z',
    actorId: 'sys-rules',
    action: 'alert_created',
    object: 'ALR-2026-026',
    result: { es: 'Creada · informativa', en: 'Created · info' },
    description: { es: 'Recepción en comercio fuera del umbral de 24 h para TRZ-DEMO-4K7Q-92FA.', en: 'Retail receipt outside the 24 h threshold for TRZ-DEMO-4K7Q-92FA.' },
  },
];

/* ------------------------------------------------------------------ */
/* KPIs simulados                                                      */
/* ------------------------------------------------------------------ */

/** Valores fijos y pequeños del periodo simulado; los contadores de alertas y casos se derivan de los fixtures. */
export const KPI_BASE = {
  unitsRegistered: 1284,
  verificationsPeriod: 312,
} as const;

export function computeKpis(alerts: readonly Pick<InstitutionalAlert, 'status'>[], cases: readonly Pick<InstitutionalCase, 'status'>[]): InstitutionalKpis {
  return {
    unitsRegistered: KPI_BASE.unitsRegistered,
    verificationsPeriod: KPI_BASE.verificationsPeriod,
    alertsOpen: alerts.filter((a) => a.status === 'open').length,
    casesInProgress: cases.filter((c) => c.status !== 'closed').length,
  };
}

export const KPIS: InstitutionalKpis = computeKpis(ALERTS, CASES);

/** Conteo de alertas por tipo (para la barra sencilla del resumen). */
export function countAlertsByType(alerts: readonly Pick<InstitutionalAlert, 'type'>[]): Record<AlertType, number> {
  const counts = Object.fromEntries(ALERT_TYPES.map((t) => [t, 0])) as Record<AlertType, number>;
  for (const a of alerts) counts[a.type] += 1;
  return counts;
}

/* ------------------------------------------------------------------ */
/* Utilidades de visibilidad por rol (compartidas por servidor e isla) */
/* ------------------------------------------------------------------ */

export function alertAssignedTo(alert: Pick<InstitutionalAlert, 'assignedTo' | 'caseId'>, caseById: (id: string) => InstitutionalCase | undefined): string | undefined {
  if (alert.assignedTo) return alert.assignedTo;
  if (alert.caseId) return caseById(alert.caseId)?.inspectorId;
  return undefined;
}
