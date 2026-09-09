/**
 * Actores de ejemplo del programa de medicamentos.
 * Solo describen cómo se configura la MISMA capa (identidad unitaria + eventos + verificación + reglas);
 * no afirman capacidades ni certificaciones sectoriales.
 */
import type { Locale } from '@/i18n';
import type { IconName } from '@/content/types';

export interface Sector {
  id: string;
  name: Record<Locale, string>;
  icon: IconName;
  /** Qué se configura por tenant en ese sector (campos, eventos, reglas). */
  configurable: Record<Locale, string[]>;
}

/** Roles del piloto de medicamentos, sin afirmar relaciones con organizaciones. */
export const SECTORS: Sector[] = [
  { id: 'manufacturers', name: { es: 'Fabricantes de medicamentos', en: 'Medicine manufacturers' }, icon: 'factory', configurable: { es: ['Producto y presentación', 'Lote y vencimiento', 'Emisión y activación'], en: ['Product and presentation', 'Lot and expiry', 'Issuance and activation'] } },
  { id: 'importers', name: { es: 'Importadores de medicamentos', en: 'Medicine importers' }, icon: 'box', configurable: { es: ['Importador responsable', 'Identidad de la unidad', 'Activación del registro'], en: ['Responsible importer', 'Unit identity', 'Record activation'] } },
  { id: 'pharmacies', name: { es: 'Farmacias', en: 'Pharmacies' }, icon: 'store', configurable: { es: ['Consulta pública', 'Comparación con el envase', 'Reporte de discrepancias'], en: ['Public lookup', 'Package comparison', 'Discrepancy reporting'] } },
  { id: 'healthcare', name: { es: 'Establecimientos de salud', en: 'Healthcare facilities' }, icon: 'shield', configurable: { es: ['Consulta de unidad', 'Lote y vencimiento', 'Contexto del registro'], en: ['Unit lookup', 'Lot and expiry', 'Record context'] } },
  { id: 'quality', name: { es: 'Equipos de calidad', en: 'Quality teams' }, icon: 'check', configurable: { es: ['Revisión de señales', 'Reportes de ejemplo', 'Cierre documentado'], en: ['Signal review', 'Example reports', 'Documented closure'] } },
  { id: 'health-authorities', name: { es: 'Autoridades sanitarias', en: 'Health authorities' }, icon: 'government', configurable: { es: ['Permisos acordados', 'Lectura para auditoría', 'Inspección del ejemplo'], en: ['Agreed permissions', 'Audit access', 'Example inspection'] } },
];
