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
import { V2_HOME } from '@/content/v2-home';
import { getV2Narrative } from '@/content/v2-narrative';
import { SECTORS } from '@/config/sectors';
import { GET as getLlms } from '@/pages/llms.txt';

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
const EDITORIAL = walk({ home: V2_HOME, es: getV2Narrative('es'), en: getV2Narrative('en') }, 'editorial', []);
const ALL: Entry[] = [...CONTENT, ...FIXTURES, ...CONFIG];

/** Páginas corporativas: aquí no se admite ninguna cifra de escala o impacto. */
const CORPORATE = /^(es|en)\.(common|home|platform|solutions|solutionsGovernment|solutionsIndustry|solutionsCitizens|howItWorks|caseMedicines|security|company|privacy|notFound)\./;

/** Frases en las que se explica por qué NO se usa "auténtico" (única mención admitida). */
const AUTHENTIC_ALLOWED = /(nunca decimos|never say|no equivale a|not the same as|is not «|is not "|no es «|no es ")/i;
/** Contextos de no-afirmación: negaciones y listas "lo que no afirmamos". */
const NON_CLAIM = /(no afirma|no se afirma|no afirmamos|no presenta|no describe|no implica|no ofrece|no existe|nada de lo|sin afirmar|\bni\b|\bsin\b|not claim|does not|do not|nothing above|without|neither|\bnor\b|never|no sector-specific|no certifications)/i;
/** Rutas cuyos elementos son, por construcción, listas de cosas que NO se afirman. */
const NON_CLAIM_LISTS = /^(es|en)\.(security\.transparency\.items\[\d+\]|caseMedicines\.nonClaims\.items\[\d+\])$/;

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
    // «cliente de correo» / «mail client» es una aplicación, no una cartera de clientes.
    const MAIL_CLIENT = /cliente de correo|mail client/i;
    const found = hits(
      ALL,
      /\bclientes?\b|\bcustomers?\b|\bclients?\b/i,
      (e) => NON_CLAIM.test(e.text) || NON_CLAIM_LISTS.test(e.path) || MAIL_CLIENT.test(e.text),
    );
    expect(found).toEqual([]);
  });

  it('no se mencionan Venezuela, el Gobierno de Estados Unidos ni otras jurisdicciones como hecho', () => {
    expect(hits(ALL, /venezuela|venezolan|estados unidos|united states|gobierno de [A-Z]|government of [A-Z]/i)).toEqual([]);
    expect(hits(ALL, /\bEE\.? ?UU\b|\bU\.S\.|\bUSA\b/)).toEqual([]);
  });

  it('no quedan referencias al sector anterior ni a su autoridad en contenido, fixtures o configuración', () => {
    expect(hits([...ALL, ...EDITORIAL], /\bSENIAT\b|\blicores\b|\bspirits\b|750\s?ml|40\s?%\s?vol/i)).toEqual([]);
    expect(TENANTS.medicamentos.cobrandNotice?.es).toMatch(/no implica/i);
    expect(TENANTS.medicamentos.cobrandNotice?.en).toMatch(/does not imply/i);
  });

  it('el resumen público llms.txt presenta medicamentos y no recupera el sector anterior', async () => {
    const response = await getLlms({ site: new URL('https://traza.technology') } as Parameters<typeof getLlms>[0]);
    const text = await response.text();
    expect(text).toMatch(/El caso de uso de medicamentos es una \*\*propuesta de piloto\*\*/);
    expect(text).not.toMatch(/\bSENIAT\b|\blicores\b|\bspirits\b|750\s?ml|40\s?%\s?vol/i);
    expect(text).toContain('/casos/medicamentos/');
  });

  it('no hay garantías absolutas ni promesas de seguridad', () => {
    // «a prueba de» solo es una promesa cuando dice de qué: «a prueba de copias». La coincidencia
    // desnuda daba falsos positivos con frases legítimas como «una prueba de imprenta aprobada».
    const found = hits(ALL, /garantiza|garantizado|guarantee[sd]?\b|infalible|inviolable|a prueba de (?:copias|falsificaci|manipulaci|fraude|todo)|tamper-?proof|unhackable|imposible de (copiar|falsificar)|impossible to (copy|forge)|100 ?%/i, (e) => NON_CLAIM.test(e.text) || /promise absolute guarantees|prometer garantías/i.test(e.text));
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
      // Permitido: códigos de ejemplo, fechas del aviso, etiquetas "01", "404", medidas de presentación (120 ml), años, ECDSA P-256, 24 h.
      const stripped = e.text
        .replace(/TRZ-[A-Z0-9-]+/g, '')
        .replace(/LOTE-[A-Z0-9-]+|COS-[A-Z0-9-]+|IMP-[A-Z0-9-]+/g, '')
        .replace(/P-256/g, '')
        .replace(/\b(?:fase|phase) [12]\b/gi, '')
        .replace(/\b20\d{2}\b/g, '')
        .replace(/\b\d{1,4}\s?(ml|mg|g|kg|l|h|años|years|vol)\b/gi, '')
        .replace(/\b0\d\b/g, '')
        .replace(/\b404\b/g, '')
        .replace(/\b\d{1,2} de [a-z]+\b/gi, '')
        .replace(/\b[A-Z][a-z]+ \d{1,2},?\b/g, '')
        .replace(/\b\d\s?[A-Z]\b/g, '');
      expect(/\d/.test(stripped), `cifra no esperada en ${e.path}: «${e.text.slice(0, 100)}»`).toBe(false);
    }
  });

});

