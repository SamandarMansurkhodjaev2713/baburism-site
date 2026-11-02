import { readdirSync } from "node:fs";
import type { Config } from "@react-router/dev/config";
import { siteConfig } from "./site.config.mjs";
import { ARTWORK_SLUGS } from "./app/shared/content/artworks";
import { LOCALES } from "./app/shared/i18n/locale";

/** Slugs of the JSON files in a content folder; the file name is the slug. */
function contentSlugs(folder: string): string[] {
  return readdirSync(new URL(`./content/${folder}/`, import.meta.url))
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length))
    .sort();
}

const SECTIONS = ["", "about", "catalog", "favorites", "works", "journal", "visit", "privacy"];

/** Every page is rendered to HTML at build time: the host serves plain files. */
function prerenderPaths(): string[] {
  const products = contentSlugs("products").map((slug) => `product/${slug}`);
  const articles = contentSlugs("articles").map((slug) => `journal/${slug}`);
  const artworks = ARTWORK_SLUGS.map((slug) => `artwork/${slug}`);
  const routes = [...SECTIONS, ...artworks, ...products, ...articles];
  return [
    "/",
    ...LOCALES.flatMap((locale) => routes.map((route) => `/${locale}${route ? `/${route}` : ""}`)),
  ];
}

export default {
  // No runtime server: GitHub Pages serves the prerendered files and the client takes over.
  ssr: false,
  basename: siteConfig.routerBasename,
  prerender: { paths: prerenderPaths(), concurrency: 4 },
} satisfies Config;
