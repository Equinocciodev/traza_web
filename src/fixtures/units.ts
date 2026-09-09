/**
 * Unidades de ejemplo del registro: marcas, organizaciones, lugares, lotes y personas.
 * Las fechas son de 2026. Ningún dato corresponde a productos, empresas o registros reales.
 */
import type { Unit, UnitEvent, Place } from './types';

const PLACES = {
  plantValleSereno: { site: 'Planta Valle Sereno', region: 'Región Centro' },
  customsPuertoClaro: { site: 'Aduana de Puerto Claro', region: 'Región Costa' },
  labelingPuertoClaro: { site: 'Centro de etiquetado Puerto Claro', region: 'Región Costa' },
  hubSierraVerde: { site: 'Centro de distribución Sierra Verde', region: 'Región Norte' },
  storeElFaro: { site: 'Farmacia El Faro', region: 'Región Norte' },
  storeLaPlaza: { site: 'Farmacia La Plaza', region: 'Región Centro' },
  storeDelValle: { site: 'Farmacia Del Valle', region: 'Región Sur' },
  laboratorioMonteAzul: { site: 'Planta Monte Azul', region: 'Región Montaña' },
  hubPuertoClaro: { site: 'Centro de distribución Puerto Claro', region: 'Región Costa' },
  marketSanMarcelo: { site: 'Farmacia San Marcelo', region: 'Región Costa' },
} satisfies Record<string, Place>;

const ORGS = {
  cerroAltoLab: 'Laboratorio Cerro Alto',
  importer: 'Importadora Bahía Norte',
  labeler: 'Servicios de Etiquetado Puerto Claro',
  carrier: 'Transportes Ruta Andina',
  hub: 'Distribuidora Sierra Verde',
  storeFaro: 'Farmacia El Faro',
  storePlaza: 'Farmacia La Plaza',
  storeValle: 'Farmacia Del Valle',
  monteAzulLab: 'Laboratorio Monte Azul',
  inspection: 'Inspección de campo del piloto',
  consumer: 'Verificación pública (persona anónima)',
};

const ORAL_SOLUTION: Unit['product'] = {
  name: 'Solución oral Cerro Alto',
  presentation: 'Frasco 120 ml · 10 mg/ml',
  dosageForm: { es: 'Solución oral', en: 'Oral solution' },
  concentration: '10 mg/ml · EJEMPLO',
  healthRegistration: 'RS-EJEMPLO',
  category: { es: 'Medicamentos · solución oral', en: 'Medicines · oral solution' },
  brand: 'Cerro Alto',
};

const IMPORTED_SOLUTION: Unit['product'] = {
  name: 'Solución oral Bahía Norte',
  presentation: 'Frasco 120 ml · 10 mg/ml',
  dosageForm: { es: 'Solución oral', en: 'Oral solution' },
  concentration: '10 mg/ml · EJEMPLO',
  healthRegistration: 'RS-EJEMPLO',
  category: { es: 'Medicamentos · solución oral importada', en: 'Medicines · imported oral solution' },
  brand: 'Bahía Norte',
};

const MASTER_SOLUTION: Unit['product'] = {
  name: 'Solución oral Monte Azul',
  presentation: 'Frasco 120 ml · 10 mg/ml',
  dosageForm: { es: 'Solución oral', en: 'Oral solution' },
  concentration: '10 mg/ml · EJEMPLO',
  healthRegistration: 'RS-EJEMPLO',
  category: { es: 'Medicamentos · solución oral', en: 'Medicines · oral solution' },
  brand: 'Monte Azul',
};

/**
 * Ciclo de vida de una unidad de producción nacional.
 *
 * Los eventos son los que el registro conoce: emisión, etiquetado, prueba de imprenta,
 * cierre de la ficha del lote (que es lo que activa los códigos) y consultas públicas.
 * No hay eventos de transporte ni de distribución: la plataforma no los registra.
 */
