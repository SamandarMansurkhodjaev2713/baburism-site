import { settings } from "~/shared/content";
import { useHydrated } from "~/shared/hooks/use-hydrated";
import { scrollToTop } from "~/shared/dom";
import { LOCALES, type Locale } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { ArrowIcon } from "~/shared/ui/icons";
import { ContactLinks } from "../visit/contact-links";
import { layoutMessages } from "./messages";
import { useShell } from "./shell-context";
import { SiteLink } from "./site-link";

const ARTIST_ARCHIVE = "https://baburism.uz";

export function SiteFooter({ onLanguageChange }: { onLanguageChange: (locale: Locale) => void }) {
  const { locale, t } = useLocale();
  const { modalOpen } = useShell();
  const hasContacts = Boolean(settings.phone || settings.email);
  // The static HTML carries the build year; after hydration the footer shows the current one.
  const year = useHydrated() ? new Date().getFullYear() : __BUILD_YEAR__;

  return (
    <footer className="footer" inert={modalOpen}>
      <div className="footer-top">
        <SiteLink className="wordmark">baburism</SiteLink>
        <p>
          {t(common.spaceLine)}
          <br />
          {t(common.location)}
        </p>
        <div className="footer-nav">
          <SiteLink to="about">{t(common.about)}</SiteLink>
          <SiteLink to="catalog">{t(common.catalogueNav)}</SiteLink>
          <SiteLink to="works">{t(common.works)}</SiteLink>
          <SiteLink to="journal">{t(common.journal)}</SiteLink>
          <SiteLink to="visit">{t(common.visit)}</SiteLink>
        </div>
        <div className="footer-social">
          {hasContacts && (
            <div className="footer-contacts">
              <ContactLinks />
            </div>
          )}
          {settings.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
              <ArrowIcon diagonal />
            </a>
          )}
          {settings.telegram && (
            <a href={settings.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
              <ArrowIcon diagonal />
            </a>
          )}
          <a href={ARTIST_ARCHIVE} target="_blank" rel="noopener noreferrer">
            {t(layoutMessages.artistArchive)}
            <ArrowIcon diagonal />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Baburism</span>
        <SiteLink to="privacy">{t(common.privacy)}</SiteLink>
        <div className="footer-languages">
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
        <button onClick={scrollToTop} className="top-button">
          {t(layoutMessages.backToTop)}
          <span>↑</span>
        </button>
      </div>
    </footer>
  );
}
