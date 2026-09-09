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
      'Traza proposes a shared foundation for medicine manufacturers, health authorities and the public. This website lets you query sample units and prepare local reports; integrations are agreed per deployment.',
  },

  cards: [
    {
      key: 'government',
      title: 'Health authorities',
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
      title: 'Manufacturers and importers',
      body: 'Connect issuance, labelling, activation and lookups to review the identity of each unit.',
      bullets: [
        'Identity issued from production or import',
        'Proposed integration with management, production and labelling',
        'Signals of inconsistencies in the unit record',
      ],
      cta: { label: 'See solutions for industry', key: 'solutionsIndustry', variant: 'secondary' },
      icon: 'industry',
    },
    {
      key: 'citizens',
      title: 'Citizens',
      body: 'Compare a product with its record, understand the result and prepare a local copy if something does not match.',
      bullets: [
        'Nothing to install, no account to create',
        'Result explained in plain language',
        'Local report preparation and download',
      ],
      cta: { label: 'See solutions for citizens', key: 'solutionsCitizens', variant: 'secondary' },
      icon: 'citizen',
    },
  ],

  sharedLayer: {
    title: 'What all solutions share',
    body:
      'There are not three different products, but one platform with different views and rules for each actor. This lets a health authority, a manufacturer and a person in a pharmacy look at the same registry with the level of detail that corresponds to each of them.',
    bullets: [
      'Unit-level digital identity signed by the issuer',
      'A record of issuance, labelling, activation, lookup, signals and closure',
      'Public verification from the browser, with no installation or account',
      'Rules, brand and context configurable per tenant',
      'Downloadable reports to hand over through an organization’s channel',
    ],
  },

  multisector: {
    title: 'One record for people working with medicines',
    body:
      'The proposal shares unit-level identity, lifecycle events and public lookup. Each deployment agrees its data, permissions and rules: issuance, labelling, activation, lookup, signals and closure.',
    sectors: [
      'Medicine manufacturers',
      'Medicine importers',
      'Pharmacies',
      'Healthcare facilities',
      'Quality teams',
      'Health authorities',
    ],
    note: 'These actors illustrate possible roles in a medicines pilot. The proposal does not claim relationships, participation or certifications of any organization.',
  },

  cta: {
    title: 'Let’s talk about your case',
    body:
      'If your organization controls, manufactures or imports medicines that need a verifiable identity, we can talk about a well-scoped pilot.',
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
        body: 'Production, import and oversight record their data in different systems that can rarely be cross-checked.',
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
      'We propose an identity and registry layer with institutional rules, public lookup and inspection. Integrations and permissions are agreed and validated for each deployment.',
    items: [
      {
        title: 'Signed unit-level identity',
        body: 'Each unit receives an identifier signed by its issuer, under rules defined by the institution.',
        icon: 'signature',
      },
      {
        title: 'Auditable registry',
        body: 'The design provides for recording issuance, labelling, activation, lookups, signals and closure, with the responsible party and date for audit.',
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
        body: 'Anyone can query a unit and prepare and download a local report. This website does not send it or change the registry; it must be handed to the responsible organization.',
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
        title: 'Label and activate',
        body: 'The issuer confirms printing and, once production has finished and the record is complete, activates the codes of the units produced.',
        icon: 'link',
      },
      {
        label: '04',
        title: 'Open public verification',
        body: 'The public queries from the browser, under the institutional brand if approved. On this website they can download a local report to hand over through an organization’s channel.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Inspect and act',
        body: 'The proposed deployment provides for reviewing signals, recording actions and closing cases. Reports downloaded on this website do not automatically enter that view.',
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
      'Public lookup and local report preparation with no installation or account',
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
        body: 'Explore sample units, signals and inspections. This view illustrates oversight work; it does not receive reports downloaded from public lookup.',
        cta: { label: 'Open the institutional view', key: 'institutional', variant: 'primary' },
        icon: 'chart',
      },
      {
        key: 'verify',
        tag: 'For the public',
        title: 'Public verification',
        body: 'See what the public would see when verifying a unit, with the co-brand example from the medicines use case.',
        cta: { label: 'Verify with the sample tenant', key: 'verify', suffix: '?t=medicamentos', variant: 'secondary' },
        icon: 'scan',
      },
      {
        key: 'journey',
        tag: 'For the record',
        title: 'Unit lifecycle',
        body: 'Follow a unit from its issuance through its lookups and see which events are recorded.',
        cta: { label: 'See the lifecycle', key: 'journey', variant: 'secondary' },
        icon: 'link',
      },
    ],
  },

  disclaimer:
    'Nothing above claims a relationship with governments or agencies, certifications or measured results. The medicines use case is a pilot proposal.',

  cta: {
    title: 'Let’s talk about a well-scoped pilot',
    body:
      'A pilot starts with one product, one framework of rules and a small group of actors. We can help define it.',
    primaryCta: { label: 'Contact the team', key: 'company', variant: 'primary' },
    secondaryCta: { label: 'Learn about the medicines use case', key: 'caseMedicines', variant: 'secondary' },
  },
};