function domesticLifecycle(
  prefix: string,
  startDay: number,
  opts: { store: Place; storeOrg: string; withLookup: boolean; stopAfter?: number },
): UnitEvent[] {
  const d = (day: number, hour: number) => new Date(Date.UTC(2026, 6, day, hour, 0, 0)).toISOString(); // julio 2026
  const lot = `LOTE-VS-26-${String(startDay).padStart(3, '0')}`;
  const events: UnitEvent[] = [
    {
      id: `${prefix}-01`,
      kind: 'identity_issued',
      stage: 'issuance',
      at: d(startDay, 13),
      actor: ORGS.cerroAltoLab,
      place: PLACES.plantValleSereno,
      ref: lot,
      note: {
        es: 'Identificador derivado y firmado para la unidad, dentro de la orden solicitada.',
        en: 'Identifier derived and signed for the unit, within the order that was requested.',
      },
    },
    {
      id: `${prefix}-02`,
      kind: 'sample_approved',
      stage: 'labeling',
      at: d(startDay, 15),
      actor: ORGS.cerroAltoLab,
      place: PLACES.plantValleSereno,
      note: {
        es: 'Prueba de imprenta aprobada: el código se decodifica y la zona quieta y el contraste cumplen.',
        en: 'Press proof approved: the code decodes, and quiet zone and contrast pass.',
      },
    },
    {
      id: `${prefix}-03`,
      kind: 'labeled',
      stage: 'labeling',
      at: d(startDay, 16),
      actor: ORGS.cerroAltoLab,
      place: PLACES.plantValleSereno,
      note: { es: 'Etiqueta con el código aplicada en la línea de envasado.', en: 'Coded label applied on the packaging line.' },
    },
    {
      id: `${prefix}-04`,
      kind: 'record_completed',
      stage: 'activation',
      at: d(startDay + 1, 10),
      actor: ORGS.cerroAltoLab,
      place: PLACES.plantValleSereno,
      ref: lot,
      note: {
        es: 'Ficha del lote completada al cerrar la corrida: lote y fecha de vencimiento.',
        en: 'Lot record completed when the run closed: lot and expiry date.',
      },
    },
    {
      id: `${prefix}-05`,
      kind: 'activated',
      stage: 'activation',
      at: d(startDay + 1, 10),
      actor: ORGS.cerroAltoLab,
      place: PLACES.plantValleSereno,
      note: {
        es: 'Rango activado por límites escaneados: se leyó la primera y la última unidad de la corrida.',
        en: 'Range activated by scanned bounds: the first and last unit of the run were read.',
      },
    },
  ];
  if (opts.withLookup) {
    events.push({
      id: `${prefix}-06`,
      kind: 'verified',
      stage: 'lookup',
      at: new Date(Date.UTC(2026, 7, startDay + 14, 17, 25, 0)).toISOString(), // agosto 2026
      actor: ORGS.consumer,
      place: opts.store,
      note: {
        es: 'Primera consulta pública, desde un teléfono y sin cuenta.',
        en: 'First public lookup, from a phone and with no account.',
      },
    });
  }
  return opts.stopAfter ? events.slice(0, opts.stopAfter) : events;
}

/**
 * Ciclo de vida de una unidad importada: el identificador se emite al declarar la importación
 * y el etiquetado ocurre en un centro de destino.
 */
