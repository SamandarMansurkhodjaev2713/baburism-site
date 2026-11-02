/**
 * Checks that the finished build is complete and deployable. It reads only the files in
 * `build/client`, so it runs in CI right after the build and before the upload.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "../site.config.mjs";
import { ARTWORK_SLUGS } from "../app/shared/content/artworks.ts";
import { LOCALES, OUTPUT_DIR, prerenderedRoutes, splitRoute } from "./build-output.mjs";

const problems = [];
const check = (condition, message) => {
  if (!condition) problems.push(message);
};

const content = (folder) =>
  readdirSync(new URL(`../content/${folder}/`, import.meta.url))
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length));

const SECTIONS = ["", "about", "catalog", "favorites", "works", "journal", "visit", "privacy"];
const expected = new Set([
  "",
  ...LOCALES.flatMap((language) =>
    [
      ...SECTIONS,
      ...ARTWORK_SLUGS.map((slug) => `artwork/${slug}`),
      ...content("products").map((slug) => `product/${slug}`),
      ...content("articles").map((slug) => `journal/${slug}`),
    ].map((page) => [language, page].filter(Boolean).join("/")),
  ),
]);
const actual = new Set(prerenderedRoutes());
for (const route of expected) check(actual.has(route), `Missing page: /${route}`);
for (const route of actual) check(expected.has(route), `Unexpected page: /${route}`);

for (const file of ["404.html", ".nojekyll", "favicon.svg"]) {
  check(existsSync(join(OUTPUT_DIR, file)), `Missing file: ${file}`);
}
check(
  !existsSync(join(OUTPUT_DIR, "__spa-fallback.html")),
  "__spa-fallback.html must be renamed to 404.html.",
);

const attribute = (html, pattern) => pattern.exec(html)?.[1];

for (const route of actual) {
  const parts = splitRoute(route);
  const file = join(OUTPUT_DIR, route, "index.html");
  const html = readFileSync(file, "utf8");
  const where = `/${route}`;

  check(/<title>[^<]+<\/title>/.test(html), `${where}: no <title>.`);
  check(/<meta name="description" content="[^"]+"/.test(html), `${where}: no description.`);
  check(/<h1[ >]/.test(html) || route === "", `${where}: no <h1>.`);
  if (parts) {
    check(html.startsWith(`<!DOCTYPE html><html lang="${parts.language}"`), `${where}: wrong <html lang>.`);
    for (const language of LOCALES) {
      check(html.includes(`hrefLang="${language}"`), `${where}: missing alternate for ${language}.`);
    }
  }
  if (siteConfig.origin) {
    const canonical = attribute(html, /<link rel="canonical" href="([^"]+)"/);
    check(
      canonical?.startsWith(siteConfig.origin + siteConfig.basePath),
      `${where}: canonical ignores the base path.`,
    );
  }
  // Every root-relative URL must carry the base path, or it breaks when served from a sub-path.
  if (siteConfig.basePath !== "/") {
    const urls = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((match) => match[1]);
    for (const url of urls) {
      check(url.startsWith(siteConfig.basePath), `${where}: URL outside the base path: ${url}`);
    }
  }
}

const noindex = readFileSync(join(OUTPUT_DIR, "ru/favorites/index.html"), "utf8");
check(noindex.includes('content="noindex, nofollow"'), "/ru/favorites must be noindex.");

if (siteConfig.origin) {
  const sitemap = readFileSync(join(OUTPUT_DIR, "sitemap.xml"), "utf8");
  check(
    sitemap.includes(`<loc>${siteConfig.origin}${siteConfig.basePath}ru/</loc>`),
    "Sitemap lacks the Russian home page.",
  );
  check(!sitemap.includes("favorites"), "Sitemap must not list favourites.");
}

if (problems.length) {
  console.error(`Build verification failed (${problems.length}):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`Build verified: ${actual.size} pages, ${LOCALES.length} languages.`);
