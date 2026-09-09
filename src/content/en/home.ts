import type { HomeContent } from '../types';

export const home: HomeContent = {
  meta: {
    title: 'Digital identity for real products',
    description:
      'Traza gives each unit a signed digital identity, records its journey along the chain, and lets anyone check it from a browser — no account, no install.',
  },

  hero: {
    eyebrow: 'For industry and public institutions',
    title: 'Digital identity for real products',
    subtitle:
      'Traza assigns each unit a signed digital identity, records its lifecycle — issuance, activation and every lookup — and lets anyone check it from any browser, with nothing to install and no account to create.',
    mantra: 'Scan. Verify. Trust.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Talk to the team', key: 'company', suffix: '#contact-title', variant: 'secondary' },
    unitPreview: {
      caption: 'Identity of a unit',
      code: 'TRZ-7F2K-4K7Q-92FA',
      fields: [
        { label: 'Manufacturer / importer', value: 'Laboratorio Cerro Alto' },
        { label: 'Product / presentation', value: 'Solución oral Cerro Alto · 120 ml oral solution' },
        { label: 'Lot / expiry', value: 'LOTE-VS-26-012 · expires 03/2031' },
        { label: 'Identifier status', value: 'Activated · lookups recorded' },
      ],
      statusLabel: 'Verified · signature and registry agree',
    },
  },

  chain: {
    eyebrow: 'The lifecycle',
    title: 'From issuance to lookup, every step leaves a record',
    intro:
      'A unit’s identity is not created and forgotten: it is issued, activated when the lot closes, and from then on every lookup leaves a trace. Those moments are what the registry keeps — not the transport.',
    nodes: [
      {
        id: 'issuance',
        label: 'Issuance',
        description: 'The platform derives and signs each unit’s identifier, within the order that was requested.',
        icon: 'signature',
      },
      {
        id: 'labeling',
        label: 'Labelling',
        description: 'The signed code is printed and applied to the unit, using the plant’s own infrastructure.',
        icon: 'label',
      },
      {
        id: 'activation',
        label: 'Activation',
        description: 'When the lot closes, the record is completed — lot and expiry, or serial — and the codes become active.',
        icon: 'check',
      },
      {
        id: 'lookup',
        label: 'Public lookup',
        description: 'Anyone checks the unit from the browser and compares what they see with the registry.',
        icon: 'scan',
      },
      {
        id: 'signals',
        label: 'Signals',
        description: 'Every lookup adds context: when the first one happened, how many there have been, and whether the pattern is impossible for a single unit.',
        icon: 'chart',
      },
      {
        id: 'closure',
        label: 'Closure',
        description: 'When activation ends, the sequence numbers that were never used are voided by range.',
        icon: 'lock',
      },
    ],
    cta: { label: 'See the full lifecycle', key: 'journey', variant: 'link' },
  },

  pillars: {
    title: 'Four services on one shared layer',
    intro:
      'Identity, traceability, verification and control share the same registry. What changes in each deployment is the data, the rules and who can consult them.',
    items: [
      {
        title: 'Unit-level digital identity',
        body: 'Each unit — not just each lot — receives a unique identifier, derived and signed at the moment of issuance.',
        icon: 'fingerprint',
      },
      {
        title: 'Traceability',
        body: 'Issuance, activation and lookups go into an append-only registry, in order and with context: who, when, and with what result.',
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
      'Each identity brings together the data that matters to recognize a unit: who produced or imported it, what it is, which lot it came from, when it expires, and the state of its identifier. Few, clear, and comparable with the container.',
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
        label: 'Lot and expiry',
        description: 'Which lot it came from and when it expires, to compare against what is printed on the container.',
        icon: 'label',
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
        body: 'Follow a unit from its issuance through the lookups it accumulates, event by event, and see how its history is built.',
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
    title: 'Medicines: unit-level identity and public verification for a regulator',
    body:
      'Traza’s first use case is a pilot proposal addressed to a medicines regulator. It proposes identifying each unit with a digital signature, recording its journey and offering public verification from the browser, with field inspection included in the pilot.',
    bullets: [
      'Signed unit-level identity (target architecture: ECDSA P-256)',
      'Web-based public verification, with no installation or account',
      'Field inspection within the pilot',
      'Conditional co-brand with the regulator',
    ],
    cta: { label: 'Learn about the use case', key: 'caseMedicines', variant: 'secondary' },
    disclaimer:
      'Pilot proposal. It does not imply an official implementation, a contractual relationship or the participation of any agency.',
  },

  multisector: {
    title: 'One layer for different sectors',
    body:
      'The platform does not depend on the type of product. It combines unit-level identity, chain events, public verification and rules configurable per tenant; what changes in each sector is the identity data, the relevant events and who can consult them.',
    sectors: [
      'Medicines and health products',
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
