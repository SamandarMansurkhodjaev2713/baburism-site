import { HomePage } from "~/features/home/home-page";
import { SiteShell } from "~/features/layout/site-shell";
import { DEFAULT_LOCALE } from "~/shared/i18n/locale";
import { pageMeta } from "~/shared/routing/meta";

export const meta = () => pageMeta({ locale: DEFAULT_LOCALE, path: "" });

/** The bare site address: renders the Russian home page, then moves the visitor to their own language. */
export default function RootIndex() {
  return (
    <SiteShell locale={DEFAULT_LOCALE} page="home" detectLanguage>
      <HomePage />
    </SiteShell>
  );
}
