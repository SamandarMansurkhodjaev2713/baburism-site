import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLocale } from "~/shared/i18n/locale-context";
import { clamp } from "~/shared/math";
import { publicAsset } from "~/shared/routing/urls";
import { ViewerIcon } from "~/shared/ui/icons";
import {
  artworkGeometry,
  boundArtworkView,
  MAX_ZOOM,
  panArtwork,
  WHOLE,
  zoomArtwork,
  type ArtworkView,
  type ImageSize,
  type Point,
  type Viewport,
} from "./geometry";
import { explorerMessages } from "./messages";

const ZOOM_STEP = 0.5;
const KEY_PAN = 55;
const WHEEL_SENSITIVITY = 0.003;
const DOUBLE_TAP_MS = 300;
const TAP_TRAVEL = 6;
/** Browsers fire `dblclick` after a double tap; ignore it when touch already handled the zoom. */
const TOUCH_DBLCLICK_GUARD_MS = 600;
const ZOOMED = 1.001;
const MINIMAP_ZOOM = 1.05;

const PAN_KEYS: Record<string, [number, number]> = {
  ArrowLeft: [KEY_PAN, 0],
  ArrowRight: [-KEY_PAN, 0],
  ArrowUp: [0, KEY_PAN],
  ArrowDown: [0, -KEY_PAN],
};

type Pinch = { distance: number; mid: Point; view: ArtworkView };

export type ExplorerWork = { src: string; title: string; image: ImageSize };

type ExplorerPaneProps = {
  work: ExplorerWork;
  view: ArtworkView;
  onView: (view: ArtworkView) => void;
  /** The large full-screen viewer, where dragging is always on and pinch is the main gesture. */
  room: boolean;
  onExpand?: () => void;
  /** Incremented to reload the image after a failure. */
  imageRevision: number;
  onRetry: () => void;
};

