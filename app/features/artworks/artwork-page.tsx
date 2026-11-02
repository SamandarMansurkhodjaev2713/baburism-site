import { artworkDimensions, artworkMedium, type Artwork } from "~/shared/content/artworks";
import type { Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { ArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { ArtworkButton } from "./artwork-button";

const IN_PORTFOLIO: Localized = {
  ru: "В портфолио художника",
  uz: "Rassom portfoliosida",
  en: "In the artist’s portfolio",
};

export function ArtworkPage({ artwork }: { artwork: Artwork }) {
  const { locale, t } = useLocale();
  return (
    <section className="section artwork-page">
      <SiteLink to="works" className="back-link">
        <span className="arrow-back">
          <ArrowIcon />
        </span>
        {t(common.works)}
      </SiteLink>
      <ArtworkButton artwork={artwork} eager />
      <div className="artwork-info">
        <div>
          <h1 className="expressive">{artwork.title[locale]}</h1>
        </div>
        <div>
          <p>{t(common.artistName)}</p>
          <p>{artwork.year}</p>
          <p>{artworkMedium(artwork, locale)}</p>
          <p>{artworkDimensions(artwork, locale)}</p>
          <a href={artwork.sourcePage} target="_blank" rel="noopener noreferrer" className="text-link">
            {t(IN_PORTFOLIO)}
            <ArrowIcon diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
