import type { CaseSpiritsContent } from '../types';

export const caseSpirits: CaseSpiritsContent = {
  meta: {
    title: 'Use case: Spirits',
    description:
      'Pilot proposal for a spirits regulator: signed unit-level identity, web-based public verification and field inspection from the outset. A proposal only, with no official implementation claimed.',
  },

  hero: {
    eyebrow: 'Use case · Spirits',
    tag: 'Pilot proposal',
    title: 'Unit-level identity and public verification for a regulated spirits market',
    subtitle:
      'Traza’s first use case proposes giving each bottle a signed identity, recording its journey from the factory or customs to retail and letting anyone verify it from the browser.',
    disclaimer:
      'This case is presented as a pilot proposal addressed to a spirits regulator. It does not describe an official implementation, does not imply a contractual relationship and does not claim the participation of any agency.',
  },

  context: {
    title: 'The problem it sets out to solve',
    paragraphs: [
      'In a regulated spirits market, units circulate whose identity cannot be checked. Control usually relies on documents, seals and lots; a carefully copied label passes as legitimate and a diverted unit leaves no trace.',
      'Field inspection faces a volume it cannot cover without signals to guide it. Teams go where they can, not necessarily where they are needed, and what they observe is rarely linked to the unit’s registry record.',
      'The public, for its part, has no simple way to verify what it buys. Tools that require installing something or creating an account are not used at the moment of purchase. The proposal starts from that reality: web-based verification, with no installation or account, at the point of sale.',
    ],
  },

  scope: {
    title: 'Proposed scope of the pilot',
    intro:
      'The pilot is proposed with a narrow scope: a set of products, a small group of chain actors and a defined period, with field inspection included from the start.',
    items: [
      {
        title: 'Signed unit-level identity',
        body: 'Each unit receives a unique identifier, signed by the manufacturer or importer that places it on the market.',
        icon: 'fingerprint',
      },
      {
        title: 'Labeling with a verifiable code',
        body: 'The identifier is added to the label or seal as a code readable by the camera of any phone.',
        icon: 'label',
      },
      {
        title: 'Chain event recording',
        body: 'Dispatch from the factory or customs, labeling, transport, distribution and arrival at retail are recorded in order.',
        icon: 'history',
      },
      {
        title: 'Web-based public verification',
        body: 'Anyone verifies from the browser and receives a result explained by signals, with the regulator’s context.',
        icon: 'scan',
      },
      {
        title: 'Field inspection',
        body: 'Inspectors verify on site, check against the registry and record what they observe within the pilot itself.',
        icon: 'search',
      },
      {
        title: 'Discrepancy reporting',
        body: 'Whoever detects a difference between the unit and the registry can report it with minimal, optional data.',
        icon: 'flag',
      },
    ],
  },

  actors: {
    title: 'Who takes part',
    intro: 'The proposal describes six roles. Each one sees the registry with the level of detail that corresponds to it.',
    items: [
      {
        role: 'Spirits regulator',
        body: 'Defines the framework, governs the registry, follows anomalies and reports, and directs field inspection. In the proposal, this role corresponds to the recipient of the pilot.',
        icon: 'government',
      },
      {
        role: 'Manufacturers and importers',
        body: 'Issue and sign the identities of their units and report factory dispatch or entry through customs.',
        icon: 'factory',
      },
      {
        role: 'Carriers and distributors',
        body: 'Report transfers, receipts and dispatches, completing the history of each unit.',
        icon: 'truck',
      },
      {
        role: 'Points of sale',
        body: 'Record the arrival of units and make the code available to the public.',
        icon: 'store',
      },
      {
        role: 'Field inspectors',
        body: 'Verify on site, check the physical unit against the registry and document what they observe.',
        icon: 'map-pin',
      },
      {
        role: 'The public',
        body: 'Verifies at the point of sale, reads a clear result and reports if something does not match.',
        icon: 'citizen',
      },
    ],
  },

  target: {
    title: 'Target architecture',
    intro:
      'The proposal describes the architecture the pilot would be designed toward. It is presented as a target, not as a built system.',
    items: [
      {
        title: 'Unit-level identity signed with ECDSA P-256',
        body: 'Each identifier is signed with elliptic-curve cryptography (ECDSA P-256) using keys managed by the issuer. It is proposed as the standard for the use case.',
        icon: 'signature',
      },
      {
        title: 'Web-based public verification, with no installation or account',
        body: 'A web service evaluates signature, registry status, data match and anomalies, and returns an explained result.',
        icon: 'globe',
      },
      {
        title: 'Chain event registry',
        body: 'An ordered, auditable registry of each unit’s events, with responsible party and date, exportable for audit.',
        icon: 'database',
      },
      {
        title: 'Field inspection within the pilot',
        body: 'Tools for inspectors to verify on site and record observations linked to each unit.',
        icon: 'search',
      },
      {
        title: 'Discrepancy reporting',
        body: 'A public channel to report differences between the unit and the registry, with minimal, optional data.',
        icon: 'flag',
      },
    ],
    note: 'Target architecture for the proposal: not implemented yet. Its development and audit form part of the scope that would be agreed with the institution.',
  },

  fieldInspection: {
    title: 'Field inspection is part of the pilot',
    body:
      'The proposal does not defer field inspection to a later phase: it includes it from the start. Signals from the registry guide the teams, and what they observe on site flows back into the registry.',
    bullets: [
      'On-site verification with the same web page the public uses, with additional views for the inspector',
      'A record of each inspection linked to the unit and the point of sale',
      'Prioritization based on anomalies and discrepancy reports',
      'Feedback into the registry: what is observed in the field updates the status of the unit',
    ],
  },

  cobrand: {
    title: 'Conditional co-brand',
    body:
      'The proposal envisions public verification showing the regulator’s brand alongside Traza’s. That lockup appears only within this use case and its sample tenant, as an illustration of how a co-brand deployment would look.',
    lockupNote:
      'The “SENIAT | TRAZA” lockup is an example of a conditional co-brand included in the pilot proposal. It is shown in typographic form, without any official emblem, and its use depends on the institution’s approval. It does not imply an official relationship, endorsement or approval.',
    cta: { label: 'See verification with the sample tenant', key: 'verify', suffix: '?t=licores', variant: 'secondary' },
  },

  nonClaims: {
    title: 'What this proposal does not claim',
    intro:
      'To avoid confusion, we put in writing what this page does not say.',
    items: [
      'It does not claim that an official implementation or a working system exists.',
      'It does not claim a contractual, commercial or institutional relationship with SENIAT or any other agency; SENIAT is mentioned only as the recipient of a pilot proposal.',
      'It does not present pilot figures: quantities, timelines, costs or results.',
      'It does not claim production-grade security: the architecture described is a target whose implementation is audited in each deployment.',
      'It does not offer legal or regulatory conclusions; the proposal does not replace the regulatory analysis that may be required.',
      'It does not authorize the use of any institution’s brand or emblem; the lockup shown is a conditional example.',
    ],
  },

  cta: {
    title: 'See the use case in the platform',
    body:
      'Public verification with the sample tenant, the journey of a bottle and the institutional view show how the pilot would look.',
    primaryCta: { label: 'Verify with the sample tenant', key: 'verify', suffix: '?t=licores', variant: 'primary' },
    secondaryCta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
  },
};
