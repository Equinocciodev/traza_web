import type { Locale } from '@/i18n';
import { UNIT_BY_CODE } from '@/fixtures/units';
import { EXAMPLE_UNIT_ID, UNIT_QR_URL, STAMP_PRINT_BARCODE } from '@/brand/unit-qr';

const unit = UNIT_BY_CODE.get(EXAMPLE_UNIT_ID);
if (!unit) throw new Error('The medicine stamp requires its matching example unit.');
const product = unit.product;
const volume = product.presentation.match(/\b\d+(?:[.,]\d+)?\s*ml\b/i)?.[0];
if (!volume || !product.concentration || !product.healthRegistration || !unit.signature.issuedAt) {
  throw new Error('The medicine stamp requires volume, strength, health reference and issue date.');
}
const concentration = product.concentration.split(' · ')[0]!;
const issuedAt = unit.signature.issuedAt.slice(0, 10);
const domain = new URL(UNIT_QR_URL).hostname;

interface StampContent {
  previewAlt: string; previewCaption: string; dataTitle: string;
  eyebrow: string; title: string; intro: string; labelName: string; example: string;
  company: string; product: string; form: string; concentration: string; volume: string;
  manufacturer: string; registration: string; batch: string; serial: string;
  territory: string; domain: string; sequence: string; sequenceNote: string;
  barcodeName: string; barcodeLabel: string; issuedAt: string;
  scan: string; qrLabel: string; note: string;
  labels: { qr: string; identifier: string; territory: string; domain: string; sequence: string;
    barcode: string; volume: string; product: string; medicine: string; responsible: string; issuedAt: string; batch: string };
  features: { title: string; body: string }[];
}

const shared = {
  product: product.name, concentration, volume, manufacturer: unit.issuer.name,
  registration: product.healthRegistration, batch: unit.origin.lot, serial: unit.code,
  domain, sequence: STAMP_PRINT_BARCODE.value, barcodeName: STAMP_PRINT_BARCODE.format, issuedAt,
};

