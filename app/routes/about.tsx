import { AboutPage } from "~/features/about/about-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/about";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "about" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "about", title: PAGE_TITLES.about[locale] });
};

export default AboutPage;
