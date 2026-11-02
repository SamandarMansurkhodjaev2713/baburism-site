import { useEffect, type RefObject } from "react";
import { focusableElements, lockBodyScroll, trapFocus } from "../dom";

/** Delay before moving focus, so the opening transition has started and the target is visible. */
const FOCUS_DELAY = 40;

/**
 * Modal behaviour for a custom overlay: locks page scroll, moves focus inside,
 * traps Tab, closes on Escape and returns focus to the opener when closed.
 */
export function useModalBehaviour(
  open: boolean,
  container: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockBodyScroll();
    const timer = window.setTimeout(() => focusableElements(container.current)[0]?.focus(), FOCUS_DELAY);
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      trapFocus(event, container.current);
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      window.clearTimeout(timer);
      unlock();
      document.removeEventListener("keydown", keyDown);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, onClose, container]);
}
