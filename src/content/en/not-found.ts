import type { NotFoundContent } from '../types';

export const notFound: NotFoundContent = {
  meta: {
    title: 'Page not found',
    description:
      'The requested page does not exist or has moved. Return to the home page to read about the platform, or verify a product by entering the code printed on its label.',
  },
  code: '404',
  title: 'This page does not exist',
  body:
    'The address may be misspelled or the page may have moved. From here you can return to the home page or try public verification.',
  primaryCta: { label: 'Back to home', key: 'home', variant: 'primary' },
  secondaryCta: { label: 'Verify a product', key: 'verify', variant: 'secondary' },
};
