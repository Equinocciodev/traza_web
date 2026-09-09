import type { ReferencePageContent } from '../types';

/** Medicines pilot design criteria; no historical results or institutional relationships are claimed. */
export const rationale: ReferencePageContent = {
  "meta": {
    "title": "Why this design: criteria for a medicines pilot",
    "description": "The medicines pilot criteria: unit identity, activation after production, auditing and public lookup with clear limits and responsibilities for participants."
  },
  "hero": {
    "eyebrow": "Design criteria",
    "title": "An identity for each medicine, with clear responsibilities",
    "subtitle": "The proposal starts with a medicine unit and the people who identify, query or review it. These criteria explain what should be checked and which limits each pilot should preserve."
  },
  "contentsLabel": "On this page",
  "sections": [
    {
      "id": "sistemas",
      "title": "Decisions for the medicines pilot",
      "intro": "These are proposal criteria, subject to implementation and validation. They do not establish an operation, an institutional relationship or results from other systems.",
      "items": [
        {
          "title": "Identity linked to the unit",
          "body": "The manufacturer or importer describes the medicine before issuing its identifier. The target format links the signed identity with the unit’s status in the registry.",
          "icon": "signature"
        },
        {
          "title": "Auditing with its own permissions",
          "body": "The architecture proposes a read-only copy for the authorised team. The programme must agree which events it may consult and how to compare them with the primary registry.",
          "icon": "eye"
        },
        {
          "title": "Separate issuance, printing and activation",
          "body": "Printing a QR does not activate the unit. Activation is proposed after production ends and the product, lot and expiry record is complete.",
          "icon": "plug"
        },
        {
          "title": "Start with one medicine",
          "body": "A pilot can cover one presentation, one packaging line and defined owners. This allows each stage to be reviewed before extending the scope.",
          "icon": "search"
        },
        {
          "title": "Explicit costs and responsibilities",
          "body": "Issuance, printing, integration, support and review must be agreed before the pilot. Funding and participation conditions must also be agreed.",
          "icon": "warning"
        },
        {
          "title": "Label and record must be comparable",
          "body": "The QR and readable identifier refer to the same unit. The person compares medicine, presentation, lot and expiry; a digital match does not certify the physical contents.",
          "icon": "compare"
        },
        {
          "title": "Lookup from the browser",
          "body": "The QR opens a lookup URL. People can also type the identifier or read an image of the code, without installing an application or creating an account.",
          "icon": "qr"
        }
      ]
    },
    {
      "id": "principios",
      "title": "Ten criteria for agreeing a deployment",
      "intro": "The pilot must turn these criteria into concrete responsibilities and checks. This website lets people explore examples; it does not establish operational implementation.",
      "items": [
        {
          "title": "Limited scope",
          "body": "Define the medicine, presentation, lot and pilot owners, with the data that people will be able to query.",
          "icon": "list"
        },
        {
          "title": "Separate identity and registry",
          "body": "The target architecture combines a signature to check issuer and integrity with a registry that retains states and signals. Lookups on this website use sample data.",
          "icon": "signature"
        },
        {
          "title": "Non-sequential identifiers",
          "body": "The proposal avoids exposing a production counter in the identifier. The final format requires validation; its appearance does not establish security.",
          "icon": "lock"
        },
        {
          "title": "Costs agreed before operation",
          "body": "Define who covers printing, integration and support, and how pilot costs will be assessed. Amounts are agreed per programme.",
          "icon": "chart"
        },
        {
          "title": "Defined custody and exit",
          "body": "Agree ownership, access, key custody and data export before deployment. These are not automatically assigned to the operator or an authority.",
          "icon": "key"
        },
        {
          "title": "Continuity with explicit states",
          "body": "The architecture must define how to work during an interruption and recover pending events, without showing units as activated when their records are incomplete.",
          "icon": "offline"
        },
        {
          "title": "Closure of unused codes",
          "body": "Agree how to void unused codes when an issuance closes and how to record that decision without erasing history.",
          "icon": "clock"
        },
        {
          "title": "Activation after production",
          "body": "Complete product, lot and expiry data and confirm which codes were used before activating units. Printing alone does not establish activation.",
          "icon": "compare"
        },
        {
          "title": "Useful lookup for people",
          "body": "Show what to compare with the package and what to do about a difference. On this website a report is prepared and downloaded locally; handing it over requires an organization’s channel.",
          "icon": "citizen"
        },
        {
          "title": "Prior authorisation and limits",
          "body": "Define pilot permissions and responsibilities. Physical anti-copy features and tax validation belong to phase 2 and require authorised integration; they are not available here.",
          "icon": "document"
        }
      ]
    },
    {
      "id": "consecuencia",
      "title": "The distinction that a lookup must make clear",
      "paragraphs": [
        "A digital record describes a declared unit. When looking up a medicine, the person must compare its data with the package; a photograph or a registry match does not prove its physical contents.",
        "The proposed registry follows issuance, labelling, activation, lookup, signals and closure. It does not record transport, distribution or sales. Activation requires production to end and the record to be complete.",
        "An issued and labelled identifier awaiting activation requires review. This website explains the state using sample records and lets people prepare a local report, without sending it or changing the registry."
      ],
      "note": "We never say a medicine is “authentic” because its signature validates: the signature’s purpose is to check issuer and data integrity, not the bottle’s physical contents."
    }
  ],
  "cta": {
    "title": "Where this continues",
    "body": "Security and trust explains the proposed layers, key custody and their limits. The medicines use case sets out the pilot’s scope and responsibilities.",
    "primaryCta": {
      "label": "Security and trust",
      "key": "security",
      "variant": "primary"
    },
    "secondaryCta": {
      "label": "See the use case",
      "key": "caseMedicines",
      "variant": "secondary"
    }
  }
};
