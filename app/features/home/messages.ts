import type { Localized } from "~/shared/i18n/locale";

export const homeMessages = {
  heroLabel: {
    ru: "Baburism, пространство художника",
    uz: "Baburism, rassom makoni",
    en: "Baburism, the artist’s space",
  },
  heroLead: { ru: "Искусство становится ближе.", uz: "Sanʼat sizga yaqinroq.", en: "Art comes closer." },
  heroDescription: {
    ru: "Произведения Бабура Исмаилова и предметы, продолжающие его художественный мир.",
    uz: "Bobur Ismoilov asarlari va uning badiiy olamini davom ettiruvchi buyumlar.",
    en: "Artworks by Babur Ismailov and objects that continue his artistic world.",
  },
  heroEyebrow: { ru: "Пространство художника", uz: "Rassom makoni", en: "The artist's space" },
  heroMobileDescription: {
    ru: "Живопись, предметы и встречи с искусством.",
    uz: "Rangtasvir, buyumlar va sanʼat bilan uchrashuvlar.",
    en: "Paintings, objects and encounters with art.",
  },
  viewFullArtwork: { ru: "Картина целиком", uz: "Toʻliq kartina", en: "View full artwork" },
  continueToSpace: { ru: "Далее, о пространстве", uz: "Keyingi, makon haqida", en: "Continue to the space" },
  viewTheArtwork: { ru: "Рассмотреть произведение", uz: "Asarni koʻrish", en: "View the artwork" },
  artworkDetail: { ru: "Фрагмент произведения", uz: "Asardan lavha", en: "A detail of the artwork" },
  viewCompleteArtwork: {
    ru: "Рассмотреть произведение целиком",
    uz: "Asarni toʻliq koʻrish",
    en: "View the complete artwork",
  },
  openingArtwork: {
    ru: "Произведение с первого экрана целиком",
    uz: "Birinchi ekrandagi asar toʻliq",
    en: "The complete artwork from the opening screen",
  },
  completePainting: { ru: "Картина целиком", uz: "Toʻliq kartina", en: "The complete painting" },
  introTitle: {
    ru: "У каждого образа\nесть продолжение",
    uz: "Har bir obrazning\ndavomi bor",
    en: "Every image\nhas a life beyond",
  },
  introLead: {
    ru: "Картина может оставаться с вами и после того, как вы отошли от неё. В памяти, в ощущении, в повседневной вещи.",
    uz: "Kartinadan uzoqlashganingizdan keyin ham u siz bilan qolishi mumkin. Xotirada, tuygʻuda, kundalik buyumda.",
    en: "A painting can stay with you long after you have walked away. In a memory, a feeling, an everyday object.",
  },
  introBody: {
    ru: "Baburism задуман как продолжение художественного мира Бабура Исмаилова. Здесь произведения, будущая коллекция предметов и встречи с искусством складываются в один разговор.",
    uz: "Baburism Bobur Ismoilovning badiiy olami davomi sifatida oʻylangan. Bu yerda asarlar, kelajakdagi buyumlar kolleksiyasi va sanʼat bilan uchrashuvlar bir suhbatga qoʻshiladi.",
    en: "Baburism is conceived as a continuation of Babur Ismailov’s artistic world. Artworks, a future collection of objects and encounters with art become part of one conversation.",
  },
  categories: { ru: "Категории", uz: "Toifalar", en: "Categories" },
  fullCatalogue: { ru: "Весь каталог", uz: "Butun katalog", en: "Full catalogue" },
  categoryArtNote: {
    ru: "Фрагменты произведений — вдохновение для будущей коллекции.",
    uz: "Asar parchalari — kelajak kolleksiyasi uchun ilhom.",
    en: "Artwork details inspire the upcoming collection.",
  },
  ribbonTitle: { ru: "Выбор Baburism", uz: "Baburism tanlovi", en: "The Baburism edit" },
  ribbonLead: {
    ru: "Картины и предметы в одном ритме. Собираем созвучия, к которым хочется возвращаться.",
    uz: "Bir ritmdagi kartinalar va buyumlar. Qayta-qayta qaytishni istaydigan uygʻunliklarni jamlaymiz.",
    en: "Paintings and objects in one rhythm. A collection of affinities to return to.",
  },
  allArtworks: { ru: "Все произведения", uz: "Barcha asarlar", en: "All artworks" },
  ribbonLabel: {
    ru: "Лента. Стрелки листают, Tab выбирает произведение или предмет.",
    uz: "Tasma. Strelkalar bilan suring, Tab bilan asar yoki buyumni tanlang.",
    en: "Ribbon. Arrow keys browse; Tab selects an artwork or object.",
  },
  ribbonHint: {
    ru: "Листайте в своём ритме. Нажмите на работу, чтобы рассмотреть её.",
    uz: "Oʻz ritmingizda suring. Asarni koʻrish uchun ustiga bosing.",
    en: "Browse at your own pace. Select a work for a closer look.",
  },
} as const satisfies Record<string, Localized>;
