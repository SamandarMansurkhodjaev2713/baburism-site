import type { Localized } from "./locale";

/** Texts shared by several sections of the site. */
export const common = {
  artistName: { ru: "Бабур Исмаилов", uz: "Bobur Ismoilov", en: "Babur Ismailov" },
  spaceLine: {
    ru: "Пространство художника Бабура Исмаилова",
    uz: "Rassom Bobur Ismoilov makoni",
    en: "The space of artist Babur Ismailov",
  },
  location: { ru: "Ташкент, Узбекистан", uz: "Toshkent, Oʻzbekiston", en: "Tashkent, Uzbekistan" },
  home: { ru: "Главная", uz: "Bosh sahifa", en: "Home" },
  about: { ru: "О пространстве", uz: "Makon haqida", en: "About the space" },
  works: { ru: "Произведения", uz: "Asarlar", en: "Artworks" },
  collection: { ru: "Коллекция", uz: "Kolleksiya", en: "Collection" },
  catalogue: { ru: "Каталог", uz: "Katalog", en: "Catalogue" },
  /** The catalogue's name in the header and footer navigation. */
  catalogueNav: { ru: "Каталог", uz: "Katalog", en: "Collection" },
  favorites: { ru: "Избранное", uz: "Saralanganlar", en: "Favorites" },
  journal: { ru: "Журнал", uz: "Jurnal", en: "Journal" },
  program: { ru: "Программа", uz: "Dastur", en: "Programme" },
  visit: { ru: "Посетить", uz: "Tashrif", en: "Visit" },
  privacy: { ru: "Конфиденциальность", uz: "Maxfiylik", en: "Privacy" },
  menu: { ru: "Меню", uz: "Menyu", en: "Menu" },
  close: { ru: "Закрыть", uz: "Yopish", en: "Close" },
  previous: { ru: "Предыдущая работа", uz: "Oldingi asar", en: "Previous work" },
  next: { ru: "Следующая работа", uz: "Keyingi asar", en: "Next work" },
  changeLanguage: { ru: "Выбрать язык", uz: "Tilni tanlash", en: "Choose a language" },
  viewWork: { ru: "Рассмотреть работу", uz: "Asarni koʻrish", en: "Explore the work" },
  viewDetail: { ru: "Рассмотреть деталь", uz: "Detalni koʻrish", en: "View the detail" },
  viewWhole: { ru: "Посмотреть целиком", uz: "Toʻliq koʻrish", en: "View the whole work" },
  viewArtwork: { ru: "Рассмотреть", uz: "Koʻrish", en: "View artwork" },
  readInterview: { ru: "Читать интервью", uz: "Intervyuni oʻqish", en: "Read the interview" },
  openSource: {
    ru: "Открыть на сайте издания",
    uz: "Nashr saytida ochish",
    en: "Open on the publisher's website",
  },
  allStories: { ru: "Все материалы", uz: "Barcha materiallar", en: "All stories" },
  openCatalogue: { ru: "Открыть каталог", uz: "Katalogni ochish", en: "Open catalogue" },
  spaceName: { ru: "Пространство Baburism", uz: "Baburism makoni", en: "The Baburism space" },
  viewSpacePhoto: { ru: "Рассмотреть фото пространства", uz: "Makon suratini koʻrish", en: "View the space" },
} as const satisfies Record<string, Localized>;
