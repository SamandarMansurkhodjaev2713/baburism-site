import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { categories, products } from "~/shared/content";
import { getArtwork } from "~/shared/content/artworks";
import { useLocale } from "~/shared/i18n/locale-context";
import { CrossIcon, FilterIcon, HeartIcon, SearchIcon, ShopArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { ProductCard } from "../shop/product-card";
import { MAX_SAVED } from "../shop/selection";
import { ShopImage } from "../shop/shop-image";
import { useSavedProducts } from "../shop/use-saved-products";
import { CategoryPicker } from "./category-picker";
import { FilterDialog } from "./filter-dialog";
import { FilterFields } from "./filter-fields";
import { EMPTY_FILTERS, filterProducts, sortProducts, type CatalogueFilters } from "./filters";
import { catalogueMessages, STOCK_NAMES } from "./messages";
import { rememberCatalogueQuery } from "./return-path";
import { SortMenu } from "./sort-menu";
import { useCatalogueQuery } from "./use-catalogue-query";

/** Products are eager-loaded for the first visible row. */
const EAGER_CARDS = 3;
const collections = Array.from(new Set(products.map((product) => product.collection).filter(Boolean)));

export function CataloguePage() {
  const { locale, t, text } = useLocale();
  const saved = useSavedProducts();
  const location = useLocation();
  const { query, setSearch, update } = useCatalogueQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersButton = useRef<HTMLButtonElement>(null);

  // "Back to catalogue" on a product page restores these filters.
  useEffect(() => rememberCatalogueQuery(location.search), [location.search]);

  const filters: CatalogueFilters = {
    stock: query.stock,
    collection: query.collection,
    maxPrice: query.maxPrice,
    currency: query.currency,
  };
  const results = sortProducts(filterProducts(products, query), query.sort, locale);
  const countFor = (draft: CatalogueFilters) => filterProducts(products, { ...query, ...draft }).length;
  const filterCount = Number(!!query.stock) + Number(!!query.collection) + Number(!!query.maxPrice);
  const anyActive = filterCount > 0 || !!query.search || !!query.category;
  const category = categories.find((item) => item.id === query.category);
  const categoryTitle = category ? text(category.title) : query.category || t(catalogueMessages.allObjects);
  const comingArtwork = getArtwork("duality");

  const clearAll = () => update({ ...EMPTY_FILTERS, search: "", category: "", sort: "selected" });

  return (
    <section className="section shop-page catalog-studio">
      <header className="catalog-studio-heading">
        <div>
          <h1>{t(catalogueMessages.title)}</h1>
          <p>{t(catalogueMessages.lead)}</p>
        </div>
        <SiteLink to="favorites" className="catalog-saved-link">
          <HeartIcon />
          <span>{t(catalogueMessages.mySelection)}</span>
          <span className="catalog-saved-count">{saved.items.length}</span>
          <ShopArrowIcon />
        </SiteLink>
      </header>
      <CategoryPicker
        categories={categories}
        products={products}
        value={query.category}
        onChange={(id) => update({ category: id })}
      />
      <div className="catalog-browse-layout">
        <aside className="catalog-sidebar" aria-label={t(catalogueMessages.filtersLabel)}>
          <div className="catalog-sidebar-heading">
            <h2>{t(catalogueMessages.findObject)}</h2>
            {filterCount > 0 && (
              <button className="shop-text-button" onClick={() => update(EMPTY_FILTERS)}>
                {t(catalogueMessages.reset)}
              </button>
            )}
          </div>
          <FilterFields value={filters} onChange={update} collections={collections} products={products} />
          <p className="catalog-how">{t(catalogueMessages.howTo)}</p>
        </aside>
        <div className="catalog-stage">
          <div className="catalog-toolbar">
            <label className="catalog-search">
              <SearchIcon />
              <span className="sr-only">{t(catalogueMessages.searchLabel)}</span>
              <input
                type="search"
                value={query.search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t(catalogueMessages.searchPlaceholder)}
              />
            </label>
            <button
              ref={filtersButton}
              className="catalog-mobile-filter"
              onClick={() => setFiltersOpen(true)}
              aria-haspopup="dialog"
            >
              <FilterIcon />
              <span>{t(catalogueMessages.filters)}</span>
              {filterCount > 0 && <span>{filterCount}</span>}
            </button>
          </div>
          <div className="catalog-result-bar" id="catalog-results">
            <h2>
              {categoryTitle}
              <span role="status">{results.length}</span>
            </h2>
            <SortMenu value={query.sort} onChange={(sort) => update({ sort })} />
          </div>
          {anyActive && (
            <div className="catalog-filter-chips" aria-label={t(catalogueMessages.activeFilters)}>
              {query.category && (
                <button onClick={() => update({ category: "" })}>
                  {categoryTitle}
                  <CrossIcon />
                </button>
              )}
              {query.search && (
                <button onClick={() => update({ search: "" })}>
                  «{query.search}»<CrossIcon />
                </button>
              )}
              {query.stock && (
                <button onClick={() => update({ stock: "" })}>
                  {t(STOCK_NAMES[query.stock])}
                  <CrossIcon />
                </button>
              )}
              {query.collection && (
                <button onClick={() => update({ collection: "" })}>
                  {query.collection}
                  <CrossIcon />
                </button>
              )}
              {query.maxPrice && (
                <button onClick={() => update({ maxPrice: "" })}>
                  {t(catalogueMessages.upTo)} {query.maxPrice} {query.currency}
                  <CrossIcon />
                </button>
              )}
              <button className="catalog-clear" onClick={clearAll}>
                {t(catalogueMessages.clearAll)}
              </button>
            </div>
          )}
          {query.sort.startsWith("price-") && (
            <p className="catalog-sort-note">{t(catalogueMessages.sortNote)}</p>
          )}
          {saved.error && (
            <p className="shop-notice" role="status">
              {t(catalogueMessages.storageUnavailable)}
            </p>
          )}
          {saved.items.length >= MAX_SAVED && (
            <p className="shop-notice">{t(catalogueMessages.savedLimit)}</p>
          )}
          {results.length ? (
            <div
              className="shop-grid catalog-grid-arrival"
              // Replays the arrival animation for a new result set, not for price slider steps.
              key={[
                query.category,
                query.search,
                query.stock,
                query.collection,
                query.currency,
                query.sort,
              ].join("|")}
            >
              {results.map((product, index) => (
                <ProductCard key={product.slug} product={product} eager={index < EAGER_CARDS} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="catalog-coming">
              <div className="catalog-coming-art">
                <ShopImage src={comingArtwork.image.path} alt={t(catalogueMessages.comingArtwork)} />
              </div>
              <div>
                <h3>{t(catalogueMessages.comingTitle)}</h3>
                <p>{t(catalogueMessages.comingBody)}</p>
                <SiteLink to="works" className="action-link">
                  {t(catalogueMessages.exploreArtworks)}
                  <ShopArrowIcon />
                </SiteLink>
              </div>
            </div>
          ) : (
            <div className="catalog-no-results">
              <h3>{t(catalogueMessages.noResults)}</h3>
              <p>{t(catalogueMessages.noResultsHelp)}</p>
              <button className="action-link" onClick={clearAll}>
                {t(catalogueMessages.clearFilters)}
                <ShopArrowIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      {filtersOpen && (
        <FilterDialog
          opener={filtersButton}
          value={filters}
          onApply={update}
          onClose={() => setFiltersOpen(false)}
          collections={collections}
          products={products}
          count={countFor}
        />
      )}
    </section>
  );
}
