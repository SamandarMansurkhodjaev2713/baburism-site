/**
 * Turns the React Router prerender output into a folder GitHub Pages can serve:
 *
 * - React Router writes the HTML below the base path (`build/client/<repository>/…`)
 *   while assets sit in `build/client/`; the HTML is moved up so that one folder is the site root.
 * - `404.html` is the SPA fallback, so unknown addresses get a 404 status and the app's own 404 page.
 * - `.nojekyll` stops GitHub from processing the files with Jekyll.
 * - `sitemap.xml` lists every public page with its language alternates.
 */
import { cpSync, existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "../site.config.mjs";
import { LOCALES, OUTPUT_DIR, prerenderedRoutes, splitRoute, UNLISTED_ROUTES } from "./build-output.mjs";

function hoistHtmlFromBasePath() {
  const folder = siteConfig.basePath.replace(/^\/|\/$/g, "");
  if (!folder) return;
  const source = join(OUTPUT_DIR, folder);
  if (!existsSync(source)) throw new Error(`Expected prerendered pages in ${source}.`);
  cpSync(source, OUTPUT_DIR, { recursive: true });
  rmSync(source, { recursive: true });
}

function installFallback() {
  const fallback = join(OUTPUT_DIR, "__spa-fallback.html");
  if (!existsSync(fallback)) throw new Error("React Router did not write __spa-fallback.html.");
  renameSync(fallback, join(OUTPUT_DIR, "404.html"));
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sitemap(routes) {
  const pages = routes
    .map((route) => ({ route, parts: splitRoute(route) }))
    .filter(({ parts }) => parts && !UNLISTED_ROUTES.has(parts.page));
  const urlOf = (route) => `${siteConfig.origin}${siteConfig.basePath}${route}${route ? "/" : ""}`;
  const entries = pages.map(({ route, parts }) => {
    const alternates = LOCALES.map(
      (language) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(urlOf([language, parts.page].filter(Boolean).join("/")))}"/>`,
    ).join("\n");
    return `  <url>\n    <loc>${escapeXml(urlOf(route))}</loc>\n${alternates}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

hoistHtmlFromBasePath();
installFallback();
writeFileSync(join(OUTPUT_DIR, ".nojekyll"), "");

if (siteConfig.origin) {
  writeFileSync(join(OUTPUT_DIR, "sitemap.xml"), sitemap(prerenderedRoutes()));
  writeFileSync(
    join(OUTPUT_DIR, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.origin}${siteConfig.basePath}sitemap.xml\n`,
  );
} else {
  console.warn("SITE_ORIGIN is not set: sitemap.xml and robots.txt were not generated.");
}

console.log(`Site ready in ${OUTPUT_DIR}`);
