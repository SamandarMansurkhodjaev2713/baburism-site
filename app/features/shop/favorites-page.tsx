import { useState } from "react";
import { products } from "~/shared/content";
import { useHydrated } from "~/shared/hooks/use-hydrated";
import { useUrlSearchParams } from "~/shared/hooks/use-url-search-params";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { absoluteUrl, localePath } from "~/shared/routing/urls";
import { ShopArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { CopyButton } from "./copy-button";
import { EnquiryPanel } from "./enquiry-panel";
import { favoritesMessages, shopMessages } from "./messages";
import { productPrice, resolveSaved } from "./product-model";
import { decodeSelection, encodeSelection, MAX_SAVED, type SavedProduct } from "./selection";
import { ShopImage } from "./shop-image";
import { useSavedProducts } from "./use-saved-products";
import { VariantPicker } from "./variant-picker";

/**
 * The visitor's favourites, or a selection shared through `?items=`. A shared selection is
 * edited in the URL only; it never changes the visitor's own list unless they save it.
 */
export function FavoritesPage() {
  const { locale, t } = useLocale();
  const saved = useSavedProducts();
  const hydrated = useHydrated();
  const [params, setParams] = useUrlSearchParams();
  const [mergedCode, setMergedCode] = useState<string | null>(null);
  const [personalExcluded, setPersonalExcluded] = useState<readonly string[]>([]);

  const itemsCode = params.get("items");
  const excludeCode = params.get("exclude") ?? "";
  const shared = itemsCode !== null;
  const sharedItems = itemsCode ? decodeSelection(itemsCode) : [];
  const excludedItems = excludeCode ? decodeSelection(excludeCode) : [];
  const validLink =
    !shared ||
    (sharedItems !== null && excludedItems !== null && excludedItems.every((item) => !item.variant));

  const items: readonly SavedProduct[] = shared ? (sharedItems ?? []) : saved.items;
  const excluded = shared ? (excludedItems ?? []).map((item) => item.id) : personalExcluded;
  const selected = items.filter((item) => !excluded.includes(item.id));
  const merged = shared && mergedCode === itemsCode;
  const mergeWouldOverflow = new Set([...saved.items, ...items].map((item) => item.id)).size > MAX_SAVED;
  // The link carries the visitor's origin, which is only known in the browser.
  const shareUrl =
    hydrated && selected.length
      ? absoluteUrl(localePath(locale, `favorites?items=${encodeSelection(selected)}`))
      : "";

  /** Shared selections live in the URL; personal favourites live in local storage. */
  const writeShared = (next: readonly SavedProduct[], omit: readonly string[]) => {
    const query = new URLSearchParams(params);
    query.set("items", encodeSelection(next));
    const stillListed = omit.filter((id) => next.some((item) => item.id === id));
    if (stillListed.length)
      query.set("exclude", encodeSelection(stillListed.map((id) => ({ id, variant: "" }))));
    else query.delete("exclude");
    setParams(query);
  };

  const setVariant = (id: string, variant: string) => {
    if (shared)
      writeShared(
        items.map((item) => (item.id === id ? { ...item, variant } : item)),
        excluded,
      );
    else saved.setVariant(id, variant);
  };

  const remove = (id: string) => {
    if (shared)
      writeShared(
        items.filter((item) => item.id !== id),
        excluded,
      );
    else saved.remove(id);
  };

  const setExcluded = (next: readonly string[]) => {
    if (shared) writeShared(items, next);
    else setPersonalExcluded(next);
  };

  return (
    <section className="shop-page section shop-favorites-page">
      <div className="shop-heading">
        <div>
          <h1>{t(shared ? favoritesMessages.selection : common.favorites)}</h1>
          <p>{t(shared ? favoritesMessages.sharedIntro : favoritesMessages.intro)}</p>
        </div>
        <SiteLink to="catalog" className="action-link">
          {t(favoritesMessages.toCatalogue)}
          <ShopArrowIcon />
        </SiteLink>
      </div>
      {!validLink ? (
        <div className="shop-empty">
          <h2>{t(favoritesMessages.invalidLink)}</h2>
          <p>{t(favoritesMessages.invalidLinkHelp)}</p>
          <SiteLink to="favorites" className="action-link">
            {t(favoritesMessages.myFavorites)}
            <ShopArrowIcon />
          </SiteLink>
        </div>
      ) : !saved.ready && !shared ? (
        <p role="status">{t(favoritesMessages.loading)}</p>
      ) : items.length ? (
        <>
          <div className="shop-selection-tools">
            <label>
              <input
                type="checkbox"
                checked={selected.length === items.length}
                ref={(node) => {
                  if (node) node.indeterminate = selected.length > 0 && selected.length < items.length;
                }}
                onChange={(event) => setExcluded(event.target.checked ? [] : items.map((item) => item.id))}
              />
              {t(favoritesMessages.selectAll)}
            </label>
            <span role="status">
              {t(favoritesMessages.selected)}: {selected.length} / {items.length}
            </span>
            {shared && (
              <button
                className="shop-text-button"
                disabled={merged || !saved.ready || mergeWouldOverflow}
                onClick={() => {
                  saved.merge(items);
                  setMergedCode(itemsCode);
                }}
              >
                {t(merged ? favoritesMessages.savedSelection : favoritesMessages.saveSelection)}
              </button>
            )}
          </div>
          {shared && mergeWouldOverflow && <p className="shop-notice">{t(favoritesMessages.mergeLimit)}</p>}
          {saved.error && <p className="shop-notice">{t(favoritesMessages.storageUnavailable)}</p>}
          <div className="shop-favorites-layout">
            <div className="shop-saved-list">
              {items.map((item) => (
                <SavedRow
                  key={item.id}
                  item={item}
                  checked={!excluded.includes(item.id)}
                  onCheck={(checked) =>
                    setExcluded(checked ? excluded.filter((id) => id !== item.id) : [...excluded, item.id])
                  }
                  onVariant={(variant) => setVariant(item.id, variant)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </div>
            <aside className="shop-selection-summary">
              <h2>{t(favoritesMessages.yourSelection)}</h2>
              <p>
                {t(favoritesMessages.forEnquiry)}: {selected.length}
              </p>
              <EnquiryPanel items={selected} />
              <CopyButton value={shareUrl}>{t(favoritesMessages.copyLink)}</CopyButton>
              {shareUrl && (
                <a className="shop-text-button shop-selection-link" href={shareUrl}>
                  {t(favoritesMessages.openLink)}
                  <ShopArrowIcon />
                </a>
              )}
              {shared && (
                <SiteLink to="favorites" className="shop-text-button">
                  {t(favoritesMessages.myFavorites)}
                </SiteLink>
              )}
            </aside>
          </div>
        </>
      ) : (
        <div className="shop-empty">
          <h2>{t(favoritesMessages.emptyTitle)}</h2>
          <p>{t(favoritesMessages.emptyBody)}</p>
          <SiteLink to="catalog" className="action-link">
            {t(common.openCatalogue)}
            <ShopArrowIcon />
          </SiteLink>
          {shared && (
            <SiteLink to="favorites" className="shop-text-button">
              {t(favoritesMessages.myFavorites)}
            </SiteLink>
          )}
        </div>
      )}
    </section>
  );
}

type SavedRowProps = {
  item: SavedProduct;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  onVariant: (variant: string) => void;
  onRemove: () => void;
};

function SavedRow({ item, checked, onCheck, onVariant, onRemove }: SavedRowProps) {
  const { locale, t, text } = useLocale();
  const { product, valid, missingVariant } = resolveSaved(item, products);
  const title = product ? text(product.title) : item.id;

  return (
    <article className="shop-saved-row">
      <label className="shop-row-select">
        <span className="sr-only">
          {t(favoritesMessages.select)} {title}
        </span>
        <input type="checkbox" checked={checked} onChange={(event) => onCheck(event.target.checked)} />
      </label>
      {product ? (
        <>
          <SiteLink to={`product/${product.slug}`} className="shop-saved-image">
            <ShopImage src={product.image} alt={title} />
          </SiteLink>
          <div className="shop-saved-info">
            <SiteLink to={`product/${product.slug}`}>
              <h2>{title}</h2>
            </SiteLink>
            <p>{productPrice(product, locale)}</p>
            <VariantPicker
              product={product}
              value={item.variant}
              onChange={onVariant}
              id={`variant-${item.id}`}
            />
            {!valid && (
              <p className="shop-row-warning">
                {t(missingVariant ? shopMessages.chooseVariant : favoritesMessages.unavailableNow)}
              </p>
            )}
            <button className="shop-text-button" onClick={onRemove}>
              {t(favoritesMessages.remove)}
            </button>
          </div>
        </>
      ) : (
        <div className="shop-missing-item">
          <h2>{t(favoritesMessages.noLongerPublished)}</h2>
          <p>{t(favoritesMessages.removeToContinue)}</p>
          <button className="shop-text-button" onClick={onRemove}>
            {t(favoritesMessages.remove)}
          </button>
        </div>
      )}
    </article>
  );
}
