import { WorksPage } from "~/features/artworks/works-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/works";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "works" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "works", title: PAGE_TITLES.works[locale] });
};

export default WorksPage;
