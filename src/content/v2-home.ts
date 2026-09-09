import type { Locale, RouteKey } from '@/i18n';

interface HomeV2Content {
  meta: { title: string; description: string };
  nav: { label: string; key: RouteKey; anchor?: string }[];
  hero: { badge: string; title: [string, string]; intro: string; primaryAction: string; secondaryAction: string; imageAlt: string; relationship: string };
  record: { title: string; productLabel: string; product: string; lotLabel: string; eventLabel: string; event: string; disclaimer: string; action: string; qrLabel: string; qrHint: string };
  perspectives: {
    eyebrow: string; title: string; intro: string;
    items: { title: string; body: string; action: string; key: RouteKey; icon: 'scan' | 'history' | 'eye' }[];
    note: string;
  };
  scope: { eyebrow: string; title: string; body: string; links: { label: string; key: RouteKey }[]; note: string };
  company: { eyebrow: string; title: string; body: string; action: string; contact: string; note: string };
}

/** V2 editorial copy is separate from the preserved v1 dictionaries and verification model. */
export const V2_HOME: Record<Locale, HomeV2Content> = {
  es: {
    meta: { title: 'El origen importa. La evidencia conecta.', description: 'Traza conecta productos, industria e instituciones: una identidad firmada por unidad, el registro de su ciclo de vida y una consulta que cualquiera puede hacer.' },
    nav: [
      { label: 'Soluciones', key: 'solutions' },
      { label: 'Plataforma', key: 'platform' },
      { label: 'Recursos', key: 'howItWorks' },
      { label: 'Empresa', key: 'company' },
    ],
    hero: {
      badge: 'Identidad digital para productos reales', title: ['El origen importa', 'La evidencia conecta'],
      intro: 'Identidad digital para medicamentos: un QR por unidad, desde la producción hasta la consulta pública.',
      primaryAction: 'Conocer el proceso', secondaryAction: 'Probar verificación',
      imageAlt: 'Presentación ilustrativa de una solución oral de 120 ml en frasco ámbar junto a su caja.',
      relationship: 'La fotografía ilustra la presentación del medicamento. El QR de la tarjeta abre un registro de ejemplo; la consulta no certifica el objeto físico.',
    },
    record: { title: 'Registro de la unidad', productLabel: 'Producto', product: 'Solución oral · 120 ml', lotLabel: 'Lote', eventLabel: 'Último evento', event: 'Consulta pública', disclaimer: 'La consulta no certifica autenticidad física.', action: 'Explorar el registro', qrLabel: 'Abrir el registro de ejemplo', qrHint: 'Escanea este QR con otro dispositivo o selecciónalo para consultar la unidad.' },
    perspectives: {
      eyebrow: 'La plataforma, en acción', title: 'Un registro. Tres perspectivas.',
      intro: 'Prueba qué puede consultar una persona, cómo se registra el ciclo de vida y qué información revisa un equipo de control.',
      items: [
        { title: 'Consulta pública', body: 'Compara el producto con su registro y entiende cada resultado, incluidos sus límites.', action: 'Probar la consulta', key: 'verify', icon: 'scan' },
        { title: 'Recorrido de la unidad', body: 'Sigue los eventos de una unidad: quién los aporta, cuándo ocurren y qué información contienen.', action: 'Explorar el recorrido', key: 'journey', icon: 'history' },
        { title: 'Vista institucional', body: 'Explora reportes, señales e inspecciones de campo con permisos por rol.', action: 'Abrir la vista de control', key: 'institutional', icon: 'eye' },
      ],
      note: 'Cada perspectiva usa el mismo registro: lo que cambia es qué puede ver y hacer cada rol.',
    },
    scope: {
      eyebrow: 'Una propuesta para medicamentos', title: 'Una base común. Distintas necesidades.',
      body: 'Fabricantes, importadores, farmacias y equipos de salud necesitan consultar la misma unidad con permisos distintos. Traza propone conectar sus registros, con responsabilidades y alcance acordados en cada piloto.',
      links: [{ label: 'Para la industria', key: 'solutionsIndustry' }, { label: 'Para instituciones', key: 'solutionsGovernment' }, { label: 'Para las personas', key: 'solutionsCitizens' }],
      note: 'Medicamentos es el caso de uso de esta web. Integraciones, permisos y operación se acuerdan y validan en cada programa.',
    },
    company: {
      eyebrow: 'Conoce Traza', title: 'Tecnología privada. Vocación de servicio.',
      body: 'Traza es una compañía privada con una propuesta de identidad digital para medicamentos. Este sitio describe la plataforma; no acredita contratos ni avales de autoridades sanitarias.',
      action: 'Nuestra empresa', contact: 'Conversar sobre un piloto', note: 'Escríbanos y le responderemos en días hábiles.',
    },
  },
  en: {
    meta: { title: 'Origin matters. Evidence connects.', description: 'Traza connects products, industry and institutions: a signed identity per unit, the record of its lifecycle, and a public lookup anyone can run from a browser.' },
    nav: [
      { label: 'Solutions', key: 'solutions' }, { label: 'Platform', key: 'platform' },
      { label: 'Resources', key: 'howItWorks' }, { label: 'Company', key: 'company' },
    ],
    hero: {
      badge: 'Digital identity for real products', title: ['Origin matters', 'Evidence connects'],
      intro: 'Digital identity for medicines: one QR per unit, from production to public lookup.',
      primaryAction: 'Discover the process', secondaryAction: 'Try verification',
      imageAlt: 'Illustrative presentation of a 120 ml oral solution in an amber bottle beside its carton.',
      relationship: 'The photograph illustrates the medicine’s presentation. The card’s QR opens a sample record; the lookup does not certify the physical object.',
    },
    record: { title: 'Unit record', productLabel: 'Product', product: 'Oral solution · 120 ml', lotLabel: 'Lot', eventLabel: 'Latest event', event: 'Public query', disclaimer: 'The lookup does not certify physical authenticity.', action: 'Explore the record', qrLabel: 'Open the sample record', qrHint: 'Scan this QR with another device or select it to look up the unit.' },
    perspectives: {
      eyebrow: 'The platform, in action', title: 'One record. Three perspectives.',
      intro: 'Try what a person can query, how a unit’s lifecycle is recorded and what information a control team reviews.',
      items: [
        { title: 'Public query', body: 'Compare the product with its record and understand each result, including its limits.', action: 'Try a query', key: 'verify', icon: 'scan' },
        { title: 'Unit journey', body: 'Follow a unit’s events: who reports them, when they happen and what information they contain.', action: 'Explore the journey', key: 'journey', icon: 'history' },
        { title: 'Institutional view', body: 'Explore reports, signals and field inspections with role-based permissions.', action: 'Open the control view', key: 'institutional', icon: 'eye' },
      ],
      note: 'Each perspective works on the same record: what changes is what each role can see and do.',
    },
    scope: {
      eyebrow: 'A proposal for medicines', title: 'A shared foundation. Different needs.',
      body: 'Manufacturers, importers, pharmacies and healthcare teams need to look up the same unit with different permissions. Traza proposes connecting their records, with responsibilities and scope agreed in each pilot.',
      links: [{ label: 'For industry', key: 'solutionsIndustry' }, { label: 'For institutions', key: 'solutionsGovernment' }, { label: 'For people', key: 'solutionsCitizens' }],
      note: 'Medicines are the use case featured on this website. Integrations, permissions and operations are agreed and validated for each program.',
    },
    company: {
      eyebrow: 'Meet Traza', title: 'Private technology. A commitment to service.',
      body: 'Traza is a private company proposing digital identity for medicines. This site describes the platform; it does not establish contracts or endorsements from health authorities.',
      action: 'Our company', contact: 'Discuss a pilot', note: 'Write to us and we will reply within business days.',
    },
  },
};
