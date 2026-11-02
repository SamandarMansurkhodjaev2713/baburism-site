import { VisitSection } from "~/features/visit/visit-section";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/visit";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "visit" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "visit", title: PAGE_TITLES.visit[locale] });
};

export default function VisitRoute() {
  return <VisitSection full />;
}
