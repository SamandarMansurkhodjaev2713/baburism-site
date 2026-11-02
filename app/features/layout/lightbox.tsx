import { useEffect, useRef } from "react";
import { useModalBehaviour } from "~/shared/hooks/use-modal-behaviour";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon, CloseIcon } from "~/shared/ui/icons";
import { useShell } from "./shell-context";

/** Full-screen image viewer. Arrow keys and buttons browse the gallery it was opened with. */
export function Lightbox() {
  const { t } = useLocale();
  const { lightbox, closeLightbox, moveLightbox } = useShell();
  const container = useRef<HTMLDivElement>(null);

  useModalBehaviour(lightbox !== null, container, closeLightbox);

  useEffect(() => {
    if (!lightbox) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      moveLightbox(event.key === "ArrowLeft" ? -1 : 1);
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [lightbox, moveLightbox]);

  if (!lightbox) return null;
  const { current, gallery } = lightbox;
  const position = gallery.findIndex((item) => item.src === current.src) + 1;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      ref={container}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeLightbox();
      }}
    >
      <div className="lightbox-header">
        <p>{current.title}</p>
        <button className="menu-close" onClick={closeLightbox}>
          {t(common.close)}
          <CloseIcon />
        </button>
      </div>
      <div className="lightbox-stage">
        <img src={publicAsset(current.src)} alt={current.title} />
      </div>
      <div className="lightbox-bottom">
        <p className="lightbox-caption">{t(common.artistName)}</p>
        {gallery.length > 1 && (
          <div className="lightbox-controls">
            <button onClick={() => moveLightbox(-1)} aria-label={t(common.previous)}>
              <span className="arrow-back">
                <ArrowIcon />
              </span>
            </button>
            <span aria-live="polite">
              {position} / {gallery.length}
            </span>
            <button onClick={() => moveLightbox(1)} aria-label={t(common.next)}>
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
