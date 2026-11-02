import { PrivacyPage } from "~/features/privacy/privacy-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/privacy";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "privacy" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "privacy", title: PAGE_TITLES.privacy[locale] });
};

export default PrivacyPage;
