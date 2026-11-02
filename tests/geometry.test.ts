import { describe, expect, it } from "vitest";
import {
  artworkGeometry,
  boundArtworkView,
  MAX_ZOOM,
  panArtwork,
  WHOLE,
  zoomArtwork,
} from "~/features/explorer/geometry";
import { ribbonPhase } from "~/features/ribbon/phase";

const image = { width: 1280, height: 648 };
const port = { width: 640, height: 400 };

describe("artworkGeometry", () => {
  it("fits the whole image inside the viewport with a margin and centres it", () => {
    const g = artworkGeometry(WHOLE, port, image);
    expect(g.baseWidth).toBeLessThanOrEqual(port.width - 24);
    expect(g.baseHeight).toBeLessThanOrEqual(port.height - 24);
    expect(g.baseWidth / g.baseHeight).toBeCloseTo(image.width / image.height, 6);
    expect(g.x).toBeCloseTo((port.width - g.scaledWidth) / 2, 6);
    expect(g.y).toBeCloseTo((port.height - g.scaledHeight) / 2, 6);
  });

  it("never lets a zoomed image leave a gap at the viewport edges", () => {
    const g = artworkGeometry({ zoom: 3, cx: 0.99, cy: 0.99 }, port, image);
    expect(g.x).toBeGreaterThanOrEqual(port.width - g.scaledWidth);
    expect(g.x).toBeLessThanOrEqual(0);
    expect(g.y).toBeGreaterThanOrEqual(port.height - g.scaledHeight);
    expect(g.y).toBeLessThanOrEqual(0);
  });
});

describe("boundArtworkView", () => {
  it("clamps zoom and keeps the centre within reachable bounds", () => {
    expect(boundArtworkView({ zoom: 9, cx: 2, cy: -1 }, port, image).zoom).toBe(MAX_ZOOM);
    expect(boundArtworkView({ zoom: 0.1, cx: 0.5, cy: 0.5 }, port, image).zoom).toBe(1);
    const view = boundArtworkView({ zoom: 3, cx: 2, cy: -1 }, port, image);
    expect(view.cx).toBeLessThan(1);
    expect(view.cy).toBeGreaterThan(0);
  });
});

describe("zoomArtwork", () => {
  it("keeps the image point under the pivot fixed", () => {
    const pivot = { x: 400, y: 150 };
    const before = artworkGeometry(WHOLE, port, image);
    const imageX = (pivot.x - before.x) / before.scaledWidth;
    const imageY = (pivot.y - before.y) / before.scaledHeight;
    const zoomed = zoomArtwork(WHOLE, 2, pivot, port, image);
    const after = artworkGeometry(zoomed, port, image);
    expect(after.x + imageX * after.scaledWidth).toBeCloseTo(pivot.x, 4);
    expect(after.y + imageY * after.scaledHeight).toBeCloseTo(pivot.y, 4);
  });

  it("never exceeds the maximum zoom", () => {
    expect(zoomArtwork(WHOLE, 50, { x: 320, y: 200 }, port, image).zoom).toBe(MAX_ZOOM);
  });
});

describe("panArtwork", () => {
  it("moves the visible area opposite to the drag and stays in bounds", () => {
    const zoomed = { zoom: 2, cx: 0.5, cy: 0.5 };
    const moved = panArtwork(zoomed, -100, 0, port, image);
    expect(moved.cx).toBeGreaterThan(zoomed.cx);
    const far = panArtwork(zoomed, -1e6, 1e6, port, image);
    expect(far.cx).toBeLessThanOrEqual(1);
    expect(far.cy).toBeGreaterThanOrEqual(0);
  });
});

describe("ribbonPhase", () => {
  it("wraps positions into one period", () => {
    expect(ribbonPhase(10, 100)).toBe(10);
    expect(ribbonPhase(110, 100)).toBe(10);
    expect(ribbonPhase(-10, 100)).toBe(90);
    expect(ribbonPhase(0, 100)).toBe(0);
  });

  it("is safe for invalid input", () => {
    expect(ribbonPhase(Number.NaN, 100)).toBe(0);
    expect(ribbonPhase(10, 0)).toBe(0);
    expect(ribbonPhase(10, Number.POSITIVE_INFINITY)).toBe(0);
  });
});
