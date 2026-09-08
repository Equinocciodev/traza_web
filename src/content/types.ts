/**
 * Contrato de contenido del sitio (ES/EN).
 *
 * Reglas de contenido (ver docs/03-matriz-fuente-afirmacion.md y docs/04-supuestos-contradicciones.md):
 * - Nada se afirma como hecho si no está respaldado por una fuente aprobada. Las cantidades y la
 *   arquitectura de seguridad del caso licores se presentan como "propuesta de piloto" o "arquitectura objetivo".
 * - Ninguna relación con gobiernos, agencias, clientes, certificaciones, escala, uptime o impacto económico
 *   se presenta como hecho.
 * - Nunca se llama "auténtico" a un producto solo porque una firma sea sintácticamente válida.
 * - Sin datos personales ni tributarios reales.
 */
import type { RouteKey } from '@/i18n';

/** Nombres de iconos disponibles en `src/components/ui/Icon.astro`. */
export type IconName =
  | 'qr'
  | 'scan'
  | 'shield'
  | 'shield-check'
  | 'link'
  | 'factory'
  | 'customs'
  | 'label'
  | 'truck'
  | 'warehouse'
  | 'store'
  | 'phone'
  | 'globe'
  | 'government'
  | 'industry'
  | 'citizen'
  | 'alert'
  | 'check'
  | 'search'
  | 'clock'
  | 'document'
  | 'lock'
  | 'key'
  | 'network'
  | 'layers'
  | 'settings'
  | 'eye'
  | 'flag'
  | 'arrow-right'
  | 'x'
  | 'info'
  | 'warning'
  | 'refresh'
  | 'camera'
  | 'offline'
  | 'server'
  | 'user'
  | 'map-pin'
  | 'box'
  | 'bottle'
  | 'chart'
  | 'list'
  | 'history'
  | 'fingerprint'
  | 'signature'
  | 'database'
  | 'compare'
  | 'plug';

export interface PageMeta {
  /** Título de la pestaña sin el sufijo de marca (la plantilla lo añade). */
  title: string;
  /** 120–160 caracteres, diferenciada por página. */
  description: string;
}

export interface Cta {
  label: string;
  /** Ruta interna por clave (preferida) o enlace externo/ancla en `href`. */
  key?: RouteKey;
  href?: string;
  /** Sufijo opcional para la ruta (por ejemplo `?t=licores` o `#historia`). */
  suffix?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  external?: boolean;
}

export interface Feature {
  title: string;
  body: string;
  icon?: IconName;
}

export interface Step {
  title: string;
  body: string;
  icon?: IconName;
  /** Etiqueta corta opcional (por ejemplo "01" o "Fábrica / aduana"). */
  label?: string;
}

export interface Signal {
  key: 'signature' | 'registry' | 'match' | 'anomalies';
  title: string;
  body: string;
  icon?: IconName;
}

export type ChainNodeId = 'origin' | 'labeling' | 'transport' | 'distribution' | 'commerce' | 'verification';

export interface ChainNode {
  id: ChainNodeId;
  /** Nombre corto para el diagrama (≤ 2 palabras). */
  label: string;
  /** Explicación de una frase. */
  description: string;
  icon: IconName;
}

export interface NavItem {
  key: RouteKey;
  label: string;
  children?: NavItem[];
}

