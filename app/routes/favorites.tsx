import { FavoritesPage } from "~/features/shop/favorites-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/favorites";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "favorites" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "favorites", title: PAGE_TITLES.favorites[locale], noindex: true });
};

export default FavoritesPage;
