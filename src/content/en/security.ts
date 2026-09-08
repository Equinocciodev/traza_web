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

  antiCloning: {
    title: 'Several layers work against copying, and none is enough alone',
    intro:
      'Worth saying first: the cryptographic signature does not protect against copying. A copied code is a valid code. What the signature prevents is inventing codes, which is a different problem. Against copying something else works: layers that add up, each weak on its own.',
    items: [
      {
        title: 'Duplicate analytics',
        body: 'The same identifier looked up from places a single unit cannot travel between in the time elapsed, or at a frequency no bottle has. The state degrades and a case is opened.',
        icon: 'chart',
      },
      {
        title: 'Human comparison',
        body: 'The passport shows the lot and the expiry date; whoever holds the unit compares them with what is printed on the container. A code copied onto another lot does not match. It is free and it is the most effective step.',
        icon: 'compare',
      },
      {
        title: 'Serial binding',
        body: 'On durable goods the label is bound one to one with the manufacturer’s serial and the passport shows it: the buyer compares it with the serial printed on the device.',
        icon: 'fingerprint',
      },
      {
        title: 'First lookup visible',
        body: 'The passport says when it was first looked up and how many times since. A just-bought unit with a long history smells wrong, and anyone notices that without knowing anything about the system.',
        icon: 'history',
      },
      {
        title: 'Destructible label',
        body: 'A substrate that tears when peeled prevents moving an already-applied label from one unit to another, which is the simplest fraud of all.',
        icon: 'label',
      },
      {
        title: 'Two-stage activation',
        body: 'An identifier that is issued and labelled but not activated, turning up in a lookup out in the world, is a leak signal. That is why the result says “under review” and not “verified”.',
        icon: 'check',
      },
    ],
    note: 'Later phases add features a camera can check — a high-entropy pattern that degrades measurably when photocopied — and material features a photographic clone cannot reproduce. No layer is sufficient; the combination is what makes fraud expensive.',
  },

  keyCustody: {
    title: 'Who can use the signing keys',
    intro:
      'The keys that sign an identifier are held in a hardware security module, not on the machine of whoever issues. The objective is explicit: that no person — including whoever operates the platform — can use them outside the authorised flow.',
    items: [
      {
        title: 'The material never leaves the module',
        body: 'The master key is a native key of the module, non-exportable by design. Deriving each issuance’s key happens inside; only individual issuance keys ever reach the service’s memory.',
        icon: 'key',
      },
      {
        title: 'Administering is not using',
        body: 'Whoever can rotate or disable a key is denied its use, and the one principal that uses it is a service role. They are separate and deliberately incompatible permissions.',
        icon: 'lock',
      },
      {
        title: 'Policies that bind the administrator too',
        body: 'No exportable material, no touching the audit log, and policy changes only through the deployment pipeline. Nobody sits above the rule.',
        icon: 'shield-check',
      },
      {
        title: 'One path to production',
        body: 'Nobody deploys by hand. Cryptographic code, permissions and key infrastructure all require double approval, with signed commits and images. Exfiltrating requires an accomplice.',
        icon: 'settings',
      },
      {
        title: 'An indelible trace',
        body: 'Every key use is recorded to an archive administrators can neither write nor delete, with alerts on anomalous use and a copy to the supervising body’s mirror.',
        icon: 'document',
      },
      {
        title: 'Ceremonies with a quorum',
        body: 'Creating or rotating an epoch’s master key requires several people with split credentials and hardware tokens, and a witness from the supervising body.',
        icon: 'user',
      },
    ],
    residualRisk:
      'One risk remains standing, and writing it down is more honest than leaving it out: collusion between two people with complementary permissions. The layers above do not make it impossible; they make it detectable and attributable. There is also a background canary: lookups against ranges that were never downloaded mean a leaked signature in use. And closing an issuance contains the damage — once closed, the sequence numbers never used are voided, so a code forged against it lands on “not registered” or “under review”, never on “verified”.',
  },

  degradation: {
    title: 'What has to keep working when something fails',
    intro:
      'A fiscal system that stops a production line or a shop till has done more damage than the fraud it was chasing. That stops being an aspiration and becomes a design constraint, with concrete consequences.',
    items: [
      {
        title: 'Printing does not depend on the connection',
        body: 'The range of identifiers is downloaded once and a local process feeds the printer, with its own queue and deferred reporting when it reconnects. The plant does not wait for the network.',
        icon: 'offline',
      },
      {
        title: 'Lookup and issuance do not share a path',
        body: 'They are separate planes that talk through events. Public lookup has to keep answering even while issuance is under maintenance, and a bulk generation does not compete with someone standing at a shelf.',
        icon: 'layers',
      },
      {
        title: 'Fail open on reads, fail closed on writes',
        body: 'If the rate limiter degrades, the lookup is served: better to answer than to refuse. Writes and authentication, by contrast, fail closed.',
        icon: 'network',
      },
      {
        title: 'Rejections are telemetry',
        body: 'An attempt to enumerate codes is itself a fraud signal: spikes of rejection by origin and by code prefix feed the analytics and open a case.',
        icon: 'alert',
      },
    ],
    note: 'None of this is an availability promise. It is the list of what must stay standing when something falls over, which is a different question and a more useful one to answer in writing.',
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
