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
  storeElFaro: { site: 'Licorería El Faro', region: 'Región Norte' },
  storeLaPlaza: { site: 'Supermercado La Plaza', region: 'Región Centro' },
  storeDelValle: { site: 'Bodega Del Valle', region: 'Región Sur' },
  cafeMonteAzul: { site: 'Beneficio Monte Azul', region: 'Región Montaña' },
  hubPuertoClaro: { site: 'Centro de distribución Puerto Claro', region: 'Región Costa' },
  marketSanMarcelo: { site: 'Mercado San Marcelo', region: 'Región Costa' },
} satisfies Record<string, Place>;

const ORGS = {
  distillery: 'Destilería Cerro Alto',
  importer: 'Importadora Bahía Norte',
  labeler: 'Servicios de Etiquetado Puerto Claro',
  carrier: 'Transportes Ruta Andina',
  hub: 'Distribuidora Sierra Verde',
  storeFaro: 'Licorería El Faro',
  storePlaza: 'Supermercado La Plaza',
  storeValle: 'Bodega Del Valle',
  coffee: 'Cafetalera Monte Azul',
  inspection: 'Inspección de campo del piloto',
  consumer: 'Verificación pública (persona anónima)',
};

const RON: Unit['product'] = {
  name: 'Ron Añejo Cerro Alto 7 años',
  presentation: 'Botella 750 ml · 40 % vol.',
  category: { es: 'Bebidas alcohólicas · ron', en: 'Alcoholic beverages · rum' },
  brand: 'Cerro Alto',
};

const WHISKY: Unit['product'] = {
  name: 'Whisky Bahía Norte Reserva',
  presentation: 'Botella 700 ml · 40 % vol.',
  category: { es: 'Bebidas alcohólicas · whisky importado', en: 'Alcoholic beverages · imported whisky' },
  brand: 'Bahía Norte',
};

const CAFE: Unit['product'] = {
  name: 'Café Monte Azul · tueste medio',
  presentation: 'Bolsa 500 g · grano entero',
  category: { es: 'Alimentos · café', en: 'Food · coffee' },
  brand: 'Monte Azul',
};

/** Recorrido completo de una unidad de producción nacional ficticia. */
function domesticJourney(prefix: string, startDay: number, opts: { store: Place; storeOrg: string; withVerification: boolean }): UnitEvent[] {
  const d = (day: number, hour: number) => new Date(Date.UTC(2026, 6, day, hour, 0, 0)).toISOString(); // julio 2026
  const events: UnitEvent[] = [
    {
      id: `${prefix}-01`,
      kind: 'identity_issued',
      stage: 'origin',
      at: d(startDay, 13),
      actor: ORGS.distillery,
      place: PLACES.plantValleSereno,
      ref: `LOTE-VS-26-${String(startDay).padStart(3, '0')}`,
      note: { es: 'Identidad digital emitida y firmada por el fabricante.', en: 'Digital identity issued and signed by the manufacturer.' },
    },
    {
      id: `${prefix}-02`,
      kind: 'labeled',
      stage: 'labeling',
      at: d(startDay, 16),
      actor: ORGS.distillery,
      place: PLACES.plantValleSereno,
      note: { es: 'Etiqueta con código aplicada en línea de envasado.', en: 'Coded label applied on the bottling line.' },
    },
    {
      id: `${prefix}-03`,
      kind: 'shipped',
      stage: 'transport',
      at: d(startDay + 2, 9),
      actor: ORGS.carrier,
      place: PLACES.plantValleSereno,
      ref: `GUIA-RA-${startDay + 2}0417`,
      note: { es: 'Despacho hacia centro de distribución.', en: 'Dispatched to distribution center.' },
    },
    {
      id: `${prefix}-04`,
      kind: 'received',
      stage: 'distribution',
      at: d(startDay + 3, 15),
      actor: ORGS.hub,
      place: PLACES.hubSierraVerde,
      note: { es: 'Recepción y almacenamiento.', en: 'Received and stored.' },
    },
    {
      id: `${prefix}-05`,
      kind: 'dispatched',
      stage: 'distribution',
      at: d(startDay + 9, 8),
      actor: ORGS.hub,
      place: PLACES.hubSierraVerde,
      ref: `PED-SV-${startDay + 9}1188`,
      note: { es: 'Despacho a comercio.', en: 'Dispatched to retail.' },
    },
    {
      id: `${prefix}-06`,
      kind: 'received_commerce',
      stage: 'commerce',
      at: d(startDay + 10, 11),
      actor: opts.storeOrg,
      place: opts.store,
      note: { es: 'Recepción en punto de venta.', en: 'Received at point of sale.' },
    },
  ];
  if (opts.withVerification) {
    events.push({
      id: `${prefix}-07`,
      kind: 'verified',
      stage: 'verification',
      at: new Date(Date.UTC(2026, 7, startDay + 14, 17, 25, 0)).toISOString(), // agosto 2026
      actor: ORGS.consumer,
      place: opts.store,
      note: { es: 'Verificación pública desde un teléfono, sin cuenta.', en: 'Public verification from a phone, no account.' },
    });
  }
  return events;
}

