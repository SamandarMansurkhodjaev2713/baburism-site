/**
 * Deployment settings shared by the Vite and React Router configs and the build scripts.
 *
 * GitHub Pages serves a project site from a sub-path (`/<repository>/`), so every route
 * and asset URL must carry that prefix. CI passes the values reported by
 * `actions/configure-pages`; local development falls back to the domain root.
 *
 * It is plain JavaScript so that Node scripts can import it without a TypeScript runtime.
 */

/** @param {string | undefined} value */
function normalizeBasePath(value) {
  const trimmed = (value ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/** @param {string | undefined} value */
function normalizeOrigin(value) {
  const trimmed = (value ?? "").trim();
  return trimmed ? new URL(trimmed).origin : "";
}

const basePath = normalizeBasePath(process.env.BASE_PATH);

export const siteConfig = {
  /** URL prefix of the deployed site, always with leading and trailing slashes. */
  basePath,
  /** The same prefix as a router basename: no trailing slash except for the domain root. */
  routerBasename: basePath === "/" ? "/" : basePath.replace(/\/$/, ""),
  /** Absolute origin used for canonical, Open Graph and sitemap URLs, e.g. `https://user.github.io`. */
  origin: normalizeOrigin(process.env.SITE_ORIGIN),
  buildYear: new Date().getFullYear(),
};
