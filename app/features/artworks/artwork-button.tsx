import type { Artwork } from "~/shared/content/artworks";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";
import { useShell } from "../layout/shell-context";
import { artworkGallery, artworkImage } from "./artwork-gallery";

type ArtworkButtonProps = { artwork: Artwork; eager?: boolean };

/** A painting that opens in the lightbox; a "View artwork" label follows the mouse over it. */
export function ArtworkButton({ artwork, eager = false }: ArtworkButtonProps) {
  const { locale, t } = useLocale();
  const { openLightbox, showArtCursor, hideArtCursor } = useShell();
  const title = artwork.title[locale];

  return (
    <button
      className="art-button"
      aria-label={`${t(common.viewWork)}: ${title}`}
      onClick={() => openLightbox(artworkImage(artwork, locale), artworkGallery(locale))}
      onPointerMove={showArtCursor}
      onPointerLeave={hideArtCursor}
    >
      <img
        src={publicAsset(artwork.image.path)}
        width={artwork.image.width}
        height={artwork.image.height}
        alt={title}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
      <span className="art-action">
        {t(common.viewWork)}
        <ArrowIcon diagonal />
      </span>
    </button>
  );
}
