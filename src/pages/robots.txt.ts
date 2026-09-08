import type { APIRoute } from 'astro';

/**
 * robots.txt generado en build a partir de la URL pública configurada (PUBLIC_SITE_URL).
 *
 * Política: acceso abierto a todos los rastreadores. La página 404 no se excluye aquí;
 * lleva `noindex` en su propio <head>, que es la señal correcta para una página de error
 * (un `Disallow` impediría al rastreador ver ese `noindex`).
 *
 * Nota de operación: si el dominio se sirve a través del proxy de Cloudflare, la función
 * «managed robots.txt» de Cloudflare puede añadir bloqueos de agentes de IA por delante de
 * este archivo. Ese ajuste vive en el panel de Cloudflare, no en este repositorio.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString().replace(/\/$/, '') : '';
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${base}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