/** Recorrido de una unidad importada ficticia (entra por aduana y se etiqueta en destino). */
function importedJourney(prefix: string, startDay: number, upTo: number): UnitEvent[] {
  const d = (day: number, hour: number) => new Date(Date.UTC(2026, 7, day, hour, 0, 0)).toISOString(); // agosto 2026
  const all: UnitEvent[] = [
    {
      id: `${prefix}-01`,
      kind: 'customs_cleared',
      stage: 'origin',
      at: d(startDay, 10),
      actor: ORGS.importer,
      place: PLACES.customsPuertoClaro,
      ref: `DECL-PC-26-${startDay}732`,
      note: { es: 'Ingreso por aduana declarado por el importador.', en: 'Customs entry declared by the importer.' },
    },
    {
      id: `${prefix}-02`,
      kind: 'identity_issued',
      stage: 'origin',
      at: d(startDay, 12),
      actor: ORGS.importer,
      place: PLACES.customsPuertoClaro,
      note: { es: 'Identidad digital emitida y firmada por el importador.', en: 'Digital identity issued and signed by the importer.' },
    },
    {
      id: `${prefix}-03`,
      kind: 'labeled',
      stage: 'labeling',
      at: d(startDay + 1, 9),
      actor: ORGS.labeler,
      place: PLACES.labelingPuertoClaro,
      note: { es: 'Etiquetado en centro autorizado de destino.', en: 'Labelled at an authorised destination center.' },
    },
    {
      id: `${prefix}-04`,
      kind: 'shipped',
      stage: 'transport',
      at: d(startDay + 2, 7),
      actor: ORGS.carrier,
      place: PLACES.labelingPuertoClaro,
      ref: `GUIA-RA-${startDay + 2}0921`,
    },
    {
      id: `${prefix}-05`,
      kind: 'received',
      stage: 'distribution',
      at: d(startDay + 3, 14),
      actor: ORGS.hub,
      place: PLACES.hubSierraVerde,
    },
    {
      id: `${prefix}-06`,
      kind: 'dispatched',
      stage: 'distribution',
      at: d(startDay + 6, 8),
      actor: ORGS.hub,
      place: PLACES.hubSierraVerde,
    },
    {
      id: `${prefix}-07`,
      kind: 'received_commerce',
      stage: 'commerce',
      at: d(startDay + 7, 10),
      actor: ORGS.storePlaza,
      place: PLACES.storeLaPlaza,
    },
  ];
  return all.slice(0, upTo);
}

