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
      'The security of a verification platform is measured by what it checks and by how clearly it states what it cannot check. These are the principles and limits of the target architecture. This website queries example data; it does not validate real signatures or operate the controls described.',
  },

  principles: {
    title: 'Principles',
    intro: 'Five principles guide the target platform design. Their description does not establish that these controls are implemented on this website.',
    items: [
      {
        title: 'Signed unit-level identity',
        body: 'The design calls for an identifier per unit, signed with issuer-managed keys, to check the origin of the identity. This website does not perform that cryptographic validation.',
        icon: 'signature',
      },
      {
        title: 'Verification by separate signals',
        body: 'Signature, registry status, data match and anomalies are evaluated independently. The result shows each of them, not a single verdict.',
        icon: 'compare',
      },
      {
        title: 'Minimal data collection',
        body: 'Lookup does not require identifying yourself. A discrepancy report is prepared on this device and saved only if downloaded; this website does not send it. Identities contain no personal or tax data.',
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
        body: 'For the medicines use case proposed to a regulator, identities would be signed with ECDSA over the P-256 curve, a widely documented standard.',
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
    note: 'Target product architecture: this page does not implement or claim a security certification. The controls described would require implementation and auditing in each deployment.',
  },

  antiCloning: {
    title: 'Several layers work against copying, and none is enough alone',
    intro:
      'A cryptographic signature can establish the origin of an identity, but does not prevent copying a valid code. The following layers belong to the target design; this website does not run anti-copy analytics or check security materials.',
    items: [
      {
        title: 'Duplicate analytics',
        body: 'In the target architecture, a lookup frequency or pattern inconsistent with the expected use of a unit could raise a signal for review. This website does not change registry status or open an operational case.',
        icon: 'chart',
      },
      {
        title: 'Human comparison',
        body: 'Compare the medicine’s lot, 120 ml presentation and expiry date with what is printed on the container. A difference needs review; a match does not establish the contents or physical condition of the unit.',
        icon: 'compare',
      },
      {
        title: 'Serial binding',
        body: 'For the example medicine, the label shows the unit identifier and lot. Compare them with the lookup; the link between the identifier and each physical unit would need to be established during labelling in a deployment.',
        icon: 'fingerprint',
      },
      {
        title: 'First lookup visible',
        body: 'The design calls for showing the first lookup and lookup frequency to review an unexpected history. This website’s example data does not constitute a history of real lookups of a physical unit.',
        icon: 'history',
      },
      {
        title: 'Destructible label',
        body: 'Phase 2 would evaluate a substrate that tears when peeled to make moving a label between units harder. The stamp shown on this website does not establish that physical property.',
        icon: 'label',
      },
      {
        title: 'Two-stage activation',
        body: 'In the target design, a lookup of an identifier issued and labelled but not yet activated after production would be a signal for review. This website explains that status with example data; it does not activate units.',
        icon: 'check',
      },
    ],
    note: 'Phase 2 considers evaluating high-entropy patterns and physical anti-copy features, subject to validation and integration. This website’s camera reads QR codes; it does not evaluate those patterns or certify a physical label. No layer is enough by itself.',
  },

  keyCustody: {
    title: 'Who can use the signing keys',
    intro:
      'The target architecture requires holding signing keys in a hardware security module and restricting their use to the authorised flow. The requirements below describe that design; this website does not operate that module or establish its implementation.',
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
      'An identification system that stops a production line or a shop till has done more damage than the fraud it was chasing. The following requirements are constraints of the target architecture; they do not describe operational services on this website.',
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
        body: 'In the target architecture, rejection spikes by origin and code prefix would feed analytics and could open a case to review attempts to enumerate codes. This website does not run that operational workflow.',
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
      'Discrepancy reports are prepared locally: they are not sent and do not change the registry. Download a copy before closing the report and give it separately to the responsible organisation.',
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
      'A relationship with governments, regulators or agencies: the medicines case is a pilot proposal.',
      'Figures on scale, economic impact or results.',
    ],
  },

  disclosure: {
    title: 'Responsible vulnerability disclosure',
    body:
      'If you find a security issue on this site or in the platform, we would be grateful if you reported it responsibly before making it public. Use the company contact channel; preparing a local discrepancy report does not communicate a vulnerability.',
    note: 'Check the channel available on the company page. This page does not send reports or confirm receipt; each deployment may define its own channel.',
  },

  cta: {
    title: 'See how a result is explained',
    body:
      'Public verification shows each signal separately and the recommended next step, with sample codes covering every possible result.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'How it works', key: 'howItWorks', variant: 'secondary' },
  },
};
