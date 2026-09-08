import type { NotFoundContent } from '../types';

export const notFound: NotFoundContent = {
  meta: {
    title: 'Page not found',
    description:
      'The requested page does not exist or has moved. Return to the home page or verify a product in the Traza conceptual demonstration.',
  },
  code: '404',
  title: 'This page does not exist',
  body:
    'The address may be misspelled or the page may have moved. From here you can return to the home page or try public verification.',
  primaryCta: { label: 'Back to home', key: 'home', variant: 'primary' },
  secondaryCta: { label: 'Verify a product', key: 'verify', variant: 'secondary' },
};
