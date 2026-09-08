import type { APIRoute } from 'astro';

/**
 * Alias `/sitemap.xml` → `/sitemap-index.xml`.
 *
 * @astrojs/sitemap genera `sitemap-index.xml` + `sitemap-0.xml`, y robots.txt apunta al índice.
 * Muchas herramientas de auditoría (y algunos rastreadores) prueban primero `/sitemap.xml` por
 * convención; este alias devuelve el mismo índice para que esa comprobación no falle.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString().replace(/\/$/, '') : '';
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
