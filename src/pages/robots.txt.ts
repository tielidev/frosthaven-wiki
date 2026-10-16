import type { APIRoute } from 'astro';
import { siteUrl } from '~/config/site';

const preview = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';
const robotsTxt = preview ? 'User-agent: *\nDisallow: /' : `
User-agent: *
Allow: /
Disallow: /ads/

Sitemap: ${siteUrl}/sitemap-index.xml
`.trim();

export const GET: APIRoute = () =>
  new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
