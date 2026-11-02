import { z } from "zod";
import {
  articleSchema,
  categoriesSchema,
  productSchema,
  settingsSchema,
  SLUG_PATTERN,
  type Article,
  type Category,
  type Product,
  type Settings,
} from "./schema";

export type SiteContent = {
  settings: Settings;
  categories: readonly Category[];
  /** Curated objects first, then the most recently published. */
  products: readonly Product[];
  /** Most recently published first. */
  articles: readonly Article[];
};

export type RawContent = {
  settings: unknown;
  categories: unknown;
  /** File path → parsed JSON. The file name (without `.json`) is the slug. */
  products: Record<string, unknown>;
  articles: Record<string, unknown>;
};

export class ContentError extends Error {
  override name = "ContentError";
}

function parseFile<T extends z.ZodType>(schema: T, value: unknown, file: string): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new ContentError(`${file}\n${z.prettifyError(result.error)}`);
  return result.data;
}

function slugFromPath(path: string): string {
  const name = path.split("/").pop() ?? "";
  const slug = name.replace(/\.json$/, "");
  if (!SLUG_PATTERN.test(slug)) {
    throw new ContentError(
      `${path}\nRename the file: use lowercase latin letters, digits and single hyphens.`,
    );
  }
  return slug;
}

function parseCollection<T extends z.ZodType<object>>(
  schema: T,
  files: Record<string, unknown>,
): Array<z.output<T> & { slug: string }> {
  return Object.entries(files).map(([path, value]) => ({
    ...parseFile(schema, value, path),
    slug: slugFromPath(path),
  }));
}

const byNewest = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  b.publishedAt.localeCompare(a.publishedAt);

/** Validates every content file and the references between them. Throws a readable error on the first problem. */
export function parseContent(raw: RawContent): SiteContent {
  const settings = parseFile(settingsSchema, raw.settings, "content/settings.json");
  const categories = parseFile(categoriesSchema, raw.categories, "content/categories.json");
  const products = parseCollection(productSchema, raw.products);
  const articles = parseCollection(articleSchema, raw.articles);

  const categoryIds = new Set(categories.map((category) => category.id));
  for (const product of products) {
    if (!categoryIds.has(product.category)) {
      throw new ContentError(
        `content/products/${product.slug}.json\nCategory "${product.category}" is not listed in content/categories.json.`,
      );
    }
  }

  return {
    settings,
    categories,
    products: [...products].sort((a, b) => Number(b.curated) - Number(a.curated) || byNewest(a, b)),
    articles: [...articles].sort(byNewest),
  };
}
