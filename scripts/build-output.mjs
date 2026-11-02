import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** The folder that is uploaded to the host: the contents of `build/client`. */
export const OUTPUT_DIR = fileURLToPath(new URL("../build/client/", import.meta.url));

/** Languages of the site, in the order they appear in the sitemap. */
export const LOCALES = ["ru", "uz", "en"];

/** Pages that must not be listed for search engines. */
export const UNLISTED_ROUTES = new Set(["favorites"]);

/** Recursively lists files under a directory. */
export function listFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

/**
 * Routes of the prerendered pages, as `ru/about` (no slashes at the ends),
 * derived from the `index.html` files. The bare root page is the empty route.
 */
export function prerenderedRoutes(outputDir = OUTPUT_DIR) {
  return listFiles(outputDir)
    .map((file) => relative(outputDir, file).split(sep).join("/"))
    .filter((file) => file === "index.html" || file.endsWith("/index.html"))
    .map((file) => file.slice(0, -"index.html".length).replace(/\/$/, ""))
    .sort();
}

/** Splits `ru/about` into its language and the rest (`about`); null when it is not a language page. */
export function splitRoute(route) {
  const [language, ...rest] = route.split("/");
  return LOCALES.includes(language) ? { language, page: rest.join("/") } : null;
}
