import type { Product, ProductVariant } from "~/shared/content";
import { INTL_LOCALES, type Locale, type Localized } from "~/shared/i18n/locale";
import type { SavedProduct } from "./selection";

const ON_REQUEST: Localized = { ru: "По запросу", uz: "Soʻrov asosida", en: "On request" };

export function productPrice(product: Product, locale: Locale): string {
  if (product.price === null) return ON_REQUEST[locale];
  return `${new Intl.NumberFormat(INTL_LOCALES[locale]).format(product.price)} ${product.currency}`;
}

export function productPictures(product: Product): string[] {
  return Array.from(new Set([product.image, ...product.images].filter(Boolean)));
}

export type ResolvedSaved = {
  product: Product | undefined;
  variant: ProductVariant | undefined;
  /** The object has variants but none (or an unknown one) is chosen. */
  missingVariant: boolean;
  /** Published, with a valid variant where required, and not sold out. */
  valid: boolean;
};

export function resolveSaved(saved: SavedProduct, products: readonly Product[]): ResolvedSaved {
  const product = products.find((item) => item.slug === saved.id);
  const variant = product?.variants.find((item) => item.id === saved.variant);
  const missingVariant = !!product?.variants.length && !variant;
  const sold = product?.stock === "sold" || variant?.stock === "sold";
  return { product, variant, missingVariant, valid: !!product && !missingVariant && !sold };
}
