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
  PUBLIC_DEFAULT_TENANT,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_SHOW_COBRAND_EXAMPLE,
} from 'astro:env/client';
import { isTenantId, type TenantId } from './tenants';

export const env = {
  siteUrl: PUBLIC_SITE_URL.replace(/\/$/, ''),
  apiMode: PUBLIC_API_MODE,
  apiBaseUrl: PUBLIC_API_BASE_URL.replace(/\/$/, ''),
  analyticsProvider: PUBLIC_ANALYTICS_PROVIDER,
  analyticsEndpoint: PUBLIC_ANALYTICS_ENDPOINT,
  defaultTenant: (isTenantId(PUBLIC_DEFAULT_TENANT) ? PUBLIC_DEFAULT_TENANT : 'traza') as TenantId,
  contactEmail: PUBLIC_CONTACT_EMAIL,
  showCobrandExample: PUBLIC_SHOW_COBRAND_EXAMPLE,
} as const;

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
