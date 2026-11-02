import { describe, expect, it } from "vitest";
import { prepareEnquiry, type EnquiryLinks } from "~/features/shop/enquiry";
import type { Product } from "~/shared/content";

const links: EnquiryLinks = {
  product: (slug) => `https://site.test/ru/product/${slug}`,
  selection: (code) => `https://site.test/ru/favorites?items=${code}`,
};

function product(slug: string, overrides: Partial<Product> = {}): Product {
  return {
    slug,
    title: { ru: `Предмет ${slug}`, uz: "", en: "" },
    description: { ru: "", uz: "", en: "" },
    body: { ru: "", uz: "", en: "" },
    image: "products/x.jpg",
    images: [],
    category: "prints",
    collection: "",
    price: 100,
    currency: "UZS",
    stock: "available",
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

const variants = [
  { id: "a3", title: { ru: "A3", uz: "", en: "" }, sku: "PR-A3", stock: "available" as const },
  { id: "a2", title: { ru: "A2", uz: "", en: "" }, sku: "PR-A2", stock: "sold" as const },
];

describe("prepareEnquiry", () => {
  it("lists every object with its variant, reference and link", () => {
    const products = [product("print", { variants }), product("cup", { sku: "CUP-1" })];
    const enquiry = prepareEnquiry(
      [
        { id: "print", variant: "a3" },
        { id: "cup", variant: "" },
      ],
      products,
      "ru",
      links,
      "@baburism_shop",
    );
    expect(enquiry.valid).toBe(true);
    expect(enquiry.text).toContain(
      "1. Предмет print\nA3\nАртикул: PR-A3\nhttps://site.test/ru/product/print",
    );
    expect(enquiry.text).toContain("2. Предмет cup\nАртикул: CUP-1\nhttps://site.test/ru/product/cup");
    expect(enquiry.url).toMatch(/^https:\/\/t\.me\/baburism_shop\?text=/);
    expect(decodeURIComponent(enquiry.url?.split("?text=")[1] ?? "")).toBe(enquiry.text);
  });

  it("is invalid for a missing variant, a sold-out variant or an unpublished object", () => {
    const products = [product("print", { variants })];
    const check = (id: string, variant: string) =>
      prepareEnquiry([{ id, variant }], products, "ru", links, "@baburism_shop");
    expect(check("print", "").valid).toBe(false);
    expect(check("print", "a2").valid).toBe(false);
    expect(check("gone", "").valid).toBe(false);
    expect(check("print", "a3").valid).toBe(true);
    expect(prepareEnquiry([], products, "ru", links, "@baburism_shop").valid).toBe(false);
  });

  it("offers no chat link without a valid recipient, but still prepares the text", () => {
    const enquiry = prepareEnquiry([{ id: "cup", variant: "" }], [product("cup")], "en", links, "");
    expect(enquiry.valid).toBe(true);
    expect(enquiry.url).toBeNull();
    expect(enquiry.text.startsWith("Hello!")).toBe(true);
    expect(
      prepareEnquiry([{ id: "cup", variant: "" }], [product("cup")], "en", links, "not a name").url,
    ).toBeNull();
  });

  it("falls back to a short draft linking to the whole selection when the full text is too long", () => {
    const items = Array.from({ length: 40 }, (_, index) => `object-${index}`);
    const products = items.map((slug) =>
      product(slug, {
        title: { ru: "Очень длинное название предмета для проверки ".repeat(3), uz: "", en: "" },
      }),
    );
    const enquiry = prepareEnquiry(
      items.map((id) => ({ id, variant: "" })),
      products,
      "ru",
      links,
      "@baburism_shop",
    );
    expect(enquiry.compact).toBe(true);
    expect(enquiry.tooLong).toBe(false);
    const draft = decodeURIComponent(enquiry.url?.split("?text=")[1] ?? "");
    expect(draft).toContain("Предметов в подборке: 40");
    expect(draft).toContain("https://site.test/ru/favorites?items=object-0.");
    expect(draft.length).toBeLessThan(enquiry.text.length);
  });
});
