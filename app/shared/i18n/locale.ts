export const LOCALES = ["ru", "uz", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** A text in every site language. Message catalogues are typed with it, so a missing translation fails type-checking. */
export type Localized<T = string> = Readonly<Record<Locale, T>>;

/** A text from editable content where only Russian is required; other languages fall back to it. */
export type LocalizedDraft = Readonly<Partial<Record<Locale, string>>>;

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_NAMES: Localized = { ru: "Русский", uz: "Oʻzbekcha", en: "English" };

/** BCP 47 tags for `Intl` formatting. */
export const INTL_LOCALES: Localized = { ru: "ru-RU", uz: "uz-UZ", en: "en-US" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function pickLocalized(value: LocalizedDraft | undefined, locale: Locale): string {
  return value?.[locale] || value?.ru || "";
}
