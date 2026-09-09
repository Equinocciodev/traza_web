import type { Locale, RouteKey } from '@/i18n';
import type { IconName } from './types';
import { FEATURED_UNIT_CODE, UNIT_BY_CODE } from '@/fixtures/units';

export type MockTone = 'success' | 'warning' | 'info' | 'danger' | 'neutral';
export interface MockUiContent {
  exampleLabel: string;
  unit: { code: string; name: string; presentation: string; lot: string };
  dashboard: {
    title: string; context: string; navLabel: string; note: string;
    nav: { label: string; key: RouteKey; icon: IconName }[];
    kpis: { label: string; value: number; hint: string; trend?: number[] }[];
    chart: { title: string; description: string; series: { label: string; value: number }[] };
    integrity: { title: string; value: string; description: string };
    actionsTitle: string;
    actions: { title: string; body: string; label: string; key: RouteKey; icon: IconName }[];
  };
  phone: { title: string; intro: string; rows: { label: string; value: string }[]; codeLabel: string; cta: string; note: string };
  mini: {
    lotsTitle: string; lots: { label: string; status: string; tone: MockTone }[];
    nodesTitle: string; nodes: string[];
    sparklineTitle: string; kvTitle: string; kv: { label: string; value: string }[];
  };
}

const featured = UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!;
const unit = { code: featured.code, name: featured.product.name, presentation: featured.product.presentation, lot: featured.origin.lot };

