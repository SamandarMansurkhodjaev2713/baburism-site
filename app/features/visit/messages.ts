import type { Localized } from "~/shared/i18n/locale";

export const visitMessages = {
  title: { ru: "Увидимся\nв Ташкенте", uz: "Toshkentda\nkoʻrishamiz", en: "See you\nin Tashkent" },
  body: {
    ru: "Продолжим знакомство с искусством в пространстве художника.",
    uz: "Rassom makonida sanʼat bilan tanishishni davom ettiramiz.",
    en: "Continue your encounter with art in the artist’s space.",
  },
  comingSoon: {
    ru: "Адрес, часы работы и дату открытия опубликуем здесь.",
    uz: "Manzil, ish vaqti va ochilish sanasi shu yerda eʼlon qilinadi.",
    en: "The address, opening hours and opening date will be published here.",
  },
  planVisit: { ru: "О посещении", uz: "Tashrif haqida", en: "Plan your visit" },
  directions: { ru: "Построить маршрут", uz: "Yoʻnalish", en: "Get directions" },
  mapTitle: {
    ru: "Расположение пространства Baburism",
    uz: "Baburism makoni manzili",
    en: "Baburism location",
  },
  openInMaps: { ru: "Открыть в картах", uz: "Xaritada ochish", en: "Open in maps" },
  findUs: { ru: "Как нас найти", uz: "Bizni qanday topish mumkin", en: "Find the space" },
  openMap: { ru: "Открыть карту", uz: "Xaritani ochish", en: "Open the map" },
  mapFallback: {
    ru: "Посмотрите расположение пространства и выберите удобный маршрут.",
    uz: "Makon joylashuvini koʻring va qulay yoʻnalishni tanlang.",
    en: "View the location and choose your route.",
  },
} as const satisfies Record<string, Localized>;

export const contactMessages = {
  aboutObject: { ru: "Узнать о предмете", uz: "Buyum haqida soʻrash", en: "Ask about this object" },
  startConversation: { ru: "Начнём разговор", uz: "Suhbatni boshlaylik", en: "Let’s start a conversation" },
  name: { ru: "Имя", uz: "Ism", en: "Name" },
  namePlaceholder: { ru: "Как к вам обращаться", uz: "Ismingiz", en: "Your name" },
  contact: {
    ru: "E-mail, телефон или Telegram",
    uz: "E-mail, telefon yoki Telegram",
    en: "Email, phone or Telegram",
  },
  contactPlaceholder: { ru: "Ваш контакт", uz: "Aloqa maʼlumotingiz", en: "Your contact" },
  message: { ru: "Сообщение", uz: "Xabar", en: "Message" },
  objectQuestion: {
    ru: "Что вы хотели бы узнать?",
    uz: "Nimani bilmoqchisiz?",
    en: "What would you like to know?",
  },
  generalQuestion: {
    ru: "О чём вы хотели бы поговорить?",
    uz: "Nima haqida suhbatlashmoqchisiz?",
    en: "What is on your mind?",
  },
  submit: { ru: "Отправить сообщение", uz: "Xabar yuborish", en: "Send message" },
  consent: {
    ru: "Сообщение откроется в Telegram — проверьте его и отправьте сами. Сайт не сохраняет введённые данные.",
    uz: "Xabar Telegramda ochiladi — uni tekshirib, oʻzingiz yuboring. Sayt kiritilgan maʼlumotlarni saqlamaydi.",
    en: "Your message opens in Telegram for you to review and send. The site does not store what you enter.",
  },
  unavailable: {
    ru: "Контакт для сообщений появится после подтверждения командой.",
    uz: "Xabarlar uchun aloqa jamoa tasdiqlagach paydo boʻladi.",
    en: "A contact for messages will appear once the team confirms it.",
  },
  details: { ru: "Подробнее", uz: "Batafsil", en: "Details" },
  privacyNewTab: {
    ru: "Политика конфиденциальности, откроется в новой вкладке",
    uz: "Maxfiylik siyosati, yangi oynada ochiladi",
    en: "Privacy information, opens in a new tab",
  },
  sentTitle: { ru: "Сообщение готово", uz: "Xabar tayyor", en: "Your message is ready" },
  sentBody: {
    ru: "Мы открыли чат Telegram с вашим текстом. Отправьте его там, и команда ответит.",
    uz: "Matningiz bilan Telegram chatini ochdik. Uni oʻsha yerda yuboring, jamoa javob beradi.",
    en: "We opened a Telegram chat with your text. Send it there and the team will reply.",
  },
  writeAnother: { ru: "Написать ещё", uz: "Yana yozish", en: "Write another message" },
} as const satisfies Record<string, Localized>;