/* ------------------------------------------------------------------ */
/* Industry                                                            */
/* ------------------------------------------------------------------ */

export const solutionsIndustry: SectorPageContent = {
  meta: {
    title: 'Industry: unit-level identity and brand protection',
    description:
      'Unit-level identity for manufacturers and importers: issuance, labelling, activation and public lookup, with proposed integrations for production systems.',
  },
  key: 'industry',

  hero: {
    eyebrow: 'Solutions · Industry',
    title: 'Identity per unit and evidence of its lifecycle',
    subtitle:
      'For manufacturers and importers who want to connect production, activation and lookups, review inconsistencies and give the public a way to compare each unit with its record.',
    icon: 'industry',
  },

  challenges: {
    title: 'Common challenges',
    intro:
      'Manufacturers and importers need to connect each unit to its lot, label and record. These are the problems the proposal seeks to address.',
    items: [
      {
        title: 'Copies and diversions that damage the brand',
        body: 'A label is easy to copy. Without a per-unit identity, the brand cannot prove which units it issued and which it did not.',
        icon: 'alert',
      },
      {
        title: 'Little visibility after production',
        body: 'Without a per-unit record, production, activation and public lookups are hard to connect, and a code queried before activation is hard to review.',
        icon: 'eye',
      },
      {
        title: 'Data in separate systems',
        body: 'Production and quality control generate product, lot and expiry data, but those fields are not always linked to a publicly queryable unit identity.',
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
      'The proposal connects issuance, printing, activation after production finishes and public lookup. Connectors and controls are agreed and validated with each organization.',
    items: [
      {
        title: 'Identity per unit, not just per lot',
        body: 'Each unit receives a signed identifier from a manufacturer or importer order before it is printed on the packaging.',
        icon: 'fingerprint',
      },
      {
        title: 'Lifecycle events from your own systems',
        body: 'The issuer’s systems provide order, lot, expiry and production closure through agreed interfaces. Transport, distribution and sales are outside the scope.',
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
        body: 'The registry identifies issued units. Anyone spotting a discrepancy can download their report and hand it to the organization; this website does not send it or confirm receipt.',
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
        title: 'Activate when production closes',
        body: 'The owner confirms the produced units and completes their record. Used codes are activated; the remainder are voided when the issuance closes.',
        icon: 'history',
      },
      {
        label: '05',
        title: 'Query and review signals',
        body: 'The public queries and prepares local reports. In an agreed deployment, the organization reviews signals and documents actions and closure; downloads from this website are not sent automatically.',
        icon: 'scan',
      },
    ],
  },

  outcomes: {
    title: 'Expected outcomes',
    intro: 'What a deployment of this kind sets out to achieve, expressed without figures.',
    items: [
      'The ability to prove which units the brand issued and which it did not',
      'Visibility of issuance, activation and public lookups linked to each unit',
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
        tag: 'For the record',
        title: 'Unit lifecycle',
        body: 'Follow a unit from its issuance through its lookups and see how each event completes its history.',
        cta: { label: 'See the lifecycle', key: 'journey', variant: 'primary' },
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
        body: 'Explore sample records and signals from the organization’s point of view. This view does not receive reports prepared and downloaded on this website.',
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
      'An industrial pilot can start with one medicine, one packaging line and people responsible for issuance, activation and oversight. We can help scope it.',
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
      'Look up a product in your browser, compare its data and prepare a downloadable local report to hand to the responsible organization, with no account needed.',
  },
  key: 'citizens',

  hero: {
    eyebrow: 'Product lookup',
    title: 'Scan. Compare. Understand.',
    subtitle:
      'Compare a medicine with its record: scan, read the result and download a report if something does not match. The lookup does not certify physical authenticity.',
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
        body: 'Read the QR with the camera, select an image or type the code on the verification page.',
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
        body: 'Prepare a description without personal data and download the report on this device. It is not sent and does not change the registry; hand it to the responsible organization for review.',
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
        body: 'Point the camera at the label’s QR, select a saved image or type the identifier.',
        icon: 'qr',
      },
      {
        label: '02',
        title: 'Read the result',
        body: 'The result explains the identity status, registry data and signals. Sample codes illustrate these checks; they do not certify the physical object.',
        icon: 'eye',
      },
      {
        label: '03',
        title: 'Compare with the product',
        body: 'Compare the record’s product, presentation, concentration, lot and expiry with the medicine label.',
        icon: 'compare',
      },
      {
        label: '04',
        title: 'Prepare a report if something does not match',
        body: 'Describe the discrepancy and download the report. Review it before handing it over through the responsible organization’s channel; this website does not send it or confirm receipt.',
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
      'A local copy of the discrepancy to hand to the responsible organization',
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
        tag: 'For the record',
        title: 'Unit lifecycle',
        body: 'Explore a 120 ml oral-solution example: issuance, labelling, activation after production finishes, lookup, signals and closure.',
        cta: { label: 'See the lifecycle', key: 'journey', variant: 'secondary' },
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
