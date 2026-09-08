/**
 * Guardarraíles de contenido (brief §4): recorre TODO el contenido ES/EN, los fixtures y la configuración
 * buscando términos vetados o afirmaciones no respaldadas. Cada excepción está justificada y acotada por ruta.
 */
import { describe, expect, it } from 'vitest';
import { getContent } from '@/content';
import { UNITS } from '@/fixtures/units';
import { SCENARIOS } from '@/fixtures/scenarios';
import { ALERTS, CASES, INSPECTIONS, AUDIT_LOG, PEOPLE } from '@/fixtures/institutional';
import { TENANTS } from '@/config/tenants';
import { SECTORS } from '@/config/sectors';

interface Entry {
  path: string;
  text: string;
}

function walk(value: unknown, path: string, out: Entry[]): Entry[] {
  if (typeof value === 'string') out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`, out);
  return out;
}

const CONTENT: Entry[] = [...walk(getContent('es'), 'es', []), ...walk(getContent('en'), 'en', [])];
const FIXTURES: Entry[] = walk({ UNITS, SCENARIOS, ALERTS, CASES, INSPECTIONS, AUDIT_LOG, PEOPLE }, 'fixtures', []);
const CONFIG: Entry[] = walk({ TENANTS, SECTORS }, 'config', []);
const ALL: Entry[] = [...CONTENT, ...FIXTURES, ...CONFIG];

/** Páginas corporativas (no demos): aquí no se admite ninguna cifra de escala o impacto. */
const CORPORATE = /^(es|en)\.(common|home|platform|solutions|solutionsGovernment|solutionsIndustry|solutionsCitizens|howItWorks|caseSpirits|security|company|privacy|notFound)\./;

/** Frases en las que se explica por qué NO se usa "auténtico" (única mención admitida). */
const AUTHENTIC_ALLOWED = /(nunca decimos|never say|no equivale a|not the same as|is not «|is not "|no es «|no es ")/i;
/** Contextos de no-afirmación: negaciones y listas "lo que no afirmamos". */
const NON_CLAIM = /(no afirma|no se afirma|no afirmamos|no presenta|no describe|no implica|no ofrece|no existe|nada de lo|sin afirmar|\bni\b|\bsin\b|not claim|does not|do not|nothing above|without|neither|\bnor\b|never|no sector-specific|no certifications)/i;
/** Rutas cuyos elementos son, por construcción, listas de cosas que NO se afirman. */
const NON_CLAIM_LISTS = /^(es|en)\.(security\.transparency\.items\[\d+\]|caseSpirits\.nonClaims\.items\[\d+\])$/;

function hits(entries: Entry[], re: RegExp, allow: (e: Entry) => boolean = () => false): string[] {
  return entries.filter((e) => re.test(e.text) && !allow(e)).map((e) => `${e.path}: «${e.text.slice(0, 90)}»`);
}

describe('términos vetados', () => {
  it('"auténtico"/"authentic"/"genuine" solo aparece en la explicación de por qué no se usa', () => {
    const re = /aut[eé]ntic[oa]s?\b|\bauthentic\b|\bgenuin[eo]s?\b/i;
    const found = hits(ALL, re, (e) => AUTHENTIC_ALLOWED.test(e.text));
    expect(found).toEqual([]);
    // Y la explicación existe en ambos idiomas.
    expect(CONTENT.some((e) => e.path === 'es.security.verificationHonesty.title' && /auténtico/.test(e.text))).toBe(true);
    expect(CONTENT.some((e) => e.path === 'en.security.verificationHonesty.title' && /authentic/.test(e.text))).toBe(true);
  });

  it('"blockchain" no aparece en ningún sitio', () => {
    expect(hits(ALL, /blockchain|cadena de bloques|\bledger\b|\bcripto\b|criptomoneda|cryptocurrenc|\bcrypto\b|\btoken\b|\bNFT\b|smart contract/i)).toEqual([]);
  });

  it('"certificad/certificat" solo en el sector de ejemplo o en frases de no-afirmación', () => {
    const found = hits(ALL, /certificad|certificat/i, (e) => /documentos y certificados|documents and certificates/i.test(e.text) || NON_CLAIM.test(e.text) || NON_CLAIM_LISTS.test(e.path));
    expect(found).toEqual([]);
  });

  it('"uptime"/"disponibilidad" solo dentro de frases de no-afirmación', () => {
    const found = hits(ALL, /uptime|\bSLA\b|99[.,]9/i, (e) => NON_CLAIM.test(e.text) || NON_CLAIM_LISTS.test(e.path));
    expect(found).toEqual([]);
  });

  it('"cliente"/"customer"/"client" solo dentro de frases de no-afirmación (nunca como afirmación de clientes)', () => {
    const found = hits(ALL, /\bclientes?\b|\bcustomers?\b|\bclients?\b/i, (e) => NON_CLAIM.test(e.text) || NON_CLAIM_LISTS.test(e.path));
    expect(found).toEqual([]);
  });

  it('no se mencionan Venezuela, el Gobierno de Estados Unidos ni otras jurisdicciones como hecho', () => {
    expect(hits(ALL, /venezuela|venezolan|estados unidos|united states|gobierno de [A-Z]|government of [A-Z]/i)).toEqual([]);
    expect(hits(ALL, /\bEE\.? ?UU\b|\bU\.S\.|\bUSA\b/)).toEqual([]);
  });

  it('SENIAT solo aparece en el caso de uso y en el tenant de ejemplo, siempre como propuesta/ejemplo', () => {
    const mentions = ALL.filter((e) => /SENIAT/.test(e.text));
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) {
      expect(m.path, `SENIAT fuera del caso de uso: ${m.path}`).toMatch(/^(es|en)\.caseSpirits\.|^config\.TENANTS\.licores\./);
      if (m.path === 'config.TENANTS.licores.lockup.parts[0]') continue; // la parte tipográfica del lockup: su alt lleva el marco
      expect(m.text, `mención sin marco de propuesta: ${m.path}`).toMatch(/propuesta|proposal|piloto|pilot|ejemplo|example|no afirma|not claim/i);
    }
    // El aviso de co-brand del tenant existe y niega la relación oficial.
    expect(TENANTS.licores.cobrandNotice?.es).toMatch(/no implica/i);
    expect(TENANTS.licores.cobrandNotice?.en).toMatch(/does not imply/i);
  });

  it('no hay garantías absolutas ni promesas de seguridad', () => {
    const found = hits(ALL, /garantiza|garantizado|guarantee[sd]?\b|infalible|inviolable|a prueba de|tamper-?proof|unhackable|imposible de (copiar|falsificar)|impossible to (copy|forge)|100 ?%/i, (e) => NON_CLAIM.test(e.text) || /promise absolute guarantees|prometer garantías/i.test(e.text));
    expect(found).toEqual([]);
  });

  it('no hay testimonios ni citas atribuidas a terceros', () => {
    expect(hits(CONTENT, /\btestimoni|—\s?[A-Z][a-z]+ [A-Z][a-z]+, (CEO|Director|Gerente|Ministr)/i)).toEqual([]);
  });
});

describe('cifras de escala o impacto', () => {
  it('las páginas corporativas no contienen porcentajes, millones, países, usuarios ni cifras de impacto', () => {
    const re = /\d+\s?%|\bmillones?\b|\bmillion\b|\bbillion\b|\bmil\b|\bthousand\b|\bpaíses\b|\bcountries\b|\busuarios\b|\busers\b|\bverificaciones al\b|\bunidades registradas\b|\bahorr|\bsaving|\breducci[oó]n del?\s?\d|\bincremento del?\s?\d|\d+\s?x\b/i;
    const found = hits(
      CONTENT.filter((e) => CORPORATE.test(e.path)),
      re,
    );
    expect(found).toEqual([]);
  });

  it('los números que aparecen en páginas corporativas son de estructura (pasos, campos), no de resultados', () => {
    const numeric = CONTENT.filter((e) => CORPORATE.test(e.path) && /\d/.test(e.text));
    for (const e of numeric) {
      // Permitido: códigos de ejemplo, fechas del aviso, etiquetas "01", "404", medidas de presentación (750 ml), años, ECDSA P-256, 24 h.
      const stripped = e.text
        .replace(/TRZ-[A-Z0-9-]+/g, '')
        .replace(/LOTE-[A-Z0-9-]+|COS-[A-Z0-9-]+|IMP-[A-Z0-9-]+/g, '')
        .replace(/P-256/g, '')
        .replace(/\b20\d{2}\b/g, '')
        .replace(/\b\d{1,4}\s?(ml|g|kg|l|h|años|years|vol)\b/gi, '')
        .replace(/\b0\d\b/g, '')
        .replace(/\b404\b/g, '')
        .replace(/\b\d{1,2} de [a-z]+\b/gi, '')
        .replace(/\b[A-Z][a-z]+ \d{1,2},?\b/g, '')
        .replace(/\b\d\s?[A-Z]\b/g, '');
      expect(/\d/.test(stripped), `cifra no esperada en ${e.path}: «${e.text.slice(0, 100)}»`).toBe(false);
    }
  });

  it('las cifras de las demos van rotuladas como simuladas en su sección', () => {
    for (const locale of ['es', 'en'] as const) {
      const c = getContent(locale);
      expect(c.institutional.summary.intro).toMatch(/simulad|simulat|not real/i);
      expect(c.institutional.summary.simulatedTag).toMatch(/simulad|simulat/i);
      expect(c.institutional.banner.title).toMatch(/simulad|simulat/i);
      expect(c.journey.hero.note).toMatch(/simulad|simulat/i);
      expect(c.verify.states.simulatedTag).toMatch(/simulad|simulat/i);
    }
  });
});

describe('datos personales y tributarios', () => {
  it('ningún texto contiene correos, teléfonos, cédulas, RIF ni documentos de identidad', () => {
    const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const phone = /(\+\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]\d{3}[\s-]?\d{4}\b/;
    const idDoc = /\b[VEJGP]-?\d{6,9}\b|\bRIF\b|c[eé]dula de identidad|\bNIF\b|\bDNI\b|\bSSN\b|passport number/i;
    const found = ALL.filter((e) => email.test(e.text) || phone.test(e.text) || idDoc.test(e.text)).map((e) => e.path);
    expect(found).toEqual([]);
  });

  it('el placeholder de correo del formulario no es una dirección real', () => {
    const emails = ALL.filter((e) => /@/.test(e.text));
    expect(emails).toEqual([]);
  });
});

describe('indicador de demostración y co-brand', () => {
  it('el indicador persistente tiene el texto exacto en español y una versión corta', () => {
    const es = getContent('es').common.demoBadge;
    expect(es.long).toBe('Demostración conceptual — datos simulados');
    expect(es.short.length).toBeLessThan(es.long.length);
    expect(es.explain).toMatch(/simulad/i);
    const en = getContent('en').common.demoBadge;
    expect(en.long).toMatch(/conceptual demonstration/i);
    expect(en.long).toMatch(/simulated data/i);
  });

  it('el pie niega relaciones institucionales y rotula el caso de licores como propuesta de piloto', () => {
    for (const locale of ['es', 'en'] as const) {
      const d = getContent(locale).common.footer.disclaimer;
      expect(d).toMatch(/gobiernos|governments/i);
      expect(d).toMatch(/propuesta de piloto|pilot proposal/i);
      expect(d).toMatch(/no afirma|does not claim/i);
    }
  });

  it('el lockup del tenant de ejemplo es tipográfico y el aviso acompaña siempre', () => {
    expect(TENANTS.licores.lockup?.parts).toEqual(['SENIAT', 'TRAZA']);
    expect(TENANTS.licores.statusLabel.es).toMatch(/propuesta de piloto/i);
    expect(TENANTS.licores.statusLabel.en).toMatch(/pilot proposal/i);
    expect(TENANTS.traza.lockup).toBeUndefined();
    expect(TENANTS.traza.cobrandNotice).toBeUndefined();
  });

  it('las cantidades y la arquitectura del caso licores se presentan como propuesta/objetivo', () => {
    for (const locale of ['es', 'en'] as const) {
      const c = getContent(locale).caseSpirits;
      expect(c.hero.tag).toMatch(/propuesta de piloto|pilot proposal/i);
      expect(c.hero.disclaimer).toMatch(/no describe|does not describe|no implica|does not imply|not claim/i);
      expect(c.target.title).toMatch(/objetivo|target/i);
      expect(c.target.note).toMatch(/no implementad|not implemented/i);
      expect(c.nonClaims.items.length).toBeGreaterThanOrEqual(5);
      const ecdsa = walk(c, 'c', []).filter((e) => /ECDSA/.test(e.text));
      expect(ecdsa.length).toBeGreaterThan(0);
    }
    for (const locale of ['es', 'en'] as const) {
      const s = getContent(locale).security;
      expect(s.target.note).toMatch(/objetivo|target/i);
      expect(s.target.note).toMatch(/no implementa|does not implement/i);
    }
  });

  it('los conceptos superados no se presentan como modelo vigente (Flutter, HMAC, Odoo, cupo/tarifa)', () => {
    expect(hits(ALL, /\bflutter\b|\bHMAC\b|\bodoo\b|\bcupo\b|tarifa|\bquota\b|\bfee\b|app store|play store|descargue la app|download the app/i)).toEqual([]);
  });

  it('el modelo vigente está presente: verificación web sin instalación ni cuenta e inspección de campo dentro del piloto', () => {
    for (const locale of ['es', 'en'] as const) {
      const c = getContent(locale);
      expect(c.home.hero.subtitle).toMatch(/sin instalar nada ni crear una cuenta|nothing to install and no account/i);
      expect(c.caseSpirits.fieldInspection.body).toMatch(/desde el inicio|from the (start|outset|beginning)/i);
      expect(c.home.hero.mantra).toMatch(/^(Escanea\. Verifica\. Confía\.|Scan\. Verify\. Trust\.)$/);
    }
  });
});
