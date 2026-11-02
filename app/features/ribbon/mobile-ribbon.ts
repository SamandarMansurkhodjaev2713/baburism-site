import { ribbonPhase } from "./phase";

/** Slower than desktop: small screens show fewer items at once. */
const SPEED = 18;
/** Quiet time after the last touch or native scroll before autoplay resumes, in ms. */
const REST_AFTER_INPUT = 2200;
const KEY_STEP = 280;

/**
 * Touch and coarse-pointer ribbon. The browser owns swiping, momentum and the choice
 * between horizontal and vertical panning: on touch the visible phase is handed to
 * native horizontal scrolling, and autoplay takes it back once scrolling settles.
 * Returns a cleanup function.
 */
export function installMobileRibbon(viewport: HTMLElement, track: HTMLElement): () => void {
  const events = new AbortController();
  const { signal } = events;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let animation: Animation | undefined;
  let period = 0;
  let duration = 0;
  let visible = false;
  let native = false;
  let touching = false;
  let keyboard = false;
  let lastInput = 0;
  let timer = 0;

  const phase = () =>
    animation && duration
      ? ribbonPhase((Number(animation.currentTime ?? 0) / duration) * period, period)
      : ribbonPhase(viewport.scrollLeft, period);

  const cancel = () => {
    animation?.cancel();
    animation = undefined;
  };

  const enterNative = () => {
    if (native) return;
    const position = period + phase();
    native = true;
    cancel();
    viewport.scrollLeft = position;
  };

  const autoplay = (progress: number) => {
    if (!period) return;
    cancel();
    duration = (period / SPEED) * 1000;
    animation = track.animate(
      [{ transform: `translate3d(${-period}px,0,0)` }, { transform: `translate3d(${-period * 2}px,0,0)` }],
      { duration, iterations: Infinity, easing: "linear" },
    );
    animation.pause();
    animation.currentTime = (ribbonPhase(progress, period) / period) * duration;
    native = false;
    viewport.scrollLeft = 0;
  };

  const state = (remaining: number) => {
    if (reduce.matches) return "reduced";
    if (document.hidden) return "hidden";
    if (!visible) return "offscreen";
    if (touching) return "native-touch";
    if (keyboard) return "keyboard";
    if (native && remaining > 0) return "native-scroll";
    return "running";
  };

  const update = () => {
    window.clearTimeout(timer);
    const remaining = REST_AFTER_INPUT - (performance.now() - lastInput);
    const current = state(remaining);
    viewport.dataset.ribbonState = current;
    viewport.dataset.ribbonMode = native ? "native" : "auto";
    if (current === "running") {
      if (native || !animation) autoplay(phase());
      animation?.play();
      viewport.dataset.ribbonMode = "auto";
    } else {
      animation?.pause();
    }
    if (current === "native-scroll") timer = window.setTimeout(update, Math.max(16, remaining));
  };

  const measure = () => {
    if (reduce.matches) {
      cancel();
      native = true;
      viewport.scrollLeft = 0;
      update();
      return;
    }
    const next = track.firstElementChild?.getBoundingClientRect().width ?? 0;
    if (!next || Math.abs(next - period) < 0.1) {
      update();
      return;
    }
    const progress = period ? phase() / period : 0;
    const scrollProgress = period ? viewport.scrollLeft / period : 1;
    period = next;
    viewport.dataset.ribbonPeriod = String(period);
    if (native) viewport.scrollLeft = scrollProgress * period;
    else autoplay(progress * period);
    update();
  };

  const startTouch = () => {
    touching = true;
    keyboard = false;
    enterNative();
    lastInput = performance.now();
    update();
  };

  const endTouch = () => {
    touching = false;
    lastInput = performance.now();
    update();
  };

  // Touch pointers end through `touchend`, which also reports remaining fingers.
  const pointerEnd = (event: PointerEvent) => {
    if (event.pointerType !== "touch") endTouch();
  };

  const touchEnd = (event: TouchEvent) => {
    if (!event.touches.length) endTouch();
  };

  const scroll = () => {
    if (!native) return;
    lastInput = performance.now();
    update();
  };

  const wheel = () => {
    keyboard = false;
    enterNative();
    lastInput = performance.now();
    update();
  };

  const focusIn = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    keyboard = true;
    enterNative();
    if (target.closest(".curated-item"))
      target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    update();
  };

  const focusOut = (event: FocusEvent) => {
    if (viewport.contains(event.relatedTarget as Node | null)) return;
    keyboard = false;
    lastInput = performance.now();
    update();
  };

  const keyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    keyboard = true;
    enterNative();
    viewport.focus({ preventScroll: true });
    const offset = event.key === "ArrowRight" ? KEY_STEP : -KEY_STEP;
    viewport.scrollLeft = reduce.matches
      ? viewport.scrollLeft + offset
      : period + ribbonPhase(viewport.scrollLeft - period + offset, period);
    update();
  };

  const preferenceChange = () => {
    cancel();
    native = true;
    keyboard = false;
    touching = false;
    viewport.scrollLeft = 0;
    measure();
  };

  const visibilityChange = () => {
    if (document.hidden) touching = false;
    update();
  };

  const windowBlur = () => {
    touching = false;
    update();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(viewport);
  resize.observe(track.firstElementChild ?? track);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    update();
  });
  intersection.observe(viewport);

  const passive = { passive: true, signal };
  viewport.addEventListener("pointerdown", startTouch, passive);
  document.addEventListener("pointerup", pointerEnd, passive);
  document.addEventListener("pointercancel", pointerEnd, passive);
  viewport.addEventListener("touchstart", startTouch, passive);
  document.addEventListener("touchend", touchEnd, passive);
  document.addEventListener("touchcancel", touchEnd, passive);
  viewport.addEventListener("scroll", scroll, passive);
  viewport.addEventListener("wheel", wheel, passive);
  viewport.addEventListener("focusin", focusIn, { signal });
  viewport.addEventListener("focusout", focusOut, { signal });
  viewport.addEventListener("keydown", keyDown, { signal });
  reduce.addEventListener("change", preferenceChange, { signal });
  document.addEventListener("visibilitychange", visibilityChange, { signal });
  window.addEventListener("blur", windowBlur, { signal });
  measure();

  return () => {
    events.abort();
    window.clearTimeout(timer);
    cancel();
    resize.disconnect();
    intersection.disconnect();
    delete viewport.dataset.ribbonMode;
  };
}
