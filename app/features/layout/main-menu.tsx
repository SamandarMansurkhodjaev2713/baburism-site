import { useRef, useState } from "react";
import { getArtwork, type ArtworkSlug } from "~/shared/content/artworks";
import { useModalBehaviour } from "~/shared/hooks/use-modal-behaviour";
import { LOCALES, type Locale, type Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon, CloseIcon } from "~/shared/ui/icons";
import { layoutMessages, menuDescriptions } from "./messages";
import { useShell, type PageId } from "./shell-context";
import { SiteLink } from "./site-link";

type MenuEntry = { page: PageId; to: string; label: Localized; art: ArtworkSlug; description: Localized };

const MENU: readonly MenuEntry[] = [
  { page: "home", to: "", label: common.home, art: "samarkand-darboza", description: menuDescriptions.home },
  { page: "about", to: "about", label: common.about, art: "duality", description: menuDescriptions.about },
  {
    page: "catalog",
    to: "catalog",
    label: common.catalogue,
    art: "pomegranate-feast",
    description: menuDescriptions.catalog,
  },
  {
    page: "favorites",
    to: "favorites",
    label: common.favorites,
    art: "fruit",
    description: menuDescriptions.favorites,
  },
  {
    page: "works",
    to: "works",
    label: common.works,
    art: "keeping-balance",
    description: menuDescriptions.works,
  },
  {
    page: "journal",
    to: "journal",
    label: layoutMessages.journalMenu,
    art: "chess",
    description: menuDescriptions.journal,
  },
  {
    page: "visit",
    to: "visit",
    label: common.visit,
    art: "black-river",
    description: menuDescriptions.visit,
  },
];

/** Detail pages highlight their section. */
const MENU_SECTION: Partial<Record<PageId, PageId>> = { product: "catalog", artwork: "works" };

/** Full-screen menu: links on one side, a painting previewing the hovered or focused section on the other. */
export function MainMenu({ onLanguageChange }: { onLanguageChange: (locale: Locale) => void }) {
  const { locale, t } = useLocale();
  const { page, menuOpen, closeMenu } = useShell();
  const container = useRef<HTMLDivElement>(null);
  const section = MENU_SECTION[page] ?? page;
  const [preview, setPreview] = useState<PageId>(
    MENU.some((entry) => entry.page === section) ? section : "home",
  );
  const current = MENU.find((entry) => entry.page === preview) ?? MENU[0]!;

  useModalBehaviour(menuOpen, container, closeMenu);

  return (
    <div
      className={"menu-overlay" + (menuOpen ? " is-open" : "")}
      inert={!menuOpen}
      aria-hidden={!menuOpen}
      role="dialog"
      aria-modal={menuOpen ? true : undefined}
      aria-label={t(common.menu)}
      id="main-menu"
      ref={container}
    >
      <div className="menu-top">
        <SiteLink className="wordmark">baburism</SiteLink>
        <button onClick={closeMenu} className="menu-close">
          {t(common.close)}
          <CloseIcon />
        </button>
      </div>
      <div className="menu-content">
        <div className="menu-navigation">
          <p className="menu-label">{t(layoutMessages.exploreSpace)}</p>
          <nav aria-label={t(common.menu)}>
            {MENU.map((entry, index) => (
              <div
                className="menu-row"
                key={entry.page}
                onMouseEnter={() => setPreview(entry.page)}
                onFocus={() => setPreview(entry.page)}
              >
                <SiteLink
                  to={entry.to}
                  aria-current={section === entry.page ? "page" : undefined}
                  className={"menu-link " + (section === entry.page ? "current" : "")}
                >
                  <span style={{ animationDelay: `${80 + index * 35}ms` }}>{t(entry.label)}</span>
                  <ArrowIcon diagonal />
                </SiteLink>
              </div>
            ))}
          </nav>
        </div>
        <aside className="menu-art-preview">
          <div className="menu-art-stack">
            {MENU.map((entry) => {
              const artwork = getArtwork(entry.art);
              return (
                <img
                  key={entry.page}
                  src={publicAsset(artwork.image.path)}
                  alt={artwork.title[locale]}
                  className={entry.page === preview ? "active" : ""}
                  aria-hidden={entry.page !== preview}
                  loading="lazy"
                />
              );
            })}
          </div>
          <div className="menu-preview-text">
            <p>{t(current.description)}</p>
            <span>{getArtwork(current.art).title[locale]}</span>
          </div>
        </aside>
      </div>
      <div className="menu-bottom">
        <p>{t(common.spaceLine)}</p>
        <div className="menu-languages" aria-label={t(common.changeLanguage)}>
          {LOCALES.map((code) => (
            <button
              key={code}
              lang={code}
              aria-current={code === locale ? "true" : undefined}
              onClick={() => onLanguageChange(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <p>{t(common.location)}</p>
      </div>
    </div>
  );
}
