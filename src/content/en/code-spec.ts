import type { ReferencePageContent } from '../types';

/** The label and the code (EN). Mirrors `es/code-spec.ts` field by field. */
export const codeSpec: ReferencePageContent = {
  meta: {
    title: 'The label and the code: format and specifications',
    description:
      'How a unit’s identifier is built, why it fits in a small QR, what the printing has to satisfy, and why the code is its own index rather than a lookup key.',
  },

  hero: {
    eyebrow: 'Technical reference',
    title: 'A short code, signed and checkable at a glance',
    subtitle:
      'A unit’s identifier has to survive a small label, a mediocre camera and somebody typing it by hand. This is what is required of it and how it is built.',
  },

  contentsLabel: 'On this page',

  sections: [
    {
      id: 'requisitos',
      title: 'Five requirements that settle the design',
      intro:
        'The format is not an aesthetic choice: each requirement rules alternatives out. Together the five leave very few options open.',
      items: [
        {
          title: 'Unique at scale, with no central coordination',
          body: 'Several processes must be able to generate identifiers in parallel without consulting each other and without risking a collision.',
          icon: 'fingerprint',
        },
        {
          title: 'Not guessable',
          body: 'Knowing one code must not let you derive others. A simple sequence would be enumerable: someone would print valid “future” codes.',
          icon: 'lock',
        },
        {
          title: 'Checkable without consulting the database',
          body: 'The signature validates on its own. An invented code is discarded in microseconds of CPU, and the registry only serves codes that exist.',
          icon: 'signature',
        },
        {
          title: 'Short',
          body: 'It has to fit in a small QR with enough error correction to tolerate scuffs, humidity and a curved label.',
          icon: 'qr',
        },
        {
          title: 'Readable by a person',
          body: 'If the camera fails, the code is typed by hand on the lookup page. That forces grouped characters and a check digit.',
          icon: 'user',
        },
      ],
    },
    {
      id: 'anatomia',
      title: 'Anatomy of the identifier',
      intro:
        'What travels inside the code is twenty bytes in four parts. Each one answers one of the requirements above.',
      diagram: 'payload',
      specs: [
        { label: 'Version', value: '1 byte', note: 'Lets the format change later without invalidating what is already printed.' },
        { label: 'Key epoch', value: '1 byte', note: 'Addresses the key it was signed with. Rotating keys does not invalidate history.' },
        { label: 'Unique id', value: '10 bytes', note: 'The issuance and the position within it, enciphered so they reveal neither order nor volume.' },
        { label: 'Truncated signature', value: '8 bytes', note: 'What stops an invented code from passing the first filter.' },
      ],
      note: 'The signature protects against inventing codes, not against copying one: a copied code is valid. Other layers work against copying, and they are explained under Security and trust.',
    },
    {
      id: 'representacion',
      title: 'From twenty bytes to something you can read and type',
      intro:
        'The text uses Base32 Crockford, an alphabet that avoids the characters people confuse and that brings its own check digit.',
      code: {
        caption: 'Textual form, grouped for manual reading',
        lines: [
          'TRZ-9FXK-2M4Q-J8TV-QH3N-7WPD-BL5R-XCK',
          '',
          'URL inside the QR (uppercase, alphanumeric mode):',
          'HTTPS://T.EXAMPLE/V/9FXK2M4QJ8TVQH3N7WPDBL5RXCK',
        ],
      },
      paragraphs: [
        'The check digit is validated in the browser, before any service is called: a typing mistake is flagged instantly and does not spend a lookup.',
        'The URL is uppercase on purpose. A QR’s alphanumeric mode encodes more information per module than byte mode, so the same content fits in a QR one or two versions smaller: it scans sooner and tolerates more damage. Scheme and domain are case-insensitive, and the server accepts the path in uppercase.',
        'A short domain matters too: fewer characters mean fewer modules, and fewer modules let you print smaller at the same level of error correction.',
      ],
    },
    {
      id: 'indice',
      title: 'The code is its own index',
      intro: 'This is where the performance comes from, and it is the part of the design that departs most from the usual.',
      paragraphs: [
        'The epoch addresses the key, so no keys have to be tried. The signature discards junk without touching storage. The embedded issuance points straight at the single record holding the passport. And the position within the issuance is the exact key of the row.',
        'Nothing searches; everything addresses. That is the difference between a random identifier — which forces a database lookup even to discard junk — and a signed one, which decides valid or invented before asking anything.',
        'A code’s validity is proved by derivation, not by a stored row. Issuing an order writes one record with its size and its state; the labels exist mathematically from that moment. The row for a specific label is born on its first lookup, so only the units somebody actually looks at take up space.',
      ],
      note: 'A practical consequence: reprinting a range years later produces exactly the same bytes. There are no lost codes, and an archived range that somebody looks up comes back to life without breaking the lookup.',
    },
    {
      id: 'impresion',
      title: 'Print specifications',
      intro:
        'There is no proprietary hardware: each issuer prints with its own infrastructure. What is fixed is the minimum that makes the code readable in a shop with bad light.',
      specs: [
        { label: 'Symbology', value: 'QR model 2', note: 'The most widely supported standard in phone cameras.' },
        { label: 'Error correction', value: 'Level M minimum, Q recommended', note: 'Tolerates scuffs and dirt and still decodes.' },
        { label: 'Module size', value: '≥ 0.33 mm', note: 'Below that, lower-end cameras start to fail.' },
        { label: 'Quiet zone', value: '4 modules', note: 'The white margin is part of the code, not decoration.' },
        { label: 'Printed size', value: '≥ 22 × 22 mm', note: 'Enough for a bottle; it forces the content to stay short.' },
        { label: 'Contrast', value: '≥ 40 %', note: 'Measured on the real substrate, not on the designer’s screen.' },
        { label: 'Next to the code', value: 'Last characters in plain text', note: 'The fallback for when the camera will not cooperate.' },
      ],
      note: 'Before the run, the issuer uploads a printed sample and the system checks it: it decodes the QR, measures quiet zone and contrast, and confirms the human-readable code matches. The approved sample stays linked to that issuance.',
    },
    {
      id: 'plantillas',
      title: 'Templates and print outputs',
      intro:
        'The issuer picks a system template and does not edit the layout: the system injects the data. That way a label printed today and one printed next year are comparable.',
      items: [
        {
          title: 'Deterministic rendering',
          body: 'The same code with the same template version produces a byte-for-byte identical file. Artwork need not be stored: it is regenerated.',
          icon: 'refresh',
        },
        {
          title: 'For the print shop',
          body: 'A vector imposition PDF, with cut and registration marks and bleed, to run full sheets.',
          icon: 'document',
        },
        {
          title: 'For the production line',
          body: 'Native thermal-printer language, to label in line at the machine’s own speed.',
          icon: 'factory',
        },
        {
          title: 'For overprinting',
          body: 'A variable-layer-only output, when the security background is already pre-printed in offset.',
          icon: 'layers',
        },
      ],
      note: 'Printing does not depend on the connection: the range is downloaded once and a local process feeds the printer, with its own queue and deferred reporting when it reconnects.',
    },
  ],

  cta: {
    title: 'What comes next',
    body: 'If you want to know how an issuance is requested and activated from your own systems, the integration reference walks through it endpoint by endpoint. If you would rather see it working, public verification is open.',
    primaryCta: { label: 'See the integration', key: 'integration', variant: 'primary' },
    secondaryCta: { label: 'Try a lookup', key: 'verify', variant: 'secondary' },
  },
};
