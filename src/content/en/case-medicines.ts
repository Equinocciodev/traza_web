import type { CaseMedicinesContent } from '../types';

export const caseMedicines: CaseMedicinesContent = {
  meta: {
    title: 'Medicines: unit identity and public verification',
    description:
      'Digital identity for each medicine unit: QR printing, activation after production, public lookup and field control in a scoped pilot proposal for medicines.',
  },

  hero: {
    eyebrow: 'Use case · Medicines',
    tag: 'Pilot proposal',
    title: 'The QR is born with the medicine',
    subtitle:
      'Each 120 ml oral-solution bottle carries a unique QR from its packaging. The identity is issued, printed and activated after production; every subsequent lookup compares the unit with its record.',
    disclaimer:
      'This case is presented as a pilot proposal addressed to a medicines regulator. It does not describe an official implementation, does not imply a contractual relationship and does not claim the participation of any agency.',
  },

  context: {
    title: 'The problem it sets out to solve',
    paragraphs: [
      'A lot identifies a group; the Traza QR identifies each unit. Bottle and carton support comparison of product, concentration, dosage form, manufacturer or importer, health registration, lot and expiry. The example data does not refer to an authorised medicine.',
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
        title: 'Direct printing on the packaging',
        body: 'The QR is printed on the carton, label or seal during packaging. Every unit retains its identifier; one code is not reused for the entire lot.',
        icon: 'label',
      },
      {
        title: 'Lifecycle event recording',
        body: 'Issuance → printing → activation after production → lookup and control. Closing the lot record activates only the units actually produced.',
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
        role: 'Medicines regulator',
        body: 'Defines the framework, governs the registry, follows anomalies and reports, and directs field inspection. In the proposal, this role corresponds to the recipient of the pilot.',
        icon: 'government',
      },
      {
        role: 'Manufacturers and importers',
        body: 'Request identities for their units and complete product, concentration, dosage form, health registration, lot and expiry. They are responsible for the declared data.',
        icon: 'factory',
      },
      {
        role: 'Production and packaging',
        body: 'Print identifiers on packaging, check readability and close the record when production ends. This confirmation activates the codes used.',
        icon: 'label',
      },
      {
        role: 'Pharmacies and dispensing points',
        body: 'Make the code available to the public and compare packaging with its record. The pilot does not record sales, transport or distribution.',
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
        title: 'Lifecycle event registry',
        body: 'A record of issuance, printing, activation, lookups, signals and closure, with responsible party and date. No logistics movements need to be recorded.',
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
      { title: 'Anti-copy and tax validation · phase 2', body: 'Physical anti-copy measures and validation of tax payments would be evaluated in a later phase. Tax validation depends on integration with and authorisation from the competent authority; it is not available in this example. A digital signature alone does not prevent copying a label.', icon: 'shield' },
    ],
    note: 'Target architecture for the proposal: not implemented yet. Its development and audit form part of the scope that would be agreed with the institution.',
  },

  fieldInspection: {
    title: 'Field inspection is part of the pilot',
    body:
      'The proposal does not defer field inspection to a later phase: it includes it from the start. Signals from the registry guide the teams, and what they observe on site flows back into the registry. What arrives later is the dedicated inspector application; at first the work is done with the same web pages and the institutional views.',
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
      'The proposal allows a public and/or private company to present verification alongside Traza. The band and example use the Traza palette; each participant’s brand requires authorisation.',
    lockupNote:
      'The “EMPRESA PÚBLICA Y/O PRIVADA | TRAZA” lockup is an example of a conditional co-brand included in the pilot proposal. It is shown in typographic form, without any official emblem, and its use depends on the institution’s approval. It does not imply an official relationship, endorsement or approval.',
    cta: { label: 'See verification with the sample tenant', key: 'verify', suffix: '?t=medicamentos', variant: 'secondary' },
  },

  nonClaims: {
    title: 'What this proposal does not claim',
    intro:
      'To avoid confusion, we put in writing what this page does not say.',
    items: [
      'It does not claim that an official implementation or a working system exists.',
      'It does not claim a contractual, commercial or institutional relationship with any company, authority or agency.',
      'It does not present pilot figures: quantities, timelines, costs or results.',
      'It does not claim production-grade security: the architecture described is a target whose implementation is audited in each deployment.',
      'It does not offer legal or regulatory conclusions; the proposal does not replace the regulatory analysis that may be required.',
      'It does not authorize the use of any institution’s brand or emblem; the lockup shown is a conditional example.',
    ],
  },

  cta: {
    title: 'See the use case in the platform',
    body:
      'Public verification with the sample tenant, the lifecycle of a medicine bottle and the institutional view show how the pilot would look.',
    primaryCta: { label: 'Verify with the sample tenant', key: 'verify', suffix: '?t=medicamentos', variant: 'primary' },
    secondaryCta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
  },
};
