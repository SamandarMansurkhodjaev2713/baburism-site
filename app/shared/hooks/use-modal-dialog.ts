import { useEffect, useEffectEvent, useRef, type RefObject } from "react";
import { lockBodyScroll, prefersReducedMotion } from "../dom";

type ModalDialogOptions = {
  /** Entrance from this offset and opacity, so the sheet visibly rises into place. */
  enter: { fromY: number; fromOpacity: number; duration: number };
  /** Runs once the dialog is open, e.g. to scroll its body or focus the current choice. */
  onOpen?: (dialog: HTMLDialogElement) => void;
  /** The control that opened the dialog; it gets focus back when the dialog unmounts. */
  returnFocusTo: RefObject<HTMLElement | null>;
};

/**
 * Drives a native `<dialog>` that is mounted only while open: top layer, inert
 * background and Escape come from the browser; this adds the scroll lock, a short
 * entrance and focus return.
 */
export function useModalDialog({ enter, onOpen, returnFocusTo }: ModalDialogOptions) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opened = useEffectEvent((node: HTMLDialogElement) => {
    onOpen?.(node);
    if (prefersReducedMotion()) return;
    node.animate(
      [
        { opacity: enter.fromOpacity, transform: `translateY(${enter.fromY}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: enter.duration, easing: "cubic-bezier(.16,1,.3,1)" },
    );
  });
  const closed = useEffectEvent(() => returnFocusTo.current?.focus({ preventScroll: true }));

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const unlock = lockBodyScroll();
    node.showModal();
    opened(node);
    return () => {
      node.close();
      unlock();
      closed();
    };
  }, []);

  return dialog;
}
