import type { MetaDescriptor } from "react-router";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale, type Localized } from "../i18n/locale";
import { absoluteAsset, absoluteUrl } from "./urls";

const SITE_NAME = "Baburism";
const DEFAULT_IMAGE = "art/samarkand-darboza.jpg";

const HOME_TITLE: Localized = {
  ru: "Baburism · Пространство Бабура Исмаилова",
  uz: "Baburism · Bobur Ismoilov makoni",
  en: "Baburism · The space of Babur Ismailov",
};

const DEFAULT_DESCRIPTION: Localized = {
  ru: "Произведения Бабура Исмаилова, истории образов и замысел пространства Baburism в Ташкенте.",
  uz: "Bobur Ismoilov asarlari, obrazlar tarixi va Toshkentdagi Baburism makoni gʻoyasi.",
  en: "Artworks by Babur Ismailov, stories behind the imagery and the idea of the Baburism space in Tashkent.",
};

export const PAGE_TITLES = {
  about: { ru: "О пространстве", uz: "Makon haqida", en: "About the space" },
  catalog: { ru: "Каталог", uz: "Katalog", en: "Catalogue" },
  works: { ru: "Произведения", uz: "Asarlar", en: "Artworks" },
  journal: { ru: "Журнал", uz: "Jurnal", en: "Journal" },
  visit: { ru: "Посетить", uz: "Tashrif", en: "Visit" },
  privacy: { ru: "Конфиденциальность", uz: "Maxfiylik", en: "Privacy" },
  favorites: { ru: "Избранное", uz: "Saralanganlar", en: "Favorites" },
} as const satisfies Record<string, Localized>;

type PageMetaOptions = {
  locale: Locale;
  /** Route inside the language, e.g. "catalog" or "product/cup"; "" for the home page. */
  path: string;
  /** Page title without the site name; omitted for the home page. */
  title?: string;
  description?: string;
  /** A file in `public/` or an absolute URL. */
  image?: string;
  /** Personal pages such as favourites stay out of search results. */
  noindex?: boolean;
};

/** Title, description, canonical and language alternates, and Open Graph tags for one page. */
export function pageMeta({
  locale,
  path,
  title,
  description,
  image,
  noindex = false,
}: PageMetaOptions): MetaDescriptor[] {
  // Hosts redirect a directory URL to its trailing-slash form, so links use that form directly.
  const routeOf = (language: Locale) => `/${language}${path ? `/${path}` : ""}/`;
  const fullTitle = title ? `${title} · ${SITE_NAME}` : HOME_TITLE[locale];
  const summary = description || DEFAULT_DESCRIPTION[locale];
  const imageUrl = image?.startsWith("https://") ? image : absoluteAsset(image || DEFAULT_IMAGE);
  return [
    { title: fullTitle },
    { name: "description", content: summary },
    ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    { tagName: "link", rel: "canonical", href: absoluteUrl(routeOf(locale)) },
    ...LOCALES.map((language) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: language,
      href: absoluteUrl(routeOf(language)),
    })),
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title ?? SITE_NAME },
    { property: "og:description", content: summary },
    { property: "og:image", content: imageUrl },
    { property: "og:locale", content: { ru: "ru_RU", uz: "uz_UZ", en: "en_US" }[locale] },
  ];
}

/** The language of a route from its `:locale` parameter. Invalid codes never reach a page, so the default only guards typing. */
export function localeFromParam(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
