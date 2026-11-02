import { useEffect, useRef } from "react";

/** The ornament is visible without JavaScript; this only lets its light drift slowly on large screens. */
export function HeroOrnament() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width:701px)");
    let visible = false;
    const drift = node.animate(
      [
        { transform: "translate3d(-10px,-6px,0)" },
        { transform: "translate3d(10px,6px,0)" },
        { transform: "translate3d(-10px,-6px,0)" },
      ],
      { duration: 24000, iterations: Infinity, easing: "ease-in-out" },
    );
    drift.pause();
    const update = () => {
      if (visible && !document.hidden && !reduced.matches && wide.matches) drift.play();
      else drift.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });
    observer.observe(node);
    reduced.addEventListener("change", update);
    wide.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      drift.cancel();
      reduced.removeEventListener("change", update);
      wide.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <div className="hero-ornament" ref={root} aria-hidden="true" />;
}
