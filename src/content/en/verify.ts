import type { VerifyContent } from '../verify.types';

/**
 * Public verification (EN).
 * Plain, calm language. Never "authentic": the result describes what was checked.
 */
export const verify: VerifyContent = {
  meta: {
    title: 'Verify a product with the code on its label',
    description:
      'Scan or type the unit code and see what was checked, how much confidence each signal gives, and what the recommended next step actually is for the buyer.',
  },

  hero: {
    eyebrow: 'Public verification',
    title: 'Verify a product',
    subtitle:
      'Scan the label QR, choose an image or type the code. The result explains what the record declares and what the person must compare with the product. This lookup does not certify physical authenticity.',
    mantra: 'Scan. Compare. Understand.',
    requirement: 'No installation, no account: just a browser.',
  },

  tenant: {
    regionLabel: 'Verification context',
    contextLabel: 'Scope',
    registryLabel: 'Registry consulted',
    statusLabel: 'Deployment status',
    switchLabel: 'View this page as',
    options: [
      { id: 'traza', label: 'Traza master brand' },
      { id: 'medicamentos', label: 'Medicines pilot (co-brand example)' },
    ],
    lockupCaption: 'Example typographic lockup · pilot proposal · conditional co-brand',
  },

  scanner: {
    title: 'Scan the code',
    intro: 'Point the camera at the QR, choose a photo of it or type the code. You can use an image without allowing camera access.',
    viewerLabel: 'Scanning viewer',
    simulate: 'Look up example',
    simulating: 'Looking up…',
    useCamera: 'Use the camera',
    stopCamera: 'Stop the camera',
    typeInstead: 'Type the code',
    retryCamera: 'Try again',
    idle: 'Viewer ready. Use the camera, choose a photo or type the code.',
    simulatingHint: 'Looking up the selected example code…',
    startingHint: 'Waiting for camera permission. Respond to the browser prompt, or choose a photo or type the code instead.',
    activeHint: 'Camera on. Frame the QR code inside the viewer.',
    noDetectorHint: 'Camera reading could not be started. Choose a photo of the QR or type the code printed below it.',
    denied: {
      title: 'Camera denied',
      body: 'Camera access was not allowed. You can choose a photo of the QR or type the code. To use the camera again, check the browser permission and retry.',
    },
    unavailable: {
      title: 'Camera unavailable',
      body: 'A camera could not be opened on this device. Choose a photo of the QR or type the code printed below it.',
    },
    unreadable: {
      title: 'Unreadable QR',
      body: 'The QR could not be read. Improve the lighting and frame the whole code. You can also choose a clearer photo or type the code.',
    },
    privacyNote: 'Camera frames and selected images are processed on your device; images are not sent to any server.',
    example: {
      title: 'Try this QR',
      body: 'Save this image and open it on another device to scan it with the camera. You can also read it here or choose it from your photos. The result uses an example unit.',
      read: 'Read this image',
      download: 'Save example QR (PNG)',
      alt: 'Example QR for looking up unit TRZ-7F2K-4K7Q-92FA in Traza.',
    },
    image: {
      label: 'Read QR from an image',
      hint: 'Choose a photo or screenshot up to 10 MB. The image is read on your device and is not sent to a server.',
      reading: 'Reading the image…',
      success: 'QR read. Check the lookup result.',
      noQr: 'No readable QR was found. Try a clearer image showing the whole code, or type it by hand.',
      invalidFile: 'This file is not an image we can open. Choose another photo or screenshot, or type the code.',
      tooLarge: 'The image is too large. Choose a smaller photo with a lower resolution (up to 10 MB), or type the code.',
      unavailable: 'The image could not be read in this browser. Try another image or type the code.',
      cancelled: 'Reading cancelled. You can try again or type the code.',
      timeout: 'Reading took too long. Crop the image around the QR and try again, or type the code.',
    },
  },

  manual: {
    title: 'Or type the code',
    label: 'Product code',
    placeholder: 'TRZ-XXXX-XXXX-XXXX',
    hint: 'It is printed under the QR code. Type it with or without hyphens; capitals are adjusted for you.',
    submit: 'Verify',
    errors: {
      empty: 'Type the code printed under the QR to verify.',
      format: 'The code is not in the expected format: TRZ followed by three blocks of four letters or digits (for example, TRZ-7F2K-4K7Q-92FA).',
    },
    normalized: 'Code adjusted to the TRZ-XXXX-XXXX-XXXX format.',
    noscript:
      'Verification needs JavaScript or the QR code link. If your browser blocks it, use the link printed next to the code or try from another device.',
  },

  scenarios: {
    title: 'Sample codes',
    intro: 'Each button fills in a sample code and runs the verification, or reproduces a device or network condition.',
    groups: { code: 'By sample code', transport: 'Network conditions', device: 'Device conditions' },
    codeLabel: 'Code',
    selected: 'Selected',
    network: {
      title: 'Network state',
      toggle: 'Simulate no connection',
      hint: 'While this is on, requests fail as if the device had no network. When you turn it off, the pending verification is retried automatically. The real browser state is detected too.',
    },
  },

  states: {
    idle: {
      title: 'No result yet',
      body: 'Scan a code, type it or pick one of the samples. The result will appear here with its four checks explained.',
    },
    loading: {
      title: 'Consulting the registry…',
      body: 'Checking signature, registry, data and signals. This lookup does not inspect the physical product.',
    },
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
      'This code always reproduces this condition. To see the automatic recovery, switch "Simulate no connection" on and off with any other code.',
    retry: 'Retry',
    typeAnother: 'Type another code',
    nothingChecked: 'None of the four checks was performed.',
    statusLabel: 'Status',
  },

  verdicts: {
    valid: {
      label: 'Example without alerts',
      confidence:
        'The record declares a valid signature, an active record, matching data and no alerts. The person must compare the information with the product: these checks do not certify physical authenticity or the absence of risks.',
    },
    warning: {
      label: 'Example with warnings',
      confidence: 'The record includes a warning. It describes a signal requiring review; it does not prove fraud or establish that the physical product matches its data.',
    },
    invalid: {
      label: 'Invalid example',
      confidence:
        'The lookup does not recognise a current identity for this code, or the result is unfavourable. It is not a check of the physical object.',
    },
    unverifiable: {
      label: 'Lookup unavailable',
      confidence: 'No verdict: the registry could not be consulted or the code is not in the expected format. This says nothing about the product.',
    },
  },

  reasons: {
    all_checks_passed: {
      title: 'Results available',
      body: 'This example declares a valid signature, an active identifier, matching data and no recorded alerts. The match has not been checked against your product: compare the displayed information with the physical unit.',
    },
    anomalies_detected: {
      title: 'The example includes signals worth reviewing',
      body: 'Signature and registry are favourable, but the history includes a pattern to review. A signal does not prove fraud; compare the information with the product.',
    },
    data_partial: {
      title: 'Partial match declared in the example',
      body: 'The data match only in part. The page has not inspected the label or physical product; the person must compare their information with the record.',
    },
    registry_suspended: {
      title: 'Identity suspended in the example record',
      body: 'This identifier remains under review while declaring a valid signature. It does not constitute verification of the physical product.',
    },
    signature_invalid: {
      title: 'Invalid signature',
      body: 'The example represents a signature that does not correspond to the code contents. The lookup stops at that signal; it has not checked a real signature or established physical tampering.',
    },
    signature_malformed: {
      title: 'Unreadable signature',
      body: 'The example represents a signature that cannot be interpreted. It does not establish that the code or physical product has been tampered with.',
    },
    not_registered: {
      title: 'Identity not found in the example registry',
      body: 'The code has the expected format but does not correspond to any known identity in the registry. This does not verify or determine the state of a physical product.',
    },
    revoked: {
      title: 'Identity revoked in the example registry',
      body: 'The example declares a valid signature and a revoked identity. It shows that signature and status are different readings; it does not check the physical unit.',
    },
    data_mismatch: {
      title: 'Data discrepancy declared in the example',
      body: 'The record includes a data discrepancy. The person must compare the product and label with the displayed information; this page has not inspected them.',
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
    intro: 'Results separated by evidence type. Does not certify physical authenticity.',
    outcomes: {
      pass: 'Favourable',
      warn: 'Warning',
      fail: 'Unfavourable',
      skipped: 'Not performed',
    },
    signature: {
      title: 'Signature',
      help: 'Issuer and integrity of the signed data. Does not prevent physical copies.',
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
      help: 'Identifier existence and declared status in the registry. Does not demonstrate physical location.',
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
      none: 'No alerts are declared in this history; this does not imply an absence of risks.',
      skipped: 'Not analysed.',
      detectedAtLabel: 'Detected on',
      severity: { info: 'Informational', warning: 'Warning', critical: 'Critical' },
      codes: {
        duplicate_scans: 'Duplicate verifications',
        geo_inconsistent: 'Inconsistent location',
        pending_activation: 'Pending activation',
        lot_withdrawn: 'Lot withdrawn',
        reported: 'Open discrepancy report',
        expired: 'Expired identifier',
      },
    },
  },

  unit: {
    title: 'Declared data of the unit',
    product: 'Product',
    presentation: 'Presentation',
    dosageForm: 'Dosage form',
    concentration: 'Declared concentration',
    healthRegistration: 'Example health registration',
    brand: 'Brand',
    category: 'Category',
    issuer: 'Issuer',
    issuerRoles: { manufacturer: 'manufacturer', importer: 'importer' },
    lot: 'Lot',
    origin: 'Origin',
    producedAt: 'Produced on',
    stage: 'Lifecycle stage',
    stages: {
      issuance: 'Issuance',
      labeling: 'Labelling',
      activation: 'Activation',
      lookup: 'Public lookup',
      signals: 'Signals',
      closure: 'Closure',
    },
    lastLookupPlace: 'Place of the last lookup',
    lastEvent: 'Last event',
    eventKinds: {
      import_declared: 'Import declared',
      identity_issued: 'Identifier issued',
      labeled: 'Label applied',
      sample_approved: 'Press proof approved',
      record_completed: 'Lot record completed',
      activated: 'Range activated',
      verified: 'First public lookup',
      looked_up: 'Later lookup',
      anomaly_flagged: 'Signal raised',
      reported: 'Discrepancy report',
      inspected: 'Field inspection',
      reassigned: 'Record reassigned',
      range_voided: 'Range voided',
      revoked: 'Revocation',
      issuance_closed: 'Issuance closed',
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
      report: 'If anything does not match, you can report the discrepancy from this page.',
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
    intro: 'Prepare a discrepancy report on this device. You can download it and give it to the responsible organisation; this page does not send it.',
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
    descriptionHint: 'Between 10 and 600 characters. Describe what you observed without including personal data.',
    counter: '{count} of {max} characters',
    locationLabel: 'Location',
    locationHint: 'Shop or place where you have the unit, if you wish to say.',
    emailLabel: 'Contact email',
    emailHint: 'Only if you want follow-up. Not required.',
    dataNote: 'The information is kept only while this page is open. Download a copy to save it; nothing is sent automatically.',
    submit: 'Prepare report',
    sending: 'Preparing…',
    cancel: 'Cancel',
    errors: {
      kind: 'Select the type of discrepancy.',
      descriptionShort: 'The description must be at least 10 characters long.',
      descriptionLong: 'The description cannot exceed 600 characters.',
      email: 'Enter a valid email address or leave the field empty.',
    },
    success: {
      downloadLabel: 'Download report (JSON)',
      downloadHint: 'The copy includes code, type and description. Do not include personal data; review the contents before sharing.',
      title: 'Report prepared',
      folioLabel: 'Reference',
      receivedAtLabel: 'Prepared on',
      body: 'The information was prepared on this device. Give the report to the responsible organisation for review; it has not been sent and does not change the registry.',
      nextTitle: 'What happens next',
      next: [
        'Save a copy of the report before closing this page.',
        'Give the copy to the responsible organisation through its support channel.',
        'Follow-up depends on the organisation receiving and reviewing the report; this site does not confirm receipt.',
      ],
      proposalNote: 'Follow-up on a report depends on the rules of each deployment.',
      done: 'Back to the result',
    },
    failure: {
      offline: {
        title: 'Offline: the report was not prepared',
        body: 'Your text is kept; when the connection returns, press "Retry".',
      },
      server: {
        title: 'The report could not be prepared',
        body: 'Preparation returned an error. Your text is kept; retry in a few seconds.',
      },
      timeout: {
        title: 'Preparation took too long',
        body: 'The request timed out. Your text is kept; retry in a few seconds.',
      },
      network: {
        title: 'The report could not be prepared',
        body: 'The copy could not be prepared on this device. Your text remains on the page; check the information and try again.',
      },
      aborted: {
        title: 'Preparation cancelled',
        body: 'Preparation was interrupted before finishing.',
      },
    },
    retry: 'Retry',
  },

  a11y: {
    toolRegion: 'Public verification of a unit',
    scannerRegion: 'Scanner and code entry',
    resultRegion: 'Verification result',
    reportRegion: 'Discrepancy report',
    skeleton: 'Loading the result',
    verdictIconLabels: {
      valid: 'Without alerts',
      warning: 'With warnings',
      invalid: 'Invalid',
      unverifiable: 'Lookup unavailable',
    },
    outcomeIconLabels: {
      pass: 'Favourable',
      warn: 'Warning',
      fail: 'Unfavourable',
      skipped: 'Not performed',
    },
  },
};
