import type { Localized } from "~/shared/i18n/locale";

export const shopMessages = {
  imageUnavailable: { ru: "Изображение недоступно", uz: "Tasvir mavjud emas", en: "Image unavailable" },
  removeFromFavorites: {
    ru: "Удалить из избранного",
    uz: "Saralanganlardan oʻchirish",
    en: "Remove from favorites",
  },
  saveToFavorites: { ru: "В избранное", uz: "Saralanganlarga", en: "Save to favorites" },
  unavailable: { ru: "Нет в наличии", uz: "Mavjud emas", en: "Unavailable" },
  after: { ru: "По мотивам", uz: "Asosida", en: "After" },
  variant: { ru: "Вариант предмета", uz: "Buyum varianti", en: "Object option" },
  chooseVariant: { ru: "Выберите вариант", uz: "Variantni tanlang", en: "Choose an option" },
  variantUnavailable: { ru: "нет в наличии", uz: "mavjud emas", en: "unavailable" },
  copied: { ru: "Скопировано", uz: "Nusxalandi", en: "Copied" },
  copiedToClipboard: {
    ru: "Скопировано в буфер обмена",
    uz: "Buferga nusxalandi",
    en: "Copied to clipboard",
  },
  copyBlocked: {
    ru: "Копирование заблокировано браузером. Выделите и скопируйте текст:",
    uz: "Brauzer nusxalashni blokladi. Matnni tanlab nusxalang:",
    en: "The browser blocked copying. Select and copy the text:",
  },
  discussInTelegram: {
    ru: "Обсудить в Telegram",
    uz: "Telegramda muhokama qilish",
    en: "Discuss in Telegram",
  },
  selectAtLeastOne: {
    ru: "Выберите хотя бы один предмет.",
    uz: "Kamida bitta buyumni tanlang.",
    en: "Select at least one object.",
  },
  checkSelection: {
    ru: "Проверьте наличие и выберите вариант для каждого предмета.",
    uz: "Har bir buyumning mavjudligi va variantini tekshiring.",
    en: "Check availability and choose an option for each object.",
  },
  recipientPending: {
    ru: "Контакт для покупок появится после подтверждения командой. Пока можно сохранить подборку и текст обращения.",
    uz: "Xarid uchun aloqa jamoa tasdiqlagach paydo boʻladi. Hozircha tanlov va murojaat matnini saqlash mumkin.",
    en: "The team will add the purchase contact once confirmed. You can save the selection and enquiry draft meanwhile.",
  },
  draftTooLong: {
    ru: "Для одной ссылки слишком много данных. Разделите подборку или скопируйте полный текст.",
    uz: "Bir havola uchun maʼlumot koʻp. Tanlovni boʻling yoki toʻliq matnni nusxalang.",
    en: "There is too much information for one link. Split the selection or copy the full draft.",
  },
  chatOpens: {
    ru: "Откроется чат с подготовленным текстом. Проверьте и отправьте его самостоятельно.",
    uz: "Tayyor matn bilan chat ochiladi. Uni tekshirib, oʻzingiz yuboring.",
    en: "A chat opens with a prepared draft. Review it and send it yourself.",
  },
  enquiryDraft: { ru: "Текст обращения", uz: "Murojaat matni", en: "Enquiry draft" },
  preparedMessage: { ru: "Подготовленное сообщение", uz: "Tayyor xabar", en: "Prepared message" },
  compactDraft: {
    ru: "Для Telegram будет использована короткая версия со ссылкой на всю подборку. Здесь — полный текст.",
    uz: "Telegram uchun butun tanlovga havolali qisqa matn ishlatiladi. Bu yerda toʻliq matn.",
    en: "Telegram will use a shorter draft linking to the full selection. The complete text is shown here.",
  },
  copyDraft: { ru: "Скопировать текст", uz: "Matnni nusxalash", en: "Copy draft" },
} as const satisfies Record<string, Localized>;

export const productMessages = {
  unavailableTitle: { ru: "Предмет недоступен", uz: "Buyum mavjud emas", en: "Object unavailable" },
  backToCatalogue: { ru: "В каталог", uz: "Katalogga", en: "Back to catalogue" },
  viewImage: { ru: "Рассмотреть изображение", uz: "Tasvirni koʻrish", en: "View image" },
  view: { ru: "Рассмотреть", uz: "Koʻrish", en: "View image" },
  photo: { ru: "Фото", uz: "Surat", en: "Photo" },
  available: { ru: "В наличии", uz: "Mavjud", en: "Available" },
  onRequest: {
    ru: "Наличие уточняется по запросу",
    uz: "Mavjudligi soʻrov asosida aniqlanadi",
    en: "Availability on request",
  },
  saved: { ru: "В избранном", uz: "Saralanganlarda", en: "Saved to favorites" },
  save: { ru: "Сохранить в избранное", uz: "Saralanganlarga saqlash", en: "Save to favorites" },
  savedLimit: {
    ru: "В избранном уже 40 предметов.",
    uz: "Saralanganlarda 40 ta buyum bor.",
    en: "You have saved 40 objects.",
  },
  material: { ru: "Материал", uz: "Material", en: "Material" },
  size: { ru: "Размер", uz: "Oʻlcham", en: "Dimensions" },
  edition: { ru: "Тираж", uz: "Tiraj", en: "Edition" },
  reference: { ru: "Артикул", uz: "Artikul", en: "Reference" },
  care: { ru: "Уход", uz: "Parvarish", en: "Care" },
  imageOrigin: { ru: "Начало образа", uz: "Obrazning boshlanishi", en: "Where the image begins" },
  aboutArtwork: { ru: "Подробнее о произведении", uz: "Asar haqida batafsil", en: "About the artwork" },
  aboutObject: { ru: "Об этом предмете", uz: "Bu buyum haqida", en: "About this object" },
  contactTeam: {
    ru: "Написать команде через сайт",
    uz: "Jamoaga sayt orqali yozish",
    en: "Contact the team through the site",
  },
  moreFromCollection: { ru: "Ещё из коллекции", uz: "Kolleksiyadan yana", en: "More from the collection" },
} as const satisfies Record<string, Localized>;

