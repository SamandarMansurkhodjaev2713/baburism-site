import { describe, expect, it } from "vitest";
import categories from "@content/categories.json";
import settings from "@content/settings.json";
import exampleArticle from "@content/examples/article.json";
import exampleProduct from "@content/examples/product.json";
import { ContentError, parseContent, type RawContent } from "~/shared/content/parse";
import {
  ARTWORKS,
  artworkDimensions,
  artworkMedium,
  findArtwork,
  getArtwork,
} from "~/shared/content/artworks";
import { isValidContact, validateContact, composeContactMessage } from "~/features/visit/contact-message";

const product = {
  title: { ru: "Чашка «Дуальность»" },
  image: "products/cup.jpg",
  category: "ceramics",
  price: 150000,
  stock: "available",
  sourceArtwork: "duality",
  publishedAt: "2026-02-01",
};

const article = { title: { ru: "О серии" }, topic: "culture", publishedAt: "2026-03-01" };

function raw(overrides: Partial<RawContent> = {}): RawContent {
  return { settings, categories, products: {}, articles: {}, ...overrides };
}

describe("parseContent", () => {
  it("accepts the shipped settings and categories", () => {
    const content = parseContent(raw());
    expect(content.categories).toHaveLength(4);
    expect(content.products).toEqual([]);
  });

  it("derives slugs from file names and fills defaults", () => {
    const content = parseContent(raw({ products: { "/content/products/duality-cup.json": product } }));
    expect(content.products[0]).toMatchObject({
      slug: "duality-cup",
      currency: "UZS",
      variants: [],
      curated: false,
    });
  });

  it("puts curated objects first, then newest first", () => {
    const content = parseContent(
      raw({
        products: {
          "/content/products/old.json": { ...product, publishedAt: "2026-01-01" },
          "/content/products/new.json": { ...product, publishedAt: "2026-05-01" },
          "/content/products/pinned.json": { ...product, curated: true, publishedAt: "2025-01-01" },
        },
      }),
    );
    expect(content.products.map((item) => item.slug)).toEqual(["pinned", "new", "old"]);
  });

  it("reports the file and the problem for invalid content", () => {
    const run = () =>
      parseContent(raw({ products: { "/content/products/bad.json": { ...product, price: -1 } } }));
    expect(run).toThrow(ContentError);
    expect(run).toThrow(/bad\.json/);
  });

  it("rejects unknown fields, categories, artworks and malformed file names", () => {
    const expectError = (products: RawContent["products"], pattern: RegExp) =>
      expect(() => parseContent(raw({ products }))).toThrow(pattern);
    expectError({ "/content/products/a.json": { ...product, colour: "red" } }, /a\.json/);
    expectError(
      { "/content/products/a.json": { ...product, category: "toys" } },
      /not listed in content\/categories\.json/,
    );
    expectError({ "/content/products/a.json": { ...product, sourceArtwork: "mona-lisa" } }, /a\.json/);
    expectError({ "/content/products/Bad Name.json": product }, /Rename the file/);
  });

  it("validates articles, including video links", () => {
    expect(
      parseContent(raw({ articles: { "/content/articles/series.json": article } })).articles,
    ).toHaveLength(1);
    expect(() =>
      parseContent(
        raw({ articles: { "/content/articles/v.json": { ...article, videoUrl: "https://evil.example/x" } } }),
      ),
    ).toThrow(/YouTube or Vimeo/);
  });

  it("only accepts a usable Telegram contact", () => {
    expect(() =>
      parseContent(raw({ settings: { ...settings, salesTelegram: "https://t.me/joinchat" } })),
    ).toThrow();
    expect(
      parseContent(raw({ settings: { ...settings, salesTelegram: "@baburism_shop" } })).settings
        .salesTelegram,
    ).toBe("@baburism_shop");
  });
});

describe("content examples", () => {
  it("stay valid, so copying them is a safe way to start", () => {
    const content = parseContent(
      raw({
        products: { "/content/products/duality-cup.json": exampleProduct },
        articles: { "/content/articles/darboza.json": exampleArticle },
      }),
    );
    expect(content.products[0]).toMatchObject({ slug: "duality-cup", sourceArtwork: "duality" });
    expect(content.articles[0]?.topic).toBe("learning");
  });
});

describe("artworks", () => {
  it("has unique slugs and every image has dimensions", () => {
    expect(new Set(ARTWORKS.map((artwork) => artwork.slug)).size).toBe(ARTWORKS.length);
    for (const artwork of ARTWORKS) {
      expect(artwork.image.width).toBeGreaterThan(0);
      expect(artwork.image.path).toMatch(/^art\/.+\.jpg$/);
    }
  });

  it("formats medium and size per language", () => {
    const darboza = getArtwork("samarkand-darboza");
    expect(artworkMedium(darboza, "en")).toBe("Oil on canvas");
    expect(artworkDimensions(darboza, "ru")).toBe("100 × 200 см");
    expect(artworkDimensions(darboza, "uz")).toBe("100 × 200 cm");
    expect(artworkMedium(getArtwork("black-river"), "ru")).toBe("Холст, акрил");
    expect(findArtwork("unknown")).toBeUndefined();
  });
});

describe("contact form", () => {
  it.each(["a@b.co", "+998 90 123 45 67", "@baburism", "(71) 123-45-67"])(
    "accepts the contact %j",
    (value) => {
      expect(isValidContact(value)).toBe(true);
    },
  );

  it.each(["", "abc", "123", "@a", "a@b", "+1234567890123456789012"])("rejects the contact %j", (value) => {
    expect(isValidContact(value)).toBe(false);
  });

  it("validates fields in order and names the failing one", () => {
    expect(validateContact({ name: "A", contact: "a@b.co", message: "hello" })).toMatchObject({
      field: "name",
    });
    expect(validateContact({ name: "Ann", contact: "x", message: "hello" })).toMatchObject({
      field: "contact",
    });
    expect(validateContact({ name: "Ann", contact: "a@b.co", message: "hi" })).toMatchObject({
      field: "message",
    });
    expect(validateContact({ name: "Ann", contact: "a@b.co", message: "hello" })).toEqual({ valid: true });
  });

  it("composes the chat message with the subject when asking about an object", () => {
    const draft = { name: "Ann", contact: "a@b.co", message: "Is it available?" };
    expect(composeContactMessage(draft, "en", "Cup [cup]")).toBe(
      "Hello! I am writing from the Baburism website.\nObject: Cup [cup]\n\nIs it available?\n\nName: Ann\nContact: a@b.co",
    );
    expect(composeContactMessage(draft, "ru")).not.toContain("Предмет");
  });
});