export const STAMP: Record<Locale, StampContent> = {
  es: {
    previewAlt: 'Etiqueta ilustrativa de solución oral Traza de 120 ml, diseñada como una sola pieza.',
    previewCaption: 'Concepto visual de etiqueta. El QR funcional y los doce campos se consultan a continuación.',
    dataTitle: 'Los datos de la unidad, campo por campo',
    ...shared,
    eyebrow: 'Identidad visible. Trazabilidad conectada.',
    title: 'Doce características de la estampilla.',
    intro: 'La propuesta de estampilla reúne la identidad de cada unidad y los datos de su medicamento. El QR abre la consulta; el código de barras representa el consecutivo de impresión de ejemplo.',
    labelName: 'Estampilla de medicamento de ejemplo con doce campos identificados',
    example: 'EJEMPLO', company: 'EMPRESA PÚBLICA Y/O PRIVADA',
    form: product.dosageForm?.es ?? '',
    territory: 'Por definir en cada implementación',
    sequenceNote: 'Consecutivo de ejemplo',
    barcodeLabel: `Código de barras Code 128 del consecutivo de ejemplo ${STAMP_PRINT_BARCODE.value}`,
    scan: 'Consulta esta unidad', qrLabel: `QR de consulta pública de la unidad ${unit.code}`,
    note: 'Datos de ejemplo; no identifican un medicamento comercial ni una relación institucional existente. El territorio y las condiciones de impresión se definen en cada implementación. La imagen de etiqueta es un concepto ilustrativo, no una pieza lista para impresión ni una acreditación de seguridad física o validez fiscal. Consultar el QR no certifica el contenido del envase.',
    labels: {
      qr: 'Código QR', identifier: 'Identificador único', territory: 'Territorio de destino', domain: 'Sitio de consulta',
      sequence: 'Consecutivo de impresión', barcode: 'Código de barras', volume: 'Contenido neto', product: 'Nombre del medicamento',
      medicine: 'Forma y concentración', responsible: 'Fabricante o importador · registro sanitario', issuedAt: 'Fecha de emisión', batch: 'Lote de producción',
    },
    features: [
      { title: 'Código QR', body: 'Abre la URL pública de esta unidad. Una copia del gráfico conserva el mismo identificador.' },
      { title: 'Identificador único', body: 'El ID legible coincide con el QR y puede introducirse manualmente para consultar la unidad.' },
      { title: 'Territorio de destino', body: 'Se define para cada implementación. Aquí no se declara una jurisdicción ni una operación territorial real.' },
      { title: 'Sitio de consulta', body: 'El dominio visible indica dónde consultar la identidad, también fuera de esta página.' },
      { title: 'Consecutivo de impresión', body: 'Número de ejemplo de la pieza impresa. Es un campo distinto del identificador de la unidad.' },
      { title: 'Código de barras', body: 'Code 128 legible que codifica el consecutivo de ejemplo. No representa una identificación GS1 ni validación fiscal.' },
      { title: 'Contenido neto', body: 'El volumen se toma de la presentación registrada: 120 ml para esta unidad.' },
      { title: 'Nombre del medicamento', body: 'La denominación permite contrastar el envase con la ficha de la unidad consultada.' },
      { title: 'Forma y concentración', body: 'Forma farmacéutica y concentración correspondientes al medicamento de ejemplo.' },
      { title: 'Responsable y registro sanitario', body: 'Fabricante o importador y referencia sanitaria declarada. RS-EJEMPLO no representa una aprobación oficial.' },
      { title: 'Fecha de emisión', body: 'Fecha en que se emitió la identidad. Es distinta de producción, activación o vencimiento.' },
      { title: 'Lote de producción', body: 'Se conserva como campo propio y coincide con el lote de la unidad consultada.' },
    ],
  },
  en: {
    previewAlt: 'Illustrative Traza 120 ml oral solution label designed as one complete piece.',
    previewCaption: 'Label design concept. The functional QR and twelve fields are shown below.',
    dataTitle: 'The unit data, field by field',
    ...shared,
    eyebrow: 'Visible identity. Connected traceability.',
    title: 'Twelve features of the stamp.',
    intro: 'The proposed stamp brings together each unit’s identity and medicine details. The QR opens its lookup; the barcode represents the example print sequence.',
    labelName: 'Example medicine stamp with twelve identified fields',
    example: 'EXAMPLE', company: 'PUBLIC AND/OR PRIVATE COMPANY',
    form: product.dosageForm?.en ?? '',
    territory: 'Defined for each implementation',
    sequenceNote: 'Example print sequence',
    barcodeLabel: `Code 128 barcode for example print sequence ${STAMP_PRINT_BARCODE.value}`,
    scan: 'Look up this unit', qrLabel: `Public lookup QR for unit ${unit.code}`,
    note: 'Example data does not identify a commercial medicine or an existing institutional relationship. Territory and printing conditions are defined for each implementation. The label image is an illustrative concept, not a print-ready label or proof of physical security or fiscal validity. Looking up the QR does not certify the package contents.',
    labels: {
      qr: 'QR code', identifier: 'Unique identifier', territory: 'Destination territory', domain: 'Lookup website',
      sequence: 'Print sequence', barcode: 'Barcode', volume: 'Net contents', product: 'Medicine name',
      medicine: 'Dosage form and strength', responsible: 'Manufacturer or importer · health registration', issuedAt: 'Issue date', batch: 'Production batch',
    },
    features: [
      { title: 'QR code', body: 'Opens this unit’s public URL. A copy of the graphic retains the same identifier.' },
      { title: 'Unique identifier', body: 'The readable ID matches the QR and can be entered manually to look up the unit.' },
      { title: 'Destination territory', body: 'Defined for each implementation. This example declares no jurisdiction or actual territorial operation.' },
      { title: 'Lookup website', body: 'The visible domain shows where to look up the identity, including outside this page.' },
      { title: 'Print sequence', body: 'An example number for the printed piece. It is separate from the unit identifier.' },
      { title: 'Barcode', body: 'A readable Code 128 symbol encoding the example print sequence. It represents neither GS1 identification nor fiscal validation.' },
      { title: 'Net contents', body: 'Volume comes from the registered presentation: 120 ml for this unit.' },
      { title: 'Medicine name', body: 'The name lets people compare the package with the record of the unit being checked.' },
      { title: 'Dosage form and strength', body: 'Dosage form and strength matching the example medicine.' },
      { title: 'Responsible party and health registration', body: 'Manufacturer or importer and declared health reference. RS-EJEMPLO does not represent official approval.' },
      { title: 'Issue date', body: 'When the identity was issued. It is separate from production, activation or expiry.' },
      { title: 'Production batch', body: 'A separate field matching the batch of the unit being looked up.' },
    ],
  },
};
