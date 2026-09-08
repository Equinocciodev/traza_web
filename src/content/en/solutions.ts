import type { SolutionsContent, SectorPageContent } from '../types';

/* ------------------------------------------------------------------ */
/* Solutions overview                                                  */
/* ------------------------------------------------------------------ */

export const solutions: SolutionsContent = {
  meta: {
    title: 'Solutions for government, industry and citizens',
    description:
      'Unit-level identity, traceability and public verification for government, for industry and for citizens, on one shared layer with each programme’s rules.',
  },

  hero: {
    eyebrow: 'Solutions',
    title: 'One shared layer, three points of view',
    subtitle:
      'Governments and regulators, industry and citizens use the same platform with different needs. Here we explain what it brings to each of them.',
  },

  cards: [
    {
      key: 'government',
      title: 'Government and regulators',
      body: 'Know which units are on the market, where they come from and whether what is sold matches what is registered.',
      bullets: [
        'An auditable registry per unit',
        'Field inspection within the deployment',
        'Public verification carrying the institution’s brand',
      ],
      cta: { label: 'See solutions for government', key: 'solutionsGovernment', variant: 'secondary' },
      icon: 'government',
    },
    {
      key: 'industry',
      title: 'Industry',
      body: 'Protect the brand, gain visibility over the chain and give the public a way to check each unit.',
      bullets: [
        'Identity issued from production or import',
        'Integration with management and warehouse systems',
        'Alerts on anomalies in the chain',
      ],
      cta: { label: 'See solutions for industry', key: 'solutionsIndustry', variant: 'secondary' },
      icon: 'industry',
    },
    {
      key: 'citizens',
      title: 'Citizens',
      body: 'Check a product at the point of sale, understand the result and flag it if something does not match.',
      bullets: [
        'Nothing to install, no account to create',
        'Result explained in plain language',
        'Discrepancy reports in a few steps',
      ],
      cta: { label: 'See solutions for citizens', key: 'solutionsCitizens', variant: 'secondary' },
      icon: 'citizen',
    },
  ],

  sharedLayer: {
    title: 'What all solutions share',
    body:
      'There are not three different products, but one platform with different views and rules for each actor. This lets a regulator, a manufacturer and a person in a store look at the same registry with the level of detail that corresponds to each of them.',
    bullets: [
      'Unit-level digital identity signed by the issuer',
      'An ordered, auditable registry of chain events',
      'Public verification from the browser, with no installation or account',
      'Rules, brand and context configurable per tenant',
      'Discrepancy reports with minimal data',
    ],
  },

  multisector: {
    title: 'Adaptable to different sectors',
    body:
      'Adaptability does not come from industry-specific modules, but from the same layer: unit-level identity, chain events, public verification and rules configurable per tenant. Each sector defines which data describes a unit, which events matter and who can consult them.',
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

  cta: {
    title: 'Let’s talk about your case',
    body:
      'If your organization controls, produces or distributes products that need a verifiable identity, we can talk about a well-scoped pilot.',
    primaryCta: { label: 'Contact the team', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Verify a product', key: 'verify', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Government and regulators                                           */
/* ------------------------------------------------------------------ */

export const solutionsGovernment: SectorPageContent = {
  meta: {
    title: 'Government and regulators: unit-level control',
    description:
      'How Traza supports regulators and control agencies with unit-level identity, field inspection, an auditable registry and co-brand deployments by country.',
  },
  key: 'government',

  hero: {
    eyebrow: 'Solutions · Government and regulators',
    title: 'Control by unit and public verification carrying each institution’s brand',
    subtitle:
      'For regulators and control agencies that need to know which units are on the market, where they come from and whether what is sold matches what is registered.',
    icon: 'government',
  },

  challenges: {
    title: 'Common challenges',
    intro:
      'Regulated markets share similar problems, regardless of the product. These are the ones Traza sets out to solve.',
    items: [
      {
        title: 'Units without a verifiable identity',
        body: 'Control is usually done by lot or by document. Without a per-unit identity, it is hard to tell a legitimate product from a copy with the same label.',
        icon: 'box',
      },
      {
        title: 'Inspection that is hard to prioritize',
        body: 'Field teams are limited. Without signals from the registry, there is no way to decide where to inspect first.',
        icon: 'search',
      },
      {
        title: 'Scattered records',
        body: 'Production, import, transport and retail record their data in different systems that can rarely be cross-checked.',
        icon: 'database',
      },
      {
        title: 'No public verification channel',
        body: 'The public has no simple way to check a product or to flag it when something does not match.',
        icon: 'citizen',
      },
    ],
  },

  approach: {
    title: 'Our approach',
    intro:
      'An identity and registry layer governed by the institution, with open public verification and field inspection as part of the deployment.',
    items: [
      {
        title: 'Signed unit-level identity',
        body: 'Each unit receives an identifier signed by its issuer, under rules defined by the institution.',
        icon: 'signature',
      },
      {
        title: 'Auditable registry',
        body: 'Chain events are kept in order, with responsible party and date, and can be exported for audit.',
        icon: 'list',
      },
      {
        title: 'Field inspection within the deployment',
        body: 'Inspectors verify on site, check against the registry and record what they observe.',
        icon: 'map-pin',
      },
      {
        title: 'Co-brand by country and regulator',
        body: 'Public verification can show the institution’s brand alongside Traza’s, always with its approval.',
        icon: 'flag',
      },
      {
        title: 'Public verification',
        body: 'Anyone checks a unit from the browser and can report discrepancies that reach the registry.',
        icon: 'scan',
      },
    ],
  },

  flow: {
    title: 'How it is deployed',
    intro: 'An institutional deployment advances in well-defined stages. The usual order is as follows.',
    steps: [
      {
        label: '01',
        title: 'Define the framework',
        body: 'The institution establishes which products are identified, which data describes a unit, which events are recorded and who can consult them.',
        icon: 'settings',
      },
      {
        label: '02',
        title: 'Issue identities',
        body: 'Manufacturers and importers issue signed identities for their units according to the rules of the framework.',
        icon: 'key',
      },
      {
        label: '03',
        title: 'Record the chain',
        body: 'Chain actors report events: labeling, transport, distribution and arrival at retail.',
        icon: 'link',
      },
      {
        label: '04',
        title: 'Open public verification',
        body: 'The public verifies from the browser, with the institution’s brand if so approved, and reports discrepancies.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Inspect and act',
        body: 'The institution follows anomalies and reports, prioritizes field inspections and records the action taken.',
        icon: 'search',
      },
    ],
  },

  outcomes: {
    title: 'Expected outcomes',
    intro: 'What a deployment of this kind sets out to achieve, expressed without figures.',
    items: [
      'Per-unit visibility over what circulates in the regulated market',
      'Better-targeted field inspections thanks to signals from the registry',
      'A public channel for verification and reporting that requires no installation or account',
      'An auditable registry that supports control and accountability',
      'An institutional brand present at the moment of verification',
    ],
    note: 'Expected outcomes are qualitative. No figures or measured results are presented.',
  },

  perspectives: {
    title: 'See it in the platform',
    items: [
      {
        key: 'institutional',
        tag: 'For oversight',
        title: 'Institutional view',
        body: 'Consult the registry as a control agency would: units, anomalies, discrepancies and field inspection.',
        cta: { label: 'Open the institutional view', key: 'institutional', variant: 'primary' },
        icon: 'chart',
      },
      {
        key: 'verify',
        tag: 'For the public',
        title: 'Public verification',
        body: 'See what the public would see when verifying a unit, with the co-brand example from the spirits use case.',
        cta: { label: 'Verify with the sample tenant', key: 'verify', suffix: '?t=licores', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'For the chain',
        title: 'Product journey',
        body: 'Follow a unit from the factory or customs to retail and see which events are recorded.',
        cta: { label: 'See the journey', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nothing above claims a relationship with governments or agencies, certifications or measured results. The spirits use case is a pilot proposal.',

  cta: {
    title: 'Let’s talk about a well-scoped pilot',
    body:
      'A pilot starts with one product, one framework of rules and a small group of actors. We can help define it.',
    primaryCta: { label: 'Contact the team', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Learn about the spirits use case', key: 'caseSpirits', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Industry                                                            */
/* ------------------------------------------------------------------ */

export const solutionsIndustry: SectorPageContent = {
  meta: {
    title: 'Industry: unit-level identity and brand protection',
    description:
      'Unit-level identity, traceability and brand protection for manufacturers, importers and distributors, integrated with the systems already running today.',
  },
  key: 'industry',

  hero: {
    eyebrow: 'Solutions · Industry',
    title: 'Identity per unit, chain visibility and brand protection',
    subtitle:
      'For manufacturers, importers and distributors who want to know where their units are, detect diversions and give the public a way to check them.',
    icon: 'industry',
  },

  challenges: {
    title: 'Common challenges',
    intro:
      'Whoever places a product on the market is accountable for it long after it left the warehouse. These are the most frequent problems.',
    items: [
      {
        title: 'Copies and diversions that damage the brand',
        body: 'A label is easy to copy. Without a per-unit identity, the brand cannot prove which units it issued and which it did not.',
        icon: 'alert',
      },
      {
        title: 'Little visibility beyond the warehouse',
        body: 'Once dispatched, the unit disappears from the company’s own systems. What happens in transport and retail stays out of sight.',
        icon: 'eye',
      },
      {
        title: 'Data in separate systems',
        body: 'Production, warehouse and logistics already generate useful data, but in systems that do not talk to each other.',
        icon: 'database',
      },
      {
        title: 'A public with no way to check',
        body: 'Buyers cannot tell a legitimate unit from a copy, and the brand does not find out when there is a problem.',
        icon: 'citizen',
      },
    ],
  },

  approach: {
    title: 'Our approach',
    intro:
      'Issue the identity from the processes that already exist, record the chain with the data already generated and open verification to the public under your own brand.',
    items: [
      {
        title: 'Identity per unit, not just per lot',
        body: 'Each unit receives an identifier signed with the manufacturer’s or importer’s keys when it leaves production or enters through customs.',
        icon: 'fingerprint',
      },
      {
        title: 'Chain events from your own systems',
        body: 'Management and warehouse systems (ERP, WMS) report events through documented interfaces, without duplicating work.',
        icon: 'plug',
      },
      {
        title: 'Public verification under your own brand',
        body: 'The public checks each unit from the browser, in an experience that carries the brand’s visual identity.',
        icon: 'scan',
      },
      {
        title: 'Alerts on anomalies',
        body: 'Repeated lookups of the same code, inconsistent locations or events out of sequence are flagged for review.',
        icon: 'alert',
      },
      {
        title: 'Brand protection',
        body: 'The registry records which units the brand issued; reported discrepancies reach whoever can act on them.',
        icon: 'shield',
      },
    ],
  },

  flow: {
    title: 'How it integrates',
    intro: 'An industrial deployment builds on existing processes. The usual order is as follows.',
    steps: [
      {
        label: '01',
        title: 'Connect',
        body: 'Identity fields and relevant events are defined, and the systems that already generate them are connected.',
        icon: 'plug',
      },
      {
        label: '02',
        title: 'Issue',
        body: 'Identities are issued in batches from production or import orders, signed by the issuer.',
        icon: 'key',
      },
      {
        label: '03',
        title: 'Label',
        body: 'The signed code is added to the label or seal of each unit on the packaging line.',
        icon: 'label',
      },
      {
        label: '04',
        title: 'Move and record',
        body: 'Transport, distribution and retail report events that complete the history of each unit.',
        icon: 'truck',
      },
      {
        label: '05',
        title: 'Verify and listen',
        body: 'The public verifies and reports; the brand receives the signals and decides where to act.',
        icon: 'scan',
      },
    ],
  },

  outcomes: {
    title: 'Expected outcomes',
    intro: 'What a deployment of this kind sets out to achieve, expressed without figures.',
    items: [
      'The ability to prove which units the brand issued and which it did not',
      'Visibility over transport, distribution and retail with data that used to be lost',
      'Early signals of diversions and copies from the registry',
      'A public verification experience carrying the brand’s visual identity',
      'Integration with current systems without duplicating processes',
    ],
    note: 'Expected outcomes are qualitative. No figures or measured results are presented.',
  },

  perspectives: {
    title: 'See it in the platform',
    items: [
      {
        key: 'journey',
        tag: 'For the chain',
        title: 'Product journey',
        body: 'Follow a unit from the factory to retail and see how each event completes its history.',
        cta: { label: 'See the journey', key: 'journey', variant: 'primary' },
        icon: 'link',
      },
      {
        key: 'verify',
        tag: 'For the public',
        title: 'Public verification',
        body: 'See what the public would see when checking one of your units from the browser.',
        cta: { label: 'Verify a product', key: 'verify', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'institutional',
        tag: 'For oversight',
        title: 'Institutional view',
        body: 'Consult the registry, anomalies and reported discrepancies from the organization’s point of view.',
        cta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
        icon: 'chart',
      },
    ],
  },

  disclaimer:
    'Nothing above claims commercial relationships, certifications or measured results. Integrations are described generically: each deployment agrees its own connectors.',

  cta: {
    title: 'Start with one product line',
    body:
      'An industrial pilot usually starts with one product, one packaging line and one distribution channel. We can help scope it.',
    primaryCta: { label: 'Contact the team', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Learn about the platform', key: 'platform', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Citizens                                                            */
/* ------------------------------------------------------------------ */

export const solutionsCitizens: SectorPageContent = {
  meta: {
    title: 'Citizens: verify a product before you buy it',
    description:
      'Verify a product at the point of sale from the browser, with nothing to install and no account to create, with clear results and discrepancy reporting.',
  },
  key: 'citizens',

  hero: {
    eyebrow: 'Solutions · Citizens',
    title: 'Check what you buy, on the spot and without complications',
    subtitle:
      'For anyone who wants to know whether a product is what it claims to be: scan, read a clear result and flag it if something does not match.',
    icon: 'citizen',
  },

  challenges: {
    title: 'Common challenges',
    intro: 'Verifying a product should be as easy as looking at its label. Today it rarely is.',
    items: [
      {
        title: 'No simple way to check',
        body: 'Existing tools require installing something, signing up or knowing technical details about the product.',
        icon: 'search',
      },
      {
        title: 'Labels get copied',
        body: 'A seal or a hologram is easy to imitate. Without a registry behind it, the label alone says little.',
        icon: 'label',
      },
      {
        title: 'Results that are hard to understand',
        body: 'A technical notice or a color without explanation does not help decide what to do next.',
        icon: 'info',
      },
      {
        title: 'Not knowing whom to tell',
        body: 'When something does not match, there is no clear channel to report it and no certainty that anyone will look at it.',
        icon: 'flag',
      },
    ],
  },

  approach: {
    title: 'Our approach',
    intro: 'Public verification designed for the point of sale: fast, clear and with no barriers to entry.',
    items: [
      {
        title: 'From the browser',
        body: 'Just scan the code with your phone’s camera or type it on the verification page.',
        icon: 'phone',
      },
      {
        title: 'No installation, no account',
        body: 'There is nothing to download and no personal data to hand over to verify a unit.',
        icon: 'lock',
      },
      {
        title: 'Plain language',
        body: 'The result says what was checked, how much confidence it provides and what the next step is, without technical jargon.',
        icon: 'document',
      },
      {
        title: 'Discrepancy reporting',
        body: 'If what you see does not match the registry, you can report it in a few steps with minimal, optional data.',
        icon: 'flag',
      },
    ],
  },

  flow: {
    title: 'How to verify',
    intro: 'Four steps that fit in the time it takes to decide on a purchase.',
    steps: [
      {
        label: '01',
        title: 'Scan or type the code',
        body: 'Point the camera at the code on the label or type the identifier on the verification page.',
        icon: 'qr',
      },
      {
        label: '02',
        title: 'Read the result',
        body: 'The page shows what was checked: signature, registry status, data match and anomalies.',
        icon: 'eye',
      },
      {
        label: '03',
        title: 'Compare with the product',
        body: 'Check the registry data — product, presentation, lot, destination — against what you hold in your hand.',
        icon: 'compare',
      },
      {
        label: '04',
        title: 'Report if something does not match',
        body: 'Send a discrepancy report. It reaches whoever can review it and helps protect other people.',
        icon: 'flag',
      },
    ],
  },

  outcomes: {
    title: 'What verifying gives you',
    intro: 'What public verification brings to buyers, expressed without figures.',
    items: [
      'A clear answer before paying, with nothing to install and no sign-up',
      'Knowing exactly what was checked and what was not',
      'A concrete next step when the result is not favorable',
      'A channel to report discrepancies that reaches the registry',
      'No personal data in exchange for verifying',
    ],
    note: 'Benefits are qualitative. No figures or measured results are presented.',
  },

  perspectives: {
    title: 'See it in the platform',
    items: [
      {
        key: 'verify',
        tag: 'For the public',
        title: 'Public verification',
        body: 'Try verification with sample codes and see the different possible results, explained in plain language.',
        cta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'For the chain',
        title: 'Product journey',
        body: 'Discover what lies behind the code: the path a unit travels before reaching your hands.',
        cta: { label: 'See the journey', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nothing above claims certifications or measured results.',

  cta: {
    title: 'Try it with a sample code',
    body:
      'Public verification includes several sample codes with different results. It is the fastest way to understand what you will see when you scan.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'How it works', key: 'howItWorks', variant: 'secondary' },
  },
};
