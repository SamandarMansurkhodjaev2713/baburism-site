import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { artworkDimensions, artworkMedium, getArtwork } from "~/shared/content/artworks";
import { isCompactViewport, lockBodyScroll, scrollBehavior, trapFocus } from "~/shared/dom";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { ViewerIcon } from "~/shared/ui/icons";
import { ExplorerPane, type ExplorerWork } from "./explorer-pane";
import { WHOLE, type ArtworkView } from "./geometry";
import { ARTWORK_DETAILS, explorerMessages } from "./messages";

const HEADER_CLEARANCE = 80;
const BOTTOM_CLEARANCE = 100;
const SCROLL_OFFSET = 84;
const WHOLE_THRESHOLD = 1.05;

/** On phones, choosing a detail brings the viewer back into view if it has scrolled away. */
function revealViewerOnPhone() {
  if (!isCompactViewport()) return;
  const toolbar = document.querySelector<HTMLElement>("#story .explorer-toolbar");
  if (!toolbar) return;
  const bounds = toolbar.getBoundingClientRect();
  if (bounds.top < HEADER_CLEARANCE || bounds.bottom > window.innerHeight - BOTTOM_CLEARANCE) {
    window.scrollTo({ top: bounds.top + window.scrollY - SCROLL_OFFSET, behavior: scrollBehavior() });
  }
}

/** "From whole to detail": a guided look at Samarkand Darboza with free zoom and a full-screen room. */
export function ArtworkExplorer({ collectionLink }: { collectionLink: ReactNode }) {
  const { locale, t } = useLocale();
  const artwork = getArtwork("samarkand-darboza");
  const [view, setView] = useState<ArtworkView>(WHOLE);
  const [selected, setSelected] = useState<number | null>(null);
  const [room, setRoom] = useState(false);
  const [imageRevision, setImageRevision] = useState(0);
  const roomRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const work: ExplorerWork = {
    src: artwork.image.path,
    title: artwork.title[locale],
    image: { width: artwork.image.width, height: artwork.image.height },
  };
  const medium = artworkMedium(artwork, locale);

  const freeView = useCallback((next: ArtworkView) => {
    setView(next);
    setSelected(null);
  }, []);

  const chooseDetail = (index: number) => {
    const detail = ARTWORK_DETAILS[index];
    if (!detail) return;
    setSelected(index);
    setView({ zoom: detail.zoom, cx: detail.x, cy: detail.y });
    if (!room) revealViewerOnPhone();
  };

  // The room is modal: the page behind it is inert and focus stays inside.
  useEffect(() => {
    if (!room) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockBodyScroll();
    const app = document.querySelector<HTMLElement>(".baburism");
    const wasInert = app?.inert ?? false;
    if (app) app.inert = true;
    const frame = requestAnimationFrame(() =>
      roomRef.current?.querySelector<HTMLButtonElement>(".explorer-room-close")?.focus(),
    );
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setRoom(false);
        return;
      }
      trapFocus(event, roomRef.current);
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keyDown);
      unlock();
      if (app) app.inert = wasInert;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [room]);

  const readings = [
    { title: t(explorerMessages.wholeTitle), body: t(explorerMessages.wholeBody) },
    { title: t(explorerMessages.freeTitle), body: t(explorerMessages.freeBody) },
    ...ARTWORK_DETAILS.map((detail) => ({ title: t(detail.title), body: t(detail.body) })),
  ];
  const readingIndex = selected === null ? (view.zoom < WHOLE_THRESHOLD ? 0 : 1) : selected + 2;
  const reading = readings[readingIndex] ?? readings[0]!;

  const pane = (expanded: boolean) => (
    <ExplorerPane
      work={work}
      view={view}
      onView={freeView}
      room={expanded}
      onExpand={() => setRoom(true)}
      imageRevision={imageRevision}
      onRetry={() => setImageRevision((revision) => revision + 1)}
    />
  );

  return (
    <section
      className="art-explorer section"
      id="story"
      aria-labelledby={headingId}
      data-chapter={t(explorerMessages.heading)}
    >
      <div className="explorer-heading">
        <h2 id={headingId}>{t(explorerMessages.heading)}</h2>
        <p>{t(explorerMessages.lead)}</p>
      </div>
      <div className="explorer-layout">
        <figure className="explorer-figure">
          {pane(false)}
          <figcaption>
            <span>
              {work.title}, {artwork.year}
            </span>
            <span>
              {medium} · {artworkDimensions(artwork, locale)}
            </span>
          </figcaption>
        </figure>
        <aside className="explorer-reading">
          <div className="explorer-reading-copy">
            <div className="explorer-current-reading" key={reading.title} aria-live="polite">
              <h3>{reading.title}</h3>
              <p>{reading.body}</p>
            </div>
            {/* Every reading is laid out invisibly so the panel keeps the height of the longest one. */}
            {readings.map((item, index) => (
              <div className="explorer-reading-reserve" aria-hidden="true" key={index}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="explorer-details" role="group" aria-label={t(explorerMessages.details)}>
            {ARTWORK_DETAILS.map((detail, index) => (
              <button key={index} aria-pressed={selected === index} onClick={() => chooseDetail(index)}>
                <span className="explorer-detail-image">
                  <img
                    key={imageRevision}
                    src={publicAsset(work.src)}
                    alt=""
                    loading="eager"
                    style={{
                      width: `${detail.zoom * 100}%`,
                      transform: `translate(${-detail.x * 100}%,${-detail.y * 100}%)`,
                    }}
                  />
                </span>
                <span className="explorer-detail-title">{t(detail.title)}</span>
                <ViewerIcon name="arrow" />
              </button>
            ))}
          </div>
          <p className="explorer-interpretation">{t(explorerMessages.interpretation)}</p>
        </aside>
      </div>
      <div className="explorer-continuation">
        <h3>{t(explorerMessages.continuationTitle)}</h3>
        <div>
          <p>{t(explorerMessages.continuationBody)}</p>
          {collectionLink}
        </div>
      </div>
      {room &&
        createPortal(
          <div
            className="explorer-room"
            ref={roomRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${headingId}-room`}
          >
            <header>
              <div>
                <h2 id={`${headingId}-room`}>{work.title}</h2>
                <p>
                  {artwork.year} · {medium}
                </p>
              </div>
              <button
                className="explorer-room-close"
                onClick={() => setRoom(false)}
                aria-label={t(explorerMessages.closeRoom)}
              >
                <ViewerIcon name="close" />
              </button>
            </header>
            {pane(true)}
            <nav className="explorer-room-details" aria-label={t(explorerMessages.roomDetails)}>
              {ARTWORK_DETAILS.map((detail, index) => (
                <button key={index} aria-pressed={selected === index} onClick={() => chooseDetail(index)}>
                  {t(detail.title)}
                </button>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </section>
  );
}
