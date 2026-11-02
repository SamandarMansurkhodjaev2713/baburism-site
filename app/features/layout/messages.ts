import type { Localized } from "~/shared/i18n/locale";

export const layoutMessages = {
  skipToContent: { ru: "Перейти к содержанию", uz: "Asosiy mazmunga oʻtish", en: "Skip to content" },
  homeLink: { ru: "Baburism, главная", uz: "Baburism, bosh sahifa", en: "Baburism, home" },
  mainNavigation: { ru: "Основная навигация", uz: "Asosiy navigatsiya", en: "Main navigation" },
  exploreSpace: { ru: "Исследуйте пространство", uz: "Makon bilan tanishing", en: "Explore the space" },
  journalMenu: { ru: "Journal", uz: "Journal", en: "Journal" },
  artistArchive: { ru: "Архив художника", uz: "Rassom arxivi", en: "Artist’s archive" },
  backToTop: { ru: "Наверх", uz: "Yuqoriga", en: "Back to top" },
  favoritesCount: { ru: "Избранное", uz: "Saralanganlar", en: "Favorites" },
} as const satisfies Record<string, Localized>;

/** Menu entries: a route, a painting that previews it, and a short description. */
export const menuDescriptions = {
  home: {
    ru: "Художественный мир Бабура Исмаилова",
    uz: "Bobur Ismoilovning badiiy olami",
    en: "The artistic world of Babur Ismailov",
  },
  about: {
    ru: "Идея, художник и пространство",
    uz: "Gʻoya, rassom va makon",
    en: "The idea, the artist and the space",
  },
  catalog: {
    ru: "Продолжение образа в предметах",
    uz: "Obrazning buyumlardagi davomi",
    en: "The image continues through objects",
  },
  favorites: {
    ru: "Ваша личная подборка предметов",
    uz: "Buyumlarning shaxsiy tanlovingiz",
    en: "Your personal selection of objects",
  },
  works: { ru: "Знакомство с живописью", uz: "Rangtasvir bilan tanishuv", en: "An encounter with painting" },
  journal: {
    ru: "Интервью и размышления об искусстве",
    uz: "Intervyular va sanʼat haqida fikrlar",
    en: "Interviews and reflections on art",
  },
  visit: { ru: "Ташкент, Узбекистан", uz: "Toshkent, Oʻzbekiston", en: "Tashkent, Uzbekistan" },
} as const satisfies Record<string, Localized>;
