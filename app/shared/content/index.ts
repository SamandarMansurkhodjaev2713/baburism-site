import rawCategories from "@content/categories.json";
import rawSettings from "@content/settings.json";
import { parseContent } from "./parse";

/**
 * Site content lives in `/content` as JSON files and is bundled at build time.
 * Invalid content stops the build, so a published page never shows half-broken data.
 */
const content = parseContent({
  settings: rawSettings,
  categories: rawCategories,
  products: import.meta.glob("/content/products/*.json", { eager: true, import: "default" }),
  articles: import.meta.glob("/content/articles/*.json", { eager: true, import: "default" }),
});

export const { settings, categories, products, articles } = content;

export function findProduct(slug: string | undefined) {
  return products.find((product) => product.slug === slug);
}

export function findArticle(slug: string | undefined) {
  return articles.find((article) => article.slug === slug);
}

export { ARTICLE_TOPICS, CURRENCIES, STOCK_STATES } from "./schema";
export type {
  Article,
  ArticleTopic,
  Category,
  Currency,
  Product,
  ProductVariant,
  Settings,
  StockState,
} from "./schema";
