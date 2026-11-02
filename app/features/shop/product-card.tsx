import type { Product } from "~/shared/content";
import { findArtwork } from "~/shared/content/artworks";
import { useLocale } from "~/shared/i18n/locale-context";
import { HeartIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { shopMessages } from "./messages";
import { productPrice } from "./product-model";
import { MAX_SAVED } from "./selection";
import { ShopImage } from "./shop-image";
import { useSavedProducts } from "./use-saved-products";

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { locale, t, text } = useLocale();
  const saved = useSavedProducts();
  const title = text(product.title);
  const isSaved = saved.items.some((item) => item.id === product.slug);
  const limitReached = saved.items.length >= MAX_SAVED && !isSaved;
  const source = product.sourceArtwork ? findArtwork(product.sourceArtwork) : undefined;

  return (
    <article className="shop-card">
      <div className="shop-card-visual">
        <SiteLink to={`product/${product.slug}`} className="shop-card-image" aria-label={title}>
          <ShopImage src={product.image} alt={title} eager={eager} />
        </SiteLink>
        <button
          className="shop-heart"
          disabled={!saved.ready || limitReached}
          aria-pressed={isSaved}
          aria-label={`${t(isSaved ? shopMessages.removeFromFavorites : shopMessages.saveToFavorites)}: ${title}`}
          onClick={() => saved.toggle(product.slug)}
        >
          <HeartIcon filled={isSaved} />
        </button>
        {product.stock === "sold" && <span className="shop-stock-label">{t(shopMessages.unavailable)}</span>}
      </div>
      <SiteLink to={`product/${product.slug}`} className="shop-card-info">
        <h2>{title}</h2>
        <p className="shop-price">{productPrice(product, locale)}</p>
        {source && (
          <p className="shop-source">
            {t(shopMessages.after)} «{source.title[locale]}»
          </p>
        )}
      </SiteLink>
    </article>
  );
}
