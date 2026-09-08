import type { HomeContent } from '../types';

export const home: HomeContent = {
  meta: {
    title: 'Digital identity for real products',
    description:
      'Traza gives each unit a signed digital identity, records its journey along the chain and lets anyone check it from a browser, with nothing to install and no account to create, in a result explained signal by signal.',
  },

  hero: {
    eyebrow: 'For industry and public institutions',
    title: 'Digital identity for real products',
    subtitle:
      'Traza assigns each unit a signed digital identity, records its movements along the chain and lets anyone verify it from any browser, with nothing to install and no account to create.',
    mantra: 'Scan. Verify. Trust.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Talk to the team', key: 'company', suffix: '#contact-title', variant: 'secondary' },
    unitPreview: {
      caption: 'Identity of a unit',
      code: 'TRZ-7F2K-4K7Q-92FA',
      fields: [
        { label: 'Manufacturer / importer', value: 'Destilería Cerro Alto' },
        { label: 'Product / presentation', value: 'Ron Añejo Cerro Alto 7 años · 750 ml bottle' },
        { label: 'Origin / lot', value: 'Planta Valle Sereno · LOTE-VS-26-012' },
        { label: 'Last movement', value: 'Received at retail · Licorería El Faro' },
      ],
      statusLabel: 'Signature issued · active in registry',
    },
  },

  chain: {
    eyebrow: 'The chain',
    title: 'From the factory to the point of sale, every step leaves a record',
    intro:
      'Each unit receives its identity at origin and adds events as it moves forward. The final verification compares what the label says with what the registry holds.',
    nodes: [
      {
        id: 'origin',
        label: 'Factory / customs',
        description: 'The unit receives its digital identity when it leaves the factory or enters through customs.',
        icon: 'factory',
      },
      {
        id: 'labeling',
        label: 'Labeling',
        description: 'The signed code is printed on the label or seal of each unit.',
        icon: 'label',
      },
      {
        id: 'transport',
        label: 'Transport',
        description: 'Each transfer is recorded as an event with date, origin and destination.',
        icon: 'truck',
      },
      {
        id: 'distribution',
        label: 'Distribution',
        description: 'Distribution centers confirm the receipt and dispatch of units.',
        icon: 'warehouse',
      },
      {
        id: 'commerce',
        label: 'Retail',
        description: 'The point of sale records the arrival and the unit is ready for verification.',
        icon: 'store',
      },
      {
        id: 'verification',
        label: 'Verification',
        description: 'Anyone verifies the unit from the browser and compares what they see with the registry.',
        icon: 'scan',
      },
    ],
    cta: { label: 'See the full journey', key: 'journey', variant: 'link' },
  },

  pillars: {
    title: 'Four services on one shared layer',
    intro:
      'Identity, traceability, verification and control share the same registry. What changes in each deployment is the data, the rules and who can consult them.',
    items: [
      {
        title: 'Unit-level digital identity',
        body: 'Each unit — not just each lot — receives a unique identifier, signed by whoever places it on the market.',
        icon: 'fingerprint',
      },
      {
        title: 'Traceability',
        body: 'Chain events are recorded in order and with context: who reports them, when and where.',
        icon: 'link',
      },
      {
        title: 'Public verification',
        body: 'Anyone can check a unit from the browser, with nothing to install and no account to create.',
        icon: 'scan',
      },
      {
        title: 'Institutional control',
        body: 'Regulators and companies consult the registry, follow anomalies and coordinate field inspection.',
        icon: 'eye',
      },
    ],
  },

  story: {
    eyebrow: 'The story of the unit',
    title: 'More than a code: a story that can be checked',
    body:
      'Each identity brings together the data that matters to recognize a unit and follow its path. The fields are few, clear and verifiable: who produced or imported it, what it is, where it comes from and where it has been.',
    quote: 'Traza does more than identify products. It builds their verifiable history.',
    fields: [
      {
        label: 'Manufacturer / importer',
        description: 'Who placed the unit on the market and is accountable for it.',
        icon: 'factory',
      },
      {
        label: 'Product / presentation',
        description: 'What exactly it is: type, variant, format and declared content.',
        icon: 'box',
      },
      {
        label: 'Origin / lot',
        description: 'Where it comes from and which production or import lot it belongs to.',
        icon: 'map-pin',
      },
      {
        label: 'Movements / destination',
        description: 'Where it has been and where it was headed according to the registry.',
        icon: 'truck',
      },
    ],
  },

  audiences: {
    title: 'Who it is for',
    intro:
      'The same platform answers different needs: controlling a market, protecting a brand or knowing what you are buying.',
    items: [
      {
        key: 'government',
        title: 'Government and regulators',
        body: 'An auditable registry, field inspection and public verification carrying each institution’s brand.',
        bullets: [
          'Control by unit, not just by lot',
          'Field inspection within the deployment',
          'Co-brand by country and regulator',
        ],
        cta: { label: 'Solutions for government', key: 'solutionsGovernment', variant: 'link' },
        icon: 'government',
      },
      {
        key: 'industry',
        title: 'Industry',
        body: 'Brand protection, chain visibility and integration with the systems already in use.',
        bullets: [
          'Identity issued from production or import',
          'Chain events from management and warehouse systems',
          'Public verification under your own brand',
        ],
        cta: { label: 'Solutions for industry', key: 'solutionsIndustry', variant: 'link' },
        icon: 'industry',
      },
      {
        key: 'citizens',
        title: 'Citizens',
        body: 'Verify at the point of sale, understand the result and report a discrepancy in a few steps.',
        bullets: [
          'Nothing to install, no account to create',
          'Result explained in plain language',
          'Discrepancy reports with minimal data',
        ],
        cta: { label: 'Solutions for citizens', key: 'solutionsCitizens', variant: 'link' },
        icon: 'citizen',
      },
    ],
  },

  perspectives: {
    eyebrow: 'The platform at work',
    title: 'Three ways to see it in action',
    intro:
      'Each view shows one part of the platform from the point of view of the person using it: the public, whoever follows a unit and the institution in control.',
    items: [
      {
        key: 'verify',
        tag: 'For the public',
        title: 'Public verification',
        body: 'Scan or type a sample code and read a result explained by signals: signature, registry, data match and anomalies.',
        cta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'For the chain',
        title: 'Product journey',
        body: 'Follow a unit from the factory or customs to retail, event by event, and see how its history is built.',
        cta: { label: 'See the journey', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
      {
        key: 'institutional',
        tag: 'For oversight',
        title: 'Institutional view',
        body: 'Consult the registry as a regulator or a company would: units, anomalies, discrepancies and field inspection.',
        cta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
        icon: 'chart',
      },
    ],
    note: 'All three views work on the same record: what changes is what each role can see and do.',
  },

  useCase: {
    eyebrow: 'First use case',
    tag: 'Pilot proposal',
    title: 'Spirits: unit-level identity and public verification for a regulator',
    body:
      'Traza’s first use case is a pilot proposal addressed to a spirits regulator. It proposes identifying each unit with a digital signature, recording its journey and offering public verification from the browser, with field inspection included in the pilot.',
    bullets: [
      'Signed unit-level identity (target architecture: ECDSA P-256)',
      'Web-based public verification, with no installation or account',
      'Field inspection within the pilot',
      'Conditional co-brand with the regulator',
    ],
    cta: { label: 'Learn about the use case', key: 'caseSpirits', variant: 'secondary' },
    disclaimer:
      'Pilot proposal. It does not imply an official implementation, a contractual relationship or the participation of any agency.',
  },

  multisector: {
    title: 'One layer for different sectors',
    body:
      'The platform does not depend on the type of product. It combines unit-level identity, chain events, public verification and rules configurable per tenant; what changes in each sector is the identity data, the relevant events and who can consult them.',
    sectors: [
      'Food and beverages',
      'Pharmaceutical',
      'Agribusiness',
      'Spare parts and components',
      'Consumer goods',
      'Documents and certificates',
    ],
    note: 'Sectors are mentioned only as examples of adaptability. No sector-specific capabilities or certifications are claimed.',
  },

  trust: {
    title: 'Security and trust, with the limits in plain view',
    intro:
      'We would rather explain precisely what is checked and what is not than promise absolute guarantees.',
    items: [
      {
        title: 'Signature per unit',
        body: 'Each identity is signed with keys managed by the issuer. A valid signature indicates issuance; it does not describe the physical content.',
        icon: 'signature',
      },
      {
        title: 'Verification by signals',
        body: 'Signature, registry status, data match and anomalies are evaluated separately and explained in plain language.',
        icon: 'compare',
      },
      {
        title: 'Minimal data',
        body: 'Public verification requires no personal data. Reports ask only for what is necessary, and only optionally.',
        icon: 'lock',
      },
      {
        title: 'Transparency',
        body: 'We state what is supported and point out what is not. No certifications, audits or results without a source.',
        icon: 'info',
      },
    ],
    cta: { label: 'Read about security and trust', key: 'security', variant: 'link' },
  },

  finalCta: {
    title: 'Start by verifying a unit',
    body:
      'The best way to understand Traza is to use it: scan or type a sample code and read the result. If you would like to talk about a pilot or an integration, the team is available.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Contact the team', key: 'company', variant: 'secondary' },
  },
};
