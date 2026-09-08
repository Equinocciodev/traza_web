import type { PrivacyContent } from '../types';

export const privacy: PrivacyContent = {
  meta: {
    title: 'Privacy notice: cookies, data and your options',
    description:
      'What we measure with Google Analytics, which cookies are set, how we handle contact-form messages, and how to opt out. Controller: Traza Technology, C.A.',
  },

  title: 'Privacy notice',
  updatedLabel: 'Last updated',
  updated: 'September 5, 2026',
  provisionalNote:
    'This notice covers this site, traza.technology, for which Traza Technology, C.A. is the controller. Each deployment of the platform governed by an institution or a company has its own notice, adapted to its jurisdiction.',
  intro:
    'This site does not ask you for personal data in order to browse it, and it builds no advertising profiles. It does use an audience-measurement tool — Google Analytics — which sets cookies; below we explain exactly what is collected and how to avoid it.',

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
        'This site uses Google Analytics 4 to measure audience. That tool sets first-party cookies on your browser — `_ga` and `_ga_<identifier>` — used to distinguish visits and sessions. We embed no advertising pixels, heat maps or third-party advertising cookies.',
        'You can prevent this by blocking cookies for this site in your browser, by using Google’s Analytics opt-out add-on, or by enabling “Do Not Track”: we honour that signal, and with it enabled no measurement is sent.',
        'The browser may also keep local preferences — for example, the chosen language — in its own storage. That information never leaves the device and can be deleted from the browser at any time.',
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
      title: 'Audience measurement',
      paragraphs: [
        'We measure use of the site with Google Analytics 4, provided by Google. It records aggregated events — page views, language switches, use of verification — together with the usual technical data: approximate country and city derived from the IP address, device type, browser, language and referring page.',
        'We neither ask for nor send your name, your email or any identifier of yours, and we do not use this data for personalised advertising or combine it with other sources. The purpose is to understand which content is useful and how to improve the site.',
        'Google acts as data processor and may process the data on servers outside your country. Its terms are available at policies.google.com/technologies/partner-sites. If you would rather not be measured, see the cookies section.',
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
        'Fonts and graphic assets are served from the site itself. The only third-party service involved is Google Analytics, described above.',
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
