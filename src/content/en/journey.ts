import type { JourneyContent } from '../journey.types';

/**
 * Demo B · Product journey (EN).
 * Everything shown is simulated: units, organisations, places, lots and dates are fictional.
 * The six stage names match `home.chain.nodes`.
 */
export const journey: JourneyContent = {
  meta: {
    title: 'Product journey',
    description:
      'Follow a simulated unit from the factory or customs to final verification: six stages, events with actor, place and date, and the story built along the way. Conceptual demonstration.',
  },

  hero: {
    eyebrow: 'Demo B · Product journey',
    title: 'From the factory to verification, step by step',
    subtitle:
      'Each unit adds events as it moves along the chain: who records them, where and when. This demonstration rebuilds that journey with simulated data and plays it back stage by stage.',
    note: 'Conceptual demonstration with simulated data: units, organisations, places, lots and dates are fictional.',
  },

  demo: {
    eyebrow: 'Interactive demonstration',
    title: 'The line that completes itself',
    intro:
      'Choose a unit and play its journey. The line advances through the recorded stages and each card shows the event as it appears in the simulated registry. Some units never reach the end: the line stops at the last recorded stage.',
    regionLabel: 'Interactive journey of a simulated unit',
    simulatedNotice: 'Simulated data',
    keyboardHint: 'With focus inside the stage list, use the arrow keys to move forward or back; Home and End jump to the ends.',
    noScript: 'Playback controls require JavaScript. The full list of events for the example unit is shown below.',
  },

  stages: [
    {
      id: 'origin',
      label: 'Factory / customs',
      description: 'The unit receives its digital identity when it leaves the factory or enters through customs.',
      icon: 'factory',
    },
    {
      id: 'labeling',
      label: 'Labeling',
      description: 'The signed code is printed on the label or seal of each unit.',
      icon: 'label',
    },
    {
      id: 'transport',
      label: 'Transport',
      description: 'Each transfer is recorded as an event with date, origin and destination.',
      icon: 'truck',
    },
    {
      id: 'distribution',
      label: 'Distribution',
      description: 'Distribution centers confirm the receipt and dispatch of units.',
      icon: 'warehouse',
    },
    {
      id: 'commerce',
      label: 'Retail',
      description: 'The point of sale records the arrival and the unit is ready for verification.',
      icon: 'store',
    },
    {
      id: 'verification',
      label: 'Verification',
      description: 'Anyone verifies the unit from the browser and compares what they see with the registry.',
      icon: 'scan',
    },
  ],

  unitSelector: {
    label: 'Example unit',
    help: 'Each unit shows a different journey: complete, in progress, with incidents, or without a record.',
    codeLabel: 'Code',
    registryLabel: 'Registry',
    options: [
      { code: 'TRZ-DEMO-4K7Q-92FA', label: 'Domestic rum · complete journey with public verification' },
      { code: 'TRZ-DEMO-3N6D-09ZB', label: 'Imported whisky · with discrepancy report and inspection' },
      { code: 'TRZ-DEMO-8L1F-63HW', label: 'Imported whisky · held at distribution (in progress)' },
      { code: 'TRZ-DEMO-5R9C-77MQ', label: 'Domestic rum · lot revoked by the issuer' },
      { code: 'TRZ-DEMO-6C2A-84MZ', label: 'Coffee · Traza demonstration registry (another sector)' },
      { code: 'TRZ-DEMO-2B8X-40NE', label: 'Unit with no recorded journey' },
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
    intro: 'Grouped by stage, in the order they appear in the simulated registry. Future stages are dimmed, never hidden.',
  },

  story: {
    title: 'Story of the unit',
    simulatedTag: 'Simulated data',
    fields: [
      { key: 'issuer', label: 'Manufacturer / importer', icon: 'factory' },
      { key: 'product', label: 'Product / presentation', icon: 'box' },
      { key: 'origin', label: 'Origin / lot', icon: 'map-pin' },
      { key: 'movements', label: 'Movements / destination', icon: 'truck' },
    ],
  },

  states: {
    loading: 'Rebuilding the journey…',
    empty: {
      title: 'No recorded journey',
      body: 'The selected unit has no events in the simulated registry. This happens, for example, when the identifier was not issued by a known key or its signature does not match the code content: without events there is no journey to rebuild. Public verification explains separately what was checked and what the next step is.',
    },
    error: {
      title: 'We could not query the registry',
      body: 'This is a simulated error that shows how the demonstration behaves when the registry does not respond. It is not a problem on your side: retry to rebuild the journey.',
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
        key: 'movements',
        label: 'Movements / destination',
        description: 'Where it has been and where it was headed according to the registry. A gap between the last movement and the place of verification is a signal worth reviewing.',
        icon: 'truck',
      },
    ],
    note: 'No event in this demonstration comes from a real system. In a deployment, events would be recorded from the management systems of each actor in the chain, following the rules of each tenant.',
  },

  cta: {
    title: 'See the other side of the journey',
    body: 'Public verification compares the label with this registry and explains the result in plain language. The institutional view shows how a regulator or a company would follow it.',
    primaryCta: { label: 'Verify a product', key: 'verify', variant: 'primary' },
    secondaryCta: { label: 'Open the institutional view', key: 'institutional', variant: 'secondary' },
  },

  runtime: {
    eventKinds: {
      identity_issued: 'Digital identity issued',
      customs_cleared: 'Customs entry',
      labeled: 'Label applied',
      shipped: 'Dispatched for transport',
      in_transit: 'In transit',
      received: 'Received at distribution',
      dispatched: 'Dispatched to retail',
      received_commerce: 'Received at retail',
      sold: 'Sale recorded',
      verified: 'Public verification',
      inspected: 'Field inspection',
      reported: 'Discrepancy report',
      revoked: 'Lot revocation',
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
      error: 'The registry could not be queried (simulated error). You can retry.',
      unrecorded: 'There is no record of the {stage} stage for this unit.',
      restarted: 'Journey restarted at {stage}.',
    },
    story: {
      product: '{presentation} · {category}',
      origin: '{site} · {region}',
      lot: '{lot}',
      produced: 'produced {date}',
      movements: '{events} events across {stages} of {total} stages',
      destination: 'Recorded destination: {site} · {region}',
      noDestination: 'No recorded destination',
      noMovements: 'No recorded movements',
      empty: '—',
    },
    refLabel: 'Reference',
  },
};
