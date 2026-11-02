import type { Locale, Localized } from "../i18n/locale";

/**
 * Paintings reproduced on the site, in the order of the artist's portfolio (the lightbox browses in this order). Images are unmodified files from the artist's
 * public portfolio (baburism.uz); `image` describes the reproduction file, `canvas` the painting itself.
 * This module has no framework imports because the build config reads it too.
 */
export type ArtworkMedium = "oil" | "acrylic";

export type Artwork = {
  slug: string;
  title: Localized;
  year: number;
  /** Canvas size in centimetres: height × width. */
  canvas: readonly [number, number];
  medium: ArtworkMedium;
  image: { path: string; width: number; height: number };
  sourcePage: string;
};

export const ARTWORKS = [
  {
    slug: "samarkand-darboza",
    title: { ru: "Самарканд Дарбоза", uz: "Samarqand Darvoza", en: "Samarkand Darboza" },
    year: 2009,
    canvas: [100, 200],
    medium: "oil",
    image: { path: "art/samarkand-darboza.jpg", width: 1280, height: 648 },
    sourcePage: "https://en.baburism.uz/paintings",
  },
  {
    slug: "duality",
    title: { ru: "Дуальность", uz: "Ikkiyoqlamalik", en: "Duality" },
    year: 2009,
    canvas: [90, 90],
    medium: "oil",
    image: { path: "art/duality.jpg", width: 1002, height: 991 },
    sourcePage: "https://en.baburism.uz/paintings-1",
  },
  {
    slug: "pomegranate-feast",
    title: { ru: "Гранатовое застолье", uz: "Anor bazmi", en: "Pomegranate feast" },
    year: 2004,
    canvas: [90, 120],
    medium: "oil",
    image: { path: "art/pomegranate-feast.jpg", width: 1020, height: 866 },
    sourcePage: "https://en.baburism.uz/paintings-1",
  },
  {
    slug: "duval",
    title: { ru: "Дувал", uz: "Devor", en: "Duval" },
    year: 2002,
    canvas: [80, 110],
    medium: "oil",
    image: { path: "art/duval.jpg", width: 1000, height: 614 },
    sourcePage: "https://en.baburism.uz/paintings",
  },
  {
    slug: "chess",
    title: { ru: "Шахматы", uz: "Shaxmat", en: "Chess" },
    year: 2003,
    canvas: [45, 100],
    medium: "oil",
    image: { path: "art/chess.jpg", width: 1280, height: 490 },
    sourcePage: "https://en.baburism.uz/paintings-5",
  },
  {
    slug: "keeping-balance",
    title: { ru: "Сохраняя равновесие", uz: "Muvozanatni saqlash", en: "Keeping balance" },
    year: 2008,
    canvas: [85, 150],
    medium: "oil",
    image: { path: "art/keeping-balance.jpg", width: 1280, height: 598 },
    sourcePage: "https://en.baburism.uz/paintings-5",
  },
  {
    slug: "black-river",
    title: { ru: "Чёрная река", uz: "Qora daryo", en: "Black river" },
    year: 2012,
    canvas: [100, 100],
    medium: "acrylic",
    image: { path: "art/black-river.jpg", width: 770, height: 769 },
    sourcePage: "https://en.baburism.uz/paintings-1",
  },
  {
    slug: "fruit",
    title: { ru: "Плод", uz: "Meva", en: "Fruit" },
    year: 2005,
    canvas: [90, 130],
    medium: "oil",
    image: { path: "art/fruit.jpg", width: 1020, height: 629 },
    sourcePage: "https://en.baburism.uz/paintings",
  },
] as const satisfies readonly Artwork[];

export type ArtworkSlug = (typeof ARTWORKS)[number]["slug"];

export const ARTWORK_SLUGS: readonly string[] = ARTWORKS.map((artwork) => artwork.slug);

export const ARTIST_PORTRAIT = { path: "art/babur-portrait.jpg", width: 640, height: 470 } as const;

const MEDIUM_NAMES: Record<ArtworkMedium, Localized> = {
  oil: { ru: "Холст, масло", uz: "Mato, moyboʻyoq", en: "Oil on canvas" },
  acrylic: { ru: "Холст, акрил", uz: "Mato, akril", en: "Acrylic on canvas" },
};

const CENTIMETRES: Localized = { ru: "см", uz: "cm", en: "cm" };

export function isArtworkSlug(value: string): value is ArtworkSlug {
  return ARTWORK_SLUGS.includes(value);
}

export function findArtwork(slug: string): Artwork | undefined {
  return ARTWORKS.find((artwork) => artwork.slug === slug);
}

export function getArtwork(slug: ArtworkSlug): Artwork {
  const artwork = findArtwork(slug);
  if (!artwork) throw new Error(`Unknown artwork "${slug}".`);
  return artwork;
}

export function artworkMedium(artwork: Artwork, locale: Locale): string {
  return MEDIUM_NAMES[artwork.medium][locale];
}

export function artworkDimensions(artwork: Artwork, locale: Locale): string {
  const [height, width] = artwork.canvas;
  return `${height} × ${width} ${CENTIMETRES[locale]}`;
}
