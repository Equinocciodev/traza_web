import type { Locale } from '@/i18n';
import type { IconName } from './types';
import { FEATURED_UNIT_CODE } from '@/fixtures/units';

interface QrBirthContent {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  steps: { title: string; body: string }[];
  image: { alt: string; caption: string };
  unitCode: string;
  unitCta: string;
  lifecycleLabel: string;
  lifecycle: string[];
  phase: { label: string; title: string; items: { title: string; body: string; icon: IconName }[]; note: string };
  tagline: string[];
}

/** La lámina 09/12 aporta la composición; las capacidades se acotan al producto y a cada fase. */
export const QR_BIRTH: Record<Locale, QrBirthContent> = {
  es: {
    eyebrow: 'Desde la producción',
    title: 'El QR nace con el producto.',
    body: 'Traza vincula un identificador único con cada unidad para su impresión durante la producción. Se activa solo al finalizarla, con lote y vencimiento completos.',
    note: 'Un QR legible permite consultar la identidad y sus señales; no certifica el contenido físico ni impide copiar la etiqueta. Compare siempre el registro con la unidad.',
    steps: [
      { title: 'Se emite', body: 'El emisor solicita los identificadores de la orden, uno por unidad.' },
      { title: 'Se imprime', body: 'Cada envase recibe su QR y serial legible durante la producción.' },
      { title: 'Se activa', body: 'Solo al finalizar producción, con impresión confirmada, lote y vencimiento completos.' },
    ],
    image: { alt: 'Caja de medicamento de ejemplo en perspectiva, iluminada en azul sobre fondo oscuro.', caption: 'Envase de ejemplo. Consulta el registro mediante el QR.' },
    unitCode: FEATURED_UNIT_CODE,
    unitCta: 'Consultar la unidad de ejemplo',
    lifecycleLabel: 'Del identificador a la consulta',
    lifecycle: ['Emisión de identidad', 'Impresión y activación al finalizar producción', 'Consulta y control'],
    phase: {
      label: 'Fase 2 · sujeta a integración',
      title: 'Capas adicionales de control.',
      items: [
        { title: 'Medidas físicas anticopia', body: 'Materiales y elementos físicos por definir y validar en cada implementación. La firma digital no impide copiar una etiqueta.', icon: 'shield' },
        { title: 'Validación del pago de tributos', body: 'Capacidad futura, sujeta a integración y autorización de la autoridad competente. No está disponible en esta web.', icon: 'document' },
      ],
      note: 'Estas capacidades requieren una fase posterior. No se afirma una integración tributaria ni una relación institucional existente.',
    },
    tagline: ['Escanea.', 'Compara.', 'Comprende.'],
  },
  en: {
    eyebrow: 'From production',
    title: 'The QR is born with the product.',
    body: 'Traza links a unique identifier to each unit for printing during production. It is activated only when production is complete, with full lot and expiry data.',
    note: 'A readable QR lets you look up the identity and its signals; it does not certify the physical contents or prevent label copying. Always compare the record with the unit.',
    steps: [
      { title: 'Issued', body: 'The issuer requests identifiers for the order, one per unit.' },
      { title: 'Printed', body: 'Each package receives its QR and readable serial during production.' },
      { title: 'Activated', body: 'Only when production is complete, printing is confirmed, and lot and expiry data are complete.' },
    ],
    image: { alt: 'An example medicine box in perspective, lit in blue against a dark background.', caption: 'Example package. Look up the record using the QR.' },
    unitCode: FEATURED_UNIT_CODE,
    unitCta: 'Look up the example unit',
    lifecycleLabel: 'From identifier to lookup',
    lifecycle: ['Identity issuance', 'Printing and activation when production is complete', 'Lookup and oversight'],
    phase: {
      label: 'Phase 2 · subject to integration',
      title: 'Additional layers of control.',
      items: [
        { title: 'Physical measures against copying', body: 'Materials and physical features must be defined and validated for each implementation. A digital signature does not prevent label copying.', icon: 'shield' },
        { title: 'Tax payment validation', body: 'A future capability, subject to integration and approval by the competent authority. It is not available on this website.', icon: 'document' },
      ],
      note: 'These capabilities require a later phase. No existing tax integration or institutional relationship is claimed.',
    },
    tagline: ['Scan.', 'Compare.', 'Understand.'],
  },
};
