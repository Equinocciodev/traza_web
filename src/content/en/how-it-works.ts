import type { HowItWorksContent } from '../types';

export const howItWorks: HowItWorksContent = {
  meta: {
    title: 'How it works',
    description:
      'Step by step: how an identity is issued and signed, how it is applied to the label, how chain events are recorded, and how public verification explains each possible result signal by signal.',
  },

  hero: {
    eyebrow: 'How it works',
    title: 'From the code on the label to the result on screen',
    subtitle:
      'Traza follows a simple principle: each unit has a signed identity, each movement leaves an event and anyone can check both. This is how it happens, step by step.',
  },

  steps: {
    title: 'Five steps',
    intro:
      'From the moment a unit receives its identity until someone verifies it in a store, the process passes through five moments.',
    items: [
      {
        label: '01',
        title: 'Identity issuance',
        body: 'The manufacturer or importer generates a unique identifier for each unit and signs it with its own keys. That identifier carries the four fields of the story: manufacturer or importer, product and presentation, origin and lot, and intended destination.',
        icon: 'key',
      },
      {
        label: '02',
        title: 'Labeling',
        body: 'The signed identifier is printed as a code on the label or seal. From then on, the physical unit and its digital identity travel together.',
        icon: 'label',
      },
      {
        label: '03',
        title: 'Event recording',
        body: 'Each actor in the chain — customs, transport, distribution, retail — reports an event when the unit passes through its hands. The registry keeps them in order, with date and responsible party.',
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
        id: 'origin',
        label: 'Factory / customs',
        description: 'Point of issuance: the unit receives its identity when it leaves production or enters the country.',
        icon: 'factory',
      },
      {
        id: 'labeling',
        label: 'Labeling',
        description: 'The signed code is added to the label or seal of the unit.',
        icon: 'label',
      },
      {
        id: 'transport',
        label: 'Transport',
        description: 'Each transfer is recorded with origin, destination and date.',
        icon: 'truck',
      },
      {
        id: 'distribution',
        label: 'Distribution',
        description: 'Distribution centers confirm receipt and dispatch toward retail.',
        icon: 'warehouse',
      },
      {
        id: 'commerce',
        label: 'Retail',
        description: 'The point of sale records the arrival; the unit becomes available to the public.',
        icon: 'store',
      },
      {
        id: 'verification',
        label: 'Verification',
        description: 'The final verification compares the label with the registry and explains the result.',
        icon: 'scan',
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
        body: 'Compares the data on the label with the data in the registry: product, presentation, lot and destination.',
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
        body: 'The signature is valid, but the registry shows something worth reviewing: for example, repeated lookups of the same code or a movement outside the expected route. The next step is to check against the unit and, if appropriate, report.',
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
