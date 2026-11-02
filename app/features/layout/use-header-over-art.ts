import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const DEFAULT_HEADER_HEIGHT = 80;
const SCROLL_THRESHOLD = 8;

/**
 * On the home page the header sits transparently over the hero artwork until the page
 * scrolls (desktop) or the intro section reaches it (phones keep it over the art longer).
 */
export function useHeaderOverArt(isHome: boolean): boolean {
  const [overArt, setOverArt] = useState(isHome);
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight =
        document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? DEFAULT_HEADER_HEIGHT;
      const intro = document.getElementById("idea");
      setOverArt(
        isHome &&
          (window.innerWidth <= 700 || window.scrollY < SCROLL_THRESHOLD) &&
          (!intro || intro.getBoundingClientRect().top > headerHeight),
      );
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(queue);
    const main = document.querySelector("main");
    if (main) resize.observe(main);
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [isHome, pathname]);

  return overArt;
}
