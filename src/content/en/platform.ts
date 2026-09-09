import type { PlatformContent } from '../types';

export const platform: PlatformContent = {
  "meta": {
    "title": "Platform for identity, traceability and control",
    "description": "Capabilities of the Traza platform: unit-level identity, lifecycle recording, public verification, institutional control views, and rules set per tenant."
  },
  "hero": {
    "eyebrow": "Platform",
    "title": "Every product. Its full context.",
    "subtitle": "Traza brings together three things that usually live apart: the identity of each unit, the record of its lifecycle, and a public, simple way to check both.",
    "titleLines": [
      "Every product.",
      "Its full context."
    ],
    "cta": {
      "label": "Explore a unit",
      "key": "verify",
      "suffix": "?t=medicamentos&c=TRZ-7F2K-4K7Q-92FA"
    }
  },
  "capabilities": {
    "title": "Identity that connects. Evidence you can understand.",
    "intro": "Six capabilities that combine according to the deployment. None of them requires replacing the systems an organization already uses.",
    "items": [
      {
        "title": "Unit-level digital identity",
        "body": "A unique, signed identifier for each unit, with the minimal data that describes it: manufacturer or importer, product and presentation, origin and lot.",
        "icon": "fingerprint",
        "key": "codeSpec"
      },
      {
        "title": "Lifecycle record",
        "body": "Issuance, printing and activation when production is complete. Then lookups, signals and closure: every event retains its source and timestamp.",
        "icon": "history",
        "key": "journey"
      },
      {
        "title": "Public verification",
        "body": "Anyone verifies a unit from the browser, with nothing to install and no account to create. The result is explained by signals and in plain language.",
        "icon": "scan",
        "key": "verify"
      },
      {
        "title": "Institutional control",
        "body": "Regulators and companies consult the registry, follow anomalies, coordinate field inspections and export information for audit.",
        "icon": "eye",
        "key": "institutional"
      },
      {
        "title": "Rules configurable per tenant",
        "body": "Each deployment defines its brand, its identity fields, its event types, its roles and the context the public sees when verifying.",
        "icon": "settings",
        "key": "solutions"
      },
      {
        "title": "Discrepancy reporting",
        "body": "Anyone verifying can prepare a discrepancy report to share with the responsible organisation. This website downloads it locally.",
        "icon": "flag",
        "key": "verify"
      }
    ],
    "eyebrow": "One platform, six capabilities"
  },
  "identity": {
    "title": "The identity of a unit",
    "body": "Each unit links its manufacturer or importer, presentation, concentration, lot and expiry date to its identifier. The health registration shown is an example field: it does not establish authorisation.",
    "fields": [
      {
        "label": "Manufacturer / importer",
        "description": "The organization that produced the unit or brought it to market, and that signs it as issuer.",
        "icon": "factory"
      },
      {
        "label": "Product / presentation",
        "description": "What it is and in what format: type, variant, packaging and declared content.",
        "icon": "box"
      },
      {
        "label": "Lot and expiry",
        "description": "The production or import lot and the expiry date, to compare against what is printed on the container.",
        "icon": "label"
      },
      {
        "label": "Identifier status",
        "description": "Whether it is issued, activated, under review or voided, and since when it has been looked up.",
        "icon": "shield-check"
      }
    ],
    "example": {
      "caption": "Unit identity example",
      "code": "TRZ-7F2K-4K7Q-92FA",
      "rows": [
        {
          "label": "Manufacturer / importer",
          "value": "Laboratorio Cerro Alto"
        },
        {
          "label": "Product / presentation",
          "value": "Oral solution · 120 ml bottle"
        },
        {
          "label": "Concentration",
          "value": "10 mg/ml · EXAMPLE"
        },
        {
          "label": "Health registration",
          "value": "RS-EJEMPLO"
        },
        {
          "label": "Identifier status",
          "value": "Activated"
        }
      ]
    }
  },
  "architecture": {
    "title": "Target architecture",
    "intro": "The target architecture separates issuance, lookup and audit so each function has defined permissions and responsibilities. Controls are implemented and validated for each deployment.",
    "layers": [
      {
        "name": "Issuance plane",
        "body": "Derives and signs identifiers per order. Keys are held in a hardware security module, derived per issuance: administering a key and using it are separate permissions.",
        "icon": "key"
      },
      {
        "name": "Verification plane",
        "body": "The hot path: it resolves the public lookup, evaluates signature, registry, data match and signals, and returns an explained result. It must keep answering even while issuance is under maintenance.",
        "icon": "globe"
      },
      {
        "name": "Analytics and audit plane",
        "body": "Append-only: every issuance, download, activation and status change is recorded. No UPDATE, no DELETE — revoking is a new event, not a correction of the previous one.",
        "icon": "database"
      },
      {
        "name": "Read-only mirror",
        "body": "The architecture proposes a read-only copy for the authorised audit team. It allows medicine events to be compared with the primary registry; access, scope and synchronisation are agreed in each deployment.",
        "icon": "eye"
      },
      {
        "name": "Integration",
        "body": "Interfaces to issue and activate from existing management systems, and to export information back to them.",
        "icon": "plug"
      }
    ],
    "note": "Target product architecture. Cryptographic and security controls are implemented and audited in each deployment."
  },
  "verificationModel": {
    "title": "What is checked when verifying",
    "intro": "A verification does not give a single verdict. It evaluates four signals separately and explains them, so that whoever verifies knows what was checked, how much confidence it provides and what the next step is.",
    "signals": [
      {
        "key": "signature",
        "title": "Signature",
        "body": "Whether the identity was issued by the expected issuer and has not been altered.",
        "icon": "signature"
      },
      {
        "key": "registry",
        "title": "Registry status",
        "body": "Whether the identity is active, suspended or revoked, and which events are recorded for it.",
        "icon": "database"
      },
      {
        "key": "match",
        "title": "Data match",
        "body": "Whether what the label shows matches what the registry says: product, presentation, lot and expiry date.",
        "icon": "compare"
      },
      {
        "key": "anomalies",
        "title": "Anomalies",
        "body": "Whether there are signals worth reviewing: repeated lookups of the same code, inconsistent locations or events out of sequence.",
        "icon": "alert"
      }
    ],
    "caution": "A valid signature indicates that the identity was issued; it does not describe the physical content or prevent a label from being copied. That is why the result is never reduced to a single word: it is explained, it comes with a next step, and physical inspection remains necessary."
  },
  "tenancy": {
    "title": "Your organisation. A shared foundation.",
    "body": "The master brand lives at traza.technology. Each medicines programme may present the responsible organization’s visual identity and its own lookup context, subject to approval.",
    "bullets": [
      "Co-brand lockup or own brand (white-label) in each deployment",
      "Configurable accent colors, context texts and next step",
      "Medicine data and lifecycle events agreed per programme",
      "Roles and permissions defined by each institution",
      "Public verification reads the tenant from the URL and adapts the result"
    ],
    "exampleNote": "PUBLIC AND/OR PRIVATE COMPANY | TRAZA: example co-brand, subject to approval. It does not establish an institutional relationship.",
    "eyebrow": "Brand and permissions"
  },
  "integration": {
    "title": "Integration with existing systems",
    "body": "Connect issuance, activation and lookup with existing systems. Each implementation defines its interfaces, permissions and validation criteria.",
    "bullets": [
      "Production orders and unit identities",
      "Activation when production is complete",
      "Record export for audit"
    ],
    "note": "Integration capabilities are described generically and without naming products: each deployment agrees its own connectors.",
    "eyebrow": "Integrations",
    "intro": "Connect issuance, activation and lookup with existing systems. Each implementation defines its interfaces, permissions and validation criteria.",
    "diagramAlt": "Conceptual diagram: management, production, quality and analytics connect to Traza.",
    "diagramLabel": "Conceptual integration diagram",
    "nodes": [
  {
    "name": "ERP / Management",
    "body": "Catalogs and lots"
  },
  {
    "name": "Quality / Compliance",
    "body": "Signals and reports"
  },
  {
    "name": "Production / Labelling",
    "body": "Printing and activation"
  },
  {
    "name": "Analytics",
    "body": "Exports and reports"
  }
],
    "scope": {
      "eyebrow": "Connection scope",
      "title": "Define. Connect. Validate.",
      "steps": [
        {
          "title": "Agree the scope",
          "body": "Data, responsibilities and permissions for each system."
        },
        {
          "title": "Connect operations",
          "body": "Issuance and printing; activation when production is complete."
        },
        {
          "title": "Validate with evidence",
          "body": "Readability, data and change-traceability checks."
        }
      ]
    },
    "cta": {
      "label": "View integration and scope",
      "key": "integration"
    }
  },
  "cta": {
    "title": "See the platform in action",
    "body": "The three views show public verification, the journey of a unit and the institutional dashboard.",
    "primaryCta": {
      "label": "Verify a product",
      "key": "verify",
      "variant": "primary"
    },
    "secondaryCta": {
      "label": "How it works",
      "key": "howItWorks",
      "variant": "secondary"
    }
  },
  "productView": {
    "eyebrow": "Product view",
    "title": "Its full context. One click away.",
    "intro": "One unit, three ways to understand the evidence: its record, the recorded events and the checks that explain the result.",
    "tabsLabel": "Product view sections",
    "tabs": [
      {
        "href": "#pasaporte",
        "label": "Digital passport"
      },
      {
        "href": "#historial",
        "label": "History"
      },
      {
        "href": "#senales",
        "label": "Signals"
      }
    ],
    "passport": {
      "kicker": "Digital passport",
      "exampleLabel": "Example",
      "title": "Cerro Alto oral solution",
      "presentation": "120 ml bottle · 10 mg/ml",
      "status": "Identifier activated",
      "codeLabel": "Unit identifier",
      "code": "TRZ-7F2K-4K7Q-92FA",
      "rows": [
        {
          "label": "Manufacturer / importer",
          "value": "Laboratorio Cerro Alto"
        },
        {
          "label": "Product / presentation",
          "value": "Oral solution · 120 ml bottle"
        },
        {
          "label": "Concentration",
          "value": "10 mg/ml · EXAMPLE"
        },
        {
          "label": "Health registration",
          "value": "RS-EJEMPLO"
        },
        {
          "label": "Identifier status",
          "value": "Activated"
        }
      ],
      "note": "Example data. Always compare the result with the label and physical unit.",
      "cta": {
        "label": "Explore a unit",
        "key": "verify",
        "suffix": "?t=medicamentos&c=TRZ-7F2K-4K7Q-92FA"
      }
    },
    "history": {
      "kicker": "Unit history",
      "exampleLabel": "Example",
      "title": "Every event. A source.",
      "items": [
        {
          "tone": "success",
          "title": "Identity issued",
          "source": "Issuer · production order",
          "status": "Recorded"
        },
        {
          "tone": "success",
          "title": "QR printed per unit",
          "source": "Plant · print check",
          "status": "Recorded"
        },
        {
          "tone": "success",
          "title": "Activation when production is complete",
          "source": "Issuer · completed record",
          "status": "Activated"
        },
        {
          "tone": "neutral",
          "title": "Public lookup",
          "source": "Visitor · comparison with label",
          "status": "Queried"
        }
      ]
    },
    "gaps": {
      "title": "What is known. What is missing.",
      "body": "Available evidence is distinguished from what needs review. A readable QR or a valid signature alone does not certify the package contents."
    }
  },
  "roles": {
    "eyebrow": "Role-based experiences",
    "title": "One shared record. A view for each responsibility.",
    "intro": "Access and actions depend on the permissions agreed for each deployment.",
    "items": [
      {
        "title": "Public lookup",
        "who": "People",
        "body": "Scan and compare without creating an account."
      },
      {
        "title": "Operations",
        "who": "Manufacturers and importers",
        "body": "Issue identities and activate units when production is complete."
      },
      {
        "title": "Oversight",
        "who": "Authorised teams",
        "body": "Review signals, inspect events and prepare inspections."
      }
    ],
    "mockCaption": "Example view · explore the lookup and record through the links."
  }
};
