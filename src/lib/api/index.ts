/**
 * Punto de entrada del adaptador de API para las islas (usa la configuración por entorno).
 * Los tests unitarios importan `createMockApi` directamente desde ./client para no depender de astro:env.
 */
import { env } from '@/config/env';
import { createApi, type TrazaApi } from './client';

let instance: TrazaApi | null = null;

export function getApi(): TrazaApi {
  if (!instance) instance = createApi({ mode: env.apiMode, baseUrl: env.apiBaseUrl });
  return instance;
}

export { ApiError, simulateLatency, isBrowserOffline } from './client';
export type { TrazaApi, VerifyOptions, ContactForm, ContactReceipt, ApiErrorKind } from './client';
