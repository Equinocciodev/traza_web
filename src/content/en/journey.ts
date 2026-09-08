import type { JourneyContent } from '../journey.types';

/**
 * Product journey (EN).
 * The six stage names match `home.chain.nodes`.
 */
export const journey: JourneyContent = {
  meta: {
    title: 'Product journey: six stages, event by event',
    description:
      'Follow a unit from the factory or customs through to final verification: six stages with actor, place and date, and the whole story built stage by stage.',
  },

  hero: {
    eyebrow: 'Product journey',
    title: 'From the factory to verification, step by step',
    subtitle:
      'Each unit adds events as it moves along the chain: who records them, where and when. This page rebuilds that journey and plays it back stage by stage.',
  },

  explorer: {
    eyebrow: 'Interactive journey',
    title: 'The line that completes itself',
    intro:
      'Choose a unit and play its journey. The line advances through the recorded stages and each card shows the event as it appears in the registry. Some units never reach the end: the line stops at the last recorded stage.',
    regionLabel: 'Interactive journey of a unit',
    keyboardHint: 'With focus inside the stage list, use the arrow keys to move forward or back; Home and End jump to the ends.',
    noScript: 'Playback controls require JavaScript. The full list of events for the example unit is shown below.',
  },

  stages: [
    {
      id: 'issuance',
      label: 'Issuance',
      description: 'The platform derives and signs each unit’s identifier, within the order that was requested.',
      icon: 'signature',
    },
    {
      id: 'labeling',
      label: 'Labelling',
      description: 'The signed code is printed and applied to the unit, using the plant’s own infrastructure.',
      icon: 'label',
    },
    {
      id: 'activation',
      label: 'Activation',
      description: 'When the lot closes, the record is completed — lot and expiry, or serial — and the codes become active.',
      icon: 'check',
    },
    {
      id: 'lookup',
      label: 'Public lookup',
      description: 'Anyone checks the unit from the browser and compares what they see with the registry.',
      icon: 'scan',
    },
    {
      id: 'signals',
      label: 'Signals',
      description: 'Every lookup adds context: when the first one happened, how many there have been, and whether the pattern is impossible for a single unit.',
      icon: 'chart',
    },
    {
      id: 'closure',
      label: 'Closure',
      description: 'When activation ends, the sequence numbers that were never used are voided by range.',
      icon: 'lock',
    },
  ],

  unitSelector: {
    label: 'Example unit',
    help: 'Each unit shows a different journey: complete, in progress, with incidents, or without a record.',
    codeLabel: 'Code',
    registryLabel: 'Registry',
    options: [
      { code: 'TRZ-7F2K-4K7Q-92FA', label: 'Domestic rum · complete journey with public verification' },
      { code: 'TRZ-7F2K-3N6D-09ZB', label: 'Imported whisky · with discrepancy report and inspection' },
      { code: 'TRZ-7F2K-8L1F-63HW', label: 'Imported whisky · labelled but not activated (under review)' },
      { code: 'TRZ-7F2K-5R9C-77MQ', label: 'Domestic rum · lot revoked by the issuer' },
      { code: 'TRZ-7F2K-6C2A-84MZ', label: 'Coffee · Traza registry (another sector)' },
      { code: 'TRZ-7F2K-2B8X-40NE', label: 'Unit with no recorded journey' },
    ],
  },

  controls: {
    play: 'Play',
    pause: 'Pause',
    replay: 'Play again',
    prev: 'Previous',
    next: 'Next',
    restart: 'Restart',
    stepsLabel: 'Journey stages',
    progressLabel: 'Journey progress',
    simulateError: 'Simulate registry error',
  },

  legend: {
    title: 'Legend',
    items: [
      { state: 'done', label: 'Stage travelled' },
      { state: 'active', label: 'Current stage' },
      { state: 'pending', label: 'Recorded, not yet travelled' },
      { state: 'unrecorded', label: 'No record for this unit' },
    ],
  },

  eventsSection: {
    title: 'Recorded events',
    intro: 'Grouped by stage, in the order they appear in the registry. Future stages are dimmed, never hidden.',
  },

  story: {
    title: 'Story of the unit',
    fields: [
      { key: 'issuer', label: 'Manufacturer / importer', icon: 'factory' },
      { key: 'product', label: 'Product / presentation', icon: 'box' },
      { key: 'origin', label: 'Origin / lot', icon: 'map-pin' },
      { key: 'record', label: 'Lifecycle record', icon: 'history' },
    ],
  },

  states: {
    loading: 'Rebuilding the journey…',
    empty: {
      title: 'No recorded journey',
      body: 'The selected unit has no events in the registry. This happens, for example, when the identifier was not issued by a known key or its signature does not match the code content: without events there is no journey to rebuild. Public verification explains separately what was checked and what the next step is.',
    },
    error: {
      title: 'We could not query the registry',
      body: 'The registry did not respond to the query. It is not a problem on your side: retry to rebuild the journey.',
      retry: 'Retry',
    },
  },

  explain: {
    eyebrow: 'The story of the unit',
    title: 'How a verifiable story is built',
    intro:
      'A journey is the sum of events recorded by each actor in the chain. Each event states who records it, where, when and under which document reference; together they let anyone compare what the label says with what the registry holds.',
    quote: 'Traza does more than identify products. It builds their verifiable history.',
    fields: [
      {
        key: 'issuer',
        label: 'Manufacturer / importer',
        description: 'Who placed the unit on the market and is accountable for it. Issues and signs the identity when the unit leaves the factory or enters through customs.',
        icon: 'factory',
      },
      {
        key: 'product',
        label: 'Product / presentation',
        description: 'What exactly it is: type, variant, format and declared content. This is what verification compares against the label.',
        icon: 'box',
      },
      {
        key: 'origin',
        label: 'Origin / lot',
        description: 'Where it comes from and which production or import lot it belongs to. A withdrawn lot affects all of its units.',
        icon: 'map-pin',
      },
      {
        key: 'record',
        label: 'Lifecycle record',
        description: 'How many events it has, and at which stages. An identifier that is labelled but not yet activated, already being looked up out in the world, is a signal worth reviewing.',
        icon: 'history',
      },
    ],
    note: 'Events are contributed by the issuer from its own systems, or by the platform when someone runs a lookup. Transport and distribution are not recorded.',
  },

  cta: {
    title: 'See the other side of the journey',
    body: 'Public verification compares the label with this registry and explains the result in plain language. The institutional view shows how a regulator or a company would follow it.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
  },

  runtime: {
    eventKinds: {
      import_declared: 'Import declared',
      identity_issued: 'Identifier issued and signed',
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
      revoked: 'Lot revocation',
      issuance_closed: 'Issuance closed',
    },
    issuerRoles: { manufacturer: 'Manufacturer', importer: 'Importer' },
    stageStates: {
      done: 'Travelled',
      active: 'Current stage',
      pending: 'Not yet travelled',
      unrecorded: 'No record',
    },
    stageEmpty: 'No events recorded at this stage.',
    stageUnrecorded: 'According to the registry, the unit has not reached this stage.',
    events: {
      none: 'No events',
      one: '1 event: {list}',
      many: '{count} events: {list}',
    },
    summary: {
      complete: 'Complete journey · last stage: {stage}',
      inProgress: 'Journey in progress · last recorded stage: {stage}',
      none: 'No recorded journey',
    },
    progress: 'Stage {n} of {total}',
    live: {
      stage: 'Stage {n} of {total}: {stage}. {events}.',
      playing: 'Playing the journey.',
      paused: 'Playback paused at {stage}.',
      ended: 'Journey complete. Last stage: {stage}.',
      endedPartial: 'End of record: the unit is at {stage}. Journey in progress.',
      loaded: 'Journey rebuilt: {unit}.',
      loading: 'Rebuilding the journey…',
      empty: 'No recorded journey for this unit.',
      error: 'The registry could not be queried. You can retry.',
      unrecorded: 'There is no record of the {stage} stage for this unit.',
      restarted: 'Journey restarted at {stage}.',
    },
    story: {
      product: '{presentation} · {category}',
      origin: '{site} · {region}',
      lot: '{lot}',
      produced: 'produced {date}',
      record: '{events} events across {stages} of {total} stages',
      lastLookup: 'Last lookup: {site} · {region}',
      noLastLookup: 'No lookups recorded',
      noRecord: 'No events recorded',
      empty: '—',
    },
    refLabel: 'Reference',
  },
};