/** Contenido ilustrativo: cifras pequeñas, sin métricas de clientes ni escala comercial. */
export const MOCK_UI: Record<Locale, MockUiContent> = {
  es: {
    exampleLabel: 'Ejemplo · Datos ilustrativos', unit,
    dashboard: {
      title: 'Espacio de trabajo', context: 'Ejemplo · Operación farmacéutica', navLabel: 'Explorar la plataforma',
      note: 'Vista ilustrativa. Los enlaces abren las secciones de esta web; las cifras no describen una operación real.',
      nav: [
        { label: 'Resumen', key: 'platform', icon: 'chart' },
        { label: 'Identidades', key: 'verify', icon: 'fingerprint' },
        { label: 'Etiquetas', key: 'codeSpec', icon: 'label' },
        { label: 'Señales', key: 'institutional', icon: 'flag' },
        { label: 'Informes', key: 'integration', icon: 'document' },
      ],
      kpis: [{ label: 'Lotes activos', value: 8, hint: 'Identidades activadas', trend: [2, 3, 3, 5, 6, 7, 8] }, { label: 'Señales abiertas', value: 3, hint: 'Pendientes de revisión' }, { label: 'Consultas hoy', value: 42, hint: 'Lecturas del registro' }],
      chart: {
        title: 'Consultas de la semana', description: 'Consultas ilustrativas por día; no son mediciones de uso.',
        series: [{ label: 'Lun', value: 8 }, { label: 'Mar', value: 10 }, { label: 'Mié', value: 24 }, { label: 'Jue', value: 20 }, { label: 'Vie', value: 36 }, { label: 'Sáb', value: 31 }, { label: 'Dom', value: 42 }],
      },
      integrity: { title: 'Integridad de eventos', value: 'Alta', description: 'Estado cualitativo de ejemplo. Cada señal debe revisarse por separado.' },
      actionsTitle: 'Siguientes acciones',
      actions: [
        { title: 'Revisar señales', body: 'Consultar las alertas del registro de ejemplo.', label: 'Abrir señales', key: 'institutional', icon: 'flag' },
        { title: 'Contrastar una unidad', body: 'Comparar la ficha con la etiqueta del medicamento.', label: 'Verificar unidad', key: 'verify', icon: 'scan' },
      ],
    },
    phone: {
      title: 'Registro encontrado', intro: 'Compara esta información con la etiqueta del producto.', codeLabel: 'Identificador de unidad', cta: 'Verificar esta unidad',
      rows: [{ label: 'Producto', value: 'Solución oral Cerro Alto' }, { label: 'Presentación', value: 'Frasco 120 ml · 10 mg/ml' }, { label: 'Lote', value: unit.lot }, { label: 'Estado', value: 'Identificador activado' }],
      note: 'Encontrar el registro no certifica el contenido del envase. Revisa las señales y compara la unidad física.',
    },
    mini: {
      lotsTitle: 'Lotes de ejemplo', lots: [{ label: unit.lot, status: 'Activado', tone: 'success' }, { label: 'LOTE-VS-26-015', status: 'En revisión', tone: 'warning' }, { label: 'LOTE-VS-26-013', status: 'Emitido', tone: 'info' }],
      nodesTitle: 'Desde la producción', nodes: ['Identidad', 'Etiquetado', 'Activación'], sparklineTitle: 'Consultas de la semana', kvTitle: 'Ficha de la unidad',
      kv: [{ label: 'Producto', value: 'Solución oral' }, { label: 'Contenido', value: '120 ml' }, { label: 'Lote', value: unit.lot }],
    },
  },
  en: {
    exampleLabel: 'Example · Illustrative data', unit: { ...unit, name: 'Cerro Alto oral solution', presentation: '120 ml bottle · 10 mg/ml' },
    dashboard: {
      title: 'Workspace', context: 'Example · Pharmaceutical operations', navLabel: 'Explore the platform',
      note: 'Illustrative view. Links open sections of this website; the figures do not describe a live operation.',
      nav: [
        { label: 'Overview', key: 'platform', icon: 'chart' },
        { label: 'Identities', key: 'verify', icon: 'fingerprint' },
        { label: 'Labels', key: 'codeSpec', icon: 'label' },
        { label: 'Signals', key: 'institutional', icon: 'flag' },
        { label: 'Reports', key: 'integration', icon: 'document' },
      ],
      kpis: [{ label: 'Active lots', value: 8, hint: 'Activated identities', trend: [2, 3, 3, 5, 6, 7, 8] }, { label: 'Open signals', value: 3, hint: 'Awaiting review' }, { label: 'Lookups today', value: 42, hint: 'Registry lookups' }],
      chart: {
        title: 'Weekly lookups', description: 'Illustrative daily lookups; these are not usage measurements.',
        series: [{ label: 'Mon', value: 8 }, { label: 'Tue', value: 10 }, { label: 'Wed', value: 24 }, { label: 'Thu', value: 20 }, { label: 'Fri', value: 36 }, { label: 'Sat', value: 31 }, { label: 'Sun', value: 42 }],
      },
      integrity: { title: 'Event integrity', value: 'High', description: 'Example qualitative status. Each signal needs a separate review.' },
      actionsTitle: 'Next actions',
      actions: [
        { title: 'Review signals', body: 'Explore alerts in the example registry.', label: 'Open signals', key: 'institutional', icon: 'flag' },
        { title: 'Check a unit', body: 'Compare the record with the medicine label.', label: 'Verify unit', key: 'verify', icon: 'scan' },
      ],
    },
    phone: {
      title: 'Record found', intro: 'Compare this information with the product label.', codeLabel: 'Unit identifier', cta: 'Verify this unit',
      rows: [{ label: 'Product', value: 'Cerro Alto oral solution' }, { label: 'Presentation', value: '120 ml bottle · 10 mg/ml' }, { label: 'Lot', value: unit.lot }, { label: 'Status', value: 'Identifier activated' }],
      note: 'Finding a record does not certify the contents of the package. Review the signals and compare the physical unit.',
    },
    mini: {
      lotsTitle: 'Example lots', lots: [{ label: unit.lot, status: 'Activated', tone: 'success' }, { label: 'LOTE-VS-26-015', status: 'Under review', tone: 'warning' }, { label: 'LOTE-VS-26-013', status: 'Issued', tone: 'info' }],
      nodesTitle: 'From production', nodes: ['Identity', 'Labeling', 'Activation'], sparklineTitle: 'Weekly lookups', kvTitle: 'Unit record',
      kv: [{ label: 'Product', value: 'Oral solution' }, { label: 'Contents', value: '120 ml' }, { label: 'Lot', value: unit.lot }],
    },
  },
};
