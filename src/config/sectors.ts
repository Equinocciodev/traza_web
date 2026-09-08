/**
 * Sectores de ejemplo para explicar la adaptabilidad multisector.
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

export const SECTORS: Sector[] = [
  {
    id: 'beverages-food',
    name: { es: 'Bebidas y alimentos', en: 'Beverages and food' },
    icon: 'bottle',
    configurable: {
      es: ['Presentación y lote', 'Eventos de aduana y comercio', 'Reglas de duplicado por región'],
      en: ['Presentation and lot', 'Customs and retail events', 'Duplicate rules per region'],
    },
  },
  {
    id: 'pharma',
    name: { es: 'Farmacéutico', en: 'Pharmaceutical' },
    icon: 'shield',
    configurable: {
      es: ['Lote y vencimiento', 'Cadena de custodia', 'Reglas de retiro de lote'],
      en: ['Lot and expiry', 'Chain of custody', 'Lot withdrawal rules'],
    },
  },
  {
    id: 'agro',
    name: { es: 'Agroindustria', en: 'Agribusiness' },
    icon: 'box',
    configurable: {
      es: ['Origen y cosecha', 'Lote de acopio y vencimiento', 'Estado del identificador'],
      en: ['Origin and harvest', 'Collection lot and expiry', 'Identifier status'],
    },
  },
  {
    id: 'parts',
    name: { es: 'Repuestos y partes', en: 'Spare parts' },
    icon: 'settings',
    configurable: {
      es: ['Número de serie', 'Importación y distribución', 'Reglas de garantía'],
      en: ['Serial number', 'Import and distribution', 'Warranty rules'],
    },
  },
  {
    id: 'consumer-goods',
    name: { es: 'Bienes de consumo', en: 'Consumer goods' },
    icon: 'store',
    configurable: {
      es: ['Presentación y campaña', 'Comercio y verificación', 'Reporte de discrepancias'],
      en: ['Presentation and campaign', 'Retail and verification', 'Discrepancy reporting'],
    },
  },
  {
    id: 'documents',
    name: { es: 'Documentos y certificados', en: 'Documents and certificates' },
    icon: 'document',
    configurable: {
      es: ['Emisor y vigencia', 'Estado en registro', 'Revocación'],
      en: ['Issuer and validity', 'Registry status', 'Revocation'],
    },
  },
];