export const favoritesMessages = {
  selection: { ru: "Подборка", uz: "Tanlov", en: "Selection" },
  sharedIntro: {
    ru: "Предметы, которыми с вами поделились.",
    uz: "Sizga ulashilgan buyumlar.",
    en: "Objects shared with you.",
  },
  intro: {
    ru: "Сохраните то, к чему хочется вернуться.",
    uz: "Qaytishni istagan buyumlaringizni saqlang.",
    en: "Keep the objects you would like to return to.",
  },
  toCatalogue: { ru: "В каталог", uz: "Katalogga", en: "Catalogue" },
  invalidLink: {
    ru: "Ссылка на подборку повреждена",
    uz: "Tanlov havolasi buzilgan",
    en: "This selection link is invalid",
  },
  invalidLinkHelp: {
    ru: "Попросите отправить её ещё раз. Ваше избранное сохранено.",
    uz: "Havolani qayta yuborishni soʻrang. Sizning tanlovingiz saqlangan.",
    en: "Ask for the link again. Your favorites are still saved.",
  },
  myFavorites: { ru: "Моё избранное", uz: "Mening tanlovim", en: "My favorites" },
  loading: { ru: "Загрузка подборки…", uz: "Tanlov yuklanmoqda…", en: "Loading your selection…" },
  selectAll: { ru: "Выбрать всё", uz: "Barchasini tanlash", en: "Select all" },
  selected: { ru: "Выбрано", uz: "Tanlangan", en: "Selected" },
  savedSelection: { ru: "Сохранено в избранном", uz: "Saralanganlarga saqlandi", en: "Saved to favorites" },
  saveSelection: { ru: "Сохранить подборку", uz: "Tanlovni saqlash", en: "Save selection" },
  mergeLimit: {
    ru: "В избранное помещается 40 предметов. Удалите часть из своего списка, чтобы сохранить эту подборку целиком.",
    uz: "Saralanganlarga 40 ta buyum sigʻadi. Tanlovni toʻliq saqlash uchun roʻyxatingizdan ayrimlarini oʻchiring.",
    en: "Favorites hold up to 40 objects. Remove some saved objects to save this entire selection.",
  },
  storageUnavailable: {
    ru: "Избранное не сохраняется в этом браузере. Скопируйте ссылку на подборку.",
    uz: "Bu brauzer tanlovni saqlamaydi. Tanlov havolasini nusxalang.",
    en: "This browser cannot persist favorites. Copy the selection link.",
  },
  select: { ru: "Выбрать", uz: "Tanlash", en: "Select" },
  unavailableNow: {
    ru: "Сейчас недоступен для покупки",
    uz: "Hozir xarid qilish mumkin emas",
    en: "Currently unavailable to purchase",
  },
  remove: { ru: "Удалить", uz: "Oʻchirish", en: "Remove" },
  noLongerPublished: {
    ru: "Предмет больше не опубликован",
    uz: "Buyum endi eʼlon qilinmagan",
    en: "This object is no longer published",
  },
  removeToContinue: {
    ru: "Можно удалить его и продолжить с остальной подборкой.",
    uz: "Uni oʻchirib, qolgan tanlov bilan davom etishingiz mumkin.",
    en: "Remove it to continue with the rest of the selection.",
  },
  yourSelection: { ru: "Ваша подборка", uz: "Sizning tanlovingiz", en: "Your selection" },
  forEnquiry: { ru: "Для обращения", uz: "Murojaat uchun", en: "For your enquiry" },
  copyLink: {
    ru: "Скопировать ссылку на выбранное",
    uz: "Tanlanganlar havolasini nusxalash",
    en: "Copy link to selected objects",
  },
  openLink: {
    ru: "Открыть подборку по ссылке",
    uz: "Tanlovni havola orqali ochish",
    en: "Open selection link",
  },
  emptyTitle: {
    ru: "Здесь будут ваши находки",
    uz: "Bu yerda topilmalaringiz boʻladi",
    en: "Your discoveries will be here",
  },
  emptyBody: {
    ru: "Нажмите на сердце у предмета. Можно вернуться к нему позже или собрать несколько для обращения.",
    uz: "Buyum yonidagi yurakni bosing. Keyinroq qaytish yoki murojaat uchun bir nechta buyum yigʻish mumkin.",
    en: "Tap the heart on an object. Return to it later, or gather several objects for one enquiry.",
  },
} as const satisfies Record<string, Localized>;
