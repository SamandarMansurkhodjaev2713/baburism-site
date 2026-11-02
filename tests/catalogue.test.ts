import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  filterProducts,
  parseCatalogueQuery,
  priceRange,
  sortProducts,
  writeCatalogueQuery,
  type CatalogueQuery,
} from "~/features/catalogue/filters";
import type { Product } from "~/shared/content";

function product(slug: string, overrides: Partial<Product> = {}): Product {
  return {
    slug,
    title: { ru: slug, uz: "", en: slug.toUpperCase() },
    description: { ru: "", uz: "", en: "" },
    body: { ru: "", uz: "", en: "" },
    image: "products/x.jpg",
    images: [],
    category: "prints",
    collection: "",
    price: null,
    currency: "UZS",
    stock: "request",
    variants: [],
    sku: "",
    material: { ru: "", uz: "", en: "" },
    size: "",
    edition: "",
    care: { ru: "", uz: "", en: "" },
    curated: false,
    publishedAt: "2026-01-01",
    ...overrides,
  };
}

const query = (overrides: Partial<CatalogueQuery> = {}): CatalogueQuery => ({
  ...EMPTY_FILTERS,
  search: "",
  category: "",
  sort: "selected",
  ...overrides,
});

const catalogue = [
  product("cup", { category: "ceramics", price: 120_000, stock: "available", collection: "Spring" }),
  product("print-a3", { price: 300_000, stock: "request" }),
  product("poster", { price: 40, currency: "USD", stock: "available" }),
  product("tee", { category: "clothing", price: null, stock: "sold" }),
];

describe("parseCatalogueQuery / writeCatalogueQuery", () => {
  it("falls back to defaults for unknown or malformed values", () => {
    const parsed = parseCatalogueQuery(
      new URLSearchParams("stock=soon&currency=GBP&price=-5&sort=random&category=prints"),
    );
    expect(parsed).toEqual(query({ category: "prints" }));
  });

  it("round-trips a full state and keeps defaults out of the URL", () => {
    const state = query({
      search: "чашка",
      category: "ceramics",
      stock: "available",
      maxPrice: "0",
      currency: "USD",
      sort: "price-up",
    });
    const params = writeCatalogueQuery(state);
    expect(parseCatalogueQuery(params)).toEqual(state);
    expect(writeCatalogueQuery(query()).toString()).toBe("");
  });

  it("preserves unrelated parameters", () => {
    expect(writeCatalogueQuery(query({ category: "prints" }), new URLSearchParams("utm=1")).toString()).toBe(
      "utm=1&category=prints",
    );
  });
});

describe("filterProducts", () => {
  it("filters by category and stock", () => {
    expect(filterProducts(catalogue, query({ category: "ceramics" })).map((item) => item.slug)).toEqual([
      "cup",
    ]);
    expect(filterProducts(catalogue, query({ stock: "available" })).map((item) => item.slug)).toEqual([
      "cup",
      "poster",
    ]);
  });

  it("searches every translation, ignoring case and apostrophe variants", () => {
    expect(filterProducts(catalogue, query({ search: "POSTER" })).map((item) => item.slug)).toEqual([
      "poster",
    ]);
    expect(filterProducts(catalogue, query({ search: "TEE" })).map((item) => item.slug)).toEqual(["tee"]);
  });

  it("applies a budget only within its currency and treats zero as a real bound", () => {
    expect(filterProducts(catalogue, query({ maxPrice: "150000" })).map((item) => item.slug)).toEqual([
      "cup",
    ]);
    expect(
      filterProducts(catalogue, query({ maxPrice: "50", currency: "USD" })).map((item) => item.slug),
    ).toEqual(["poster"]);
    expect(filterProducts(catalogue, query({ maxPrice: "0" }))).toEqual([]);
  });

  it("excludes unpriced objects only when a budget is applied", () => {
    expect(filterProducts(catalogue, query())).toHaveLength(4);
    expect(filterProducts(catalogue, query({ maxPrice: "1000000" })).map((item) => item.slug)).not.toContain(
      "tee",
    );
  });
});

describe("sortProducts", () => {
  it("keeps content order by default and sorts by title", () => {
    expect(sortProducts(catalogue, "selected", "ru").map((item) => item.slug)).toEqual([
      "cup",
      "print-a3",
      "poster",
      "tee",
    ]);
    expect(sortProducts(catalogue, "title", "ru").map((item) => item.slug)).toEqual([
      "cup",
      "poster",
      "print-a3",
      "tee",
    ]);
  });

  it("orders prices within each currency and puts unpriced objects last", () => {
    expect(sortProducts(catalogue, "price-up", "ru").map((item) => item.slug)).toEqual([
      "poster",
      "cup",
      "print-a3",
      "tee",
    ]);
    expect(sortProducts(catalogue, "price-down", "ru").map((item) => item.slug)).toEqual([
      "poster",
      "print-a3",
      "cup",
      "tee",
    ]);
  });
});

describe("priceRange", () => {
  it("rounds the ceiling up to a readable number from real prices", () => {
    expect(priceRange(catalogue, "UZS")).toEqual({ max: 500_000, step: 5_000 });
    expect(priceRange(catalogue, "USD")?.max).toBe(50);
  });

  it("is absent without prices in that currency", () => {
    expect(priceRange(catalogue, "EUR")).toBeNull();
    expect(priceRange([], "UZS")).toBeNull();
  });
});
