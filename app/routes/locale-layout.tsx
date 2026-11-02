import { Outlet, useMatches, useParams } from "react-router";
import { SiteShell } from "~/features/layout/site-shell";
import type { PageId } from "~/features/layout/shell-context";
import { isLocale } from "~/shared/i18n/locale";

/** Route modules declare which menu section and page layout they belong to. */
export type PageHandle = { page: PageId };

function isPageHandle(value: unknown): value is PageHandle {
  return typeof value === "object" && value !== null && "page" in value;
}

/** Shared frame of every page in one language; unknown language codes are a 404. */
export default function LocaleLayout() {
  const { locale } = useParams();
  const matches = useMatches();
  if (!isLocale(locale)) throw new Response(null, { status: 404 });
  const handle = matches.map((match) => match.handle).findLast(isPageHandle);
  return (
    <SiteShell locale={locale} page={handle?.page ?? "home"}>
      <Outlet />
    </SiteShell>
  );
}
