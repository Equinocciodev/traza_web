import type { CommonContent } from '../types';

export const common: CommonContent = {
  brand: {
    name: 'traza',
    wordmarkAlt: 'traza®',
    tagline: 'Digital identity for real products',
    domain: 'traza.technology',
  },

  meta: {
    siteName: 'traza',
    titleTemplate: '%s · traza',
    defaultDescription:
      'Traza is a platform for unit-level digital identity, traceability and public verification of real products. Conceptual demonstration with simulated data.',
    ogImageAlt: 'traza® — Digital identity for real products. Conceptual demonstration with simulated data.',
  },

  demoBadge: {
    long: 'Conceptual demonstration — simulated data',
    short: 'Demo · simulated data',
    explain:
      'This site is a conceptual demonstration. The codes, units, events, results and organizations it shows are simulated; none of them correspond to a real implementation or imply a relationship with any institution.',
  },

  skipLink: 'Skip to main content',

  nav: {
    ariaLabel: 'Main navigation',
    items: [
      { key: 'home', label: 'Home' },
      { key: 'platform', label: 'Platform' },
      {
        key: 'solutions',
        label: 'Solutions',
        children: [
          { key: 'solutionsGovernment', label: 'Government and regulators' },
          { key: 'solutionsIndustry', label: 'Industry' },
          { key: 'solutionsCitizens', label: 'Citizens' },
        ],
      },
      { key: 'howItWorks', label: 'How it works' },
      { key: 'caseSpirits', label: 'Case: Spirits' },
      { key: 'security', label: 'Security and trust' },
      { key: 'company', label: 'Company' },
    ],
    cta: { label: 'Verify', key: 'verify', variant: 'primary' },
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    homeLinkLabel: 'traza — go to home page',
  },

  languageSwitch: {
    label: 'Language',
    switchTo: 'Español',
    switchAria: 'Switch to Spanish',
  },

  footer: {
    columns: [
      {
        title: 'Demos',
        links: [
          { label: 'Public verification', key: 'verify' },
          { label: 'Product journey', key: 'journey' },
          { label: 'Institutional view', key: 'institutional' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { label: 'Platform', key: 'platform' },
          { label: 'How it works', key: 'howItWorks' },
          { label: 'Solutions', key: 'solutions' },
          { label: 'Case: Spirits', key: 'caseSpirits' },
          { label: 'Security and trust', key: 'security' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Company and contact', key: 'company' },
          { label: 'Privacy notice', key: 'privacy' },
        ],
      },
    ],
    legal: '© 2026 traza. All rights reserved.',
    disclaimer:
      'Conceptual demonstration with simulated data. This site does not claim any relationship with governments, regulators, clients or certifications. The spirits use case is presented as a pilot proposal; nothing shown here constitutes an official implementation.',
    privacyLabel: 'Privacy',
    contactLabel: 'Contact',
    languageLabel: 'Language',
  },

  cobrandNotice:
    'The tenant lockup shown is a co-brand example included in a pilot proposal. Its use is subject to approval by the corresponding institution and does not imply an official relationship, endorsement or approval.',

  a11y: {
    newWindow: 'Opens in a new window',
    loading: 'Loading',
    close: 'Close',
    back: 'Back',
    breadcrumbs: 'Breadcrumb',
    demoRegion: 'Interactive demonstration with simulated data',
  },

  states: {
    loading: 'Loading…',
    retry: 'Try again',
    offlineTitle: 'No connection',
    offlineBody:
      'There is no internet connection right now. You can keep reading this page; lookups will resume when the connection returns.',
    serverErrorTitle: 'We could not complete the lookup',
    serverErrorBody:
      'The service did not respond as expected. This is not a problem on your side. Wait a few seconds and try again.',
    emptyTitle: 'No results',
    emptyBody: 'We found no information for this lookup. Check the code you entered or try another one.',
    recoveredTitle: 'Connection restored',
    recoveredBody: 'You can continue. If a lookup was left pending, try it again.',
  },

  form: {
    required: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    tooShort: 'The text is too short.',
    tooLong: 'The text is too long.',
    submit: 'Send',
    sending: 'Sending…',
    sentTitle: 'Message received',
    sentBody: 'Thank you. In this demo the submission is simulated: no data has been transmitted or stored.',
    errorTitle: 'Could not send',
    errorBody: 'A problem occurred while processing the form. Check the highlighted fields and try again.',
    optional: 'optional',
    privacyNote:
      'This form is simulated: it does not send data to any server or store it. It only shows how the flow would work.',
    errorSummaryTitle: 'Check the following fields',
    noScript: 'Simulated submission requires JavaScript. Until it is available, the button is disabled and your data is not sent.',
  },
};
