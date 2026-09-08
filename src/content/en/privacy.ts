import type { PrivacyContent } from '../types';

export const privacy: PrivacyContent = {
  meta: {
    title: 'Privacy notice',
    description:
      'Provisional privacy notice for the Traza demo: no cookies or trackers, simulated forms and cookieless analytics that is disabled by default.',
  },

  title: 'Provisional privacy notice',
  updatedLabel: 'Last updated',
  updated: 'September 5, 2026',
  provisionalNote:
    'This notice is provisional and corresponds to a conceptual demonstration. A real deployment of the platform will have its own notice, adapted to the jurisdiction and to the institution or company that governs it.',
  intro:
    'This site exists to show how Traza works. It is designed not to collect personal data: it uses no cookies, embeds no trackers and its forms send no information to any server. Each point is explained below.',

  sections: [
    {
      title: 'Scope of this notice',
      paragraphs: [
        'This notice applies only to this conceptual demonstration and to the pages and interactive demos it contains. It does not describe the practices of any real deployment of the platform or of any institution or company.',
        'All data shown on the site — codes, units, events, organizations and verification results — is simulated.',
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
        'The forms on this site, including the contact form and the discrepancy report, are simulated. They show how the flow would work, but they send no data to any server and store none.',
        'We recommend not entering real personal data in any form of this demonstration.',
      ],
    },
    {
      title: 'Cookieless analytics',
      paragraphs: [
        'The site includes an analytics interface that uses no cookies and does not identify people. It is disabled by default in this demo.',
        'If a deployment enabled it, it would record only anonymous, aggregated events — such as a page view or the use of a demo — without full IP addresses, device identifiers or user profiles. Any activation would be reflected in this notice.',
      ],
    },
    {
      title: 'Public verification',
      paragraphs: [
        'Verifying a product does not require identifying yourself, creating an account or providing personal data. In this demo, verification runs on simulated data and consults no external service.',
        'In a real deployment, the verification service would need to receive the code being looked up in order to respond; that deployment’s notice would explain what is kept, for how long and for what purpose.',
      ],
    },
    {
      title: 'Third-party links and services',
      paragraphs: [
        'This site loads no third-party resources: fonts and graphic assets are served from the site itself.',
        'If external links were included in the future, the privacy practices of those sites would be the responsibility of their owners.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'The contact channel for privacy matters is configured in each deployment. No real channel is enabled in this demo; the contact form is simulated.',
      ],
    },
    {
      title: 'Changes to this notice',
      paragraphs: [
        'This notice may be updated as the demonstration evolves. The date of the last update appears at the top of the page.',
      ],
    },
  ],
};
