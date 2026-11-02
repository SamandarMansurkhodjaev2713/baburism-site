import type { Locale } from "../i18n/locale";

const BASE_PATH = import.meta.env.BASE_URL;

/** URL of a file in `public/`, e.g. `publicAsset("art/fruit.jpg")`. Absolute URLs pass through unchanged. */
export function publicAsset(path: string): string {
  if (!path || /^[a-z][a-z\d+.-]*:/i.test(path)) return path;
  return BASE_PATH + path.replace(/^\/+/, "");
}

/**
 * A site route relative to the router basename, e.g. `localePath("ru", "catalog?category=prints")`.
 * Router-aware components (`<Link>`, `navigate`) take this form.
 */
export function localePath(locale: Locale, target = ""): string {
  return `/${locale}${target ? `/${target}` : ""}`;
}

/** The same route as an `href` for a plain anchor or a shareable link: it includes the deployment base path. */
export function documentPath(routerPath: string): string {
  return BASE_PATH.replace(/\/$/, "") + routerPath;
}

/** Absolute URL of a file in `public/`, for Open Graph images. */
export function absoluteAsset(path: string): string {
  return currentOrigin() + publicAsset(path);
}

/**
 * Absolute URL for sharing. In the browser the current origin is authoritative;
 * at build time the configured origin is used for canonical metadata.
 */
export function absoluteUrl(routerPath: string, origin = currentOrigin()): string {
  return origin + documentPath(routerPath);
}

function currentOrigin(): string {
  return typeof window === "undefined" ? __SITE_ORIGIN__ : window.location.origin;
}
