import type { CompanyContent } from '../types';

export const company: CompanyContent = {
  meta: {
    title: 'Company: mission, principles and how to reach us',
    description:
      'Traza Technology, C.A.: digital identity and medicines lookup. Explore the mission, principles and contact details of the private company behind this proposal.',
  },

  hero: {
    eyebrow: 'Company',
    title: 'A private company dedicated to medicine identity',
    subtitle:
      'Traza Technology, C.A. is a private company. Its medicines proposal connects unit-level digital identity, lifecycle records and public lookup, with roles and responsibilities defined in each pilot.',
  },

  mission: {
    title: 'Mission',
    paragraphs: [
      'To give each medicine unit a digital identity that anyone can look up. The record lets people compare product, presentation, lot and expiry with the package; it does not certify its physical contents.',
      'We design the proposal for manufacturers, importers, pharmacies, healthcare facilities, quality teams and health authorities. The public also needs a clear answer when comparing a medicine with its record.',
      'Our master brand lives at traza.technology. Each medicines pilot may carry the responsible organization’s brand, subject to approval and without claiming an institutional relationship.',
    ],
  },

  whatWeDo: {
    title: 'What we do',
    items: [
      {
        title: 'Unit-level digital identity',
        body: 'A unique, signed identifier for each unit, with the data that describes it and no personal data.',
        icon: 'fingerprint',
      },
      {
        title: 'Traceability',
        body: 'An ordered record of each unit’s lifecycle: issuance, labelling, activation, lookup, signals and closure.',
        icon: 'link',
      },
      {
        title: 'Public verification',
        body: 'A way to check any unit from the browser, with nothing to install and no account to create, with explained results.',
        icon: 'scan',
      },
      {
        title: 'Institutional control',
        body: 'Sample views for health authorities and quality teams: signals, reports and inspections. Their operation is agreed in each pilot.',
        icon: 'eye',
      },
      {
        title: 'Co-brand and white-label deployments',
        body: 'The same platform with the brand, rules and permissions agreed for each medicines programme.',
        icon: 'layers',
      },
    ],
  },

  principles: {
    title: 'Principles',
    items: [
      {
        title: 'Precision',
        body: 'We say exactly what was checked and what was not. We prefer an explanation to a promise.',
        icon: 'check',
      },
      {
        title: 'Calm',
        body: 'A verification result should help people decide, not alarm them. We design for the point of sale and for quick reading.',
        icon: 'clock',
      },
      {
        title: 'Public and private service',
        body: 'The platform is designed for institutions and companies alike. The same layer serves control and brand protection.',
        icon: 'globe',
      },
      {
        title: 'Openness to audit',
        body: 'The registry is designed so that a third party can review it. What we cannot prove, we do not claim.',
        icon: 'document',
      },
    ],
  },

  contact: {
    title: 'What would you like to improve?',
    intro: 'A first conversation to understand your operation and consider the next step.',
    formTitle: 'Let’s start with your context.',
    form: {
      name: 'Name',
      email: 'Email',
      organization: 'Organization',
      sector: 'Organization type',
      sectorOptions: [
        'Medicine manufacturers',
        'Medicine importers',
        'Pharmacies',
        'Healthcare facilities',
        'Quality teams',
        'Health authorities',
        'Other',
      ],
      message: 'Message',
      consent: 'I agree that my details may be used only to reply to this message.',
      mailSubject: 'Enquiry from traza.technology — {name}',
      submit: 'Send message',
      success: {
        title: 'Your message is ready to send',
        body: 'We have opened your email app with the message drafted. Review it and send it: until you do, it has not reached us. If nothing opened, write to us at:',
      },
      error: {
        title: 'Could not prepare the message',
        body: 'Your email app could not be opened. Copy what you wrote and send it to the contact address shown on this page.',
      },
    },
    emailLabel: 'Contact email',
    emailFallback:
      'Write to us using the form and we will reply to the address you provide.',
    responseNote: 'The team responds on business days.',
  },

  legal: {
    title: 'Company details',
    items: [
      { label: 'Registered name', value: 'Traza Technology, C.A.' },
      { label: 'Brand', value: 'Traza®' },
      { label: 'Activity', value: 'Unit-level digital identity, traceability and verification platform' },
      { label: 'Site', value: 'traza.technology' },
    ],
  },

  disclaimer:
    'This page does not claim contracts, certifications or a relationship with governments or agencies. The medicines use case is a pilot proposal.',
};
