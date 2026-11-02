import { useCallback, useEffect, useRef, useState } from "react";

/** Each painting stays nine seconds; after a manual choice the visitor gets eighteen seconds of quiet. */
const AUTO_INTERVAL = 9000;
const QUIET_AFTER_MANUAL = 18000;
/** The hero counts as visible when more than half of it is on screen. */
const VISIBLE_RATIO = 0.55;

type HeroRotationOptions = {
  count: number;
  index: number;
  onChange: (index: number) => void;
  /** A menu or lightbox is open over the page. */
  blocked: boolean;
};

/**
 * Slideshow timing. Rotation pauses when the hero is off screen, the tab is hidden,
 * a modal is open, the pointer rests on the controls, keyboard focus is inside, or the
 * visitor prefers reduced motion. The next image decodes before it is shown, so a slow
 * connection never produces a blank frame. Returns the ref to attach to the hero element and the controls.
 */
export function useHeroRotation({ count, index, onChange, blocked }: HeroRotationOptions) {
  const rootRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const [reading, setReading] = useState(false);

  const alive = useRef(false);
  const blockedRef = useRef(blocked);
  /** Increments whenever the timer is re-armed, so an older automatic change that is still decoding is dropped. */
  const autoEpoch = useRef(0);
  /** The newest manual request; an older one that is still decoding is dropped. */
  const manualRequest = useRef(0);
  const manualPending = useRef(false);
  const quietUntil = useRef(0);

  useEffect(() => {
    blockedRef.current = blocked;
  }, [blocked]);

  useEffect(() => {
    alive.current = true;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(motion.matches);
    const updateVisibility = () => setHidden(document.hidden);
    motion.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    // Initial values are delivered asynchronously, like later changes.
    const initial = requestAnimationFrame(() => {
      updatePreference();
      updateVisibility();
    });
    const observer = new IntersectionObserver(
      ([entry]) => setVisible((entry?.intersectionRatio ?? 0) >= VISIBLE_RATIO),
      { threshold: [0, VISIBLE_RATIO] },
    );
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      alive.current = false;
      cancelAnimationFrame(initial);
      observer.disconnect();
      motion.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  /** Decodes the target image, then shows it unless something newer has taken over. */
  const change = useCallback(
    async (target: number, manual: boolean, epoch: number) => {
      const request = manual ? ++manualRequest.current : manualRequest.current;
      if (manual) {
        manualPending.current = true;
        quietUntil.current = performance.now() + QUIET_AFTER_MANUAL;
        setReading(true);
        setInteraction((value) => value + 1);
      }
      const finished = () => {
        if (manual && request === manualRequest.current) manualPending.current = false;
      };
      const picture = rootRef.current?.querySelectorAll<HTMLImageElement>(".art-hero-image img")[target];
      if (picture) {
        picture.loading = "eager";
        try {
          await picture.decode();
        } catch {
          finished();
          return;
        }
        if (!picture.naturalWidth) return;
      }
      const superseded = manual
        ? request !== manualRequest.current
        : epoch !== autoEpoch.current || manualPending.current || document.hidden;
      if (!alive.current || superseded || blockedRef.current) {
        finished();
        return;
      }
      finished();
      if (!manual) setReading(false);
      onChange(target);
    },
    [onChange],
  );

  const canRotate = count > 1 && visible && !hidden && !blocked && !reduced && !hovered && !keyboardFocus;

  useEffect(() => {
    const epoch = ++autoEpoch.current;
    if (!canRotate) return;
    const timer = window.setTimeout(
      () => void change((index + 1) % count, false, epoch),
      Math.max(AUTO_INTERVAL, quietUntil.current - performance.now()),
    );
    return () => window.clearTimeout(timer);
  }, [canRotate, index, count, interaction, change]);

  const controls = {
    manual: (target: number) => void change(target, true, autoEpoch.current),
    setHovered,
    setKeyboardFocus,
    /** Announce slide changes only when the visitor is engaged with the slideshow. */
    live: reading || keyboardFocus ? ("polite" as const) : ("off" as const),
  };
  return [rootRef, controls] as const;
}
