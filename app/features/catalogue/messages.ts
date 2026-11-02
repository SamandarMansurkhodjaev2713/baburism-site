import type { StockState } from "~/shared/content";
import type { Localized } from "~/shared/i18n/locale";
import type { SortOrder } from "./filters";

export const STOCK_NAMES = {
  available: { ru: "В наличии", uz: "Mavjud", en: "Available" },
  request: { ru: "По запросу", uz: "Soʻrov asosida", en: "On request" },
  sold: { ru: "Нет в наличии", uz: "Mavjud emas", en: "Unavailable" },
} as const satisfies Record<StockState, Localized>;

export const SORT_NAMES = {
  selected: { ru: "Выбор Baburism", uz: "Baburism tanlovi", en: "Curated first" },
  title: { ru: "По названию", uz: "Nomi boʻyicha", en: "By name" },
  "price-up": { ru: "Сначала дешевле", uz: "Avval arzonroq", en: "Price: low to high" },
  "price-down": { ru: "Сначала дороже", uz: "Avval qimmatroq", en: "Price: high to low" },
} as const satisfies Record<SortOrder, Localized>;

export const catalogueMessages = {
  title: { ru: "Каталог", uz: "Katalog", en: "Catalogue" },
  lead: { ru: "Искусство — в вашем пространстве.", uz: "Sanʼat — makoningizda.", en: "Art, in your space." },
  mySelection: { ru: "Моя подборка", uz: "Mening tanlovim", en: "My selection" },
  filtersLabel: { ru: "Фильтры каталога", uz: "Katalog filtrlari", en: "Catalogue filters" },
  findObject: { ru: "Выбрать предмет", uz: "Buyumni tanlash", en: "Find your object" },
  reset: { ru: "Сбросить", uz: "Tozalash", en: "Reset" },
  howTo: {
    ru: "Сохраните понравившееся сердечком. В подборке можно выбрать несколько предметов для одного обращения.",
    uz: "Yoqtirgan buyumlarni yurakcha bilan saqlang. Bir murojaat uchun bir nechta buyumni tanlash mumkin.",
    en: "Save objects with the heart. Your selection lets you discuss several objects in one enquiry.",
  },
  searchLabel: {
    ru: "Поиск по названию или артикулу",
    uz: "Nom yoki artikul boʻyicha izlash",
    en: "Search by name or reference",
  },
  searchPlaceholder: { ru: "Найти предмет", uz: "Buyumni izlash", en: "Find an object" },
  filters: { ru: "Фильтры", uz: "Filtrlar", en: "Filters" },
  allObjects: { ru: "Все предметы", uz: "Barcha buyumlar", en: "All objects" },
  activeFilters: { ru: "Выбранные фильтры", uz: "Tanlangan filtrlar", en: "Active filters" },
  upTo: { ru: "До", uz: "Gacha", en: "Up to" },
  clearAll: { ru: "Сбросить всё", uz: "Barchasini tozalash", en: "Clear all" },
  sortNote: {
    ru: "Цены упорядочены внутри каждой валюты, без пересчёта.",
    uz: "Narxlar har bir valyutada alohida, konvertatsiyasiz tartiblanadi.",
    en: "Prices are ordered within each currency, without conversion.",
  },
  storageUnavailable: {
    ru: "Чтобы сохранить подборку, скопируйте её ссылку: браузер не сохраняет избранное.",
    uz: "Brauzer tanlovni saqlamaydi. Uni saqlash uchun havolasini nusxalang.",
    en: "This browser cannot keep favorites. Copy your selection link to save it.",
  },
  savedLimit: {
    ru: "В подборке уже 40 предметов. Удалите один, чтобы сохранить новый.",
    uz: "Tanlovda 40 ta buyum bor. Yangisini saqlash uchun bittasini oʻchiring.",
    en: "Your selection has 40 objects. Remove one to save another.",
  },
  comingTitle: {
    ru: "Коллекция складывается",
    uz: "Kolleksiya yaratilmoqda",
    en: "The collection is taking shape",
  },
  comingBody: {
    ru: "Предметы ещё не опубликованы. Познакомьтесь с произведениями, из которых начинается Baburism.",
    uz: "Buyumlar hali eʼlon qilinmagan. Baburism boshlangan asarlar bilan tanishing.",
    en: "Objects have not been published yet. Discover the artworks at the beginning of Baburism.",
  },
  comingArtwork: {
    ru: "Дуальность, Бабур Исмаилов",
    uz: "Ikkiyoqlamalik, Bobur Ismoilov",
    en: "Duality, Babur Ismailov",
  },
  exploreArtworks: { ru: "Смотреть произведения", uz: "Asarlarni koʻrish", en: "Explore artworks" },
  noResults: { ru: "Пока ничего не нашлось", uz: "Hozircha hech narsa topilmadi", en: "No objects found" },
  noResultsHelp: {
    ru: "Попробуйте другую категорию, запрос или бюджет.",
    uz: "Boshqa toifa, soʻrov yoki byudjetni tanlab koʻring.",
    en: "Try another category, search or budget.",
  },
  clearFilters: { ru: "Сбросить фильтры", uz: "Filtrlarni tozalash", en: "Clear filters" },
  closeFilters: { ru: "Закрыть фильтры", uz: "Filtrlarni yopish", en: "Close filters" },
  showObjects: { ru: "Показать предметы", uz: "Buyumlarni koʻrsatish", en: "Show objects" },
  availability: { ru: "Наличие", uz: "Mavjudligi", en: "Availability" },
  price: { ru: "Цена", uz: "Narx", en: "Price" },
  noLimit: { ru: "Без ограничения", uz: "Cheklanmagan", en: "No limit" },
  maximumPrice: { ru: "Максимальная цена", uz: "Eng yuqori narx", en: "Maximum price" },
  priceUpTo: { ru: "Цена до", uz: "Narx chegarasi", en: "Maximum price" },
  currency: { ru: "Валюта", uz: "Valyuta", en: "Currency" },
  rangePending: {
    ru: "Диапазон появится после публикации цен.",
    uz: "Narxlar eʼlon qilingach, diapazon paydo boʻladi.",
    en: "The range appears when prices are published.",
  },
  rangeHint: {
    ru: "Без пересчёта валют. Верхняя граница ползунка снимает ограничение.",
    uz: "Valyuta konvertatsiyasiz. Slayderning yuqori chegarasi cheklovni olib tashlaydi.",
    en: "No currency conversion. The top of the slider removes the limit.",
  },
  collection: { ru: "Коллекция", uz: "Kolleksiya", en: "Collection" },
  allCollections: { ru: "Все коллекции", uz: "Barcha kolleksiyalar", en: "All collections" },
  sort: { ru: "Сортировка", uz: "Saralash", en: "Sort" },
  productCategories: { ru: "Категории товаров", uz: "Buyum toifalari", en: "Product categories" },
  category: { ru: "Категория", uz: "Toifa", en: "Category" },
  categories: { ru: "Категории", uz: "Toifalar", en: "Categories" },
  closeCategories: { ru: "Закрыть категории", uz: "Toifalarni yopish", en: "Close categories" },
} as const satisfies Record<string, Localized>;
