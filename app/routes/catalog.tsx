import { CataloguePage } from "~/features/catalogue/catalogue-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/catalog";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "catalog" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "catalog", title: PAGE_TITLES.catalog[locale] });
};

export default CataloguePage;
