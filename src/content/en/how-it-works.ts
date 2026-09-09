import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'How it works: from printing to public lookup',
    description:
      'How each medicine QR is created: issuance, printing and activation after production, followed by public lookup and field control with explained results.',
  },

  hero: {
    eyebrow: 'How it works',
    title: 'From medicine to record, step by step',
    subtitle:
      'Every medicine bottle has its own identity. The QR is printed during production and activated when production ends and the owner completes its record. A later lookup lets the person compare the unit with that record.',
  },

  steps: {
    title: 'Five steps',
    intro:
      'The process connects the production order with packaging, activation and public lookup. It records the identifier’s lifecycle without requiring transport, distribution or sales events.',
    items: [
      {
        label: '01',
        title: 'Identity issuance',
        body: 'The manufacturer or importer requests an issuance linked to its order. A different signed identifier is generated for each unit. The record is linked to the product; lot and expiry are completed after production, before activation.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Printing per unit',
        body: 'The QR and readable identifier are printed on each medicine carton, label or seal. A press proof checks readability, contrast and quiet zone. Printing alone does not activate the code.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Activation after production',
        body: 'When the run ends, the owner completes lot and expiry and confirms the produced units. Used codes are activated; unused ones are voided when issuance closes. A lookup before activation remains under review.',
        icon: 'history',
      },
      {
        label: '04',
        title: 'Public verification',
        body: 'The person scans the QR or types the identifier. The lookup separates signature, registry, data and signals; the person compares name, 120 ml presentation, concentration, health registration, lot and expiry with the package.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Control and inspection',
        body: 'The responsible organisation reviews signals and discrepancies to guide field inspection. This website lets people prepare and download a report; delivery and follow-up use the organisation’s own channel.',
        icon: 'search',
      },
    ],
  },

  chain: {
    title: 'The lifecycle, node by node',
    intro:
      'These stages organise what the registry knows. Issuance, printing and activation precede lookup; signals and closure record reviews or withdrawal where applicable. They do not describe a logistics route.',
    nodes: [
      {
        id: 'issuance',
        label: 'Issuance',
        description: 'The platform derives and signs each unit’s identifier, within the order that was requested.',
        icon: 'signature',
      },
      {
        id: 'labeling',
        label: 'Printing',
        description: 'The unique QR is printed on the packaging and its readability is checked before activation.',
        icon: 'label',
      },
      {
        id: 'activation',
        label: 'Activation',
        description: 'After production, lot and expiry are completed and the used codes are confirmed; only then do they become active.',
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
        description: 'Every lookup adds context: when the first one happened, how many there have been and which patterns need review. A signal does not prove a copy.',
        icon: 'chart',
      },
      {
        id: 'closure',
        label: 'Closure',
        description: 'Closure preserves the history and records voided or withdrawn identifiers. It does not record a sale.',
        icon: 'lock',
      },
    ],
    cta: { label: 'See the interactive journey', key: 'journey', variant: 'link' },
  },

  verification: {
    title: 'What happens when you verify',
    intro:
      'The result of a verification is not a single word. It is built from four independent signals, each with its own explanation.',
    signals: [
      {
        key: 'signature',
        title: 'Signature',
        body: 'Checks that the identity was issued by the expected issuer and has not been altered since.',
        icon: 'signature',
      },
      {
        key: 'registry',
        title: 'Registry status',
        body: 'Looks up whether the identity is active, suspended or revoked, and which events are recorded in its history.',
        icon: 'database',
      },
      {
        key: 'match',
        title: 'Data match',
        body: 'Shows the recorded data for the person to compare with the packaging. This site does not inspect the label or physical contents.',
        icon: 'compare',
      },
      {
        key: 'anomalies',
        title: 'Anomalies',
        body: 'Looks for patterns worth reviewing: the same code looked up in different places, events out of sequence or inconsistent locations.',
        icon: 'alert',
      },
    ],
    outcomes: [
      {
        status: 'valid',
        title: 'Record without alerts',
        body: 'The registry declares a valid signature, an active identity and no alerts. The person must compare the data with the package: the result does not certify its contents or confirm that the label is not a copy.',
      },
      {
        status: 'warning',
        title: 'With warnings',
        body: 'The registry declares a valid signature and a signal that needs review, such as repeated lookups or a code awaiting activation. Compare the unit and, where appropriate, prepare a report for the responsible organisation.',
      },
      {
        status: 'invalid',
        title: 'Invalid signature or unrecognized identity',
        body: 'The code does not correspond to an issued identity, or the registry indicates it was revoked. Do not treat the unit as verified and use the discrepancy report.',
      },
      {
        status: 'unverifiable',
        title: 'Could not verify',
        body: 'It was not possible to consult the registry — for example, without a connection — or the code could not be read. This is not a verdict on the unit: try again when possible.',
      },
    ],
    caution:
      'A valid signature does not certify the physical contents or prevent copying the label. Physical anti-copy measures and tax validation are planned for phase 2. Validating payments depends on integration with and authorisation from the competent authority; this feature is not available in the example.',
  },

  requirements: {
    title: 'What you need to verify',
    intro: 'Very little. Public verification was designed to work at the point of sale with what anyone already carries.',
    items: [
      {
        title: 'A current browser',
        body: 'Verification opens as a web page on a phone or a desktop computer.',
        icon: 'phone',
      },
      {
        title: 'No installation, no account',
        body: 'There is nothing to download or sign up for. No personal data is requested to verify either.',
        icon: 'lock',
      },
      {
        title: 'A connection to consult the registry',
        body: 'Registry status and anomalies require a connection. Without one, the result is marked as unverifiable and can be retried.',
        icon: 'offline',
      },
      {
        title: 'A readable code',
        body: 'The code on the label is scanned with the camera or typed by hand if it is damaged.',
        icon: 'qr',
      },
    ],
  },

  cta: {
    title: 'See it with a sample code',
    body:
      'Public verification includes sample codes that show each of the possible results.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'See the journey', key: 'journey', variant: 'secondary' },
  },
};
