import type { PrivacyContent } from '../types';

export const privacy: PrivacyContent = {
  meta: {
    title: 'Privacy notice',
    description:
      'Privacy notice for traza.technology: no cookies or trackers, no third-party resources, forms that store no data, and cookieless analytics disabled by default. Controller: Traza Technology, C.A.',
  },

  title: 'Privacy notice',
  updatedLabel: 'Last updated',
  updated: 'September 5, 2026',
  provisionalNote:
    'This notice covers this site, traza.technology, for which Traza Technology, C.A. is the controller. Each deployment of the platform governed by an institution or a company has its own notice, adapted to its jurisdiction.',
  intro:
    'This site is designed not to collect personal data: it uses no cookies, embeds no trackers and loads no third-party resources. Each point is explained below.',

  sections: [
    {
      title: 'Scope of this notice',
      paragraphs: [
        'This notice applies to this site and to the pages and interactive tools it contains. It does not describe the practices of a deployment governed by an institution or a company, which has its own notice.',
        'The controller is Traza Technology, C.A. You may direct any privacy enquiry to it through the channel indicated below.',
      ],
    },
    {
      title: 'Cookies and trackers',
      paragraphs: [
        'This site sets no cookies, neither its own nor third-party ones. It embeds no tracking pixels, heat maps or advertising tools.',
        'The browser may keep local preferences — for example, the chosen language — in its own storage. That information never leaves the device and can be deleted from the browser at any time.',
      ],
    },
    {
      title: 'Forms',
      paragraphs: [
        'The contact form composes a message from what you type and opens it in your own mail client: you send it from your own account. This site neither transmits those details on its own nor stores them.',
        'Anything you write to us is used only to reply to you. We do not pass it to third parties or use it for any other purpose.',
      ],
    },
    {
      title: 'Cookieless analytics',
      paragraphs: [
        'The site includes an analytics interface that uses no cookies and does not identify people. It is disabled by default.',
        'If it were enabled, it would record only anonymous, aggregated events — such as a page view or the use of a tool — without full IP addresses, device identifiers or user profiles. Any activation would be reflected in this notice.',
      ],
    },
    {
      title: 'Public verification',
      paragraphs: [
        'Verifying a product does not require identifying yourself, creating an account or providing personal data. On this site the lookup is resolved in your browser.',
        'When verification is served from a deployment’s registry, the service needs to receive the code being looked up in order to respond; that deployment’s notice explains what is kept, for how long and for what purpose.',
      ],
    },
    {
      title: 'Third-party links and services',
      paragraphs: [
        'This site loads no third-party resources: fonts and graphic assets are served from the site itself.',
        'The footer includes a link to our Instagram profile. If you follow it, that platform’s privacy practices are the responsibility of its owner; this site loads nothing from it.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'For any privacy matter you may write to Traza Technology, C.A. using the form on the company page, or to the contact address shown there.',
      ],
    },
    {
      title: 'Changes to this notice',
      paragraphs: [
        'This notice may be updated as the site and the platform evolve. The date of the last update appears at the top of the page.',
      ],
    },
  ],
};
