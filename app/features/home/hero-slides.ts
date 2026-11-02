import { getArtwork, type ArtworkSlug } from "~/shared/content/artworks";
import type { Locale } from "~/shared/i18n/locale";

/**
 * The hero slideshow. Desktop shows the whole painting in a frame; phones show a crop,
 * so each scene can use a different painting and focal point per layout.
 */
const SCENES: ReadonlyArray<{
  desktop: ArtworkSlug;
  mobile: ArtworkSlug;
  position: string;
  mobilePosition: string;
}> = [
  { desktop: "duval", mobile: "duality", position: "50% 42%", mobilePosition: "24% 38%" },
  { desktop: "keeping-balance", mobile: "keeping-balance", position: "50% 48%", mobilePosition: "50% 40%" },
  { desktop: "chess", mobile: "pomegranate-feast", position: "50% 42%", mobilePosition: "50% 36%" },
  { desktop: "fruit", mobile: "fruit", position: "50% 42%", mobilePosition: "43% 36%" },
  { desktop: "samarkand-darboza", mobile: "black-river", position: "52% 46%", mobilePosition: "50% 36%" },
  { desktop: "duality", mobile: "duval", position: "50% 35%", mobilePosition: "28% 25%" },
];

export type HeroSlide = {
  id: string;
  position: string;
  mobilePosition: string;
  desktop: { src: string; width: number; height: number; caption: string };
  mobile: { src: string; width: number; height: number; caption: string };
};

function variant(slug: ArtworkSlug, locale: Locale) {
  const artwork = getArtwork(slug);
  return {
    src: artwork.image.path,
    width: artwork.image.width,
    height: artwork.image.height,
    caption: `${artwork.title[locale]}, ${artwork.year}`,
  };
}

export function heroSlides(locale: Locale): HeroSlide[] {
  return SCENES.map((scene) => ({
    id: scene.desktop,
    position: scene.position,
    mobilePosition: scene.mobilePosition,
    desktop: variant(scene.desktop, locale),
    mobile: variant(scene.mobile, locale),
  }));
}
