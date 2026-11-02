import { ARTWORKS, type Artwork } from "~/shared/content/artworks";
import type { Locale } from "~/shared/i18n/locale";
import type { LightboxImage } from "../layout/shell-context";

export function artworkImage(artwork: Artwork, locale: Locale): LightboxImage {
  return { src: artwork.image.path, title: artwork.title[locale] };
}

/** Every painting, so the lightbox can browse the whole collection from any of them. */
export function artworkGallery(locale: Locale): LightboxImage[] {
  return ARTWORKS.map((artwork) => artworkImage(artwork, locale));
}