function importedLifecycle(prefix: string, startDay: number, upTo: number): UnitEvent[] {
  const d = (day: number, hour: number) => new Date(Date.UTC(2026, 7, day, hour, 0, 0)).toISOString(); // agosto 2026
  const all: UnitEvent[] = [
    {
      id: `${prefix}-01`,
      kind: 'import_declared',
      stage: 'issuance',
      at: d(startDay, 10),
      actor: ORGS.importer,
      place: PLACES.customsPuertoClaro,
      ref: `DECL-PC-26-${startDay}732`,
      note: { es: 'Importación declarada por el importador.', en: 'Import declared by the importer.' },
    },
    {
      id: `${prefix}-02`,
      kind: 'identity_issued',
      stage: 'issuance',
      at: d(startDay, 12),
      actor: ORGS.importer,
      place: PLACES.customsPuertoClaro,
      note: {
        es: 'Identificador derivado y firmado para la unidad declarada.',
        en: 'Identifier derived and signed for the declared unit.',
      },
    },
    {
      id: `${prefix}-03`,
      kind: 'labeled',
      stage: 'labeling',
      at: d(startDay + 1, 9),
      actor: ORGS.labeler,
      place: PLACES.labelingPuertoClaro,
      note: { es: 'Etiquetado en centro autorizado de destino.', en: 'Labelled at an authorised destination centre.' },
    },
    {
      id: `${prefix}-04`,
      kind: 'record_completed',
      stage: 'activation',
      at: d(startDay + 2, 11),
      actor: ORGS.importer,
      place: PLACES.labelingPuertoClaro,
      note: {
        es: 'Ficha completada con lote y vencimiento de la producto acondicionado.',
        en: 'Record completed with the lot and expiry of the packaged product.',
      },
    },
    {
      id: `${prefix}-05`,
      kind: 'activated',
      stage: 'activation',
      at: d(startDay + 2, 11),
      actor: ORGS.importer,
      place: PLACES.labelingPuertoClaro,
      note: { es: 'Códigos del rango activados.', en: 'Codes in the range activated.' },
    },
    {
      id: `${prefix}-06`,
      kind: 'verified',
      stage: 'lookup',
      at: d(startDay + 9, 10),
      actor: ORGS.consumer,
      place: PLACES.storeLaPlaza,
      note: { es: 'Primera consulta pública registrada.', en: 'First public lookup recorded.' },
    },
    {
      id: `${prefix}-07`,
      kind: 'looked_up',
      stage: 'signals',
      at: d(startDay + 12, 16),
      actor: ORGS.consumer,
      place: PLACES.storeLaPlaza,
      note: { es: 'Consulta posterior: suma contexto al historial del identificador.', en: 'Later lookup: adds context to the identifier’s history.' },
    },
  ];
  return all.slice(0, upTo);
}

