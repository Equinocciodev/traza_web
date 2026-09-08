import type { CommonContent } from '../types';

export const common: CommonContent = {
  brand: {
    name: 'traza',
    wordmarkAlt: 'traza®',
    tagline: 'Digital identity for real products',
    domain: 'traza.technology',
  },

  meta: {
    siteName: 'Traza®',
    titleTemplate: '%s · Traza®',
    defaultDescription:
      'Platform for unit-level digital identity, traceability and public verification: a signed identifier per unit and an auditable record of its whole journey.',
    homeTitle: 'Traza — Verifiable digital identity for real products',
    ogImageAlt: 'traza® — Digital identity for real products.',
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
        title: 'The platform at work',
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
          { label: 'Instagram', href: 'https://www.instagram.com/traza.technology/', external: true, rel: 'me' },
        ],
      },
    ],
    legal: '© 2026 traza. All rights reserved.',
    disclaimer:
      'This site does not claim any relationship with governments, regulators or certifications. The spirits use case is presented as a pilot proposal; it does not constitute an official implementation.',
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
    toolRegion: 'Interactive tool',
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
    sentBody: 'Thank you for writing. We will reply within business days.',
    errorTitle: 'Could not send',
    errorBody: 'A problem occurred while processing the form. Check the highlighted fields and try again.',
    optional: 'optional',
    privacyNote:
      'Your details are used only to reply to you. They are not stored on this site and are not shared with third parties.',
    errorSummaryTitle: 'Check the following fields',
    noScript: 'Submitting the form requires JavaScript. Until it is available, please write to us directly at the contact address.',
  },
};
