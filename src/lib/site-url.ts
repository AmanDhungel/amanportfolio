/**
 * The site's public origin, used for canonical URLs, Open Graph, the sitemap,
 * robots.txt and JSON-LD.
 *
 * 1. Production on Vercel always uses PRODUCTION_URL, so search engines index
 *    one address whatever environment variables are set in the dashboard.
 * 2. NEXT_PUBLIC_SITE_URL, when set (previews, other hosts).
 * 3. On Vercel, VERCEL_PROJECT_PRODUCTION_URL (the project's primary domain).
 * 4. Locally, localhost.
 */
export const PRODUCTION_URL = "https://www.amandhungel.com.np";

function resolveSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
