import type { Localized } from "~/shared/i18n/locale";

export const explorerMessages = {
  heading: { ru: "От целого к детали", uz: "Butundan detalga", en: "From whole to detail" },
  lead: {
    ru: "Иногда, чтобы увидеть больше, достаточно задержаться перед одной картиной.",
    uz: "Baʼzan koʻproq narsani koʻrish uchun bir asar oldida biroz toʻxtash kifoya.",
    en: "Sometimes, seeing more begins with spending a little longer with one painting.",
  },
  controls: { ru: "Управление просмотром", uz: "Koʻrishni boshqarish", en: "Viewing controls" },
  showWhole: { ru: "Показать картину целиком", uz: "Butun asarni koʻrsatish", en: "Show the whole artwork" },
  fit: { ru: "Целиком", uz: "Toʻliq", en: "Fit" },
  zoomOut: { ru: "Уменьшить", uz: "Kichraytirish", en: "Zoom out" },
  zoom: { ru: "Масштаб", uz: "Masshtab", en: "Zoom" },
  zoomIn: { ru: "Увеличить", uz: "Kattalashtirish", en: "Zoom in" },
  openRoom: { ru: "Открыть большой просмотр", uz: "Katta koʻrinishni ochish", en: "Open the large viewer" },
  closeRoom: { ru: "Закрыть большой просмотр", uz: "Katta koʻrinishni yopish", en: "Close the large viewer" },
  stage: {
    ru: "Область картины. Плюс и минус меняют масштаб, стрелки перемещают, ноль возвращает целое.",
    uz: "Asar sohasi. Plyus va minus masshtabni oʻzgartiradi, strelkalar siljitadi, nol butun koʻrinishni qaytaradi.",
    en: "Artwork area. Plus and minus zoom, arrow keys pan, zero restores the whole artwork.",
  },
  loading: { ru: "Загружаем произведение…", uz: "Asar yuklanmoqda…", en: "Loading the artwork…" },
  failed: {
    ru: "Не удалось загрузить картину.",
    uz: "Asarni yuklab boʻlmadi.",
    en: "The artwork could not be loaded.",
  },
  retry: { ru: "Попробовать снова", uz: "Qayta urinish", en: "Try again" },
  minimap: {
    ru: "Обзор картины. Нажмите, чтобы переместиться.",
    uz: "Asar koʻrinishi. Siljitish uchun bosing.",
    en: "Artwork overview. Select a position to move there.",
  },
  pointerHint: {
    ru: "Двойной щелчок — приблизить. Перетаскивайте увеличенную картину.",
    uz: "Ikki marta bosing — yaqinlashtiring. Kattalashtirilgan asarni suring.",
    en: "Double-click to zoom. Drag the enlarged artwork to explore.",
  },
  touchRoomHint: {
    ru: "Разведите пальцы для увеличения. Двигайте картину пальцем.",
    uz: "Kattalashtirish uchun ikki barmoqni yoying. Asarni barmoq bilan suring.",
    en: "Pinch to zoom. Move the artwork with your finger.",
  },
  touchHint: {
    ru: "Выберите деталь или нажмите +. Увеличенную картину можно двигать пальцем.",
    uz: "Detalni tanlang yoki + tugmasini bosing. Kattalashtirilgan asarni barmoq bilan surish mumkin.",
    en: "Choose a detail or tap +. Move the enlarged artwork with your finger.",
  },
  wholeTitle: { ru: "Сначала увидеть целое", uz: "Avval butun asarni koʻring", en: "Begin with the whole" },
  wholeBody: {
    ru: "«Самарканд Дарбоза» — пространство внутри пространства. Выберите фрагмент рядом с картиной или приблизьте любую её часть самостоятельно.",
    uz: "«Samarqand Darvoza» — makon ichidagi makon. Asar yonidagi detalni tanlang yoki istalgan qismini oʻzingiz yaqinlashtiring.",
    en: "Samarkand Darboza is a space within a space. Choose a fragment beside the painting or explore any part of it yourself.",
  },
  freeTitle: { ru: "Следуйте за своим взглядом", uz: "Nigohingiz ortidan boring", en: "Follow your own eye" },
  freeBody: {
    ru: "Перемещайтесь по картине, меняйте масштаб и возвращайтесь к целой композиции. Свою точку внимания можно найти в любой её части.",
    uz: "Asar boʻylab siljiting, masshtabni oʻzgartiring va butun kompozitsiyaga qayting. Diqqat markazini uning istalgan qismidan topishingiz mumkin.",
    en: "Move around the painting, change the scale and return to the whole composition. A detail worth your attention may be anywhere.",
  },
  details: { ru: "Детали картины", uz: "Asar detallari", en: "Painting details" },
  roomDetails: { ru: "Детали произведения", uz: "Asar detallari", en: "Artwork details" },
  interpretation: {
    ru: "Это приглашение присмотреться. Собственное прочтение остаётся за вами.",
    uz: "Bu diqqat bilan qarashga taklif. Oʻz talqiningizni topish sizga qoladi.",
    en: "An invitation to look closely. The interpretation is yours.",
  },
  continuationTitle: {
    ru: "Откуда начинается предмет",
    uz: "Buyum nimadan boshlanadi",
    en: "Where an object begins",
  },
  continuationBody: {
    ru: "Линия, силуэт, сочетание цветов. Внимание к произведению помогает заметить образ, который может получить продолжение в предмете.",
    uz: "Chiziq, siluet, ranglar uygʻunligi. Asarga diqqat bilan qarash buyumda davom etishi mumkin boʻlgan obrazni payqashga yordam beradi.",
    en: "A line, a silhouette, a meeting of colours. Looking closely at a work can reveal an image that might find a continuation in an object.",
  },
} as const satisfies Record<string, Localized>;

