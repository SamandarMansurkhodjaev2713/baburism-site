import { CURRENCIES, STOCK_STATES, type Currency, type Product, type StockState } from "~/shared/content";
import { pickLocalized, type Locale } from "~/shared/i18n/locale";

export const SORT_ORDERS = ["selected", "title", "price-up", "price-down"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

/** Filters edited in the filter panel (category and search have their own controls). */
export type CatalogueFilters = {
  stock: StockState | "";
  collection: string;
  /** Upper price bound as typed; "" means no bound, "0" is a valid bound. */
  maxPrice: string;
  currency: Currency;
};

export type CatalogueQuery = CatalogueFilters & {
  search: string;
  category: string;
  sort: SortOrder;
};

export const EMPTY_FILTERS: CatalogueFilters = { stock: "", collection: "", maxPrice: "", currency: "UZS" };

const isOneOf = <T extends string>(values: readonly T[], value: string | null): value is T =>
  value !== null && (values as readonly string[]).includes(value);

/** Reads catalogue state from the URL; unknown or malformed values fall back to defaults. */
export function parseCatalogueQuery(params: URLSearchParams): CatalogueQuery {
  const price = params.get("price") ?? "";
  const stock = params.get("stock");
  const currency = params.get("currency");
  const sort = params.get("sort");
  return {
    search: params.get("q") ?? "",
    category: params.get("category") ?? "",
    collection: params.get("collection") ?? "",
    stock: isOneOf(STOCK_STATES, stock) ? stock : "",
    maxPrice: price !== "" && Number.isFinite(Number(price)) && Number(price) >= 0 ? price : "",
    currency: isOneOf(CURRENCIES, currency) ? currency : "UZS",
    sort: isOneOf(SORT_ORDERS, sort) ? sort : "selected",
  };
}

/** Writes catalogue state into URL parameters, omitting defaults so links stay short. */
export function writeCatalogueQuery(query: CatalogueQuery, params = new URLSearchParams()): URLSearchParams {
  const next = new URLSearchParams(params);
  const entries: Array<[string, string]> = [
    ["q", query.search],
    ["category", query.category],
    ["collection", query.collection],
    ["stock", query.stock],
    ["price", query.maxPrice],
    ["currency", query.currency === "UZS" ? "" : query.currency],
    ["sort", query.sort === "selected" ? "" : query.sort],
  ];
  for (const [key, value] of entries) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  return next;
}

export type PriceRange = { max: number; step: number };

/** Slider bounds derived from real published prices in one currency; null when there are none. */
export function priceRange(products: readonly Product[], currency: Currency): PriceRange | null {
  const prices = products
    .filter((product) => product.currency === currency && product.price !== null)
    .map((product) => product.price as number);
  if (!prices.length) return null;
  const unit = currency === "UZS" ? 1 : 0.01;
  const highest = Math.max(...prices);
  if (highest === 0) return { max: 0, step: unit };
  const scale = 10 ** Math.floor(Math.log10(highest));
  const ceiling = ([1, 2, 5, 10].find((factor) => factor * scale >= highest) ?? 10) * scale;
  const max = Math.max(unit, ceiling);
  return { max, step: Math.max(unit, max / 100) };
}

const normalize = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[ʻʼ‘’']/g, "'")
    .trim();

/** Search covers every translation, so a query keeps working after switching language. */
function searchableText(product: Product): string {
  return normalize(
    [
      ...Object.values(product.title),
      ...Object.values(product.description),
      product.sku,
      product.category,
    ].join(" "),
  );
}

export function filterProducts(
  products: readonly Product[],
  query: Pick<CatalogueQuery, "search" | "category"> & CatalogueFilters,
): Product[] {
  const search = normalize(query.search);
  const limit = Number(query.maxPrice);
  return products.filter(
    (product) =>
      (!search || searchableText(product).includes(search)) &&
      (!query.category || product.category === query.category) &&
      (!query.stock || product.stock === query.stock) &&
      (!query.collection || product.collection === query.collection) &&
      (query.maxPrice === "" ||
        (product.price !== null && product.currency === query.currency && product.price <= limit)),
  );
}

/** "selected" keeps the curated content order; price orders group currencies and never convert between them. */
export function sortProducts(products: readonly Product[], order: SortOrder, locale: Locale): Product[] {
  if (order === "selected") return [...products];
  if (order === "title") {
    return [...products].sort((a, b) =>
      pickLocalized(a.title, locale).localeCompare(pickLocalized(b.title, locale)),
    );
  }
  const direction = order === "price-up" ? 1 : -1;
  return [...products].sort((a, b) => {
    const byCurrency = a.currency.localeCompare(b.currency);
    if (byCurrency) return byCurrency;
    if (a.price === null || b.price === null) return a.price === b.price ? 0 : a.price === null ? 1 : -1;
    return (a.price - b.price) * direction;
  });
}
