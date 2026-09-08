import type { PlatformContent } from '../types';

export const platform: PlatformContent = {
  meta: {
    title: 'Platform for identity, traceability and control',
    description:
      'Capabilities of the Traza platform: unit-level identity, chain event recording, public verification, institutional control views, and rules per tenant.',
  },

  hero: {
    eyebrow: 'Platform',
    title: 'One layer of identity, traceability and verification for real products',
    subtitle:
      'Traza brings together three things that usually live apart: the identity of each unit, the record of its movements, and a public, simple way to check both.',
  },

  capabilities: {
    title: 'What the platform does',
    intro:
      'Six capabilities that combine according to the deployment. None of them requires replacing the systems an organization already uses.',
    items: [
      {
        title: 'Unit-level digital identity',
        body: 'A unique, signed identifier for each unit, with the minimal data that describes it: manufacturer or importer, product and presentation, origin and lot.',
        icon: 'fingerprint',
      },
      {
        title: 'Chain event recording',
        body: 'Every relevant movement — factory dispatch, customs, labeling, transport, distribution, retail — is recorded as an event with date, place and responsible party.',
        icon: 'history',
      },
      {
        title: 'Public verification',
        body: 'Anyone verifies a unit from the browser, with nothing to install and no account to create. The result is explained by signals and in plain language.',
        icon: 'scan',
      },
      {
        title: 'Institutional control',
        body: 'Regulators and companies consult the registry, follow anomalies, coordinate field inspections and export information for audit.',
        icon: 'eye',
      },
      {
        title: 'Rules configurable per tenant',
        body: 'Each deployment defines its brand, its identity fields, its event types, its roles and the context the public sees when verifying.',
        icon: 'settings',
      },
      {
        title: 'Discrepancy reporting',
        body: 'Whoever verifies can report a difference between what they see and what the registry says, with minimal, optional data.',
        icon: 'flag',
      },
    ],
  },

  identity: {
    title: 'The identity of a unit',
    body:
      'A Traza identity is a brief record, signed by its issuer, that answers four questions about the unit. It stores no personal or tax data: it stores what is needed to recognize the product and follow its journey.',
    fields: [
      {
        label: 'Manufacturer / importer',
        description: 'The organization that produced the unit or brought it to market, and that signs it as issuer.',
        icon: 'factory',
      },
      {
        label: 'Product / presentation',
        description: 'What it is and in what format: type, variant, packaging and declared content.',
        icon: 'box',
      },
      {
        label: 'Origin / lot',
        description: 'Place of origin and the production or import lot it belongs to.',
        icon: 'map-pin',
      },
      {
        label: 'Movements / destination',
        description: 'The sequence of recorded events and the intended destination according to the latest one.',
        icon: 'truck',
      },
    ],
    example: {
      caption: 'Example of a unit-level identity',
      code: 'TRZ-7F2K-6C2A-84MZ',
      rows: [
        { label: 'Manufacturer / importer', value: 'Cafetalera Monte Azul' },
        { label: 'Product / presentation', value: 'Café Monte Azul · medium roast · 500 g bag' },
        { label: 'Origin / lot', value: 'Beneficio Monte Azul · COS-MA-26-07' },
        { label: 'Movements / destination', value: 'Origin → labeling → transport → distribution → retail · Mercado San Marcelo' },
        { label: 'Registry status', value: 'Signature issued · active in registry' },
      ],
    },
  },

  architecture: {
    title: 'Target architecture',
    intro:
      'The platform is organized in layers that can be deployed together or integrated with existing systems. What follows is the architecture it is designed toward, not a description of a system in production.',
    layers: [
      {
        name: 'Identity issuance',
        body: 'The issuer generates identifiers and signs them with its own keys. For the spirits use case, ECDSA P-256 is proposed.',
        icon: 'key',
      },
      {
        name: 'Event registry',
        body: 'An ordered, auditable registry of each unit’s events, with who reported them and when.',
        icon: 'database',
      },
      {
        name: 'Public verification',
        body: 'A web service that evaluates signature, status, data match and anomalies, and returns an explained, tenant-aware result.',
        icon: 'globe',
      },
      {
        name: 'Control and reporting',
        body: 'Institutional views to consult the registry, follow discrepancies and coordinate field inspections.',
        icon: 'chart',
      },
      {
        name: 'Integration',
        body: 'Interfaces to receive events from existing systems and export information back to them.',
        icon: 'plug',
      },
    ],
    note: 'Target product architecture. Cryptographic and security controls are implemented and audited in each deployment.',
  },

  verificationModel: {
    title: 'What is checked when verifying',
    intro:
      'A verification does not give a single verdict. It evaluates four signals separately and explains them, so that whoever verifies knows what was checked, how much confidence it provides and what the next step is.',
    signals: [
      {
        key: 'signature',
        title: 'Signature',
        body: 'Whether the identity was issued by the expected issuer and has not been altered.',
        icon: 'signature',
      },
      {
        key: 'registry',
        title: 'Registry status',
        body: 'Whether the identity is active, suspended or revoked, and which events are recorded for it.',
        icon: 'database',
      },
      {
        key: 'match',
        title: 'Data match',
        body: 'Whether what the label shows matches what the registry says: product, presentation, lot and destination.',
        icon: 'compare',
      },
      {
        key: 'anomalies',
        title: 'Anomalies',
        body: 'Whether there are signals worth reviewing: repeated lookups of the same code, inconsistent locations or events out of sequence.',
        icon: 'alert',
      },
    ],
    caution:
      'A valid signature indicates that the identity was issued; it does not describe the physical content or prevent a label from being copied. That is why the result is never reduced to a single word: it is explained, it comes with a next step, and physical inspection remains necessary.',
  },

  tenancy: {
    title: 'Co-brand and white-label per tenant',
    body:
      'The master brand lives at traza.technology. Each deployment — by country, regulator or industry — can present its own visual identity and its own verification context, on the same platform.',
    bullets: [
      'Co-brand lockup or own brand (white-label) in each deployment',
      'Configurable accent colors, context texts and next step',
      'Identity fields and event types specific to each sector',
      'Roles and permissions defined by each institution',
      'Public verification reads the tenant from the URL and adapts the result',
    ],
    exampleNote:
      'The example shown corresponds to the spirits use case: a typographic co-brand lockup included in a pilot proposal addressed to a regulator. It is subject to approval and does not imply an official relationship.',
  },

  integration: {
    title: 'Integration with existing systems',
    body:
      'The platform is designed to coexist with the management, warehouse and logistics systems organizations already use, without replacing them.',
    bullets: [
      'Receiving events from management and warehouse systems (ERP, WMS) through documented interfaces',
      'Issuing identities in batches from production or import orders',
      'Exporting the registry for audit and analysis',
      'Issuer authentication and traceability of who reports each event',
    ],
    note: 'Integration capabilities are described generically and without naming products: each deployment agrees its own connectors.',
  },

  cta: {
    title: 'See the platform in action',
    body:
      'The three views show public verification, the journey of a unit and the institutional dashboard.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'How it works', key: 'howItWorks', variant: 'secondary' },
  },
};
