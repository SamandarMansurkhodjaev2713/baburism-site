import { JournalPage } from "~/features/journal/journal-page";
import { localeFromParam, PAGE_TITLES, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/journal";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "journal" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  return pageMeta({ locale, path: "journal", title: PAGE_TITLES.journal[locale] });
};

export default JournalPage;