export const UNITS: Unit[] = [
  // 1 · Válida: firma emitida, registro activo, datos coinciden, sin anomalías.
  {
    code: 'TRZ-7F2K-4K7Q-92FA',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-012', producedAt: '2026-07-12' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-12T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'active', registeredAt: '2026-07-12T13:00:04Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-08-26T17:25:00Z' },
    currentStage: 'commerce',
    destination: PLACES.storeElFaro,
    events: domesticJourney('U1', 12, { store: PLACES.storeElFaro, storeOrg: ORGS.storeFaro, withVerification: true }),
  },
  // 2 · Advertencia: duplicado — el mismo código escaneado muchas veces en regiones distintas.
  {
    code: 'TRZ-7F2K-7H2M-31LC',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
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
          es: 'Este código se ha verificado 14 veces en 3 regiones distintas durante las últimas 48 horas. Una misma botella no suele moverse así.',
          en: 'This code has been verified 14 times across 3 regions in the last 48 hours. A single bottle does not usually move like that.',
        },
      },
      {
        code: 'geo_inconsistent',
        severity: 'warning',
        detectedAt: '2026-08-29T20:10:00Z',
        detail: {
          es: 'Las verificaciones provienen de regiones distintas a la del comercio de destino registrado.',
          en: 'Verifications come from regions other than the registered destination retailer.',
        },
      },
    ],
    scans: { total: 14, distinctRegions: 3, lastAt: '2026-08-29T20:10:00Z' },
    currentStage: 'commerce',
    destination: PLACES.storeElFaro,
    events: domesticJourney('U2', 12, { store: PLACES.storeElFaro, storeOrg: ORGS.storeFaro, withVerification: true }),
  },
  // 3 · Advertencia: coincidencia parcial — la presentación impresa no coincide con el registro.
  {
    code: 'TRZ-7F2K-9P4T-55RD',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-015', producedAt: '2026-07-15' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-15T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'active', registeredAt: '2026-07-15T13:00:03Z' },
    dataMatch: 'partial',
    dataMatchDetail: {
      es: 'La etiqueta escaneada indica "1 L"; el registro indica "750 ml" para este identificador.',
      en: 'The scanned label reads "1 L"; the registry lists "750 ml" for this identifier.',
    },
    anomalies: [],
    scans: { total: 2, distinctRegions: 1, lastAt: '2026-08-30T11:02:00Z' },
    currentStage: 'commerce',
    destination: PLACES.storeLaPlaza,
    events: domesticJourney('U3', 15, { store: PLACES.storeLaPlaza, storeOrg: ORGS.storePlaza, withVerification: false }),
  },
  // 4 · Inválida: firma no válida (el contenido del código no corresponde a la firma).
  {
    code: 'TRZ-7F2K-2B8X-40NE',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-012', producedAt: '2026-07-12' },
    signature: { status: 'invalid', algorithm: 'ECDSA P-256', issuedAt: '2026-07-12T13:00:00Z', keyId: 'DCA-2026-K03' },
    registry: { status: 'not_checked' },
    dataMatch: 'not_checked',
    anomalies: [],
    scans: { total: 3, distinctRegions: 1, lastAt: '2026-08-31T09:40:00Z' },
    currentStage: 'commerce',
    events: [],
  },
  // 5 · Inválida: no reconocida — la firma es sintácticamente válida pero el registro no la conoce.
  {
    code: 'TRZ-7F2K-6W3S-18KV',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
    origin: { place: PLACES.plantValleSereno, lot: 'LOTE-VS-26-013', producedAt: '2026-07-13' },
    signature: { status: 'unknown_key', algorithm: 'ECDSA P-256', issuedAt: '2026-07-13T13:00:00Z', keyId: 'XX-2026-K99' },
    registry: { status: 'not_found' },
    dataMatch: 'not_checked',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-09-01T14:12:00Z' },
    currentStage: 'commerce',
    events: [],
  },
  // 6 · Revocada: lote retirado por el emisor.
  {
    code: 'TRZ-7F2K-5R9C-77MQ',
    tenant: 'licores',
    product: RON,
    issuer: { name: ORGS.distillery, role: 'manufacturer' },
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
    currentStage: 'commerce',
    destination: PLACES.storeDelValle,
    events: [
      ...domesticJourney('U6', 9, { store: PLACES.storeDelValle, storeOrg: ORGS.storeValle, withVerification: false }),
      {
        id: 'U6-07',
        kind: 'revoked',
        stage: 'verification',
        at: '2026-08-20T10:00:00Z',
        actor: ORGS.distillery,
        place: PLACES.plantValleSereno,
        ref: 'RET-2026-004',
        note: { es: 'Revocación de lote publicada en el registro.', en: 'Lot revocation published in the registry.' },
      },
    ],
  },
  // 7 · Anomalía crítica: reportada y con caso de inspección abierto.
  {
    code: 'TRZ-7F2K-3N6D-09ZB',
    tenant: 'licores',
    product: WHISKY,
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
    currentStage: 'commerce',
    destination: PLACES.storeLaPlaza,
    events: [
      ...importedJourney('U7', 3, 7),
      {
        id: 'U7-08',
        kind: 'reported',
        stage: 'verification',
        at: '2026-08-28T16:45:00Z',
        actor: ORGS.consumer,
        place: PLACES.storeLaPlaza,
        ref: 'RPT-2026-000418',
        note: { es: 'Reporte de discrepancia: sello dañado.', en: 'Discrepancy report: damaged seal.' },
      },
      {
        id: 'U7-09',
        kind: 'inspected',
        stage: 'verification',
        at: '2026-08-31T09:30:00Z',
        actor: ORGS.inspection,
        place: PLACES.storeLaPlaza,
        ref: 'CASO-2026-0142',
        note: { es: 'Inspección de campo programada dentro del piloto.', en: 'Field inspection scheduled within the pilot.' },
      },
    ],
  },
  // 8 · Advertencia: brecha de cadena — la unidad aún figura en distribución pero se verifica en comercio.
  {
    code: 'TRZ-7F2K-8L1F-63HW',
    tenant: 'licores',
    product: WHISKY,
    issuer: { name: ORGS.importer, role: 'importer' },
    origin: { place: PLACES.customsPuertoClaro, lot: 'IMP-BN-26-034', producedAt: '2026-06-02' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-08-18T12:00:00Z', keyId: 'IBN-2026-K01' },
    registry: { status: 'active', registeredAt: '2026-08-18T12:00:02Z' },
    dataMatch: 'match',
    anomalies: [
      {
        code: 'chain_gap',
        severity: 'info',
        detectedAt: '2026-09-02T12:20:00Z',
        detail: {
          es: 'El último evento registrado es la recepción en distribución; no consta despacho a comercio. Puede ser un retraso de registro.',
          en: 'The last recorded event is receipt at distribution; no dispatch to retail is on record. It may be a recording delay.',
        },
      },
    ],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-09-02T12:20:00Z' },
    currentStage: 'distribution',
    destination: PLACES.storeLaPlaza,
    events: importedJourney('U8', 18, 5),
  },
  // 9 · Suspendida: registro en revisión (advertencia).
  {
    code: 'TRZ-7F2K-1V5J-26PT',
    tenant: 'licores',
    product: WHISKY,
    issuer: { name: ORGS.importer, role: 'importer' },
    origin: { place: PLACES.customsPuertoClaro, lot: 'IMP-BN-26-031', producedAt: '2026-05-30' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-08-03T12:00:00Z', keyId: 'IBN-2026-K01' },
    registry: { status: 'suspended', registeredAt: '2026-08-03T12:00:02Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 2, distinctRegions: 1, lastAt: '2026-09-01T10:05:00Z' },
    currentStage: 'commerce',
    destination: PLACES.storeLaPlaza,
    events: importedJourney('U9', 3, 7),
  },
  // 10 · Válida en el tenant maestro (otro sector): café.
  {
    code: 'TRZ-7F2K-6C2A-84MZ',
    tenant: 'traza',
    product: CAFE,
    issuer: { name: ORGS.coffee, role: 'manufacturer' },
    origin: { place: PLACES.cafeMonteAzul, lot: 'COS-MA-26-07', producedAt: '2026-06-20' },
    signature: { status: 'valid', algorithm: 'ECDSA P-256', issuedAt: '2026-06-21T14:00:00Z', keyId: 'CMA-2026-K01' },
    registry: { status: 'active', registeredAt: '2026-06-21T14:00:02Z' },
    dataMatch: 'match',
    anomalies: [],
    scans: { total: 1, distinctRegions: 1, lastAt: '2026-08-15T09:12:00Z' },
    currentStage: 'commerce',
    destination: PLACES.marketSanMarcelo,
    events: [
      {
        id: 'U10-01',
        kind: 'identity_issued',
        stage: 'origin',
        at: '2026-06-21T14:00:00Z',
        actor: ORGS.coffee,
        place: PLACES.cafeMonteAzul,
        ref: 'COS-MA-26-07',
        note: { es: 'Identidad emitida por la cafetalera.', en: 'Identity issued by the coffee grower.' },
      },
      { id: 'U10-02', kind: 'labeled', stage: 'labeling', at: '2026-06-21T16:00:00Z', actor: ORGS.coffee, place: PLACES.cafeMonteAzul },
      { id: 'U10-03', kind: 'shipped', stage: 'transport', at: '2026-06-24T08:00:00Z', actor: ORGS.carrier, place: PLACES.cafeMonteAzul, ref: 'GUIA-RA-240633' },
      { id: 'U10-04', kind: 'received', stage: 'distribution', at: '2026-06-25T13:00:00Z', actor: ORGS.hub, place: PLACES.hubPuertoClaro },
      { id: 'U10-05', kind: 'dispatched', stage: 'distribution', at: '2026-07-01T08:00:00Z', actor: ORGS.hub, place: PLACES.hubPuertoClaro },
      { id: 'U10-06', kind: 'received_commerce', stage: 'commerce', at: '2026-07-02T10:30:00Z', actor: 'Mercado San Marcelo', place: PLACES.marketSanMarcelo },
      { id: 'U10-07', kind: 'verified', stage: 'verification', at: '2026-08-15T09:12:00Z', actor: ORGS.consumer, place: PLACES.marketSanMarcelo },
    ],
  },
];

export const UNIT_BY_CODE: ReadonlyMap<string, Unit> = new Map(UNITS.map((u) => [u.code, u]));

/** Unidad de referencia para el hero, el recorrido y los ejemplos. */
export const FEATURED_UNIT_CODE = 'TRZ-7F2K-4K7Q-92FA';

export const ORGANIZATIONS = ORGS;
export const PLACE_INDEX = PLACES;
