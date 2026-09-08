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
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MEASUREMENT_ID,
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
 * Configuración web de Firebase (valores públicos). Se considera utilizable solo si están
 * presentes la clave, el appId y el measurementId: sin ellos `getAnalytics()` no puede medir.
 */
export const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

export const firebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.appId) && Boolean(firebaseConfig.measurementId);

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
