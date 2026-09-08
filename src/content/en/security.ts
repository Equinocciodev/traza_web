import type { SecurityContent } from '../types';

export const security: SecurityContent = {
  meta: {
    title: 'Security and trust: what is checked and what is not',
    description:
      'One signature per unit, verification by separate signals, minimal data, and transparency about the limits of what a digital check proves about a product.',
  },

  hero: {
    eyebrow: 'Security and trust',
    title: 'Trust that is explained, not promised',
    subtitle:
      'The security of a verification platform is measured by what it checks and by how clearly it states what it cannot check. These are our principles and our limits.',
  },

  principles: {
    title: 'Principles',
    intro: 'Five principles guide the design of the platform and the language it uses to present each result.',
    items: [
      {
        title: 'Signed unit-level identity',
        body: 'Each unit has its own identifier, signed with keys managed by the issuer. No one else can issue identities in its name.',
        icon: 'signature',
      },
      {
        title: 'Verification by separate signals',
        body: 'Signature, registry status, data match and anomalies are evaluated independently. The result shows each of them, not a single verdict.',
        icon: 'compare',
      },
      {
        title: 'Minimal data collection',
        body: 'Verifying does not require identifying yourself. Reports ask only for what is necessary, and only optionally. No personal or tax data is stored in identities.',
        icon: 'lock',
      },
      {
        title: 'Transparency about the limits',
        body: 'Each result says what was checked, how much confidence it provides and what remains outside its scope. What is not supported is not claimed.',
        icon: 'info',
      },
      {
        title: 'Auditable registry',
        body: 'Events are kept in order, with responsible party and date, and can be exported for a third party to review.',
        icon: 'list',
      },
    ],
  },

  target: {
    title: 'Target architecture',
    intro:
      'The mechanisms the platform proposes to uphold those principles. They are described as a design target, not as implemented or audited controls.',
    items: [
      {
        title: 'ECDSA P-256 signatures',
        body: 'For the spirits use case proposed to a regulator, identities would be signed with ECDSA over the P-256 curve, a widely documented standard.',
        icon: 'key',
      },
      {
        title: 'Keys managed by the issuer',
        body: 'Each manufacturer or importer holds its own signing keys. The platform verifies with the public key; it does not need the private one.',
        icon: 'fingerprint',
      },
      {
        title: 'Public verification without an account',
        body: 'The verification service requires no sign-up or personal data. It answers any lookup with an explained result.',
        icon: 'globe',
      },
      {
        title: 'Event registry',
        body: 'An ordered registry of each unit’s events, with who reported them and when, that makes it possible to reconstruct the history and detect inconsistencies.',
        icon: 'database',
      },
      {
        title: 'Anomaly detection',
        body: 'Repeated lookups of the same code in different places, events out of sequence or inconsistent locations are flagged for review.',
        icon: 'alert',
      },
    ],
    note: 'Target product architecture: this page does not implement or claim a security certification. The controls described are implemented and audited in each deployment.',
  },

  verificationHonesty: {
    title: 'Why we never say “authentic”',
    body:
      'It is tempting to sum up a verification in one reassuring word. We do not, because it would be inaccurate. A valid signature proves that an identity was issued by the expected issuer; it proves nothing about the liquid, the container or the label in front of you.',
    bullets: [
      'A valid signature indicates issuance; it does not prevent a legitimate label from being copied and placed on another unit.',
      'Registry status and anomalies complete the picture: an issued code may be revoked or may appear looked up in incompatible places.',
      'The data match is the responsibility of whoever verifies: comparing product, presentation, lot and expiry date with what they hold in their hand.',
      'Physical inspection remains necessary. The platform guides where to look; it does not replace the eye of the inspector.',
      'That is why each result says what was checked, how much confidence it provides and what the next step is.',
    ],
  },

  privacy: {
    title: 'Privacy',
    body:
      'The platform is designed so that verifying costs no personal data. This site applies the same standard.',
    bullets: [
      'No advertising cookies and no third-party trackers. The site’s only cookies are for audience measurement, described in the privacy notice.',
      'No personal data in public verification: looking up a code does not require identifying yourself.',
      'Discrepancy reports with minimal, optional data; whoever reports decides what to share.',
      'Unit identities contain no personal or tax data.',
      'Aggregated audience measurement that does not identify people and honours “Do Not Track”.',
    ],
  },

  transparency: {
    title: 'What we do not claim',
    intro:
      'Saying clearly what is not supported is part of trust. This site claims none of the following.',
    items: [
      'Security, quality or regulatory compliance certifications.',
      'Availability levels (uptime) or service commitments.',
      'External audits of code, infrastructure or processes.',
      'Clients, contracts or production deployments.',
      'A relationship with governments, regulators or agencies: the spirits case is a pilot proposal.',
      'Figures on scale, economic impact or results.',
    ],
  },

  disclosure: {
    title: 'Responsible vulnerability disclosure',
    body:
      'If you find a security issue on this site or in the platform, we would be grateful if you reported it responsibly before making it public. We commit to acknowledging receipt, keeping the conversation open and crediting the contribution if you wish.',
    note: 'Security reports reach the company contact address. Each deployment may additionally define its own channel.',
  },

  cta: {
    title: 'See how a result is explained',
    body:
      'Public verification shows each signal separately and the recommended next step, with sample codes covering every possible result.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'How it works', key: 'howItWorks', variant: 'secondary' },
  },
};
