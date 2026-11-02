import { useRef, type ReactNode } from "react";
import { useLocation } from "react-router";
import type { Locale } from "~/shared/i18n/locale";
import { LocaleProvider, useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { ArrowIcon } from "~/shared/ui/icons";
import { useLanguageSwitch } from "./language";
import { Lightbox } from "./lightbox";
import { MainMenu } from "./main-menu";
import { layoutMessages } from "./messages";
import { useEditorialMotion } from "./motion";
import { ShellProvider, useShell, type PageId } from "./shell-context";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const SHOP_PAGES = new Set<PageId>(["catalog", "product", "favorites"]);

type SiteShellProps = {
  locale: Locale;
  page: PageId;
  /** On the bare site root: redirect to the visitor's language after hydration. */
  detectLanguage?: boolean;
  children: ReactNode;
};

/** Header, menu, footer and overlays shared by every page of one language. */
export function SiteShell({ locale, page, detectLanguage = false, children }: SiteShellProps) {
  return (
    <LocaleProvider locale={locale}>
      <ShellProvider page={page}>
        <ShellFrame detectLanguage={detectLanguage}>{children}</ShellFrame>
      </ShellProvider>
    </LocaleProvider>
  );
}

function ShellFrame({ detectLanguage, children }: { detectLanguage: boolean; children: ReactNode }) {
  const { locale, t } = useLocale();
  const { page, menuOpen, modalOpen, cursorRef } = useShell();
  const { pathname } = useLocation();
  const languagePicker = useRef<HTMLDivElement>(null);
  const changeLanguage = useLanguageSwitch(locale, languagePicker, detectLanguage);
  useEditorialMotion(pathname);

  const className = ["baburism", page === "home" && "is-home", SHOP_PAGES.has(page) && "is-shop"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <a className="skip-link" href="#main">
        {t(layoutMessages.skipToContent)}
      </a>
      <SiteHeader languagePicker={languagePicker} onLanguageChange={changeLanguage} />
      <main id="main" tabIndex={-1} inert={modalOpen}>
        {children}
      </main>
      <SiteFooter onLanguageChange={changeLanguage} />
      <div className={"menu-surface" + (menuOpen ? " is-open" : "")} aria-hidden="true" />
      <MainMenu onLanguageChange={changeLanguage} />
      <Lightbox />
      <span className="art-cursor" ref={cursorRef} aria-hidden="true">
        {t(common.viewArtwork)}
        <ArrowIcon diagonal />
      </span>
    </div>
  );
}
