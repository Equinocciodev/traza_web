/**
 * Tenants (co-brand / white-label).
 *
 * La marca maestra vive en traza.technology. Cada despliegue por país, regulador o industria
 * puede definir un tenant con su lockup, acentos y textos de contexto. Los lockups de agencias
 * son condicionales: solo se muestran cuando una fuente aprobada lo autoriza. Aquí el
 * tenant `medicamentos` es un EJEMPLO de co-brand para una propuesta de piloto (sin emblema oficial),
 * y se puede desactivar con PUBLIC_SHOW_COBRAND_EXAMPLE=false.
 */
import type { Locale } from '@/i18n';

export type TenantId = 'traza' | 'medicamentos';

export interface TenantLockup {
  /** Partes del lockup tipográfico, por ejemplo ["EMPRESA PÚBLICA Y/O PRIVADA", "TRAZA"]. */
  parts: [string, string];
  /** Texto accesible del lockup. */
  alt: Record<Locale, string>;
}

export interface Tenant {
  id: TenantId;
  /** Nombre visible del tenant/registro. */
  name: Record<Locale, string>;
  /** Nombre corto para chips y contexto de verificación. */
  shortName: Record<Locale, string>;
  /** Tipo de despliegue. */
  kind: 'master' | 'regulator-pilot' | 'industry';
  /** Sector o ámbito. */
  scope: Record<Locale, string>;
  /** Estado del despliegue tal como debe rotularse siempre. */
  statusLabel: Record<Locale, string>;
  /** Lockup tipográfico opcional (co-brand). */
  lockup?: TenantLockup;
  /** Aviso obligatorio que acompaña al lockup. */
  cobrandNotice?: Record<Locale, string>;
  /** Texto de contexto que se muestra en la verificación pública. */
  verifyContext: Record<Locale, string>;
  /** Nombre del registro consultado. */
  registryName: Record<Locale, string>;
  /** Canal de siguiente paso recomendado (texto por idioma). */
  nextStepHint: Record<Locale, string>;
}

export const TENANTS: Record<TenantId, Tenant> = {
  traza: {
    id: 'traza',
    name: { es: 'Traza', en: 'Traza' },
    shortName: { es: 'Traza', en: 'Traza' },
    kind: 'master',
    scope: { es: 'Multisector', en: 'Multi-sector' },
    statusLabel: { es: 'Marca maestra', en: 'Master brand' },
    verifyContext: {
      es: 'Verificación pública de Traza. El resultado se refiere únicamente al identificador escaneado.',
      en: 'Traza public verification. The result refers only to the scanned identifier.',
    },
    registryName: { es: 'Registro de Traza', en: 'Traza registry' },
    nextStepHint: {
      es: 'Si algo no coincide con el producto que tiene en la mano, prepare un reporte de discrepancia para la organización responsable.',
      en: 'If anything does not match the product in your hand, prepare a discrepancy report for the responsible organisation.',
    },
  },
  medicamentos: {
    id: 'medicamentos',
    name: { es: 'Piloto de medicamentos', en: 'Medicines pilot' },
    shortName: { es: 'Piloto medicamentos', en: 'Medicines pilot' },
    kind: 'regulator-pilot',
    scope: { es: 'Medicamentos', en: 'Medicines' },
    statusLabel: { es: 'Propuesta de piloto', en: 'Pilot proposal' },
    lockup: {
      parts: ['EMPRESA PÚBLICA Y/O PRIVADA', 'TRAZA'],
      alt: {
        es: 'Ejemplo de lockup co-brand EMPRESA PÚBLICA Y/O PRIVADA | TRAZA — propuesta de piloto',
        en: 'Example co-brand lockup EMPRESA PÚBLICA Y/O PRIVADA | TRAZA — pilot proposal',
      },
    },
    cobrandNotice: {
      es: 'Ejemplo de co-brand de una propuesta de piloto. No implica relación oficial, aprobación ni implementación.',
      en: 'Example co-brand for a pilot proposal. It does not imply an official relationship, approval or implementation.',
    },
    verifyContext: {
      es: 'Verificación pública del piloto de medicamentos (propuesta). El resultado se refiere únicamente al identificador escaneado.',
      en: 'Public verification for the medicines pilot (proposal). The result refers only to the scanned identifier.',
    },
    registryName: { es: 'Registro del piloto de medicamentos', en: 'Medicines pilot registry' },
    nextStepHint: {
      es: 'Ante una discrepancia, conserve la unidad, prepare el reporte y entréguelo a la organización responsable para revisión.',
      en: 'If there is a discrepancy, keep the unit, prepare the report and give it to the responsible organisation for review.',
    },
  },
};

export const DEFAULT_TENANT: TenantId = 'traza';

export function isTenantId(value: unknown): value is TenantId {
  return value === 'traza' || value === 'medicamentos';
}

/** Resuelve el tenant desde un valor de URL (`?t=medicamentos`), con fallback seguro. */
export function resolveTenant(value: string | null | undefined, fallback: TenantId = DEFAULT_TENANT): Tenant {
  const id = value && isTenantId(value) ? value : fallback;
  return TENANTS[id];
}