/** Editorial observations about Samarkand Darboza: a point of the image (0–1) and a zoom level. */
export const ARTWORK_DETAILS = [
  {
    x: 0.47,
    y: 0.43,
    zoom: 1.8,
    title: { ru: "Пространство внутри", uz: "Ichki makon", en: "A space within" },
    body: {
      ru: "Тёмный проём обрамляет освещённую сцену. Приблизьте её и проследите, как архитектура собирает отдельные образы в одну композицию.",
      uz: "Qorongʻi ochiq joy yorugʻ sahnani hoshiyalaydi. Yaqinlashtirib, meʼmoriy shakl alohida obrazlarni bir kompozitsiyaga qanday birlashtirishini kuzating.",
      en: "A dark opening frames the illuminated scene. Move closer to see how the architecture brings its separate images into one composition.",
    },
  },
  {
    x: 0.515,
    y: 0.485,
    zoom: 3,
    title: { ru: "Плоды и округлые формы", uz: "Mevalar va yumaloq shakllar", en: "Fruit and rounded forms" },
    body: {
      ru: "Чаша с плодами находится почти в центре. Рядом повторяются округлые силуэты: взгляд переходит от одного к другому.",
      uz: "Mevali kosa deyarli markazda joylashgan. Yonidagi yumaloq shakllar nigohni biridan boshqasiga yetaklaydi.",
      en: "The bowl of fruit sits near the centre. Rounded silhouettes repeat beside it, carrying the eye from one shape to another.",
    },
  },
  {
    x: 0.565,
    y: 0.22,
    zoom: 3,
    title: {
      ru: "Тонкие линии кроны",
      uz: "Daraxt shoxlarining nozik chiziqlari",
      en: "The fine lines of the crown",
    },
    body: {
      ru: "В верхней части видна сеть тонких ветвей. Она контрастирует с крупными плоскостями стены и тёмного проёма.",
      uz: "Yuqori qismda nozik shoxlar toʻri koʻrinadi. U devor va qorongʻi ochiq joyning yirik tekisliklariga qarama-qarshi turadi.",
      en: "A network of fine branches fills the upper part. Its lines contrast with the broad planes of the wall and the dark opening.",
    },
  },
] as const satisfies ReadonlyArray<{ x: number; y: number; zoom: number; title: Localized; body: Localized }>;
