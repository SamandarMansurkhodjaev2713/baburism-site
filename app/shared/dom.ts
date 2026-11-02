const FOCUSABLE = 'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]';

export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth scrolling unless the visitor asked for reduced motion. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "instant" : "smooth";
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}

export function isCompactViewport(): boolean {
  return matchMedia("(max-width:700px)").matches;
}

/** Visible, enabled focus targets inside a container, in document order. */
export function focusableElements(container: HTMLElement | null): HTMLElement[] {
  return Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
    (element) => element.getClientRects().length > 0,
  );
}

/** Keeps Tab and Shift+Tab inside a modal container. */
export function trapFocus(event: KeyboardEvent, container: HTMLElement | null): void {
  if (event.key !== "Tab") return;
  const items = focusableElements(container);
  const first = items[0];
  const last = items.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Locks page scrolling and returns a function that restores the previous value. */
export function lockBodyScroll(): () => void {
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
}
