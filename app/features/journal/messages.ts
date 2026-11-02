import type { ArticleTopic } from "~/shared/content";
import type { Localized } from "~/shared/i18n/locale";

export const TOPIC_NAMES = {
  meanings: { ru: "Образы и смыслы", uz: "Obrazlar va maʼnolar", en: "Images and meanings" },
  culture: { ru: "Искусство и культура", uz: "Sanʼat va madaniyat", en: "Art and culture" },
  learning: { ru: "Как смотреть искусство", uz: "Sanʼatni qanday koʻrish", en: "Ways of seeing" },
  interviews: { ru: "Интервью", uz: "Intervyular", en: "Interviews" },
  events: { ru: "События", uz: "Tadbirlar", en: "Events" },
} as const satisfies Record<ArticleTopic, Localized>;

export const journalMessages = {
  homeHeading: {
    ru: "Разговор с художником",
    uz: "Rassom bilan suhbat",
    en: "In conversation with the artist",
  },
  pageTitle: {
    ru: "За пределами\nкартины",
    uz: "Kartina\nchegaralaridan tashqarida",
    en: "Beyond\nthe painting",
  },
  pageIntro: {
    ru: "Опубликованные интервью о творчестве, свободе и работе с культурной памятью.",
    uz: "Ijod, erkinlik va madaniy xotira bilan ishlash haqidagi chop etilgan intervyular.",
    en: "Published interviews on creativity, freedom and working with cultural memory.",
  },
  topic: { ru: "Рубрика", uz: "Rukn", en: "Topic" },
  interview: { ru: "Интервью", uz: "Intervyu", en: "Interview" },
  interviewInRussian: { ru: "Интервью на русском", uz: "Rus tilidagi intervyu", en: "Interview in Russian" },
  readStory: { ru: "Читать материал", uz: "Maqolani oʻqish", en: "Read the story" },
  emptyTitle: {
    ru: "Здесь появятся новые истории",
    uz: "Bu yerda yangi hikoyalar paydo boʻladi",
    en: "New stories will appear here",
  },
  emptyBody: {
    ru: "Материалы этой рубрики пока не опубликованы. Можно начать с разговоров с художником.",
    uz: "Bu rukndagi materiallar hali eʼlon qilinmagan. Rassom bilan suhbatlardan boshlashingiz mumkin.",
    en: "This section has no published stories yet. You can begin with the artist’s interviews.",
  },
  readInterviews: { ru: "Читать интервью", uz: "Intervyularni oʻqish", en: "Read the interviews" },
  viewImage: { ru: "Рассмотреть иллюстрацию", uz: "Tasvirni koʻrish", en: "View image" },
  video: { ru: "Видео к материалу", uz: "Maqolaga oid video", en: "Watch the video" },
  loadVideo: { ru: "Загрузить видео", uz: "Videoni yuklash", en: "Load video" },
  videoNotice: {
    ru: "Плеер загрузится после нажатия.",
    uz: "Pleyer tugma bosilgandan keyin yuklanadi.",
    en: "The player loads when you choose to play.",
  },
  moreStories: { ru: "Другие материалы", uz: "Boshqa materiallar", en: "More stories" },
  keepReading: { ru: "Продолжить чтение", uz: "Oʻqishni davom ettirish", en: "Keep reading" },
} as const satisfies Record<string, Localized>;
