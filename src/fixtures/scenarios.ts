/**
 * Escenarios de verificación pública. Cada estado obligatorio del brief se reproduce
 * con un código de unidad, una condición de transporte o un permiso del dispositivo.
 */
import type { Scenario } from './types';

/** Códigos especiales que el adaptador de API interpreta como condiciones de transporte. */
export const TRANSPORT_CODES = {
  serverError: 'TRZ-7F2K-ERR5-0000',
  timeout: 'TRZ-7F2K-TIME-0000',
  offline: 'TRZ-7F2K-OFFL-0000',
} as const;

export const SCENARIOS: Scenario[] = [
  {
    id: 'valid',
    code: 'TRZ-7F2K-4K7Q-92FA',
    trigger: 'code',
    label: { es: 'Ejemplo sin alertas', en: 'Example without alerts' },
    description: {
      es: 'Firma válida, registro activo y coincidencia declarada. No comprueba el producto físico.',
      en: 'Valid signature, active record and declared match. This does not check the physical product.',
    },
  },
  {
    id: 'duplicate',
    code: 'TRZ-7F2K-7H2M-31LC',
    trigger: 'code',
    label: { es: 'Advertencia: duplicado', en: 'Warning: duplicate' },
    description: {
      es: 'El mismo código verificado muchas veces en regiones distintas.',
      en: 'The same code verified many times across different regions.',
    },
  },
  {
    id: 'partial_match',
    code: 'TRZ-7F2K-9P4T-55RD',
    trigger: 'code',
    label: { es: 'Advertencia: datos no coinciden del todo', en: 'Warning: data only partially matches' },
    description: {
      es: 'La presentación impresa no coincide con la registrada.',
      en: 'The printed presentation does not match the registered one.',
    },
  },
  {
    id: 'chain_gap',
    code: 'TRZ-7F2K-8L1F-63HW',
    trigger: 'code',
    label: { es: 'Advertencia: brecha en la cadena', en: 'Warning: chain gap' },
    description: {
      es: 'La unidad se verifica en comercio pero el registro no muestra despacho.',
      en: 'The unit is verified at retail but the registry shows no dispatch.',
    },
  },
  {
    id: 'suspended',
    code: 'TRZ-7F2K-1V5J-26PT',
    trigger: 'code',
    label: { es: 'Advertencia: registro en revisión', en: 'Warning: registry under review' },
    description: {
      es: 'El identificador está suspendido temporalmente en el registro.',
      en: 'The identifier is temporarily suspended in the registry.',
    },
  },
  {
    id: 'reported',
    code: 'TRZ-7F2K-3N6D-09ZB',
    trigger: 'code',
    label: { es: 'Anomalía: reporte y caso abiertos', en: 'Anomaly: open report and case' },
    description: {
      es: 'Existe un reporte de discrepancia y una inspección de campo en curso.',
      en: 'There is a discrepancy report and a field inspection in progress.',
    },
  },
  {
    id: 'signature_invalid',
    code: 'TRZ-7F2K-2B8X-40NE',
    trigger: 'code',
    label: { es: 'No válido: firma incorrecta', en: 'Invalid: wrong signature' },
    description: {
      es: 'El contenido del código no corresponde a la firma que lo acompaña.',
      en: 'The code contents do not correspond to the accompanying signature.',
    },
  },
  {
    id: 'not_registered',
    code: 'TRZ-7F2K-6W3S-18KV',
    trigger: 'code',
    label: { es: 'No válido: identidad no reconocida', en: 'Invalid: identity not recognised' },
    description: {
      es: 'La firma está bien formada pero el registro no conoce este identificador.',
      en: 'The signature is well-formed but the registry does not know this identifier.',
    },
  },
  {
    id: 'revoked',
    code: 'TRZ-7F2K-5R9C-77MQ',
    trigger: 'code',
    label: { es: 'Revocado: lote retirado', en: 'Revoked: lot withdrawn' },
    description: {
      es: 'El emisor retiró el lote y el registro lo marca como revocado.',
      en: 'The issuer withdrew the lot and the registry marks it as revoked.',
    },
  },
  {
    id: 'unknown_format',
    code: 'ABC-123',
    trigger: 'code',
    label: { es: 'No verificable: formato desconocido', en: 'Unverifiable: unknown format' },
    description: {
      es: 'El texto no tiene el formato de un identificador de Traza.',
      en: 'The text is not in the format of a Traza identifier.',
    },
  },
  {
    id: 'unreadable',
    trigger: 'device',
    label: { es: 'QR ilegible', en: 'Unreadable QR' },
    description: {
      es: 'La cámara no logra leer el código; se ofrece la entrada manual.',
      en: 'The camera cannot read the code; manual entry is offered.',
    },
  },
  {
    id: 'camera_denied',
    trigger: 'device',
    label: { es: 'Cámara denegada', en: 'Camera denied' },
    description: {
      es: 'El permiso de cámara fue denegado; se puede escribir el código.',
      en: 'Camera permission was denied; the code can be typed.',
    },
  },
  {
    id: 'camera_unavailable',
    trigger: 'device',
    label: { es: 'Cámara no disponible', en: 'Camera unavailable' },
    description: {
      es: 'El dispositivo no tiene cámara utilizable; se puede escribir el código.',
      en: 'The device has no usable camera; the code can be typed.',
    },
  },
  {
    id: 'offline',
    code: TRANSPORT_CODES.offline,
    trigger: 'transport',
    label: { es: 'Sin conexión', en: 'Offline' },
    description: {
      es: 'No hay red: el código queda listo para reintentar cuando vuelva la conexión.',
      en: 'No network: the code is kept ready to retry when the connection returns.',
    },
  },
  {
    id: 'server_error',
    code: TRANSPORT_CODES.serverError,
    trigger: 'transport',
    label: { es: 'Error del servidor', en: 'Server error' },
    description: {
      es: 'El registro respondió con un error; se puede reintentar.',
      en: 'The registry responded with an error; it can be retried.',
    },
  },
  {
    id: 'timeout',
    code: TRANSPORT_CODES.timeout,
    trigger: 'transport',
    label: { es: 'Tiempo de espera agotado', en: 'Timed out' },
    description: {
      es: 'El registro tardó demasiado en responder; se puede reintentar.',
      en: 'The registry took too long to respond; it can be retried.',
    },
  },
];

export const SCENARIO_BY_ID: ReadonlyMap<string, Scenario> = new Map(SCENARIOS.map((s) => [s.id, s]));
