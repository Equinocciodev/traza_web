import type { CompanyContent } from '../types';

export const company: CompanyContent = {
  meta: {
    title: 'Company: mission, principles and how to reach us',
    description:
      'Traza Technology, C.A., a private company and multisector platform for unit-level identity, traceability and verification. Mission, principles, contact.',
  },

  hero: {
    eyebrow: 'Company',
    title: 'A private company dedicated to trust in products',
    subtitle:
      'Traza Technology, C.A. is a private company and a multisector technology platform. It provides unit-level digital identity, traceability, verification and control services to public-sector entities and private industries.',
  },

  mission: {
    title: 'Mission',
    paragraphs: [
      'To give real products a digital identity that anyone can check. We believe that trust in what is bought, distributed or regulated should not depend on a label that is hard to imitate, but on a verifiable history that accompanies each unit.',
      'We design the platform for regulators, control agencies and private industries that need to know which units circulate, where they come from and whether what is sold matches what is registered. And for the public, who deserve a clear answer at the moment of purchase.',
      'Our master brand lives at traza.technology. Each deployment can carry the brand of the institution or company that governs it, by country, regulator or industry, on the same platform.',
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
        body: 'An ordered, auditable registry of each unit’s events along the chain.',
        icon: 'link',
      },
      {
        title: 'Public verification',
        body: 'A way to check any unit from the browser, with nothing to install and no account to create, with explained results.',
        icon: 'scan',
      },
      {
        title: 'Institutional control',
        body: 'Views for regulators and companies: anomaly tracking, discrepancy reports and field inspection.',
        icon: 'eye',
      },
      {
        title: 'Co-brand and white-label deployments',
        body: 'The same platform with the brand, rules and context of each institution or company, by country and by sector.',
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
    title: 'Contact',
    intro:
      'If your organization is considering a pilot, an integration or simply wants to understand the platform better, write to us.',
    form: {
      name: 'Name',
      email: 'Email',
      organization: 'Organization',
      sector: 'Sector',
      sectorOptions: [
        'Government or regulator',
        'Food and beverages',
        'Pharmaceutical and health',
        'Agribusiness',
        'Spare parts and components',
        'Consumer goods',
        'Documents and certificates',
        'Other',
      ],
      message: 'Message',
      consent: 'I agree that my details may be used only to reply to this message.',
      submit: 'Send message',
      success: {
        title: 'Message received',
        body: 'Thank you for writing. We will reply within business days to the address you provided.',
      },
      error: {
        title: 'Could not send',
        body: 'A problem occurred while processing the form. Check the highlighted fields and try again.',
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
    'This page does not claim contracts, certifications or a relationship with governments or agencies. The spirits use case is a pilot proposal.',
};
