import { useState } from "react";
import { products, type Product } from "~/shared/content";
import { findArtwork } from "~/shared/content/artworks";
import { useHydrated } from "~/shared/hooks/use-hydrated";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { HeartIcon, ShopArrowIcon } from "~/shared/ui/icons";
import { artworkGallery, artworkImage } from "../artworks/artwork-gallery";
import { catalogueReturnTarget } from "../catalogue/return-path";
import { useShell } from "../layout/shell-context";
import { SiteLink } from "../layout/site-link";
import { ContactForm } from "../visit/contact-form";
import { EnquiryPanel } from "./enquiry-panel";
import { productMessages, shopMessages } from "./messages";
import { ProductCard } from "./product-card";
import { productPictures, productPrice } from "./product-model";
import { MAX_SAVED } from "./selection";
import { ShopImage } from "./shop-image";
import { useSavedProducts } from "./use-saved-products";
import { VariantPicker } from "./variant-picker";

const RELATED_COUNT = 3;

function relatedProducts(product: Product): Product[] {
  return products
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, RELATED_COUNT);
}

export function ProductPage({ product }: { product: Product }) {
  const { locale, t, text } = useLocale();
  const { openLightbox } = useShell();
  const saved = useSavedProducts();
  const hydrated = useHydrated();
  const [pictureIndex, setPictureIndex] = useState(0);
  const [chosenVariant, setChosenVariant] = useState("");

  const savedItem = saved.items.find((item) => item.id === product.slug);
  // A saved object keeps its variant in favourites; otherwise the choice is local to this page.
  const variant = savedItem?.variant || chosenVariant;
  const limitReached = !savedItem && saved.items.length >= MAX_SAVED;
  const title = text(product.title);
  const pictures = productPictures(product);
  const picture = pictures[pictureIndex] ?? pictures[0] ?? "";
  const gallery = pictures.map((src) => ({ src, title }));
  const source = product.sourceArtwork ? findArtwork(product.sourceArtwork) : undefined;
  const related = relatedProducts(product);

  const chooseVariant = (value: string) => {
    setChosenVariant(value);
    if (savedItem) saved.setVariant(product.slug, value);
  };

  const specs = [
    [productMessages.material, text(product.material)],
    [productMessages.size, product.size],
    [productMessages.edition, product.edition],
    [productMessages.reference, product.variants.find((item) => item.id === variant)?.sku || product.sku],
    [productMessages.care, text(product.care)],
  ] as const;

  const stockLabel =
    product.stock === "available"
      ? productMessages.available
      : product.stock === "sold"
        ? shopMessages.unavailable
        : productMessages.onRequest;

  return (
    <section className="shop-page shop-product-page section">
      <SiteLink to={hydrated ? catalogueReturnTarget() : "catalog"} className="shop-back">
        <span className="arrow-back">
          <ShopArrowIcon />
        </span>
        {t(common.catalogue)}
      </SiteLink>
      <div className="shop-product-layout">
        <div className="shop-product-gallery">
          <button
            className="shop-product-picture"
            onClick={() => picture && openLightbox({ src: picture, title }, gallery)}
            disabled={!pictures.length}
            aria-label={`${t(productMessages.viewImage)}: ${title}`}
          >
            <ShopImage src={picture} alt={title} eager />
            <span className="shop-picture-action">
              {t(productMessages.view)}
              <ShopArrowIcon />
            </span>
          </button>
          {pictures.length > 1 && (
            <div className="shop-thumbnails">
              {pictures.map((src, index) => (
                <button
                  key={src}
                  aria-label={`${t(productMessages.photo)} ${index + 1}`}
                  aria-pressed={index === pictureIndex}
                  onClick={() => setPictureIndex(index)}
                >
                  <ShopImage src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="shop-product-info">
          <h1>{title}</h1>
          <p className="shop-product-price">{productPrice(product, locale)}</p>
          <p className="shop-product-description">{text(product.description)}</p>
          <p className="shop-product-stock">{t(stockLabel)}</p>
          <VariantPicker product={product} value={variant} onChange={chooseVariant} id="product-variant" />
          <button
            className="shop-save-product"
            disabled={!saved.ready || limitReached}
            aria-pressed={!!savedItem}
            onClick={() => saved.toggle(product.slug, variant)}
          >
            <HeartIcon filled={!!savedItem} />
            {t(savedItem ? productMessages.saved : productMessages.save)}
          </button>
          {limitReached && <p>{t(productMessages.savedLimit)}</p>}
          <EnquiryPanel items={[{ id: product.slug, variant }]} />
          <dl className="shop-specs">
            {specs
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label.en}>
                  <dt>{t(label)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
      {source && (
        <div className="shop-provenance">
          <button onClick={() => openLightbox(artworkImage(source, locale), artworkGallery(locale))}>
            <ShopImage src={source.image.path} alt={source.title[locale]} />
          </button>
          <div>
            <h2>{t(productMessages.imageOrigin)}</h2>
            <h3>{source.title[locale]}</h3>
            <SiteLink className="action-link" to={`artwork/${source.slug}`}>
              {t(productMessages.aboutArtwork)}
              <ShopArrowIcon />
            </SiteLink>
          </div>
        </div>
      )}
      {text(product.body) && (
        <div className="shop-product-story">
          <h2>{t(productMessages.aboutObject)}</h2>
          {text(product.body)
            .split(/\n\s*\n/)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      )}
      <details className="shop-contact-form">
        <summary>{t(productMessages.contactTeam)}</summary>
        <ContactForm subject={title} subjectReference={product.slug} />
      </details>
      {related.length > 0 && (
        <div className="shop-related">
          <h2>{t(productMessages.moreFromCollection)}</h2>
          <div className="shop-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
