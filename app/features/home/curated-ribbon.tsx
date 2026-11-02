import { products, settings } from "~/shared/content";
import { findArtwork } from "~/shared/content/artworks";
import { pickLocalized, type Locale } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { documentPath, localePath } from "~/shared/routing/urls";
import { ShopArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { useRibbonMotion } from "../ribbon/use-ribbon-motion";
import { productPrice } from "../shop/product-model";
import { ShopImage } from "../shop/shop-image";
import { homeMessages } from "./messages";

/** The loop needs at least this much content per copy to never show an empty edge. */
const MIN_SEQUENCE_WIDTH = 2400;
const ESTIMATED_ITEM_WIDTH = 250;
/** Three identical copies: the middle one is real, the outer ones make the loop seamless. */
const COPIES = [0, 1, 2] as const;
const REAL_COPY = 1;

type RibbonItem = { id: string; to: string; image: string; title: string; meta: string };

/** Curated artworks interleaved with curated objects. */
function ribbonItems(locale: Locale): RibbonItem[] {
  const artworks = settings.curatedArtworks.flatMap((slug) => {
    const artwork = findArtwork(slug);
    return artwork
      ? [
          {
            id: artwork.slug,
            to: `artwork/${artwork.slug}`,
            image: artwork.image.path,
            title: artwork.title[locale],
            meta: String(artwork.year),
          },
        ]
      : [];
  });
  const objects = products
    .filter((product) => product.curated)
    .map((product) => ({
      id: product.slug,
      to: `product/${product.slug}`,
      image: product.image,
      title: pickLocalized(product.title, locale),
      meta: productPrice(product, locale),
    }));
  const interleaved = artworks.flatMap((artwork, index) => {
    const object = objects[index];
    return object ? [artwork, object] : [artwork];
  });
  return [...interleaved, ...objects.slice(artworks.length)];
}

export function CuratedRibbon() {
  const { locale, t } = useLocale();
  const items = ribbonItems(locale);
  const repeats = Math.max(
    1,
    Math.ceil(MIN_SEQUENCE_WIDTH / (Math.max(1, items.length) * ESTIMATED_ITEM_WIDTH)),
  );
  const sequence = Array.from({ length: repeats }, () => items).flat();
  const { viewport, track } = useRibbonMotion(`${items.map((item) => item.id).join("|")}|${repeats}`);

  return (
    <section className="curated-section" aria-label={t(homeMessages.ribbonTitle)}>
      <div className="section curated-heading">
        <h2>{t(homeMessages.ribbonTitle)}</h2>
        <div>
          <p>{t(homeMessages.ribbonLead)}</p>
          <SiteLink to="works" className="action-link">
            {t(homeMessages.allArtworks)}
            <ShopArrowIcon />
          </SiteLink>
        </div>
      </div>
      <div
        className="curated-viewport"
        ref={viewport}
        tabIndex={0}
        role="group"
        aria-label={t(homeMessages.ribbonLabel)}
      >
        <div className="curated-track" ref={track}>
          {COPIES.map((copy) => (
            <div className="curated-group" key={copy} aria-hidden={copy !== REAL_COPY ? true : undefined}>
              {sequence.map((item, position) => {
                // Only the first sequence of the middle copy is reachable; the rest are visual repeats.
                const repeat = copy !== REAL_COPY || position >= items.length;
                return (
                  // Plain anchors: a drag over the ribbon must be able to cancel the click (see ribbon controllers).
                  <a
                    href={documentPath(localePath(locale, item.to))}
                    className="curated-item"
                    key={`${item.id}-${position}`}
                    draggable={false}
                    tabIndex={repeat ? -1 : undefined}
                    aria-hidden={repeat ? true : undefined}
                  >
                    <div>
                      <ShopImage src={item.image} alt={repeat ? "" : item.title} />
                    </div>
                    <p>{item.title}</p>
                    <span>{item.meta}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="curated-hint section">{t(homeMessages.ribbonHint)}</p>
    </section>
  );
}