describe('vocabulario de demostración', () => {
  /**
   * El sitio es la web corporativa de Traza Technology, C.A.: ningún texto visible debe
   * presentarlo como una demostración ni rotular su contenido como simulado o ficticio.
   * Se admiten los controles que ofrecen simular una condición ("simular escaneo",
   * "simular que no hay conexión"): describen lo que hace un botón, no el origen del dato.
   */
  const DEMO_VOCAB = /demostraci[oó]n|demonstration|\bdemos?\b|simulad[oa]s?|simulated|ficticio|fictitious|fictional/i;
  const CONTROL_ALLOWED = /^(simular|simulate)\b/i;

  it('ningún texto de contenido se describe como demo, simulado o ficticio', () => {
    const found = CONTENT.filter((e) => DEMO_VOCAB.test(e.text) && !CONTROL_ALLOWED.test(e.text.trim()))
      .map((e) => `${e.path}: «${e.text.slice(0, 90)}»`);
    expect(found).toEqual([]);
  });

  it('los fixtures y la configuración tampoco usan ese vocabulario', () => {
    const found = [...FIXTURES, ...CONFIG].filter((e) => DEMO_VOCAB.test(e.text))
      .map((e) => `${e.path}: «${e.text.slice(0, 90)}»`);
    expect(found).toEqual([]);
  });

  it('los códigos de ejemplo no llevan el bloque DEMO', () => {
    const codes = ALL.filter((e) => /TRZ-/.test(e.text));
    expect(codes.length).toBeGreaterThan(0);
    expect(codes.filter((e) => /TRZ-DEMO/i.test(e.text))).toEqual([]);
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

  it('el correo de contacto se configura por entorno, nunca en los diccionarios de contenido', () => {
    // PUBLIC_CONTACT_EMAIL alimenta la página de empresa; el contenido no debe fijar direcciones.
    const emails = ALL.filter((e) => /@/.test(e.text));
    expect(emails).toEqual([]);
  });
});

describe('no-afirmación institucional y co-brand', () => {
  it('no existe un indicador persistente de demostración en el contenido común', () => {
    for (const locale of ['es', 'en'] as const) {
      expect('demoBadge' in getContent(locale).common).toBe(false);
    }
  });

  it('el pie niega relaciones institucionales y rotula el caso de medicamentos como propuesta de piloto', () => {
    for (const locale of ['es', 'en'] as const) {
      const d = getContent(locale).common.footer.disclaimer;
      expect(d).toMatch(/gobiernos|governments/i);
      expect(d).toMatch(/propuesta de piloto|pilot proposal/i);
      expect(d).toMatch(/no afirma|does not claim/i);
    }
  });

  it('el lockup del tenant de ejemplo es tipográfico y el aviso acompaña siempre', () => {
    expect(TENANTS.medicamentos.lockup?.parts).toEqual(['EMPRESA PÚBLICA Y/O PRIVADA', 'TRAZA']);
    expect(TENANTS.medicamentos.statusLabel.es).toMatch(/propuesta de piloto/i);
    expect(TENANTS.medicamentos.statusLabel.en).toMatch(/pilot proposal/i);
    expect(TENANTS.traza.lockup).toBeUndefined();
    expect(TENANTS.traza.cobrandNotice).toBeUndefined();
  });

  it('las cantidades y la arquitectura del caso medicamentos se presentan como propuesta/objetivo', () => {
    for (const locale of ['es', 'en'] as const) {
      const c = getContent(locale).caseMedicines;
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
      expect(c.caseMedicines.fieldInspection.body).toMatch(/desde el inicio|from the (start|outset|beginning)/i);
      expect(c.home.hero.mantra).toMatch(/^(Escanea\. Verifica\. Confía\.|Scan\. Verify\. Trust\.)$/);
    }
  });
});


describe('alcance del caso de medicamentos', () => {
  it('sitúa la activación tras la producción y condiciona tributación a integración en fase 2', () => {
    for (const locale of ['es', 'en'] as const) {
      const page = getContent(locale).caseMedicines;
      const scope = JSON.stringify(page.scope);
      expect(scope).toMatch(locale === 'es' ? /activación al finalizar producción/ : /activation after production/);
      const phaseTwo = page.target.items.find(item => /fase 2|phase 2/.test(item.title));
      expect(phaseTwo).toBeDefined();
      expect(phaseTwo!.body).toMatch(locale === 'es' ? /depende de la integración y autorización/ : /depends on integration with and authorisation/);
      expect(phaseTwo!.body).toMatch(locale === 'es' ? /no está disponible/ : /not available/);
    }
  });
});


describe('proceso y formato objetivo frente a consulta disponible', () => {
  for (const locale of ['es', 'en'] as const) {
    it(`${locale}: no activa antes de finalizar producción ni presenta criptografía objetivo como ejecutada en la web`, () => {
      const content = getContent(locale);
      expect(content.howItWorks.steps.items[2].title).toMatch(/finalizar producción|after production/);
      expect(content.howItWorks.verification.caution).toMatch(/fase 2|phase 2/);
      const issuance = content.integration.sections.find(section => section.id === 'emision')!;
      expect(issuance.paragraphs![0]).toMatch(/producción ya terminó|production has finished/);
      expect(issuance.paragraphs![0]).toMatch(/no permite activar|does not permit activating/);
      expect(content.codeSpec.hero.subtitle).toMatch(/no valida firmas reales|does not validate real signatures/);
      expect(content.codeSpec.sections[0].code!.lines).toContain('TRZ-7F2K-4K7Q-92FA');
      expect(content.codeSpec.sections.find(section => section.id === 'representacion')!.code!.caption)
        .toMatch(/no consultable|not queryable/);
    });
  }
});
