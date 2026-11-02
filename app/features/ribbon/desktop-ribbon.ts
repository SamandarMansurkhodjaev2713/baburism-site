import { clamp } from "~/shared/math";
import { ribbonPhase } from "./phase";

/** CSS pixels per second, independent of frame rate and display density. */
const SPEED = 24;
/** Pause after a drag or wheel gesture before autoplay resumes, in ms. */
const REST_AFTER_INPUT = 850;
const KEY_STEP = 280;
const FOCUS_INSET = 8;

type Gesture = { id: number; x: number; y: number; phase: number; moved: boolean };

/**
 * Fine-pointer ribbon: one compositor animation runs the loop, and pointer, wheel
 * and keyboard input seek that same timeline, so motion never jumps or doubles.
 * Returns a cleanup function.
 */
export function installDesktopRibbon(viewport: HTMLElement, track: HTMLElement): () => void {
  const events = new AbortController();
  const { signal } = events;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let animation: Animation | undefined;
  let period = 0;
  let duration = 0;
  let visible = false;
  let keyboard = false;
  let timer = 0;
  let resumeAt = 0;
  let suppressClick = false;
  let gesture: Gesture | null = null;

  const phase = () =>
    animation && duration ? ribbonPhase((Number(animation.currentTime ?? 0) / duration) * period, period) : 0;

  const seek = (value: number) => {
    if (animation && period) animation.currentTime = (ribbonPhase(value, period) / period) * duration;
  };

  const state = () => {
    if (reduce.matches) return "reduced";
    if (document.hidden) return "hidden";
    if (!visible) return "offscreen";
    if (gesture) return "interaction";
    if (keyboard) return "keyboard";
    if (performance.now() < resumeAt) return "settling";
    return "running";
  };

  const update = () => {
    window.clearTimeout(timer);
    const current = state();
    viewport.dataset.ribbonState = current;
    if (current === "running") animation?.play();
    else animation?.pause();
    if (current === "settling") timer = window.setTimeout(update, Math.max(1, resumeAt - performance.now()));
  };

  const measure = () => {
    if (reduce.matches) {
      animation?.cancel();
      animation = undefined;
      track.style.removeProperty("transform");
      viewport.scrollLeft = 0;
      update();
      return;
    }
    const next = track.firstElementChild?.getBoundingClientRect().width ?? 0;
    if (next <= 0) return;
    if (animation && Math.abs(next - period) < 0.1) {
      update();
      return;
    }
    const progress = period ? phase() / period : 0;
    animation?.cancel();
    period = next;
    duration = (period / SPEED) * 1000;
    animation = track.animate(
      [{ transform: `translate3d(${-period}px,0,0)` }, { transform: `translate3d(${-period * 2}px,0,0)` }],
      { duration, iterations: Infinity, easing: "linear" },
    );
    animation.pause();
    animation.currentTime = progress * duration;
    viewport.dataset.ribbonPeriod = String(period);
    update();
  };

  const rest = () => {
    resumeAt = performance.now() + REST_AFTER_INPUT;
    update();
  };

  const pointerDown = (event: PointerEvent) => {
    if (reduce.matches || !event.isPrimary || event.button !== 0) return;
    keyboard = false;
    resumeAt = 0;
    suppressClick = false;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, phase: phase(), moved: false };
    update();
  };

  const pointerMove = (event: PointerEvent) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.moved) {
      // A mostly vertical gesture belongs to page scrolling.
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        gesture = null;
        update();
        return;
      }
      if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      gesture.moved = true;
      suppressClick = true;
      viewport.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    seek(gesture.phase - dx);
  };

  const pointerUp = (event: PointerEvent) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    gesture = null;
    rest();
  };

  // A drag must not also follow the link it started on.
  const click = (event: MouseEvent) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  };

  const wheel = (event: WheelEvent) => {
    if (reduce.matches || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
    event.preventDefault();
    keyboard = false;
    animation?.pause();
    seek(phase() + (event.deltaX || event.deltaY) * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1));
    rest();
  };

  const keyDown = (event: KeyboardEvent) => {
    if (reduce.matches || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    keyboard = true;
    animation?.pause();
    viewport.focus({ preventScroll: true });
    viewport.scrollLeft = 0;
    seek(phase() + (event.key === "ArrowRight" ? KEY_STEP : -KEY_STEP));
    update();
  };

  const focusIn = (event: FocusEvent) => {
    const target = event.target;
    if (
      reduce.matches ||
      !(target instanceof HTMLElement) ||
      target === viewport ||
      !target.matches(":focus-visible")
    ) {
      return;
    }
    keyboard = true;
    animation?.pause();
    viewport.scrollLeft = 0;
    const bounds = target.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    // Focus belongs to the middle (real) copy; wrapping here would reveal a clone.
    const focusSeek = (value: number) => seek(clamp(value, 0, Math.max(0, period - viewport.clientWidth)));
    if (bounds.left < frame.left + FOCUS_INSET) focusSeek(phase() + bounds.left - frame.left - FOCUS_INSET);
    else if (bounds.right > frame.right - FOCUS_INSET)
      focusSeek(phase() + bounds.right - frame.right + FOCUS_INSET);
    update();
  };

  const focusOut = (event: FocusEvent) => {
    if (viewport.contains(event.relatedTarget as Node | null)) return;
    keyboard = false;
    resumeAt = 0;
    update();
  };

  const preferenceChange = () => {
    gesture = null;
    keyboard = false;
    viewport.scrollLeft = 0;
    measure();
  };

  const visibilityChange = () => {
    if (document.hidden) gesture = null;
    update();
  };

  const windowBlur = () => {
    gesture = null;
    update();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(track.firstElementChild ?? track);
  resize.observe(viewport);
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    },
    { threshold: 0 },
  );
  intersection.observe(viewport);

  viewport.addEventListener("pointerdown", pointerDown, { signal });
  viewport.addEventListener("pointermove", pointerMove, { signal });
  viewport.addEventListener("pointerup", pointerUp, { signal });
  viewport.addEventListener("pointercancel", pointerUp, { signal });
  viewport.addEventListener("lostpointercapture", pointerUp, { signal });
  document.addEventListener("pointerup", pointerUp, { signal });
  document.addEventListener("pointercancel", pointerUp, { signal });
  viewport.addEventListener("click", click, { capture: true, signal });
  viewport.addEventListener("wheel", wheel, { passive: false, signal });
  viewport.addEventListener("keydown", keyDown, { signal });
  viewport.addEventListener("focusin", focusIn, { signal });
  viewport.addEventListener("focusout", focusOut, { signal });
  document.addEventListener("visibilitychange", visibilityChange, { signal });
  window.addEventListener("blur", windowBlur, { signal });
  reduce.addEventListener("change", preferenceChange, { signal });
  measure();

  return () => {
    events.abort();
    window.clearTimeout(timer);
    animation?.cancel();
    resize.disconnect();
    intersection.disconnect();
  };
}
