import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/root";
import { NotFoundPage } from "./features/layout/not-found-page";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./shared/i18n/locale";
import { publicAsset } from "./shared/routing/urls";
import onestFont from "./assets/fonts/Onest-Variable.woff2?url";
// Order matters: later sheets refine earlier ones.
import "./styles/base.css";
import "./styles/commerce.css";
import "./styles/ornament-collection.css";
import "./styles/collection-refinement.css";
import "./styles/catalogue-studio.css";
import "./styles/inner-pages.css";
import "./styles/artwork-explorer.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: publicAsset("favicon.svg") },
  // The first paint uses Onest; preloading avoids a font swap flash.
  { rel: "preload", href: onestFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

/** The language is the first path segment; the bare root and unknown paths use the default. */
function localeFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang={localeFromPath(pathname)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f2efea" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/** Shown in the static fallback page while the app hydrates for an address that was not prerendered. */
export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { pathname } = useLocation();
  const kind = isRouteErrorResponse(error) && error.status === 404 ? "not-found" : "error";
  return <NotFoundPage locale={localeFromPath(pathname)} kind={kind} />;
}
