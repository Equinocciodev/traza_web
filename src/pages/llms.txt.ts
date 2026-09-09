import type { APIRoute } from 'astro';
import { getContent } from '@/content';
import { ROUTES, type RouteKey } from '@/i18n';

/**
 * `/llms.txt` — resumen del sitio en Markdown para modelos de lenguaje
 * (convención de llmstxt.org).
 *
 * Se genera del propio contenido, no se escribe a mano: el título y la descripción de cada
 * página salen de los diccionarios, así que no puede quedar desincronizado con el sitio. Si
 * mañana cambia una descripción, este archivo cambia con ella.
 *
 * Incluye a propósito los límites de lo que el producto afirma. Un modelo que resuma este
 * sitio debería poder decir con la misma facilidad qué hace la plataforma y qué no prueba una
 * consulta, porque lo segundo es la mitad del diseño.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString().replace(/\/$/, '') : '';
  const es = getContent('es');
  const en = getContent('en');

  /** Páginas en el orden en que conviene leerlas, no en el del menú. */
  const order: RouteKey[] = [
    'home',
    'platform',
    'howItWorks',
    'codeSpec',
    'integration',
    'security',
    'rationale',
    'solutions',
    'solutionsGovernment',
    'solutionsIndustry',
    'solutionsCitizens',
    'caseMedicines',
    'verify',
    'journey',
    'institutional',
    'company',
    'privacy',
  ];

  const line = (key: RouteKey) => {
    const page = es[key as keyof typeof es] as { meta?: { title: string; description: string } };
    const meta = page?.meta;
    if (!meta) return null;
    return `- [${meta.title}](${base}${ROUTES.es[key]}): ${meta.description}`;
  };

  const body = `# Traza®

> ${es.common.meta.defaultDescription}

Traza Technology, C.A. es una empresa privada. Traza® es su plataforma de identidad digital
unitaria, trazabilidad y verificación pública de productos: cada unidad recibe un identificador
firmado, su ciclo de vida queda en un registro auditable y cualquiera puede comprobarla desde el
navegador, sin instalar nada ni crear una cuenta.

## Límites de lo que el sitio afirma

- Una consulta comprueba la **identidad digital** de una unidad, no la **autenticidad física**
  del objeto. Una firma válida dice quién emitió el identificador y que su contenido no se
  alteró; no dice que el producto que alguien tiene en la mano sea el que lo llevaba.
- Por eso el sitio nunca llama «auténtico» a un producto porque su firma valide.
- La firma impide inventar identificadores, no copiarlos. Contra la copia trabajan varias capas,
  ninguna suficiente por sí sola.
- El registro guarda el ciclo de vida de la etiqueta —emisión, etiquetado, activación, consultas
  y cierre—, no movimientos logísticos.
- El caso de uso de medicamentos es una **propuesta de piloto**. El sitio no afirma contratos,
  certificaciones ni relación con gobiernos, reguladores o agencias.
- La arquitectura de seguridad descrita es un objetivo del producto; se implementa y se audita en
  cada despliegue.

## Páginas (español)

${order.map(line).filter(Boolean).join('\n')}

## English

The same site is available in English under \`/en/\`.

${(['home', 'platform', 'howItWorks', 'codeSpec', 'integration', 'security', 'rationale'] as RouteKey[])
  .map((key) => {
    const page = en[key as keyof typeof en] as { meta?: { title: string; description: string } };
    return page?.meta ? `- [${page.meta.title}](${base}${ROUTES.en[key]}): ${page.meta.description}` : null;
  })
  .filter(Boolean)
  .join('\n')}

## Contacto

Escriba a la dirección publicada en ${base}${ROUTES.es.company} (español) o
${base}${ROUTES.en.company} (English).
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