export const UNITS: Unit[] = [
  // 1 · Válida: firma emitida, registro activo, datos coinciden, sin anomalías.
  {
    code: 'TRZ-7F2K-4K7Q-92FA',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-012', producedAt: '2026-07-12' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-12T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'active', registeredAt: '2026-07-12T13:00:04Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-08-26T17:25:00Z' },
    currentStage: 'lookup',
    lastLookupPlace: PLACES.storeElFaro,
    events: domesticLifecycle('U1', 12, { store: PLACES.storeElFaro, storeOrg: ORGS.storeFaro, withLookup: true }),
  },
  // 2 · Advertencia: duplicado — el mismo código escaneado muchas veces en regiones distintas.
  {
    code: 'TRZ-7F2K-7H2M-31LC',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-012', producedAt: '2026-07-12' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-12T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'active', registeredAt: '2026-07-12T13:00:05Z' },
    dataMatch: 'match',
    anomalies: [
      {
        code: 'duplicate_scans',
        severity: 'warning',
        detectedAt: '2026-08-29T20:10:00Z',
        detail: {
          es: 'Este código se ha verificado 14 veces en 3 regiones distintas durante las últimas 48 horas. Un mismo frasco no suele moverse así.',
          en: 'This code has been verified 14 times across 3 regions in the last 48 hours. A single bottle does not usually move like that.',
        },
      },
      {
        code: 'geo_inconsistent',
        severity: 'warning',
        detectedAt: '2026-08-29T20:10:00Z',
        detail: {
          es: 'Las verificaciones provienen de regiones distintas a la del lugar de la primera consulta registrada.',
          en: 'Verifications come from regions other than the first recorded lookup location.',
        },
      },
    ],
    scans: { total: 14, distinctRegions: 3, lastAt: '2026-08-29T20:10:00Z' },
    currentStage: 'signals',
    lastLookupPlace: PLACES.storeElFaro,
    events: [
      ...domesticLifecycle('U2', 12, { store: PLACES.storeElFaro, storeOrg: ORGS.storeFaro, withLookup: true }),
      {
        id: 'U2-07',
        kind: 'anomaly_flagged',
        stage: 'signals',
        at: '2026-08-29T20:10:00Z',
        actor: 'Motor de reglas',
        place: PLACES.storeElFaro,
        note: {
          es: 'Señal abierta: el mismo identificador se consulta desde regiones que una sola unidad no puede recorrer en ese tiempo.',
          en: 'Signal raised: the same identifier is being looked up from regions a single unit cannot travel between in that time.',
        },
      },
    ],
  },
  // 3 · Advertencia: coincidencia parcial — la presentación impresa no coincide con el registro.
  {
    code: 'TRZ-7F2K-9P4T-55RD',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-015', producedAt: '2026-07-15' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-15T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'active', registeredAt: '2026-07-15T13:00:03Z' },
    dataMatch: 'partial',
    dataMatchDetail: {
      es: 'La etiqueta escaneada indica "150 ml"; el registro indica "120 ml" para este identificador.',
      en: 'The scanned label reads "150 ml"; the registry lists "120 ml" for this identifier.',
    },
    anomalies: [],
    scans: { total: 2, distinctRegions: 1, lastAt: '2026-08-30T11:02:00Z' },
    currentStage: 'activation',
    events: domesticLifecycle('U3', 15, { store: PLACES.storeLaPlaza, storeOrg: ORGS.storePlaza, withLookup: false }),
  },
  // 4 · Inválida: firma no válida (el contenido del código no corresponde a la firma).
  {
    code: 'TRZ-7F2K-2B8X-40NE',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-012', producedAt: '2026-07-12' },
    signature: { status: 'invalid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-12T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'not_checked' },
    dataMatch: 'not_checked',
    anomalies: [],
    scans: { total: 3, distinctRegions: 1, lastAt: '2026-08-31T09:40:00Z' },
    currentStage: 'issuance',
    events: [],
  },
  // 5 · Inválida: no reconocida — la firma es sintácticamente válida pero el registro no la conoce.
  {
    code: 'TRZ-7F2K-6W3S-18KV',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-013', producedAt: '2026-07-13' },
    signature: { status: 'unknown_key', algorithm: 'ECDSA P-256', issuedAt: '2026-07-13T13:00:00Z', keyId: 'XX-2026-K99' },
    registry: { status: 'not_found' },
    dataMatch: 'not_checked',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-09-01T14:12:00Z' },
    currentStage: 'issuance',
    events: [],
  },
  // 6 · Revocada: lote retirado por el emisor.
  {
    code: 'TRZ-7F2K-5R9C-77MQ',
    tenant: 'medicamentos',
    product: ORAL_SOLUTION,
    issuer: { name: ORGS.cerroAltoLab, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-009', producedAt: '2026-07-09' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-09T13:00:00Z', keyId: 'DCA-2026-K02' },
    registry: {
      status: 'revoked',
      registeredAt: '2026-07-09T13:00:03Z',
      revokedAt: '2026-08-20T10:00:00Z',
      revokedReason: {
        es: 'Lote retirado por el emisor (LOTE-VS-26-009) tras una revisión interna de calidad.',
        en: 'Lot withdrawn by the issuer (LOTE-VS-26-009) after an internal quality review.',
      },
    },
    dataMatch: 'match',
    anomalies: [
      {
        code: 'lot_withdrawn',
        severity: 'critical',
        detectedAt: '2026-08-20T10:00:00Z',
        detail: { es: 'El lote completo fue marcado como retirado en el registro.', en: 'The whole lot was marked as withdrawn in the registry.' },
      },
    ],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-08-22T18:00:00Z' },
    currentStage: 'closure',
    events: [
      ...domesticLifecycle('U6', 9, { store: PLACES.storeDelValle, storeOrg: ORGS.storeValle, withLookup: false }),
      {
        id: 'U6-07',
        kind: 'revoked',
        stage: 'closure',
        at: '2026-08-20T10:00:00Z',
        actor: ORGS.cerroAltoLab,
        place: PLACES.plantValleSereno,
        ref: 'RET-2026-004',
        note: { es: 'Revocación de lote publicada en el registro.', en: 'Lot revocation published in the registry.' },
      },
    ],
  },
  // 7 · Anomalía crítica: reportada y con caso de inspección abierto.
  {
    code: 'TRZ-7F2K-3N6D-09ZB',
    tenant: 'medicamentos',
    product: IMPORTED_SOLUTION,
    issuer: { name: ORGS.importer, role: 'importer' },
    origin: { place: PLACES.customsPuertoClaro, lot: 'IMP-BN-26-031', producedAt: '2026-05-30' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-08-03T12:00:00Z', keyId: 'IBN-2026-K01' },
    registry: { status: 'active', registeredAt: '2026-08-03T12:00:02Z' },
    dataMatch: 'match',
    anomalies: [
      {
        code: 'reported',
        severity: 'critical',
        detectedAt: '2026-08-28T16:45:00Z',
        detail: {
          es: 'Existe un reporte de discrepancia abierto (RPT-2026-000418) por sello dañado; un caso de inspección está en curso.',
          en: 'There is an open discrepancy report (RPT-2026-000418) for a damaged seal; an inspection case is in progress.',
        },
      },
    ],
    scans: { total: 4, distinctRegions: 1, lastAt: '2026-08-28T16:40:00Z' },
    currentStage: 'signals',
    lastLookupPlace: PLACES.storeLaPlaza,
    events: [
      ...importedLifecycle('U7', 3, 7),
      {
        id: 'U7-08',
        kind: 'reported',
        stage: 'signals',
        at: '2026-08-28T16:45:00Z',
        actor: ORGS.consumer,
        place: PLACES.storeLaPlaza,
        ref: 'RPT-2026-000418',
        note: { es: 'Reporte de discrepancia: sello dañado.', en: 'Discrepancy report: damaged seal.' },
      },
      {
        id: 'U7-09',
        kind: 'inspected',
        stage: 'signals',
        at: '2026-08-31T09:30:00Z',
        actor: ORGS.inspection,
        place: PLACES.storeLaPlaza,
        ref: 'CASO-2026-0142',
        note: { es: 'Inspección de campo programada dentro del piloto.', en: 'Field inspection scheduled within the pilot.' },
      },
    ],
  },
  // 8 · Advertencia: consulta pública anterior a la activación de la unidad.
  {
    code: 'TRZ-7F2K-8L1F-63HW',
    tenant: 'medicamentos',
    product: IMPORTED_SOLUTION,
    issuer: { name: ORGS.importer, role: 'importer' },
    origin: { place: PLACES.customsPuertoClaro, lot: 'IMP-BN-26-034', producedAt: '2026-06-02' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-08-18T12:00:00Z', keyId: 'IBN-2026-K01' },
    registry: { status: 'active', registeredAt: '2026-08-18T12:00:02Z' },
    dataMatch: 'match',
    anomalies: [
      {
        code: 'pending_activation',
        severity: 'info',
        detectedAt: '2026-09-02T12:20:00Z',
        detail: {
          es: 'El identificador está emitido y etiquetado, pero su ficha aún no se ha cerrado: no está activado. Un código sin activar que aparece consultado en la calle es una señal de fuga, y por eso el resultado es «en revisión» y no «verificado».',
          en: 'The identifier is issued and labelled, but its record has not been closed yet: it is not activated. An unactivated code being looked up out in the world is a leak signal, which is why the result is “under review” and not “verified”.',
        },
      },
    ],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-09-02T12:20:00Z' },
    currentStage: 'labeling',
    events: importedLifecycle('U8', 18, 3),
  },
  // 9 · Suspendida: registro en revisión (advertencia).
  {
    code: 'TRZ-7F2K-1V5J-26PT',
    tenant: 'medicamentos',
    product: IMPORTED_SOLUTION,
    issuer: { name: ORGS.importer, role: 'importer' },
    origin: { place: PLACES.customsPuertoClaro, lot: 'IMP-BN-26-031', producedAt: '2026-05-30' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-08-03T12:00:00Z', keyId: 'IBN-2026-K01' },
    registry: { status: 'suspended', registeredAt: '2026-08-03T12:00:02Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 2, distinctRegions: 1, lastAt: '2026-09-01T10:05:00Z' },
    currentStage: 'lookup',
    lastLookupPlace: PLACES.storeLaPlaza,
    events: importedLifecycle('U9', 3, 6),
  },
  // 10 · Válida en el tenant maestro: medicamento de otro registro.
  {
    code: 'TRZ-7F2K-6C2A-84MZ',
    tenant: 'traza',
    product: MASTER_SOLUTION,
    issuer: { name: ORGS.monteAzulLab, role: 'manufacturer' },
    origin: { place: PLACES.laboratorioMonteAzul, lot: 'COS-MA-26-07', producedAt: '2026-06-20' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-06-21T14:00:00Z', keyId: 'CMA-2026-K01' },
    registry: { status: 'active', registeredAt: '2026-06-21T14:00:02Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-08-15T09:12:00Z' },
    currentStage: 'lookup',
    lastLookupPlace: PLACES.marketSanMarcelo,
    events: [
      {
        id: 'U10-01',
        kind: 'identity_issued',
        stage: 'issuance',
        at: '2026-06-21T14:00:00Z',
        actor: ORGS.monteAzulLab,
        place: PLACES.laboratorioMonteAzul,
        ref: 'COS-MA-26-07',
        note: { es: 'Identificador emitido para la unidad, dentro de la orden del laboratorio.', en: 'Identifier issued for the unit, within the laboratory’s order.' },
      },
      { id: 'U10-02', kind: 'labeled', stage: 'labeling', at: '2026-06-21T16:00:00Z', actor: ORGS.monteAzulLab, place: PLACES.laboratorioMonteAzul },
      {
        id: 'U10-03',
        kind: 'record_completed',
        stage: 'activation',
        at: '2026-06-22T09:00:00Z',
        actor: ORGS.monteAzulLab,
        place: PLACES.laboratorioMonteAzul,
        ref: 'COS-MA-26-07',
        note: { es: 'Ficha completada con el lote de producción y la fecha de vencimiento.', en: 'Record completed with the production lot and expiry date.' },
      },
      { id: 'U10-04', kind: 'activated', stage: 'activation', at: '2026-06-22T09:00:00Z', actor: ORGS.monteAzulLab, place: PLACES.laboratorioMonteAzul },
      { id: 'U10-05', kind: 'verified', stage: 'lookup', at: '2026-08-15T09:12:00Z', actor: ORGS.consumer, place: PLACES.marketSanMarcelo },
    ],
  },
];

export const UNIT_BY_CODE: ReadonlyMap<string, Unit> = new Map(UNITS.map((u) => [u.code, u]));

/** Unidad de referencia para el hero, el recorrido y los ejemplos. */
export const FEATURED_UNIT_CODE = 'TRZ-7F2K-4K7Q-92FA';

export const ORGANIZATIONS = ORGS;
export const PLACE_INDEX = PLACES;
