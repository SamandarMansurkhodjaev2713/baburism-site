import type { Localized } from "~/shared/i18n/locale";

/** Interviews with the artist published by other outlets; the site links to the originals. */
export type Interview = {
  id: string;
  url: string;
  publisher: string;
  year: number;
  title: Localized;
  summary: Localized;
  image: string;
};

export const INTERVIEWS: readonly Interview[] = [
  {
    id: "honesty-2019",
    url: "https://mytashkent.uz/2019/12/24/babur-ismailov-hudozhnik-ne-mozhet-vrat-sebe-i-miru/",
    publisher: "Status",
    year: 2019,
    title: {
      ru: "Художник не может врать себе и миру",
      uz: "Rassom oʻziga ham, dunyoga ham yolgʻon gapira olmaydi",
      en: "An artist cannot lie to himself or the world",
    },
    summary: {
      ru: "О переменах в живописи, театральном опыте и человеке в центре произведения.",
      uz: "Rangtasvirdagi oʻzgarishlar, teatr tajribasi va asar markazidagi inson haqida.",
      en: "On changes in painting, the influence of theatre and the human figure at the centre of a work.",
    },
    image: "art/babur-portrait.jpg",
  },
  {
    id: "eternal-city-2022",
    url: "https://www.afisha.uz/ru/gorod/2022/08/22/eternal-city",
    publisher: "Afisha.uz",
    year: 2022,
    title: {
      ru: "Как рождается целый город",
      uz: "Butun shahar qanday yaraladi",
      en: "How a whole city comes to life",
    },
    summary: {
      ru: "Разговор о работе с мастерами, ремесле и замысле пространства в Самарканде.",
      uz: "Ustalar bilan ishlash, hunarmandchilik va Samarqanddagi makon gʻoyasi haqida suhbat.",
      en: "A conversation about working with craftspeople and conceiving a cultural space in Samarkand.",
    },
    image: "art/duality.jpg",
  },
  {
    id: "freedom-2020",
    url: "https://weproject.media/articles/detail/babur-ismailov-ya-schitayu-chto-nam-narodam-tsentralnoy-azii-nuzhno-stremitsya-obedinyatsya-uvazhat/?amp=y",
    publisher: "WEproject",
    year: 2020,
    title: { ru: "Искусство быть вместе", uz: "Birga boʻlish sanʼati", en: "The art of being together" },
    summary: {
      ru: "О свободе, учителях и личных принципах художника.",
      uz: "Erkinlik, ustozlar va rassomning shaxsiy tamoyillari haqida.",
      en: "On freedom, teachers and the artist's personal principles.",
    },
    image: "art/keeping-balance.jpg",
  },
];
