import { useEffect, useRef } from "react";
import { installDesktopRibbon } from "./desktop-ribbon";
import { installMobileRibbon } from "./mobile-ribbon";

const TOUCH_LAYOUT = "(max-width:700px), (pointer:coarse)";

/**
 * Drives the curated ribbon. The controller is chosen by input type and swapped when
 * the media query changes; `signature` reinstalls it when the items change.
 */
export function useRibbonMotion(signature: string) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewportNode = viewport.current;
    const trackNode = track.current;
    if (!viewportNode || !trackNode) return;
    const touchLayout = matchMedia(TOUCH_LAYOUT);
    let uninstall = () => {};
    const install = () => {
      uninstall();
      uninstall = touchLayout.matches
        ? installMobileRibbon(viewportNode, trackNode)
        : installDesktopRibbon(viewportNode, trackNode);
    };
    install();
    touchLayout.addEventListener("change", install);
    return () => {
      touchLayout.removeEventListener("change", install);
      uninstall();
    };
  }, [signature]);

  return { viewport, track };
}
