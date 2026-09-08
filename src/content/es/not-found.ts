import type { NotFoundContent } from '../types';

export const notFound: NotFoundContent = {
  meta: {
    title: 'Página no encontrada',
    description:
      'La página solicitada no existe o cambió de dirección. Vuelva al inicio para conocer la plataforma, o verifique un producto introduciendo el código que figura en su etiqueta.',
  },
  code: '404',
  title: 'Esta página no existe',
  body:
    'Puede que la dirección esté mal escrita o que la página haya cambiado de lugar. Desde aquí puede volver al inicio o probar la verificación pública.',
  primaryCta: { label: 'Volver al inicio', key: 'home', variant: 'primary' },
  secondaryCta: { label: 'Verificar un producto', key: 'verify', variant: 'secondary' },
};
