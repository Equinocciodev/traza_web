import type { Locale } from '@/i18n';
import type { SiteContent } from './types';
import { content as es } from './es';
import { content as en } from './en';

const CONTENT: Record<Locale, SiteContent> = { es, en };

/** Devuelve el diccionario completo del idioma solicitado. */
export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}

export type * from './types';
