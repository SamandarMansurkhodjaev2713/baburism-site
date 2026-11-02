import { clamp } from "~/shared/math";

/**
 * Pure geometry for the zoomable artwork viewer. A view is a zoom level and the
 * point of the image (0–1 on each axis) that sits at the centre of the viewport.
 */
export type ArtworkView = { zoom: number; cx: number; cy: number };
export type Viewport = { width: number; height: number };
export type Point = { x: number; y: number };
export type ImageSize = { width: number; height: number };

export const WHOLE: ArtworkView = { zoom: 1, cx: 0.5, cy: 0.5 };
export const MAX_ZOOM = 3;
/** Breathing room around the fitted image, in CSS pixels per side. */
const FIT_INSET = 12;

export function artworkGeometry(view: ArtworkView, port: Viewport, image: ImageSize) {
  const width = Math.max(1, port.width);
  const height = Math.max(1, port.height);
  const fit = Math.max(
    0.001,
    Math.min((width - FIT_INSET * 2) / image.width, (height - FIT_INSET * 2) / image.height),
  );
  const baseWidth = image.width * fit;
  const baseHeight = image.height * fit;
  const scaledWidth = baseWidth * view.zoom;
  const scaledHeight = baseHeight * view.zoom;
  return {
    baseWidth,
    baseHeight,
    scaledWidth,
    scaledHeight,
    x:
      scaledWidth <= width
        ? (width - scaledWidth) / 2
        : clamp(width / 2 - scaledWidth * view.cx, width - scaledWidth, 0),
    y:
      scaledHeight <= height
        ? (height - scaledHeight) / 2
        : clamp(height / 2 - scaledHeight * view.cy, height - scaledHeight, 0),
  };
}

/** Keeps the zoom within limits and the image edges from leaving the viewport. */
export function boundArtworkView(view: ArtworkView, port: Viewport, image: ImageSize): ArtworkView {
  const zoom = clamp(view.zoom, 1, MAX_ZOOM);
  const geometry = artworkGeometry({ ...view, zoom }, port, image);
  const boundX = Math.min(0.5, port.width / (2 * geometry.scaledWidth));
  const boundY = Math.min(0.5, port.height / (2 * geometry.scaledHeight));
  return { zoom, cx: clamp(view.cx, boundX, 1 - boundX), cy: clamp(view.cy, boundY, 1 - boundY) };
}

/** Zooms so that the image point under `pivot` stays under it. */
export function zoomArtwork(
  view: ArtworkView,
  zoom: number,
  pivot: Point,
  port: Viewport,
  image: ImageSize,
): ArtworkView {
  const geometry = artworkGeometry(view, port, image);
  const next = clamp(zoom, 1, MAX_ZOOM);
  const imageX = (pivot.x - geometry.x) / geometry.scaledWidth;
  const imageY = (pivot.y - geometry.y) / geometry.scaledHeight;
  return boundArtworkView(
    {
      zoom: next,
      cx: (port.width / 2 - pivot.x + imageX * geometry.baseWidth * next) / (geometry.baseWidth * next),
      cy: (port.height / 2 - pivot.y + imageY * geometry.baseHeight * next) / (geometry.baseHeight * next),
    },
    port,
    image,
  );
}

/** Moves the image by a screen-space delta. */
export function panArtwork(
  view: ArtworkView,
  dx: number,
  dy: number,
  port: Viewport,
  image: ImageSize,
): ArtworkView {
  const geometry = artworkGeometry(view, port, image);
  return boundArtworkView(
    {
      ...view,
      cx: (port.width / 2 - geometry.x - dx) / geometry.scaledWidth,
      cy: (port.height / 2 - geometry.y - dy) / geometry.scaledHeight,
    },
    port,
    image,
  );
}
