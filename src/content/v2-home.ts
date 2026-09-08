import type { Locale, RouteKey } from '@/i18n';

interface HomeV2Content {
  meta: { title: string; description: string };
  nav: { label: string; key: RouteKey; anchor?: string }[];
  hero: { badge: string; title: [string, string]; intro: string; primaryAction: string; secondaryAction: string; imageAlt: string; relationship: string };
  record: { title: string; productLabel: string; product: string; lotLabel: string; eventLabel: string; event: string; disclaimer: string; action: string };
  demos: {
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
    meta: { title: 'El origen importa. La evidencia conecta.', description: 'Explora la propuesta de Traza: tecnología de trazabilidad para conectar productos, industria e instituciones. Demo conceptual con datos simulados.' },
    nav: [
      { label: 'Plataforma', key: 'platform' },
      { label: 'Cómo funciona', key: 'home', anchor: '#historia' },
      { label: 'Soluciones', key: 'solutions' },
      { label: 'Empresa', key: 'company' },
    ],
    hero: {
      badge: 'Demo conceptual · datos simulados', title: ['El origen importa', 'La evidencia conecta'],
      intro: 'Tecnología de trazabilidad para conectar productos, industria e instituciones.',
      primaryAction: 'Conocer el proceso', secondaryAction: 'Probar verificación',
      imageAlt: 'Productos conceptuales: una botella ámbar con etiqueta DEMO, una caja y una bolsa sin marca. No son productos comerciales.',
      relationship: 'La botella representa una unidad vinculada a un registro de ejemplo. La relación de datos no certifica el objeto físico ni corresponde a los otros envases.',
    },
    record: { title: 'Registro de demostración', productLabel: 'Producto', product: 'Ron · 750 ml · ejemplo', lotLabel: 'Lote', eventLabel: 'Último evento', event: 'Consulta pública · simulada', disclaimer: 'Datos ficticios. No certifica autenticidad física.', action: 'Explorar el registro' },
    demos: {
      eyebrow: 'La plataforma, en acción', title: 'Un registro. Tres perspectivas.',
      intro: 'Prueba qué puede consultar una persona, cómo se organiza una cadena y qué información revisa un equipo de control.',
      items: [
        { title: 'Consulta pública', body: 'Compara el producto con su registro y entiende cada resultado, incluidos sus límites.', action: 'Probar la consulta', key: 'verify', icon: 'scan' },
        { title: 'Recorrido de la unidad', body: 'Sigue los eventos de una unidad: quién los aporta, cuándo ocurren y qué información contienen.', action: 'Explorar el recorrido', key: 'journey', icon: 'history' },
        { title: 'Vista institucional', body: 'Explora reportes, señales y una inspección de campo con información ficticia.', action: 'Abrir la vista de control', key: 'institutional', icon: 'eye' },
      ],
      note: 'Las tres experiencias son simulaciones. No consultan registros oficiales ni representan un despliegue en producción.',
    },
    scope: {
      eyebrow: 'Una propuesta multisector', title: 'Una base común. Distintas necesidades.',
      body: 'Cada industria tiene sus productos y cada programa, sus reglas. Traza propone conectar identidades, eventos y consultas con un alcance y unas responsabilidades definidos para cada implementación.',
      links: [{ label: 'Para la industria', key: 'solutionsIndustry' }, { label: 'Para instituciones', key: 'solutionsGovernment' }, { label: 'Para las personas', key: 'solutionsCitizens' }],
      note: 'Bebidas y alimentos son ejemplos de uso. Integraciones, permisos y operación se acuerdan y validan en cada programa.',
    },
    company: {
      eyebrow: 'Conoce Traza', title: 'Tecnología privada. Vocación de servicio.',
      body: 'Traza es una compañía privada que propone servicios de trazabilidad a industrias y entidades públicas. Esta demo muestra una dirección de producto, no acredita contratos, clientes ni avales gubernamentales.',
      action: 'Nuestra empresa', contact: 'Conversar sobre un piloto', note: 'El contacto de esta demo es simulado: no se envía ni almacena información.',
    },
  },
  en: {
    meta: { title: 'Origin matters. Evidence connects.', description: 'Explore the Traza proposal: traceability technology connecting products, industry and institutions. A conceptual demo with simulated data.' },
    nav: [
      { label: 'Platform', key: 'platform' }, { label: 'How it works', key: 'home', anchor: '#historia' },
      { label: 'Solutions', key: 'solutions' }, { label: 'Company', key: 'company' },
    ],
    hero: {
      badge: 'Conceptual demo · simulated data', title: ['Origin matters', 'Evidence connects'],
      intro: 'Traceability technology connecting products, industry and institutions.',
      primaryAction: 'Discover the process', secondaryAction: 'Try verification',
      imageAlt: 'Conceptual products: an amber bottle with a DEMO label, an unbranded carton and a pouch. These are not commercial products.',
      relationship: 'The bottle represents a unit linked to an example record. This data relationship does not certify the physical object or apply to the other packages.',
    },
    record: { title: 'Demonstration record', productLabel: 'Product', product: 'Rum · 750 ml · example', lotLabel: 'Lot', eventLabel: 'Latest event', event: 'Public query · simulated', disclaimer: 'Fictitious data. Does not certify physical authenticity.', action: 'Explore the record' },
    demos: {
      eyebrow: 'The platform, in action', title: 'One record. Three perspectives.',
      intro: 'Try what a person can query, how a supply chain is organized and what information a control team reviews.',
      items: [
        { title: 'Public query', body: 'Compare the product with its record and understand each result, including its limits.', action: 'Try a query', key: 'verify', icon: 'scan' },
        { title: 'Unit journey', body: 'Follow a unit’s events: who reports them, when they happen and what information they contain.', action: 'Explore the journey', key: 'journey', icon: 'history' },
        { title: 'Institutional view', body: 'Explore reports, signals and a field inspection using fictitious information.', action: 'Open the control view', key: 'institutional', icon: 'eye' },
      ],
      note: 'All three experiences are simulations. They do not query official records or represent a production deployment.',
    },
    scope: {
      eyebrow: 'A multisector proposal', title: 'A shared foundation. Different needs.',
      body: 'Every industry has its products and every program has its rules. Traza proposes connecting identities, events and queries with a scope and responsibilities defined for each implementation.',
      links: [{ label: 'For industry', key: 'solutionsIndustry' }, { label: 'For institutions', key: 'solutionsGovernment' }, { label: 'For people', key: 'solutionsCitizens' }],
      note: 'Beverages and food are example use cases. Integrations, permissions and operations are agreed and validated for each program.',
    },
    company: {
      eyebrow: 'Meet Traza', title: 'Private technology. A commitment to service.',
      body: 'Traza is a private company proposing traceability services to industries and public entities. This demo presents a product direction; it does not establish contracts, customers or government endorsements.',
      action: 'Our company', contact: 'Discuss a pilot', note: 'The contact experience in this demo is simulated: no information is sent or stored.',
    },
  },
};
