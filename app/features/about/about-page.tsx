import { settings } from "~/shared/content";
import { ARTIST_PORTRAIT, artworkMedium, getArtwork } from "~/shared/content/artworks";
import { common } from "~/shared/i18n/common-messages";
import type { Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";
import { TitleLines } from "~/shared/ui/title-lines";
import { ArtworkButton } from "../artworks/artwork-button";
import { useShell } from "../layout/shell-context";
import { SiteLink } from "../layout/site-link";
import { SpaceGallery } from "../visit/space-gallery";
import { VisitSection } from "../visit/visit-section";

const ARTIST_BIOGRAPHY = "https://en.baburism.uz/about";

const messages = {
  title: {
    ru: "Пространство\nБабура Исмаилова",
    uz: "Bobur Ismoilov\nmakoni",
    en: "The space of\nBabur Ismailov",
  },
  intro: {
    ru: "Baburism знакомит с художественным миром Бабура Исмаилова. Здесь можно рассмотреть произведения, прочитать опубликованные интервью и узнать о замысле пространства.",
    uz: "Baburism Bobur Ismoilovning badiiy olami bilan tanishtiradi. Bu yerda asarlarni tomosha qilish, eʼlon qilingan intervyularda rassomning fikrlari bilan tanishish va makon gʻoyasi haqida bilish mumkin.",
    en: "Baburism introduces the artistic world of Babur Ismailov. Explore his works, read published interviews and discover the idea behind the space.",
  },
  viewSpace: { ru: "Рассмотреть пространство", uz: "Makonni koʻrish", en: "View the space" },
  onThisPage: { ru: "На этой странице", uz: "Shu sahifada", en: "On this page" },
  indexIdea: { ru: "Идея", uz: "Gʻoya", en: "The idea" },
  indexArtist: { ru: "Художник", uz: "Rassom", en: "The artist" },
  indexCollection: { ru: "Коллекция", uz: "Kolleksiya", en: "The collection" },
  indexProgram: { ru: "Программа", uz: "Dastur", en: "The programme" },
  ideaChapter: { ru: "Идея пространства", uz: "Makon gʻoyasi", en: "The idea of the space" },
  philosophyHeading: { ru: "Сначала произведение", uz: "Avval asar", en: "The artwork comes first" },
  philosophyBody: {
    ru: "Всё начинается с внимательного взгляда. Сюжет, жест, цвет или небольшая деталь могут стать началом личной истории. Будущая коллекция предметов продолжит эту связь с искусством.",
    uz: "Hammasi diqqat bilan qarashdan boshlanadi. Syujet, imo-ishora, rang yoki kichik bir detal shaxsiy hikoyaning boshlanishi boʻlishi mumkin. Kelajakdagi buyumlar kolleksiyasi sanʼat bilan shu aloqani davom ettiradi.",
    en: "It begins with a closer look. A scene, a gesture, a colour or a small detail can become part of a personal story. The future collection of objects will continue this connection with art.",
  },
  philosophySecondary: {
    ru: "У произведения может быть несколько прочтений. Мы оставляем место для вашего.",
    uz: "Asarning bir nechta talqini boʻlishi mumkin. Sizning talqiningiz uchun ham joy bor.",
    en: "A work can hold more than one interpretation. There is room for yours.",
  },
  artistBio: {
    ru: "Бабур Исмаилов родился в Ташкенте в 1973 году. Его работа охватывает живопись, театральную сценографию, кино и книжную графику.",
    uz: "Bobur Ismoilov 1973-yilda Toshkentda tugʻilgan. Uning ijodi rangtasvir, teatr sahnasi bezagi, kino va kitob grafikasini qamrab oladi.",
    en: "Babur Ismailov was born in Tashkent in 1973. His practice spans painting, stage design, cinema and book illustration.",
  },
  artistInterviews: {
    ru: "В опубликованных интервью художник рассказывает о живописи, театре и работе с мастерами. Эти разговоры помогают познакомиться с его взглядом на искусство.",
    uz: "Eʼlon qilingan intervyularda rassom rangtasvir, teatr va ustalar bilan ishlash haqida soʻzlaydi. Bu suhbatlar uning sanʼatga qarashi bilan tanishtiradi.",
    en: "In published interviews, the artist talks about painting, theatre and working with craftspeople. These conversations offer an introduction to his perspective on art.",
  },
  biography: {
    ru: "Биография в архиве художника",
    uz: "Rassom arxividagi tarjimai hol",
    en: "Biography in the artist’s archive",
  },
  collectionHeading: {
    ru: "От живописи\nк предмету",
    uz: "Rangtasvirdan\nbuyumgacha",
    en: "From painting\nto object",
  },
  collectionBody: {
    ru: "В основе предметной коллекции лежат произведения Бабура Исмаилова. У каждой вещи будет своя связь с картиной: через образ, цвет или деталь.",
    uz: "Buyumlar kolleksiyasining asosida Bobur Ismoilov asarlari yotadi. Har bir buyum tasvir, rang yoki detal orqali kartina bilan oʻziga xos aloqaga ega boʻladi.",
    en: "The collection begins with Babur Ismailov’s paintings. Each object will have its own connection to a work through an image, a colour or a detail.",
  },
  aboutCollection: {
    ru: "О предметной коллекции",
    uz: "Buyumlar kolleksiyasi haqida",
    en: "About the object collection",
  },
  insideSpace: { ru: "Внутри пространства", uz: "Makon ichida", en: "Inside the space" },
  programHeading: {
    ru: "Разговоры об искусстве",
    uz: "Sanʼat haqida suhbatlar",
    en: "Conversations about art",
  },
  programBody: {
    ru: "Камерные встречи, интервью и лекции входят в замысел пространства. Даты и участники будут опубликованы после подтверждения программы.",
    uz: "Samimiy uchrashuvlar, intervyular va maʼruzalar makon gʻoyasining bir qismidir. Dastur tasdiqlangach, sanalar va ishtirokchilar eʼlon qilinadi.",
    en: "Small gatherings, interviews and talks are part of the vision for the space. Dates and participants will be published once the programme is confirmed.",
  },
  readJournal: { ru: "Читать Journal", uz: "Journalni oʻqish", en: "Read the journal" },
} as const satisfies Record<string, Localized>;

function OpeningArt() {
  const { locale, t } = useLocale();
  const { openLightbox } = useShell();
  const [spacePhoto] = settings.spacePhotos;
  const spaceName = t(common.spaceName);
  const featured = getArtwork("keeping-balance");

  if (!spacePhoto) {
    return (
      <figure className="about-opening-art reveal">
        <ArtworkButton artwork={featured} eager />
        <figcaption>
          <span>{featured.title[locale]}</span>
          <span>
            {featured.year} / {artworkMedium(featured, locale)}
          </span>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="about-opening-art reveal">
      <button
        className="art-button"
        onClick={() =>
          openLightbox(
            { src: spacePhoto, title: spaceName },
            settings.spacePhotos.map((src) => ({ src, title: spaceName })),
          )
        }
        aria-label={t(messages.viewSpace)}
      >
        <img src={publicAsset(spacePhoto)} alt={spaceName} loading="eager" fetchPriority="high" />
        <span className="art-action">
          {t(common.viewWhole)}
          <ArrowIcon diagonal />
        </span>
      </button>
      <figcaption>
        <span>{spaceName}</span>
      </figcaption>
    </figure>
  );
}

export function AboutPage() {
  const { locale, t } = useLocale();
  const fruit = getArtwork("fruit");

  return (
    <>
      <section className="section about-opening">
        <div className="about-opening-copy">
          <div>
            <h1 className="expressive">{t(messages.title)}</h1>
          </div>
          <p>{t(messages.intro)}</p>
        </div>
        <OpeningArt />
        <nav className="about-index" aria-label={t(messages.onThisPage)}>
          <a href="#about-idea">{t(messages.indexIdea)}</a>
          <a href="#artist">{t(messages.indexArtist)}</a>
          <a href="#about-collection">{t(messages.indexCollection)}</a>
          <a href="#program">{t(messages.indexProgram)}</a>
        </nav>
      </section>
      <section className="section about-idea" id="about-idea" data-chapter={t(messages.ideaChapter)}>
        <div className="about-columns reveal">
          <h2 className="expressive">
            <TitleLines>{t(messages.philosophyHeading)}</TitleLines>
          </h2>
          <div>
            <p className="lead">{t(messages.philosophyBody)}</p>
            <p>{t(messages.philosophySecondary)}</p>
          </div>
        </div>
      </section>
      <section className="artist-section section" id="artist" data-chapter={t(common.artistName)}>
        <img
          src={publicAsset(ARTIST_PORTRAIT.path)}
          alt={t(common.artistName)}
          width={ARTIST_PORTRAIT.width}
          height={ARTIST_PORTRAIT.height}
          loading="lazy"
          className="reveal"
        />
        <div className="reveal">
          <h2 className="expressive">
            <TitleLines>{t(common.artistName)}</TitleLines>
          </h2>
          <p>{t(messages.artistBio)}</p>
          <p>{t(messages.artistInterviews)}</p>
          <a href={ARTIST_BIOGRAPHY} target="_blank" rel="noopener noreferrer" className="action-link">
            {t(messages.biography)}
            <ArrowIcon diagonal />
          </a>
        </div>
      </section>
      <section
        className="section about-collection"
        id="about-collection"
        data-chapter={t(messages.indexCollection)}
      >
        <figure className="reveal">
          <ArtworkButton artwork={fruit} />
          <figcaption>
            {fruit.title[locale]}, {fruit.year}
          </figcaption>
        </figure>
        <div className="reveal">
          <h2 className="expressive">
            <TitleLines>{t(messages.collectionHeading)}</TitleLines>
          </h2>
          <p>{t(messages.collectionBody)}</p>
          <SiteLink to="catalog" className="action-link">
            {t(messages.aboutCollection)}
            <ArrowIcon />
          </SiteLink>
        </div>
      </section>
      {settings.spacePhotos.length > 1 && (
        <section className="section about-gallery">
          <div className="reveal">
            <h2>{t(messages.insideSpace)}</h2>
          </div>
          <SpaceGallery skip={1} />
        </section>
      )}
      <section className="program-section section" id="program" data-chapter={t(common.program)}>
        <div className="program-content">
          <h2 className="expressive reveal">{t(messages.programHeading)}</h2>
          <div className="reveal">
            <p className="lead">{t(messages.programBody)}</p>
            <SiteLink to="journal" className="action-link">
              {t(messages.readJournal)}
              <ArrowIcon />
            </SiteLink>
          </div>
        </div>
      </section>
      <VisitSection showGallery={false} />
    </>
  );
}
