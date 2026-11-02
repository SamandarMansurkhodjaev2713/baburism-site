import { z } from "zod";
import { ARTWORK_SLUGS } from "./artworks";
import { telegramUsername } from "./telegram";
import { getVideoEmbedUrl } from "./video";

/** Slugs double as public IDs in favourites links, so they stay URL-safe and short. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z
  .string()
  .regex(SLUG_PATTERN, "Use lowercase latin letters, digits and single hyphens.")
  .max(80);

const text = z.string().trim().default("");

/** Russian is the source language; Uzbek and English fall back to it when empty. */
const localizedText = z.strictObject({ ru: text, uz: text, en: text }).default({ ru: "", uz: "", en: "" });

const requiredLocalizedText = z.strictObject({
  ru: z.string().trim().min(1, "Russian text is required."),
  uz: text,
  en: text,
});

/** A file in `public/` (e.g. `products/cup.jpg`) or an absolute https URL. */
const imagePath = z
  .string()
  .trim()
  .regex(
    /^(?:https:\/\/\S+|[a-z0-9][\w\-./]*\.(?:jpe?g|png|webp|avif))$/i,
    "Use a path inside public/ such as products/cup.jpg, or an https URL.",
  );

const httpsUrl = z
  .string()
  .trim()
  .regex(/^https:\/\/\S+$/, "Use an https URL.");
const optionalHttpsUrl = z.union([z.literal(""), httpsUrl]).default("");

export const STOCK_STATES = ["available", "request", "sold"] as const;
export const CURRENCIES = ["UZS", "USD", "EUR"] as const;
export const ARTICLE_TOPICS = ["meanings", "culture", "learning", "interviews", "events"] as const;

const stock = z.enum(STOCK_STATES);
const artworkSlug = z.string().refine((value) => ARTWORK_SLUGS.includes(value), "Unknown artwork slug.");

export const categorySchema = z.strictObject({
  id: slug,
  title: requiredLocalizedText,
  description: requiredLocalizedText,
  image: imagePath,
});

export const categoriesSchema = z
  .array(categorySchema)
  .min(1)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    "Category IDs must be unique.",
  );

const variantSchema = z.strictObject({
  id: slug,
  title: requiredLocalizedText,
  sku: text,
  stock: stock.default("request"),
});

export const productSchema = z
  .strictObject({
    title: requiredLocalizedText,
    description: localizedText,
    body: localizedText,
    image: imagePath,
    images: z.array(imagePath).default([]),
    category: slug,
    collection: text,
    price: z.number().nonnegative().nullable().default(null),
    currency: z.enum(CURRENCIES).default("UZS"),
    stock: stock.default("request"),
    variants: z.array(variantSchema).default([]),
    sku: text,
    material: localizedText,
    size: text,
    edition: text,
    care: localizedText,
    sourceArtwork: artworkSlug.optional(),
    curated: z.boolean().default(false),
    publishedAt: z.iso.date(),
  })
  .refine(
    (product) => new Set(product.variants.map((variant) => variant.id)).size === product.variants.length,
    "Variant IDs must be unique within a product.",
  );

export const articleSchema = z.strictObject({
  title: requiredLocalizedText,
  description: localizedText,
  body: localizedText,
  topic: z.enum(ARTICLE_TOPICS),
  image: z.union([z.literal(""), imagePath]).default(""),
  images: z.array(imagePath).default([]),
  quote: localizedText,
  quoteAuthor: localizedText,
  videoUrl: z
    .union([
      z.literal(""),
      httpsUrl.refine((value) => getVideoEmbedUrl(value) !== null, "Use a YouTube or Vimeo link."),
    ])
    .default(""),
  sourceUrl: optionalHttpsUrl,
  publishedAt: z.iso.date(),
});

export const settingsSchema = z.strictObject({
  salesTelegram: z
    .string()
    .trim()
    .default("")
    .refine(
      (value) => value === "" || telegramUsername(value) !== null,
      "Use @username or https://t.me/username.",
    ),
  address: text,
  hours: localizedText,
  phone: text,
  email: z.union([z.literal(""), z.email()]).default(""),
  instagram: optionalHttpsUrl,
  telegram: optionalHttpsUrl,
  mapUrl: optionalHttpsUrl,
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),
  spacePhotos: z.array(imagePath).default([]),
  curatedArtworks: z.array(artworkSlug).min(1),
});

export type Category = z.infer<typeof categorySchema>;
export type ProductData = z.infer<typeof productSchema>;
export type ArticleData = z.infer<typeof articleSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type StockState = (typeof STOCK_STATES)[number];
export type Currency = (typeof CURRENCIES)[number];
export type ArticleTopic = (typeof ARTICLE_TOPICS)[number];
export type ProductVariant = ProductData["variants"][number];

export type Product = ProductData & { slug: string };
export type Article = ArticleData & { slug: string };
