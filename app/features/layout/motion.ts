import { useEffect } from "react";
import { prefersReducedMotion } from "~/shared/dom";

const EASE_OUT = "cubic-bezier(.22,.7,.2,1)";
const EASE_UNROLL = "cubic-bezier(.16,1,.3,1)";
/** Headings and images that arrive with a short lift. Prose, cards and controls never wait for a reveal. */
const REVEAL_TARGETS = ".intro-heading,.art-story-heading,figure.reveal,.about-opening-art";
const ARRIVAL_TARGETS = ".home-category";

/** Tracks running animations so focus or a reduced-motion switch can settle them instantly. */
function animationRegistry() {
  const running = new Set<Animation>();
  const animate = (node: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = node.animate(frames, options);
    running.add(animation);
    animation.onfinish = () => running.delete(animation);
  };
  const settle = () => {
    running.forEach((animation) => animation.cancel());
    running.clear();
  };
  return { animate, settle };
}

/**
 * Progressive enhancement: content is fully visible without JavaScript and before any
 * observer fires. Elements below the fold get a brief lift when they first appear.
 */
export function useEditorialMotion(routeKey: string) {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const registry = animationRegistry();
    const main = document.querySelector("main");
    if (main && window.scrollY < 100) {
      registry.animate(main, [{ opacity: 0.96 }, { opacity: 1 }], { duration: 180, easing: EASE_OUT });
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (reduced.matches) {
          observer.disconnect();
          return;
        }
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (
            entry.target.getBoundingClientRect().top > 90 &&
            !entry.target.contains(document.activeElement)
          ) {
            registry.animate(
              entry.target,
              [
                { transform: "translateY(12px)", opacity: 0.9 },
                { transform: "translateY(0)", opacity: 1 },
              ],
              { duration: 420, easing: EASE_OUT },
            );
          }
        }
      },
      { threshold: 0.05 },
    );
    document.querySelectorAll(REVEAL_TARGETS).forEach((node) => {
      if (node.getBoundingClientRect().top > window.innerHeight) observer.observe(node);
    });
    const settleOnFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) registry.settle();
    };
    reduced.addEventListener("change", registry.settle);
    document.addEventListener("focusin", settleOnFocus);
    return () => {
      observer.disconnect();
      registry.settle();
      reduced.removeEventListener("change", registry.settle);
      document.removeEventListener("focusin", settleOnFocus);
    };
  }, [routeKey]);
}

/** Category images unroll as they enter the viewport; titles stay readable from the first frame. */
export function useCategoryArrivals() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const registry = animationRegistry();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (prefersReducedMotion()) continue;
          const image = entry.target.querySelector(".home-category-image");
          const index = Number((entry.target as HTMLElement).dataset.arrival ?? 0);
          if (!image) continue;
          registry.animate(
            image,
            [
              { clipPath: "inset(0 0 12% 0)", transform: "translateY(14px)" },
              { clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
            ],
            { duration: 650, delay: (index % 2) * 75, easing: EASE_UNROLL },
          );
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>(ARRIVAL_TARGETS).forEach((node, index) => {
      node.dataset.arrival = String(index);
      observer.observe(node);
    });
    reduced.addEventListener("change", registry.settle);
    document.addEventListener("focusin", registry.settle);
    return () => {
      observer.disconnect();
      registry.settle();
      reduced.removeEventListener("change", registry.settle);
      document.removeEventListener("focusin", registry.settle);
    };
  }, []);
}
