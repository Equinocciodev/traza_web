import type { ReferencePageContent } from '../types';

/** Why this design (EN). Mirrors `es/rationale.ts` field by field. */
export const rationale: ReferencePageContent = {
  meta: {
    title: 'Why this design: the precedents and the lessons',
    description:
      'Which existing fiscal-marking systems each Traza decision comes from, what went wrong in those that were switched off, and the ten principles it inherits.',
  },

  hero: {
    eyebrow: 'Precedents',
    title: 'Almost every one of these decisions was tried somewhere else first',
    subtitle:
      'Unit-level fiscal marking is not a new idea. There are national systems that have run for years, and at least one large one that was switched off. It is worth saying where each decision comes from.',
  },

  contentsLabel: 'On this page',

  sections: [
    {
      id: 'sistemas',
      title: 'The systems used as reference',
      intro:
        'They are cited by name and by what they contribute to the design. Traza has no relationship with any of them, or with the authorities that govern them: they are public precedents.',
      items: [
        {
          title: 'Chestny ZNAK',
          body: 'Marks each unit with a code carrying an embedded signature, and the manufacturer requests codes over an API, prints, activates and reports. It validates the hybrid model: a signature checkable without a lookup, plus state in the registry.',
          icon: 'signature',
        },
        {
          title: 'The European tobacco traceability system',
          body: 'Identifier issuers independent of the industry, a primary repository held by industry and a secondary repository held by the regulator. Two ideas come from here: the audit mirror and the expiry of codes that are never applied.',
          icon: 'eye',
        },
        {
          title: 'Fiscal marking as a turnkey service',
          body: 'A unique code, a physical security element and activation on the production line with independent counting. It confirms that the licensed-operator model works; its risk is dependence on the supplier.',
          icon: 'plug',
        },
        {
          title: 'Programmes that started with one category',
          body: 'Beginning with a single sector and a few large issuers rather than the whole universe. Also their limit: traceability identifies what is illegal, it does not stop it; street inspection is still needed.',
          icon: 'search',
        },
        {
          title: 'A beverage system that was switched off',
          body: 'It reached billions of containers with automatic counters in the plant, and was deactivated over a cost dispute. Electronic invoicing did not replace the physical count, and under-declaration came back.',
          icon: 'warning',
        },
        {
          title: 'Physical stamps with public lookup',
          body: 'The same identity in three carriers — barcode, QR and text — on a stamp with security features. Its audit taught the central lesson: a digital match does not prove physical authenticity.',
          icon: 'compare',
        },
        {
          title: 'Open identification standards',
          body: 'A QR as a URL serves the checkout, the person buying and traceability at once. Adopting the format gives interoperability with retail without inventing a proprietary scheme.',
          icon: 'qr',
        },
      ],
    },
    {
      id: 'principios',
      title: 'Ten inherited principles',
      intro: 'These are not brand values: they are constraints that came from watching what held and what did not.',
      items: [
        {
          title: 'Start with one or two categories',
          body: 'With a few large issuers to coordinate, not the whole market at once.',
          icon: 'list',
        },
        {
          title: 'Signed code plus state in the registry',
          body: 'The signature stops codes being invented without consulting anything; the registry manages the lifecycle and detects clones.',
          icon: 'signature',
        },
        {
          title: 'Non-sequential identifiers',
          body: 'A predictable sequence is forgeable and, on top of that, reveals volumes to competitors.',
          icon: 'lock',
        },
        {
          title: 'A low per-code cost, set by regulation',
          body: 'Calibrated to the value of the product. A high cost on a popular product kills the system, and that is exactly what happened in the case that was switched off.',
          icon: 'chart',
        },
        {
          title: 'No supplier lock-in',
          body: 'Identifiers, keys and data belong to the institution commissioning the deployment, not to the operator. With escrow of the cryptographic material and public specifications, even when the operation is private.',
          icon: 'key',
        },
        {
          title: 'Graceful degradation is mandatory',
          body: 'The system can never stop production or trade: codes downloaded in advance, a local queue and deferred reporting.',
          icon: 'offline',
        },
        {
          title: 'Unapplied codes expire',
          body: 'It prevents hoarding and a grey market in labels that were issued and never used.',
          icon: 'clock',
        },
        {
          title: 'Activation with independent counting',
          body: 'That is what actually measures: it counts what was produced, not what was declared.',
          icon: 'compare',
        },
        {
          title: 'Public verification needs a reason',
          body: 'Where there was no incentive, nobody scanned. Where there was one, public lookups became massive.',
          icon: 'citizen',
        },
        {
          title: 'Legal groundwork first',
          body: 'Without a rule establishing that marking is mandatory, who pays and what happens if you do not mark, the system gets litigated or switched off by decree.',
          icon: 'document',
        },
      ],
    },
    {
      id: 'consecuencia',
      title: 'The lesson you can feel most in the product',
      paragraphs: [
        'An audit of a physical stamp with public lookup found that the printed controls and the digital record did not always agree, and that from a photograph it was impossible to tell which of the two was right.',
        'That is where the separation running through the whole design comes from: a digital identity either matches or does not, and that is checkable; physical authenticity requires material features or an observed activation, and that is not something a camera settles.',
        'So a lookup does not say “verified” when only the first of those was proved. An identifier that has been issued and labelled, but whose record has not been closed yet, returns “under review” and invites you to report where you saw it. That state is not a gap in the product: it is the lesson made visible.',
      ],
      note: 'And for the same reason we never say a product is “authentic” because its signature validates: a valid signature says who issued the identifier and that its content was not altered — not that the bottle in your hand is the one that carried it.',
    },
  ],

  cta: {
    title: 'Where this continues',
    body: 'The layers that work against copying, the custody of the keys and what the system does not promise are under Security and trust. The concrete proposal for a spirits regulator is in the use case.',
    primaryCta: { label: 'Security and trust', key: 'security', variant: 'primary' },
    secondaryCta: { label: 'See the use case', key: 'caseSpirits', variant: 'secondary' },
  },
};
