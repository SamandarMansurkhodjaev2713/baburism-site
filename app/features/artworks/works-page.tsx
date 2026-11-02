import { artworkDimensions, artworkMedium, getArtwork, type ArtworkSlug } from "~/shared/content/artworks";
import type { Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { ArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { ArtworkButton } from "./artwork-button";

const PANORAMAS: ReadonlySet<string> = new Set<ArtworkSlug>(["samarkand-darboza", "keeping-balance"]);

/** The editorial order of the Artworks page, which differs from the portfolio order. */
const WORKS_ORDER: readonly ArtworkSlug[] = [
  "samarkand-darboza",
  "duality",
  "pomegranate-feast",
  "keeping-balance",
  "black-river",
  "duval",
  "chess",
  "fruit",
];

const messages = {
  title: { ru: "Произведения", uz: "Asarlar", en: "Artworks" },
  intro: {
    ru: "Избранные работы из портфолио Бабура Исмаилова. Откройте изображение, чтобы рассмотреть произведение целиком, или выберите название, чтобы узнать о нём подробнее.",
    uz: "Bobur Ismoilov portfoliosidan tanlangan asarlar. Har bir asarni toʻliq koʻrish va uning maʼlumotlarini alohida sahifada oʻqish mumkin.",
    en: "Selected works from Babur Ismailov’s portfolio. Open a painting to view it in full, or select its title for details.",
  },
} as const satisfies Record<string, Localized>;

export function WorksPage() {
  const { locale, t } = useLocale();
  return (
    <section className="section works-page">
      <div className="inner-hero">
        <h1 className="expressive">{t(messages.title)}</h1>
        <p className="inner-intro">{t(messages.intro)}</p>
      </div>
      <div className="art-grid">
        {WORKS_ORDER.map(getArtwork).map((artwork) => (
          <figure
            key={artwork.slug}
            className={"reveal" + (PANORAMAS.has(artwork.slug) ? " work-panorama" : "")}
          >
            <ArtworkButton artwork={artwork} />
            <figcaption>
              <div>
                <SiteLink to={`artwork/${artwork.slug}`}>
                  {artwork.title[locale]}
                  <ArrowIcon diagonal />
                </SiteLink>
                <span className="work-metadata">
                  {artworkMedium(artwork, locale)} / {artworkDimensions(artwork, locale)}
                </span>
              </div>
              <span className="work-year">{artwork.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
