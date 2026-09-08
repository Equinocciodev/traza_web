import type { VerifyContent } from '../verify.types';

/**
 * Demo A · Public verification (EN).
 * Plain, calm language. Never "authentic": the result describes what was checked.
 */
export const verify: VerifyContent = {
  meta: {
    title: 'Verify a product',
    description:
      'Public verification demo: scan or type a sample code and see what was checked, how much confidence it gives and what to do next. Simulated data.',
  },

  hero: {
    eyebrow: 'Demo A · Public verification',
    title: 'Verify a product',
    subtitle:
      'Scan a sample code or type it by hand. The result explains what the simulated record declares and what the person must compare with the product. This lookup does not certify physical authenticity.',
    mantra: 'Scan. Compare. Understand.',
    requirement: 'No installation, no account: just a browser.',
  },

  tenant: {
    regionLabel: 'Verification context',
    contextLabel: 'Scope',
    registryLabel: 'Registry consulted',
    statusLabel: 'Deployment status',
    switchLabel: 'View this demo as',
    options: [
      { id: 'traza', label: 'Traza master brand' },
      { id: 'licores', label: 'Spirits pilot (co-brand example)' },
    ],
    lockupCaption: 'Example typographic lockup · pilot proposal · conditional co-brand',
  },

  scanner: {
    title: 'Scan the code',
    intro: 'Point the camera at the QR code on the label. In this demo you can also simulate scanning a sample code.',
    viewerLabel: 'Scanning viewer',
    simulate: 'Simulate scan',
    simulating: 'Scanning…',
    useCamera: 'Use the camera',
    stopCamera: 'Stop the camera',
    typeInstead: 'Type the code',
    retryCamera: 'Try again',
    idle: 'Viewer ready. Simulate a scan or turn on your device camera.',
    simulatingHint: 'Reading the sample code…',
    activeHint: 'Camera on. Frame the QR code inside the viewer.',
    noDetectorHint: 'This browser cannot decode the QR automatically. You can type the code printed under the QR.',
    denied: {
      title: 'Camera denied',
      body: 'Camera permission was denied. It is not required to verify: type the code printed under the QR, or allow access in your browser settings and try again.',
    },
    unavailable: {
      title: 'Camera unavailable',
      body: 'This device or browser does not offer a usable camera in this context. You can type the code printed under the QR.',
    },
    unreadable: {
      title: 'Unreadable QR',
      body: 'The code could not be read. Clean the label, improve the light or move a little closer. If the code is damaged, type it by hand.',
    },
    privacyNote: 'The camera image is processed on your device and is not sent to any server.',
  },

  manual: {
    title: 'Or type the code',
    label: 'Product code',
    placeholder: 'TRZ-XXXX-XXXX-XXXX',
    hint: 'It is printed under the QR code. Type it with or without hyphens; capitals are adjusted for you.',
    submit: 'Verify',
    errors: {
      empty: 'Type the code printed under the QR to verify.',
      format: 'The code is not in the expected format: TRZ followed by three blocks of four letters or digits (for example, TRZ-DEMO-4K7Q-92FA).',
    },
    normalized: 'Code adjusted to the TRZ-XXXX-XXXX-XXXX format.',
    noscript:
      'Verification needs JavaScript or the QR code link. If your browser blocks it, use the link printed next to the code or try from another device.',
  },

  scenarios: {
    title: 'Demo scenarios',
    intro: 'Each button fills in a sample code and runs the verification, or reproduces a device or network condition.',
    groups: { code: 'By sample code', transport: 'Network conditions', device: 'Device conditions' },
    codeLabel: 'Code',
    selected: 'Selected',
    network: {
      title: 'Simulated network',
      toggle: 'Simulate no connection',
      hint: 'While this is on, requests fail as if the device had no network. When you turn it off, the pending verification is retried automatically. The real browser state is detected too.',
    },
  },

  states: {
    idle: {
      title: 'No result yet',
      body: 'Scan a code, type it or pick a demo scenario. The result will appear here with its four checks explained.',
    },
    loading: {
      title: 'Consulting the demonstration registry…',
      body: 'Preparing simulated signature, registry, data and signal results. No real product verification takes place.',
    },
    simulatedTag: 'Simulated result',
    verifiedAtLabel: 'Lookup performed on',
    codeLabel: 'Code',
    registryLabel: 'Registry consulted',
    otherTenantNote: 'This identifier belongs to another deployment: {registry}.',
    offlineBanner: {
      title: 'Offline',
      body: 'There is no network right now. You can keep typing the code; the request will be retried automatically when the connection returns.',
    },
    recovered: {
      title: 'Connection restored',
      body: 'The network is back.',
    },
    retryingPending: 'Retrying the pending verification…',
    errors: {
      offline: {
        title: 'Offline: could not verify',
        body: 'Consulting the registry needs a network connection. This is not a verdict on the product: the code is kept pending.',
      },
      server: {
        title: 'The registry did not respond correctly',
        body: 'The service returned an error. It is not a problem on your side nor a verdict on the product. Wait a few seconds and retry.',
      },
      timeout: {
        title: 'The registry took too long',
        body: 'The request timed out. This is not a verdict on the product: retry in a few seconds.',
      },
      network: {
        title: 'The request could not be completed',
        body: 'There was a network problem during the request. Retry in a few seconds.',
      },
      aborted: {
        title: 'Request cancelled',
        body: 'The request was interrupted before finishing.',
      },
    },
    pendingCodeLabel: 'Pending code',
    autoRetryNote: 'When the connection returns, it will be retried automatically.',
    transportCodeNote:
      'This demo code always reproduces this condition. To see the automatic recovery, switch "Simulate no connection" on and off with any other code.',
    retry: 'Retry',
    typeAnother: 'Type another code',
    nothingChecked: 'None of the four checks was performed.',
    statusLabel: 'Status',
  },

  verdicts: {
    valid: {
      label: 'Example without alerts',
      confidence:
        'The example declares a valid signature, an active record, matching data and no alerts. These are simulated results. The person must compare the information with the product; they do not certify physical authenticity or the absence of risks.',
    },
    warning: {
      label: 'Example with warnings',
      confidence: 'The example record includes a warning. It describes a simulated signal requiring review; it does not prove fraud or establish that the physical product matches its data.',
    },
    invalid: {
      label: 'Invalid example',
      confidence:
        'The demonstration lookup does not recognise a current identity for this code, or shows an unfavourable simulated result. It is not a check of the physical object.',
    },
    unverifiable: {
      label: 'Lookup unavailable',
      confidence: 'No verdict: the registry could not be consulted or the code is not in the expected format. This says nothing about the product.',
    },
  },

  reasons: {
    all_checks_passed: {
      title: 'Simulated results available',
      body: 'This example declares a valid signature, an active identifier, matching data and no recorded alerts. The match has not been checked against your product: compare the displayed information with the physical unit.',
    },
    anomalies_detected: {
      title: 'The example includes signals worth reviewing',
      body: 'The simulated signature and registry results are favourable, but the example history includes a pattern to review. A signal does not prove fraud; compare the information with the product.',
    },
    data_partial: {
      title: 'Partial match declared in the example',
      body: 'The demonstration data include a partial match. The page has not inspected the label or physical product; the person must compare their information with the record.',
    },
    registry_suspended: {
      title: 'Identity suspended in the example record',
      body: 'The simulated scenario keeps this identifier under review while declaring a valid signature. It does not constitute verification of the physical product.',
    },
    signature_invalid: {
      title: 'Invalid signature in the simulated scenario',
      body: 'The example represents a signature that does not correspond to the code contents. The lookup stops at that signal; it has not checked a real signature or established physical tampering.',
    },
    signature_malformed: {
      title: 'Unreadable signature in the simulated scenario',
      body: 'The example represents a signature that cannot be interpreted. It does not establish that the code or physical product has been tampered with.',
    },
    not_registered: {
      title: 'Identity not found in the example registry',
      body: 'The code has the expected format but does not correspond to a known identity in this demonstration. This does not verify or determine the state of a physical product.',
    },
    revoked: {
      title: 'Identity revoked in the example registry',
      body: 'The example declares a valid signature and a revoked identity. It shows that signature and status are different readings; it does not check the physical unit.',
    },
    data_mismatch: {
      title: 'Data discrepancy declared in the example',
      body: 'The simulated scenario includes a data discrepancy. The person must compare the product and label with the displayed information; this page has not inspected them.',
    },
    registry_unavailable: {
      title: 'The registry is unavailable',
      body: 'The status of this identifier could not be consulted. This is not a verdict on the product.',
    },
    offline: {
      title: 'Offline',
      body: 'Consulting the registry needs a network connection.',
    },
    server_error: {
      title: 'The registry did not respond correctly',
      body: 'The service returned an error. Retry in a few seconds.',
    },
    timeout: {
      title: 'The registry took too long',
      body: 'The request timed out. Retry in a few seconds.',
    },
    unknown_format: {
      title: 'The text read is not a Traza identifier',
      body: 'What was read is not in the TRZ-XXXX-XXXX-XXXX format. It may be another QR code or an incomplete read. This is not a verdict on the product.',
    },
  },

  checks: {
    title: 'Four readings and their limits',
    intro: 'Demonstration results, separated by evidence type. Simulated lookup. Does not certify physical authenticity.',
    outcomes: {
      pass: 'Favourable · simulated',
      warn: 'Warning · simulated',
      fail: 'Unfavourable · simulated',
      skipped: 'Not performed',
    },
    signature: {
      title: 'Signature',
      help: 'Issuer and integrity of the signed data. Simulated; does not prevent physical copies.',
      status: {
        valid: 'The example declares a valid signature and a known issuer key.',
        invalid: 'The example represents a signature that does not correspond to the code contents.',
        malformed: 'The example represents a signature that cannot be interpreted.',
        unknown_key: 'The example does not recognise the declared issuer key.',
        not_checked: 'Not checked.',
      },
      algorithmLabel: 'Target algorithm',
      issuedAtLabel: 'Issued on',
      keyIdLabel: 'Issuer key',
    },
    registry: {
      title: 'Registry status',
      help: 'Identifier existence and declared status in the example registry. Does not demonstrate physical location.',
      status: {
        active: 'Identifier found; active status declared in the example.',
        not_found: 'Identifier not found in the example registry.',
        revoked: 'Revoked status declared in the example.',
        suspended: 'Suspended status declared in the example (under review).',
        unavailable: 'The registry was unavailable.',
        not_checked: 'Not consulted.',
      },
      registryLabel: 'Registry',
      registeredAtLabel: 'Registered on',
      revokedAtLabel: 'Revoked on',
      reasonLabel: 'Reason',
    },
    dataMatch: {
      title: 'Data to compare',
      help: 'Information to compare. The person checks whether it matches the product.',
      status: {
        match: 'Match declared in the example; not checked against your physical product.',
        partial: 'Partial match declared in the example; physical comparison is required.',
        mismatch: 'Discrepancy declared in the example; physical comparison is required.',
        not_checked: 'Not compared.',
      },
    },
    anomalies: {
      title: 'Signals',
      help: 'Patterns in the available records. No alerts does not mean no risks.',
      none: 'No alerts are declared in this simulated history; this does not imply an absence of risks.',
      skipped: 'Not analysed.',
      detectedAtLabel: 'Detected on',
      severity: { info: 'Informational', warning: 'Warning', critical: 'Critical' },
      codes: {
        duplicate_scans: 'Duplicate verifications',
        geo_inconsistent: 'Inconsistent location',
        chain_gap: 'Chain gap',
        lot_withdrawn: 'Lot withdrawn',
        reported: 'Open discrepancy report',
        expired: 'Expired identifier',
      },
    },
  },

  unit: {
    title: 'Declared data of the simulated unit',
    product: 'Product',
    presentation: 'Presentation',
    brand: 'Brand',
    category: 'Category',
    issuer: 'Issuer',
    issuerRoles: { manufacturer: 'manufacturer', importer: 'importer' },
    lot: 'Lot',
    origin: 'Origin',
    producedAt: 'Produced on',
    stage: 'Declared stage',
    stages: {
      origin: 'Factory / customs',
      labeling: 'Labelling',
      transport: 'Transport',
      distribution: 'Distribution',
      commerce: 'Retail',
      verification: 'Verification',
    },
    destination: 'Registered destination',
    lastEvent: 'Last event',
    eventKinds: {
      identity_issued: 'Identity issued',
      customs_cleared: 'Customs entry',
      labeled: 'Labelled',
      shipped: 'Dispatched',
      in_transit: 'In transit',
      received: 'Received at distribution',
      dispatched: 'Dispatched to retail',
      received_commerce: 'Received at retail',
      sold: 'Sold',
      verified: 'Public verification',
      inspected: 'Field inspection',
      reported: 'Discrepancy report',
      revoked: 'Revocation',
    },
    scans: 'Previous verifications',
    scansValue: '{total} across {regions} region(s)',
    lastScan: 'Last verification',
    noScans: 'None recorded',
    hiddenNote: 'Unit data are not shown when the signature is invalid or the identity is not recognised.',
  },

  meaning: {
    title: 'What this result means',
    confidenceLabel: 'Scope of this lookup',
    nextStepTitle: 'Next step',
    steps: {
      keep_receipt: 'Keep the purchase receipt together with the code.',
      compare_physical: 'Compare the physical product with the registered data: name, presentation, lot and seal.',
      report: 'If anything does not match, you can try the simulated discrepancy report on this page.',
      do_not_purchase: 'Do not buy or consume the unit until the situation is clarified.',
      contact_seller: 'Ask the seller about the origin of the unit and keep the receipt.',
      retry: 'Retry the verification in a few seconds.',
      type_code: 'Type the code printed under the QR in the manual entry.',
      check_connection: 'Check your device connection.',
    },
    tenantHintLabel: 'In this deployment',
  },

  actions: {
    report: 'Report a discrepancy',
    another: 'Verify another code',
    backToResult: 'Back to the result',
  },

  report: {
    title: 'Report a discrepancy',
    intro: 'Describe what does not match between the product and the result. No personal data are requested; the email is optional.',
    codeLabel: 'Verified code',
    kindLabel: 'Type of discrepancy',
    kindPlaceholder: 'Select an option',
    kinds: {
      label_mismatch: 'The label does not match the registered data',
      seal_damaged: 'Damaged seal',
      suspected_copy: 'Suspected copy of the code',
      wrong_location: 'Location different from the registered one',
      already_scanned: 'The code already appeared as verified',
      other: 'Another situation',
    },
    descriptionLabel: 'Description',
    descriptionHint: 'Between 10 and 600 characters. What you observed, where and when.',
    counter: '{count} of {max} characters',
    locationLabel: 'Location',
    locationHint: 'Shop or place where you have the unit, if you wish to say.',
    emailLabel: 'Contact email',
    emailHint: 'Only if you want follow-up. Not required.',
    dataNote: 'Minimal data: no name, ID document or tax data are requested.',
    simulatedNote: 'This report is simulated: it is not transmitted to nor stored on any server.',
    submit: 'Send report',
    sending: 'Sending…',
    cancel: 'Cancel',
    errors: {
      kind: 'Select the type of discrepancy.',
      descriptionShort: 'The description must be at least 10 characters long.',
      descriptionLong: 'The description cannot exceed 600 characters.',
      email: 'Enter a valid email address or leave the field empty.',
    },
    success: {
      title: 'Report sent',
      folioLabel: 'Reference',
      receivedAtLabel: 'Received on',
      body: 'Thank you. The report was linked to the verified code under the reference shown.',
      nextTitle: 'What happens next',
      next: [
        'The registry marks the code with an open report: the next verifications will show it as an anomaly.',
        'In the proposed pilot, a field inspector can follow up and record what is observed on site.',
        'If you left an email, you would receive the outcome of the review.',
      ],
      proposalNote: 'This flow describes a pilot proposal; there is no real follow-up in this demo.',
      done: 'Back to the result',
    },
    failure: {
      offline: {
        title: 'Offline: the report was not sent',
        body: 'Your text is kept; when the connection returns, press "Retry".',
      },
      server: {
        title: 'The report could not be sent',
        body: 'The service returned an error. Your text is kept; retry in a few seconds.',
      },
      timeout: {
        title: 'Sending took too long',
        body: 'The request timed out. Your text is kept; retry in a few seconds.',
      },
      network: {
        title: 'The report could not be sent',
        body: 'There was a network problem. Your text is kept; retry in a few seconds.',
      },
      aborted: {
        title: 'Sending cancelled',
        body: 'Sending was interrupted before finishing.',
      },
    },
    retry: 'Retry',
  },

  a11y: {
    demoRegion: 'Public verification demo with simulated data',
    scannerRegion: 'Scanner and code entry',
    resultRegion: 'Verification result',
    reportRegion: 'Discrepancy report',
    skeleton: 'Loading the result',
    verdictIconLabels: {
      valid: 'Example without alerts',
      warning: 'Example with warnings',
      invalid: 'Invalid example',
      unverifiable: 'Lookup unavailable',
    },
    outcomeIconLabels: {
      pass: 'Favourable · simulated',
      warn: 'Warning · simulated',
      fail: 'Unfavourable · simulated',
      skipped: 'Not performed',
    },
  },
};
