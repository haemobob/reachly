import { projects, services } from "../data/content";
export function GET() {
  const paths = [
    "/",
    "/work/",
    "/services/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/possibilities/",
    ...projects.map((p) => `/work/${p.slug}/`),
    ...services.map((s) => `/services/${s.slug}/`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>https://reachly.id${path}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
