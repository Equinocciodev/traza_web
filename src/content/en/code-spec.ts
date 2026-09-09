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
      'This page distinguishes the working website lookup code from the target production format. The twenty-byte scheme requires implementation and cryptographic audit; the example lookup does not validate real signatures.',
  },

  contentsLabel: 'On this page',

  sections: [
    {
      id: 'requisitos',
      title: 'Five requirements that settle the design',
      intro:
        'The working example uses the TRZ-XXXX-XXXX-XXXX format and a local record. The requirements below belong to the target design; they do not describe cryptographic checks performed by this website.',
      code: { caption: 'Working lookup code on this website · example data', lines: ['TRZ-7F2K-4K7Q-92FA', 'https://traza.technology/en/verify/?c=TRZ-7F2K-4K7Q-92FA&t=medicamentos'] },
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
          body: 'The goal is to validate the signature before querying the registry. The scheme, keys, security and performance must be checked during implementation; this website does not perform that validation.',
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
        'The target format reserves twenty bytes in four parts. It is a design proposal awaiting validation, not the twelve-character format of codes that can be queried on this website.',
      diagram: 'payload',
      specs: [
        { label: 'Version', value: '1 byte', note: 'Lets the format change later without invalidating what is already printed.' },
        { label: 'Key epoch', value: '1 byte', note: 'Addresses the key it was signed with. Rotating keys does not invalidate history.' },
        { label: 'Unique id', value: '10 bytes', note: 'The issuance and the position within it, enciphered so they reveal neither order nor volume.' },
        { label: 'Truncated signature', value: '8 bytes', note: 'Field intended for an authenticator. The cryptographic scheme and its security require independent validation.' },
      ],
      note: 'The byte layout does not establish security or constitute a verified ECDSA signature. A copy preserves the same identifier and does not create another unit. The final format and anti-copy measures require validation in each deployment.',
    },
    {
      id: 'representacion',
      title: 'From twenty bytes to something you can read and type',
      intro:
        'The target representation proposes Base32 Crockford with a typing-error check. The following block is illustrative: it is not a cryptographic test vector or a code recognised by this website’s registry.',
      code: {
        caption: 'Illustrative target format · not queryable on this website',
        lines: [
          'TRZ-9FXK-2M4Q-J8TV-QH3N-7WPD-BL5R-XCK',
          '',
          'URL inside the QR (uppercase, alphanumeric mode):',
          'HTTPS://T.EXAMPLE/V/9FXK2M4QJ8TVQH3N7WPDBL5RXCK',
        ],
      },
      paragraphs: [
        'In the target format, the check digit would be checked before a service lookup. This website’s reader checks the example identifier format; it does not implement that algorithm or validate a cryptographic signature.',
        'The URL is uppercase on purpose. A QR’s alphanumeric mode encodes more information per module than byte mode, so the same content fits in a QR one or two versions smaller: it scans sooner and tolerates more damage. Scheme and domain are case-insensitive, and the server accepts the path in uppercase.',
        'A short domain matters too: fewer characters mean fewer modules, and fewer modules let you print smaller at the same level of error correction.',
      ],
    },
    {
      id: 'indice',
      title: 'The code is its own index',
      intro: 'The target architecture proposes addressing the record from the identifier. The described benefits require implementation and measurement; they are not results established by this website.',
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
        { label: 'Printed size', value: '≥ 22 × 22 mm', note: 'A reference for a medicine bottle; validate it on the selected package and substrate.' },
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
    body: 'The integration reference describes the target API. Public lookup lets you explore this website’s available example codes, with their results and limits explained.',
    primaryCta: { label: 'See the integration', key: 'integration', variant: 'primary' },
    secondaryCta: { label: 'Try a lookup', key: 'verify', variant: 'secondary' },
  },
};
