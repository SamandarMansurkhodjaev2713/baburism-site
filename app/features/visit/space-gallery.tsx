import { settings } from "~/shared/content";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { useShell } from "../layout/shell-context";

/** Photos of the space from settings; `skip` leaves out photos already shown above. */
export function SpaceGallery({ skip = 0 }: { skip?: number }) {
  const { t } = useLocale();
  const { openLightbox } = useShell();
  const title = t(common.spaceName);
  const gallery = settings.spacePhotos.map((src) => ({ src, title }));
  const photos = gallery.slice(skip);
  if (!photos.length) return null;

  return (
    <div className="space-gallery">
      {photos.map((photo, index) => (
        <button
          key={`${photo.src}-${index}`}
          onClick={() => openLightbox(photo, gallery)}
          aria-label={t(common.viewSpacePhoto)}
        >
          <img src={publicAsset(photo.src)} loading="lazy" alt={title} />
        </button>
      ))}
    </div>
  );
}
