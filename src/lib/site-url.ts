/**
 * The site's public origin, used for canonical URLs, Open Graph, the sitemap
 * and JSON-LD.
 *
 * 1. NEXT_PUBLIC_SITE_URL wins when set (e.g. https://dhungelaman.info).
 * 2. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production domain: the
 *    custom domain once one is attached, the *.vercel.app domain before that.
 * 3. Locally, localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
