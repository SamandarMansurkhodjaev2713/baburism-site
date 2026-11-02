import type { RefObject } from "react";
import type { Locale } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { HeaderFavoritesLink } from "../shop/header-favorites-link";
import { LanguagePicker } from "./language-picker";
import { layoutMessages } from "./messages";
import { useShell } from "./shell-context";
import { SiteLink } from "./site-link";
import { useHeaderOverArt } from "./use-header-over-art";

const SHOP_PAGES = new Set(["catalog", "product", "favorites"]);

type SiteHeaderProps = {
  languagePicker: RefObject<HTMLDivElement | null>;
  onLanguageChange: (locale: Locale) => void;
};

export function SiteHeader({ languagePicker, onLanguageChange }: SiteHeaderProps) {
  const { t } = useLocale();
  const { page, menuOpen, openMenu, modalOpen } = useShell();
  const overArt = useHeaderOverArt(page === "home");

  return (
    <header className={"site-header" + (overArt ? " header-over-art" : "")} inert={modalOpen}>
      <SiteLink className="wordmark" aria-label={t(layoutMessages.homeLink)}>
        baburism
      </SiteLink>
      <nav aria-label={t(layoutMessages.mainNavigation)}>
        <SiteLink to="catalog" className="desktop-link">
          {t(common.catalogueNav)}
        </SiteLink>
        <SiteLink to="visit" className="desktop-link header-visit">
          {t(common.visit)}
        </SiteLink>
        {SHOP_PAGES.has(page) && <HeaderFavoritesLink />}
        <LanguagePicker pickerRef={languagePicker} onChange={onLanguageChange} />
        <button
          className="menu-toggle"
          aria-label={t(common.menu)}
          onClick={openMenu}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
        >
          <span>{t(common.menu)}</span>
          <span className="menu-lines" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
