import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'How it works: from identity to public lookup',
    description:
      'Step by step: how an identity is issued and signed, applied to the label, recorded as chain events, and explained by public verification, signal by signal.',
  },

  hero: {
    eyebrow: 'How it works',
    title: 'From the code on the label to the result on screen',
    subtitle:
      'Traza follows a simple principle: each unit has a signed identity, each moment of its lifecycle leaves an event and anyone can check both. This is how it happens, step by step.',
  },

  steps: {
    title: 'Five steps',
    intro:
      'From the moment a unit receives its identity until someone checks it in front of a shelf, the process passes through five moments.',
    items: [
      {
        label: '01',
        title: 'Identity issuance',
        body: 'The manufacturer or importer requests an issuance and the platform derives and signs a unique identifier per unit, with the keys in its custody. That identifier carries the four fields of the story: who issues it, what the product is, which lot it came from and when it expires.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Labeling',
        body: 'The signed identifier is printed as a code on the label, using the plant’s own infrastructure and after a press proof is approved. From then on, the physical unit and its digital identity travel together.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Event recording',
        body: 'When the lot closes, the issuer completes the record — lot and expiry date, or serial — and at that moment the codes become active. A code that is looked up before activation does not say “verified”: it says “under review”.',
        icon: 'history',
      },
      {
        label: '04',
        title: 'Public verification',
        body: 'Whoever has the unit in front of them scans the code or types it on the verification page. The service evaluates four signals and returns an explained result.',
        icon: 'scan',
      },
      {
        label: '05',
        title: 'Control and inspection',
        body: 'Regulators and companies follow anomalies and discrepancy reports, prioritize field inspections and record what is observed on site.',
        icon: 'search',
      },
    ],
  },

  chain: {
    title: 'The chain, node by node',
    intro:
      'The history of a unit is built from the events at these nodes. Not every deployment uses all of them; each tenant defines the ones that matter to it.',
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
        body: 'Compares the data on the label with the data in the registry: product, presentation, lot and expiry date.',
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
        title: 'Signature issued and data match',
        body: 'The identity was issued by the expected issuer, is active in the registry, its data matches the label and there are no anomalies. It is a solid signal; checking against the physical unit remains the complement.',
      },
      {
        status: 'warning',
        title: 'With warnings',
        body: 'The signature is valid, but the registry shows something worth reviewing: for example, the same code looked up from places a single unit cannot travel between in that time. The next step is to check against the unit and, if appropriate, report.',
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
      'A valid signature indicates that the identity was issued; it does not describe the physical content or prevent a label from being copied. That is why the result always explains what was checked, how much confidence it provides and what the next step is.',
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