export interface FooterLink {
  label: string;
  key?: RouteKey;
  href?: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface AudienceCard {
  key: 'government' | 'industry' | 'citizens';
  title: string;
  body: string;
  bullets: string[];
  cta: Cta;
  icon: IconName;
}

export interface PerspectiveCard {
  key: 'verify' | 'journey' | 'institutional';
  tag: string;
  title: string;
  body: string;
  cta: Cta;
  icon: IconName;
}

/* ------------------------------------------------------------------ */
/* Común                                                               */
/* ------------------------------------------------------------------ */

export interface CommonContent {
  brand: {
    /** Siempre "traza" en minúsculas (wordmark). */
    name: string;
    /** Texto alternativo del wordmark, por ejemplo "traza®". */
    wordmarkAlt: string;
    tagline: string;
    domain: string;
  };
  meta: {
    siteName: string;
    /** Plantilla de título, con %s como marcador: "%s · traza". */
    titleTemplate: string;
    defaultDescription: string;
    ogImageAlt: string;
  };
  skipLink: string;
  nav: {
    ariaLabel: string;
    items: NavItem[];
    cta: Cta;
    menuOpen: string;
    menuClose: string;
    homeLinkLabel: string;
  };
  languageSwitch: {
    label: string;
    /** Texto del enlace al otro idioma, por ejemplo "English". */
    switchTo: string;
    /** aria-label completo, por ejemplo "Cambiar a inglés". */
    switchAria: string;
  };
  footer: {
    columns: FooterColumn[];
    /** Aviso legal breve con ©, sin afirmar registro ni jurisdicción. */
    legal: string;
    /** Descargo de responsabilidad: sin relación institucional afirmada. */
    disclaimer: string;
    privacyLabel: string;
    contactLabel: string;
    languageLabel: string;
  };
  /** Nota de co-brand que acompaña cualquier lockup de tenant. */
  cobrandNotice: string;
  a11y: {
    newWindow: string;
    loading: string;
    close: string;
    back: string;
    breadcrumbs: string;
    toolRegion: string;
  };
  states: {
    loading: string;
    retry: string;
    offlineTitle: string;
    offlineBody: string;
    serverErrorTitle: string;
    serverErrorBody: string;
    emptyTitle: string;
    emptyBody: string;
    recoveredTitle: string;
    recoveredBody: string;
  };
  form: {
    required: string;
    invalidEmail: string;
    tooShort: string;
    tooLong: string;
    submit: string;
    sending: string;
    sentTitle: string;
    sentBody: string;
    errorTitle: string;
    errorBody: string;
    optional: string;
    privacyNote: string;
    noScript: string;
    errorSummaryTitle: string;
  };
}

/* ------------------------------------------------------------------ */
/* Páginas corporativas                                                */
/* ------------------------------------------------------------------ */

export interface HomeContent {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    /** "Identidad digital para productos reales" (o su traducción). */
    title: string;
    subtitle: string;
    /** "Escanea. Verifica. Confía." */
    mantra: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    /** Tarjeta de unidad del hero. */
    unitPreview: {
      caption: string;
      code: string;
      fields: { label: string; value: string }[];
      statusLabel: string;
    };
  };
  chain: {
    eyebrow: string;
    title: string;
    intro: string;
    nodes: ChainNode[];
    /** Texto del enlace al recorrido interactivo. */
    cta: Cta;
  };
  pillars: {
    title: string;
    intro: string;
    items: Feature[];
  };
  story: {
    eyebrow: string;
    title: string;
    body: string;
    /** "Traza no solo identifica productos. Construye su historia verificable." */
    quote: string;
    fields: { label: string; description: string; icon: IconName }[];
  };
  audiences: {
    title: string;
    intro: string;
    items: AudienceCard[];
  };
  perspectives: {
    eyebrow: string;
    title: string;
    intro: string;
    items: PerspectiveCard[];
    note: string;
  };
  useCase: {
    eyebrow: string;
    tag: string;
    title: string;
    body: string;
    bullets: string[];
    cta: Cta;
    disclaimer: string;
  };
  multisector: {
    title: string;
    body: string;
    /** Sectores mencionados solo como ejemplos de adaptabilidad, sin capacidades sectoriales inventadas. */
    sectors: string[];
    note: string;
  };
  trust: {
    title: string;
    intro: string;
    items: Feature[];
    cta: Cta;
  };
  finalCta: {
    title: string;
    body: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
}

export interface PlatformContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  capabilities: { title: string; intro: string; items: Feature[] };
  identity: {
    title: string;
    body: string;
    /** Campos de la historia de la unidad: fabricante/importador, producto/presentación, origen/lote, movimientos/destino. */
    fields: { label: string; description: string; icon: IconName }[];
    example: { caption: string; code: string; rows: { label: string; value: string }[] };
  };
  architecture: {
    title: string;
    intro: string;
    layers: { name: string; body: string; icon: IconName }[];
    /** Aclaración: arquitectura objetivo, no implementación auditada. */
    note: string;
  };
  verificationModel: {
    title: string;
    intro: string;
    signals: Signal[];
    caution: string;
  };
  tenancy: {
    title: string;
    body: string;
    bullets: string[];
    /** Descripción del ejemplo de co-brand que se muestra (sin afirmar relación). */
    exampleNote: string;
  };
  integration: {
    title: string;
    body: string;
    bullets: string[];
    note: string;
  };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface SolutionsContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  cards: AudienceCard[];
  sharedLayer: { title: string; body: string; bullets: string[] };
  multisector: { title: string; body: string; sectors: string[]; note: string };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface SectorPageContent {
  meta: PageMeta;
  key: 'government' | 'industry' | 'citizens';
  hero: { eyebrow: string; title: string; subtitle: string; icon: IconName };
  challenges: { title: string; intro: string; items: Feature[] };
  approach: { title: string; intro: string; items: Feature[] };
  flow: { title: string; intro: string; steps: Step[] };
  outcomes: { title: string; intro: string; items: string[]; note: string };
  perspectives: { title: string; items: PerspectiveCard[] };
  /** Descargo específico: nada de lo anterior afirma clientes, certificaciones ni resultados medidos. */
  disclaimer: string;
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface HowItWorksContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  steps: { title: string; intro: string; items: Step[] };
  chain: { title: string; intro: string; nodes: ChainNode[]; cta: Cta };
  verification: {
    title: string;
    intro: string;
    signals: Signal[];
    outcomes: { status: 'valid' | 'warning' | 'invalid' | 'unverifiable'; title: string; body: string }[];
    caution: string;
  };
  requirements: { title: string; intro: string; items: Feature[] };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface CaseSpiritsContent {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    /** Etiqueta visible "Propuesta de piloto". */
    tag: string;
    title: string;
    subtitle: string;
    disclaimer: string;
  };
  context: { title: string; paragraphs: string[] };
  scope: { title: string; intro: string; items: Feature[] };
  actors: { title: string; intro: string; items: { role: string; body: string; icon: IconName }[] };
  target: {
    title: string;
    intro: string;
    items: Feature[];
    /** "Arquitectura objetivo de la propuesta: no implementada todavía." */
    note: string;
  };
  fieldInspection: { title: string; body: string; bullets: string[] };
  cobrand: { title: string; body: string; lockupNote: string; cta: Cta };
  nonClaims: { title: string; intro: string; items: string[] };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface SecurityContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  principles: { title: string; intro: string; items: Feature[] };
  target: { title: string; intro: string; items: Feature[]; note: string };
  verificationHonesty: { title: string; body: string; bullets: string[] };
  privacy: { title: string; body: string; bullets: string[] };
  transparency: { title: string; intro: string; items: string[] };
  disclosure: { title: string; body: string; note: string };
  cta: { title: string; body: string; primaryCta: Cta; secondaryCta: Cta };
}

export interface CompanyContent {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; subtitle: string };
  mission: { title: string; paragraphs: string[] };
  whatWeDo: { title: string; items: Feature[] };
  principles: { title: string; items: Feature[] };
  contact: {
    title: string;
    intro: string;
    form: {
      name: string;
      email: string;
      organization: string;
      sector: string;
      sectorOptions: string[];
      message: string;
      consent: string;
      submit: string;
      success: { title: string; body: string };
      error: { title: string; body: string };
    };
    emailLabel: string;
    /** Texto que se muestra cuando no hay correo configurado. */
    emailFallback: string;
    responseNote: string;
  };
  /** Datos identificativos de la empresa (razón social, marca, actividad, sitio). */
  legal: { title: string; items: { label: string; value: string }[] };
  disclaimer: string;
}

export interface PrivacyContent {
  meta: PageMeta;
  title: string;
  updatedLabel: string;
  updated: string;
  provisionalNote: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
}

export interface NotFoundContent {
  meta: PageMeta;
  code: string;
  title: string;
  body: string;
  primaryCta: Cta;
  secondaryCta: Cta;
}

/* ------------------------------------------------------------------ */
/* Contenido del sitio                                                 */
/* ------------------------------------------------------------------ */

import type { VerifyContent } from './verify.types';
import type { JourneyContent } from './journey.types';
import type { InstitutionalContent } from './institutional.types';

export type { VerifyContent, JourneyContent, InstitutionalContent };

export interface SiteContent {
  common: CommonContent;
  home: HomeContent;
  platform: PlatformContent;
  solutions: SolutionsContent;
  solutionsGovernment: SectorPageContent;
  solutionsIndustry: SectorPageContent;
  solutionsCitizens: SectorPageContent;
  howItWorks: HowItWorksContent;
  caseSpirits: CaseSpiritsContent;
  security: SecurityContent;
  company: CompanyContent;
  privacy: PrivacyContent;
  notFound: NotFoundContent;
  verify: VerifyContent;
  journey: JourneyContent;
  institutional: InstitutionalContent;
}
