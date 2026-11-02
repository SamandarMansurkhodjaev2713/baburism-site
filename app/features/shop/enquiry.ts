import type { Product } from "~/shared/content";
import { telegramChatUrl, telegramUsername } from "~/shared/content/telegram";
import { pickLocalized, type Locale, type Localized } from "~/shared/i18n/locale";
import { resolveSaved } from "./product-model";
import { cleanSaved, encodeSelection, type SavedProduct } from "./selection";

/** Telegram accepts roughly 4096 characters; a URL must stay well below browser limits. */
const FULL_DRAFT_CHARS = 3300;
const FULL_DRAFT_URL_CHARS = 7200;
const MAX_DRAFT_CHARS = 3500;
const MAX_DRAFT_URL_CHARS = 7800;

const GREETING: Localized = {
  ru: "Здравствуйте! Интересуют предметы Baburism:",
  uz: "Salom! Baburism buyumlari bilan qiziqyapman:",
  en: "Hello! I am interested in these Baburism objects:",
};
const ENDING: Localized = {
  ru: "Подскажите, пожалуйста, наличие и как их приобрести.",
  uz: "Mavjudligi va qanday xarid qilish mumkinligini ayta olasizmi?",
  en: "Could you confirm availability and how to purchase?",
};
const REFERENCE: Localized = { ru: "Артикул", uz: "Artikul", en: "Reference" };
const SELECTION_SIZE: Localized = {
  ru: "Предметов в подборке",
  uz: "Tanlovdagi buyumlar",
  en: "Objects in the selection",
};

export type EnquiryLinks = {
  /** Absolute URL of a product page. */
  product: (slug: string) => string;
  /** Absolute URL of a shared selection with the given code. */
  selection: (code: string) => string;
};

export type Enquiry = {
  /** Full message with every object, variant, reference and link. */
  text: string;
  /** Every item exists, is available and has a required variant. */
  valid: boolean;
  /** Even the short draft exceeds Telegram limits. */
  tooLong: boolean;
  /** The chat link carries a short draft that links to the full selection. */
  compact: boolean;
  /** Ready-to-open chat link, or null while it cannot be offered. */
  url: string | null;
};

const charCount = (value: string) => Array.from(value).length;

export function prepareEnquiry(
  items: readonly SavedProduct[],
  products: readonly Product[],
  locale: Locale,
  links: EnquiryLinks,
  recipient: string,
): Enquiry {
  const clean = cleanSaved(items);
  const resolved = clean.map((item) => resolveSaved(item, products));
  const valid = clean.length > 0 && resolved.every((item) => item.valid);

  const lines = resolved.flatMap(({ product, variant }, index) => {
    if (!product) return [];
    const sku = variant?.sku || product.sku;
    return [
      "",
      `${index + 1}. ${pickLocalized(product.title, locale)}`,
      variant ? pickLocalized(variant.title, locale) : "",
      sku ? `${REFERENCE[locale]}: ${sku}` : "",
      links.product(product.slug),
    ].filter((line, position) => position === 0 || line);
  });
  const text = [GREETING[locale], ...lines, "", ENDING[locale]].join("\n");

  const compactText = [
    GREETING[locale],
    `${SELECTION_SIZE[locale]}: ${clean.length}`,
    links.selection(encodeSelection(clean)),
    ENDING[locale],
  ].join("\n\n");
  const fitsFully =
    charCount(text) <= FULL_DRAFT_CHARS && encodeURIComponent(text).length <= FULL_DRAFT_URL_CHARS;
  const draft = fitsFully ? text : compactText;
  const tooLong =
    charCount(draft) > MAX_DRAFT_CHARS || encodeURIComponent(draft).length > MAX_DRAFT_URL_CHARS;
  const username = telegramUsername(recipient);

  return {
    text,
    valid,
    tooLong,
    compact: !fitsFully,
    url: valid && username && !tooLong ? telegramChatUrl(username, draft) : null,
  };
}