/** A zoomable, pannable view of one artwork with toolbar, keyboard, mouse, touch and minimap control. */
export function ExplorerPane({
  work,
  view,
  onView,
  room,
  onExpand,
  imageRevision,
  onRetry,
}: ExplorerPaneProps) {
  const { t } = useLocale();
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [port, setPort] = useState<Viewport>({ width: 640, height: 400 });
  const [measured, setMeasured] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const hintId = useId();

  // Gestures fire faster than React re-renders, so they read and write the newest view here.
  const latest = useRef(view);
  useLayoutEffect(() => {
    latest.current = view;
  }, [view]);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<Pinch | null>(null);
  const travel = useRef(0);
  const lastTap = useRef(0);
  const lastTouch = useRef(0);
  const minimapPointer = useRef<number | null>(null);

  const commit = (next: ArtworkView) => {
    latest.current = next;
    onView(next);
  };
  const center = { x: port.width / 2, y: port.height / 2 };
  const zoomTo = (zoom: number, pivot: Point = center) =>
    commit(zoomArtwork(latest.current, zoom, pivot, port, work.image));
  const geometry = artworkGeometry(view, port, work.image);
  const ready = loaded && !failed;

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const resize = () => {
      setPort({ width: element.clientWidth, height: element.clientHeight });
      setMeasured(true);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Ctrl/⌘ + wheel zooms; a plain wheel keeps scrolling the page.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      const next = zoomArtwork(
        latest.current,
        latest.current.zoom * Math.exp(-event.deltaY * WHEEL_SENSITIVITY),
        { x: event.clientX - bounds.left, y: event.clientY - bounds.top },
        port,
        work.image,
      );
      latest.current = next;
      onView(next);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [onView, port, work.image]);

  const pointFrom = (event: { clientX: number; clientY: number }): Point => {
    const bounds = stage.current?.getBoundingClientRect();
    return { x: event.clientX - (bounds?.left ?? 0), y: event.clientY - (bounds?.top ?? 0) };
  };

  const startPinch = () => {
    const [a, b] = [...pointers.current.values()];
    if (!a || !b) return;
    pinch.current = {
      distance: Math.hypot(a.x - b.x, a.y - b.y),
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      view: latest.current,
    };
  };

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !ready) return;
    if (event.pointerType === "touch") lastTouch.current = performance.now();
    pointers.current.set(event.pointerId, pointFrom(event));
    travel.current = 0;
    if (room || latest.current.zoom > ZOOMED || pointers.current.size > 1) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (pointers.current.size === 2) startPinch();
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const before = pointers.current.get(event.pointerId);
    if (!before) return;
    const point = pointFrom(event);
    pointers.current.set(event.pointerId, point);
    travel.current += Math.hypot(point.x - before.x, point.y - before.y);
    const [a, b] = [...pointers.current.values()];
    if (pointers.current.size === 2 && pinch.current && a && b) {
      const start = pinch.current;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const zoom = (start.view.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, start.distance);
      const zoomed = zoomArtwork(start.view, zoom, start.mid, port, work.image);
      commit(panArtwork(zoomed, mid.x - start.mid.x, mid.y - start.mid.y, port, work.image));
    } else if (latest.current.zoom > ZOOMED) {
      commit(panArtwork(latest.current, point.x - before.x, point.y - before.y, port, work.image));
    }
  };

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const isTap =
      event.pointerType === "touch" &&
      event.type === "pointerup" &&
      pointers.current.size === 1 &&
      travel.current < TAP_TRAVEL;
    if (isTap) {
      const now = performance.now();
      if (now - lastTap.current < DOUBLE_TAP_MS) {
        zoomTo(latest.current.zoom < 1.2 ? 2 : 1, pointFrom(event));
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    if (!pointers.current.size) setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const keyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const pan = PAN_KEYS[event.key];
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomTo(view.zoom + ZOOM_STEP);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomTo(view.zoom - ZOOM_STEP);
    } else if (event.key === "0" || event.key === "Home") {
      event.preventDefault();
      commit(WHOLE);
    } else if (pan && view.zoom > 1) {
      event.preventDefault();
      commit(panArtwork(view, pan[0], pan[1], port, work.image));
    }
  };

  const moveToMinimapPoint = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    commit(
      boundArtworkView(
        {
          ...latest.current,
          cx: (event.clientX - bounds.left) / bounds.width,
          cy: (event.clientY - bounds.top) / bounds.height,
        },
        port,
        work.image,
      ),
    );
  };

  const visibleArea = {
    left: clamp(-geometry.x / geometry.scaledWidth, 0, 1) * 100,
    top: clamp(-geometry.y / geometry.scaledHeight, 0, 1) * 100,
    right: clamp((port.width - geometry.x) / geometry.scaledWidth, 0, 1) * 100,
    bottom: clamp((port.height - geometry.y) / geometry.scaledHeight, 0, 1) * 100,
  };

  return (
    <div className={"explorer-pane" + (room ? " explorer-pane-room" : "")}>
      <div className="explorer-toolbar" role="group" aria-label={t(explorerMessages.controls)}>
        <button
          className="explorer-fit"
          onClick={() => commit(WHOLE)}
          aria-label={t(explorerMessages.showWhole)}
        >
          <ViewerIcon name="fit" />
          <span>{t(explorerMessages.fit)}</span>
        </button>
        <div className="explorer-zoom">
          <button
            disabled={!loaded || view.zoom <= ZOOMED}
            onClick={() => zoomTo(view.zoom - ZOOM_STEP)}
            aria-label={t(explorerMessages.zoomOut)}
          >
            <ViewerIcon name="minus" />
          </button>
          <output aria-live="polite" aria-label={t(explorerMessages.zoom)}>
            {Math.round(view.zoom * 100)}%
          </output>
          <button
            disabled={!loaded || view.zoom >= MAX_ZOOM - 0.001}
            onClick={() => zoomTo(view.zoom + ZOOM_STEP)}
            aria-label={t(explorerMessages.zoomIn)}
          >
            <ViewerIcon name="plus" />
          </button>
        </div>
        {!room && (
          <button className="explorer-expand" onClick={onExpand} aria-label={t(explorerMessages.openRoom)}>
            <ViewerIcon name="expand" />
          </button>
        )}
      </div>
      <div
        className={
          "explorer-stage" +
          (view.zoom > ZOOMED ? " is-zoomed" : "") +
          (dragging ? " is-dragging" : "") +
          (room ? " is-room" : "")
        }
        ref={stage}
        tabIndex={ready ? 0 : -1}
        role="group"
        aria-label={t(explorerMessages.stage)}
        aria-describedby={hintId}
        onKeyDown={keyDown}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onLostPointerCapture={(event) => {
          pointers.current.delete(event.pointerId);
          if (pointers.current.size) return;
          pinch.current = null;
          setDragging(false);
        }}
        onDoubleClick={(event) => {
          event.preventDefault();
          const onArtwork = event.target === stage.current || event.target === image.current;
          if (performance.now() - lastTouch.current > TOUCH_DBLCLICK_GUARD_MS && onArtwork) {
            zoomTo(view.zoom < 1.2 ? 2 : 1, pointFrom(event));
          }
        }}
      >
        <img
          key={imageRevision}
          ref={(node) => {
            image.current = node;
            // A cached image can finish loading before React attaches `onLoad`.
            if (node?.complete && node.naturalWidth) setLoaded(true);
          }}
          src={publicAsset(work.src)}
          width={work.image.width}
          height={work.image.height}
          alt={work.title}
          loading={room ? "eager" : "lazy"}
          draggable="false"
          className={"explorer-art" + (loaded ? " is-ready" : "")}
          style={
            measured
              ? {
                  left: 0,
                  top: 0,
                  width: geometry.baseWidth,
                  height: geometry.baseHeight,
                  transform: `translate3d(${geometry.x}px,${geometry.y}px,0) scale(${view.zoom})`,
                }
              : undefined
          }
          onLoad={() => {
            setLoaded(true);
            setFailed(false);
          }}
          onError={() => setFailed(true)}
        />
        {measured && !loaded && !failed && (
          <p className="explorer-loading" role="status">
            {t(explorerMessages.loading)}
          </p>
        )}
        {failed && (
          <div className="explorer-error" role="alert">
            <p>{t(explorerMessages.failed)}</p>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => {
                setFailed(false);
                setLoaded(false);
                onRetry();
              }}
            >
              {t(explorerMessages.retry)}
            </button>
          </div>
        )}
        {ready && view.zoom > MINIMAP_ZOOM && (
          <button
            className="explorer-map"
            aria-label={t(explorerMessages.minimap)}
            onPointerDown={(event) => {
              event.stopPropagation();
              minimapPointer.current = event.pointerId;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
              moveToMinimapPoint(event);
            }}
            onPointerMove={(event) => {
              event.stopPropagation();
              if (minimapPointer.current === event.pointerId) moveToMinimapPoint(event);
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              minimapPointer.current = null;
              setDragging(false);
            }}
            onPointerCancel={() => {
              minimapPointer.current = null;
              setDragging(false);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              commit({ ...view, cx: 0.5, cy: 0.5 });
            }}
          >
            <img src={publicAsset(work.src)} alt="" draggable="false" />
            <span
              style={{
                left: `${visibleArea.left}%`,
                top: `${visibleArea.top}%`,
                width: `${visibleArea.right - visibleArea.left}%`,
                height: `${visibleArea.bottom - visibleArea.top}%`,
              }}
            />
          </button>
        )}
      </div>
      <p className="explorer-hint" id={hintId}>
        <span className="explorer-hint-pointer">{t(explorerMessages.pointerHint)}</span>
        <span className="explorer-hint-touch">
          {t(room ? explorerMessages.touchRoomHint : explorerMessages.touchHint)}
        </span>
      </p>
    </div>
  );
}
