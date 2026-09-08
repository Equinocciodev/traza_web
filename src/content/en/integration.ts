import type { ReferencePageContent } from '../types';

/** Integration (EN). Mirrors `es/integration.ts` field by field. */
export const integration: ReferencePageContent = {
  meta: {
    title: 'Integration: issue, activate and look up by API',
    description:
      'The issuance, activation, binding and lookup endpoints, with idempotency, webhooks, delivery formats and the role-based permissions behind every one of them.',
  },

  hero: {
    eyebrow: 'Integration reference',
    title: 'The console and the API are the same truth',
    subtitle:
      'Anything you can do from the console you can do from the API, and the other way round. The console is not a privileged shortcut: it calls the same endpoints you do.',
  },

  contentsLabel: 'On this page',

  sections: [
    {
      id: 'emision',
      title: 'Issue and activate',
      intro:
        'There are two steps because a factory works that way: codes are printed while production runs, and the lot’s definitive data only exists once the run ends.',
      code: {
        caption: 'Endpoints of the issuance cycle',
        lines: [
          'POST /v1/issuances',
          '     Generates identifiers for a product. The record is optional:',
          '     if lot and expiry are supplied, the issuance is born activated.',
          '',
          'POST /v1/issuances/{id}/activate',
          '     Completes the record, which is what activates the codes. Four modes:',
          '     declared range · scanned bounds · scan session · whole issuance',
          '',
          'POST /v1/issuances/{id}/reassign',
          '     Corrects the record of a range. It stays in the audit trail.',
          '',
          'GET  /v1/issuances/{id}/labels',
          '     Paginated download, or streaming for large runs.',
        ],
      },
      paragraphs: [
        'The two steps are a right, not an obligation: an importer that already knows the lot and the expiry can issue and activate in a single call.',
        'Issuing requires an idempotency header. A retry after a dropped connection does not produce a second run or spend the balance twice: it returns exactly the same issuance.',
      ],
    },
    {
      id: 'activacion',
      title: 'Four ways to activate, ordered by certainty',
      intro:
        'Matching codes to a lot assumes the plant consumed the labels in order, and the physical world mixes rolls up. Hence more than one method.',
      items: [
        {
          title: 'Declared range',
          body: 'You declare from where to where, with its lot and expiry. It works in plants with orderly consumption, under declared responsibility.',
          icon: 'list',
        },
        {
          title: 'Scanned bounds · recommended',
          body: 'Opening the run, the label of the first unit is read; closing it, the last one. The system derives the range actually observed and absorbs offsets and waste.',
          icon: 'scan',
        },
        {
          title: 'Scan session',
          body: 'A session is opened for a lot and every code read during it is assigned to it. Assignment stops being an assumption and becomes an observation.',
          icon: 'clock',
        },
        {
          title: 'Sampling audit',
          body: 'Before dispatch, random units from each pallet are scanned and the assigned record is compared with what is printed. A mis-assigned pallet is caught before it leaves.',
          icon: 'compare',
        },
      ],
      note: 'Correcting the record is free while the range has no public lookups: the mistake stays in the factory. Once it has been looked up in the market, the correction needs approval and opens a case, because the passport already showed data and the change has to be defensible.',
    },
    {
      id: 'consulta',
      title: 'Look up and bind',
      code: {
        caption: 'Lookup and serial-mode endpoints',
        lines: [
          'GET  /v1/verify/{code}',
          '     Public lookup: status and passport. Anonymous, rate-limited.',
          '     Meant for integrators too: retail chains and customs.',
          '',
          'GET  /v1/labels/{code}',
          '     Looks up one of your own labels, in more detail than the public one.',
          '',
          'POST /v1/labels/bind',
          '     Serial mode: binds a code to the manufacturer’s serial, 1 to 1.',
          '',
          'POST /v1/labels/void',
          '     Voids ranges, with a reason. It stays in the audit trail.',
          '',
          'Webhooks: issuance.issued · label.alert',
        ],
      },
      paragraphs: [
        'In serial mode, a serial repeated within the same product, or a second attempt to bind the same code, is rejected and raises a signal. The reverse index from serial to code is what later enables a per-unit warranty or a surgical recall.',
        'The full specification is published as OpenAPI, and the version lives in the path: what works today keeps working when the next one appears.',
      ],
    },
    {
      id: 'entrega',
      title: 'How the result arrives',
      specs: [
        { label: 'Issuance receipt', value: 'Issuance, range, record state, your own reference and a digest of the content', note: 'The digest lets you check the integrity of what the print shop received.' },
        { label: 'Your own reference', value: 'Whatever order or run number you use', note: 'It travels with the issuance and is filterable: reconciling with your management system is direct.' },
        { label: 'Download', value: 'CSV · XLSX · images · imposition PDF', note: 'Every download stays in the audit trail: labels are fiscal instruments.' },
        { label: 'Production line', value: 'Native thermal-printer language', note: 'To label at machine speed, without going through a PDF.' },
        { label: 'Visible sequence', value: 'One running number per product', note: 'Internally the code carries issuance and position; on screen everything speaks in a sequence that never repeats.' },
      ],
    },
    {
      id: 'permisos',
      title: 'Identities and permissions',
      intro:
        'An issuer’s account authorises the creation of fiscal instruments. The asymmetry with the public is deliberate.',
      items: [
        {
          title: 'The public has no account',
          body: 'Looking up and reporting require no registration. Contact details in a report are optional and only serve to follow it up.',
          icon: 'citizen',
        },
        {
          title: 'The console requires a second factor',
          body: 'Corporate email and password with a mandatory second factor, and an optional passkey for anyone who wants phishing resistance. Nobody gets in with a password alone.',
          icon: 'key',
        },
        {
          title: 'No social sign-in',
          body: 'An issuer’s identity is corporate. A personal email address should not control an account that issues.',
          icon: 'shield-check',
        },
        {
          title: 'Machine identity',
          body: 'Integrations use an API key with request signing, specific scopes and rotation. Revocable per key and per device.',
          icon: 'plug',
        },
      ],
    },
    {
      id: 'degradacion',
      title: 'What keeps working when something fails',
      intro:
        'A fiscal system cannot stop production or trade. That stops being an aspiration and becomes a design requirement.',
      items: [
        {
          title: 'Printing does not depend on the connection',
          body: 'The range is downloaded once and the local process feeds the printer, with its own queue and consumption reporting when it reconnects.',
          icon: 'offline',
        },
        {
          title: 'Public lookup and issuance are separate planes',
          body: 'The lookup has to keep answering even while issuance is under maintenance. They do not share a path.',
          icon: 'layers',
        },
        {
          title: 'Fail open on reads, fail closed on writes',
          body: 'If the rate limiter degrades, the lookup is served. Writes and authentication, by contrast, fail closed.',
          icon: 'lock',
        },
      ],
    },
  ],

  cta: {
    title: 'Before you integrate',
    body: 'The identifier format and the print specifications are in the label reference. If you want to understand why the design makes these calls, the precedents page walks through the systems that tried it first.',
    primaryCta: { label: 'See the label and the code', key: 'codeSpec', variant: 'primary' },
    secondaryCta: { label: 'Why this design', key: 'rationale', variant: 'secondary' },
  },
};
