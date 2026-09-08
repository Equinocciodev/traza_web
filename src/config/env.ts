/**
 * Acceso tipado a la configuración por entorno (ver astro.config.ts y .env.example).
 * Los valores se inyectan en tiempo de build; ninguno conecta dominios ni proveedores.
 */
import {
  PUBLIC_SITE_URL,
  PUBLIC_API_MODE,
  PUBLIC_API_BASE_URL,
  PUBLIC_ANALYTICS_PROVIDER,
  PUBLIC_ANALYTICS_ENDPOINT,
  PUBLIC_GA4_MEASUREMENT_ID,
  PUBLIC_DEFAULT_TENANT,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_EMAIL_EN,
  PUBLIC_SHOW_COBRAND_EXAMPLE,
} from 'astro:env/client';
import { isTenantId, type TenantId } from './tenants';

export const env = {
  siteUrl: PUBLIC_SITE_URL.replace(/\/$/, ''),
  apiMode: PUBLIC_API_MODE,
  apiBaseUrl: PUBLIC_API_BASE_URL.replace(/\/$/, ''),
  analyticsProvider: PUBLIC_ANALYTICS_PROVIDER,
  analyticsEndpoint: PUBLIC_ANALYTICS_ENDPOINT,
  ga4MeasurementId: PUBLIC_GA4_MEASUREMENT_ID,
  defaultTenant: (isTenantId(PUBLIC_DEFAULT_TENANT) ? PUBLIC_DEFAULT_TENANT : 'traza') as TenantId,
  contactEmail: PUBLIC_CONTACT_EMAIL,
  contactEmailEn: PUBLIC_CONTACT_EMAIL_EN,
  showCobrandExample: PUBLIC_SHOW_COBRAND_EXAMPLE,
} as const;

/**
 * Correo de contacto del idioma pedido. El buzón en inglés es opcional: si no está
 * configurado, se responde desde el mismo de siempre.
 */
export function contactEmailFor(locale: 'es' | 'en'): string {
  if (locale === 'en' && env.contactEmailEn) return env.contactEmailEn;
  return env.contactEmail;
}

/**
 * Endpoints futuros (documentados, no consumidos en modo mock).
 * Se construyen sobre PUBLIC_API_BASE_URL para no fijar proveedor.
 */
export const ENDPOINTS = {
  verify: (code: string, tenant: TenantId) => `${env.apiBaseUrl}/v1/verify?code=${encodeURIComponent(code)}&tenant=${encodeURIComponent(tenant)}`,
  report: () => `${env.apiBaseUrl}/v1/reports`,
  contact: () => `${env.apiBaseUrl}/v1/contact`,
  analytics: () => env.analyticsEndpoint,
} as const;
