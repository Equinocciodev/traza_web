import type { APIRoute } from 'astro';

/** robots.txt generado en build a partir de la URL pública configurada (PUBLIC_SITE_URL). */
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString().replace(/\/$/, '') : '';
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /404', '', `Sitemap: ${base}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
