import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useLocale } from "~/shared/i18n/locale-context";
import { CheckIcon, ChevronIcon } from "~/shared/ui/icons";
import { SORT_ORDERS, type SortOrder } from "./filters";
import { catalogueMessages, SORT_NAMES } from "./messages";

const VIEWPORT_MARGIN = 16;
const GAP = 8;
const MIN_WIDTH = 280;
const MAX_WIDTH = 340;
const MAX_HEIGHT = 300;
const MIN_SPACE_BELOW = 260;

/** Places the popover under the trigger, or above it when there is clearly more room there. */
function placePopover(popover: HTMLElement, trigger: HTMLElement) {
  const bounds = trigger.getBoundingClientRect();
  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, bounds.width), innerWidth - VIEWPORT_MARGIN * 2);
  const height = Math.min(MAX_HEIGHT, innerHeight - VIEWPORT_MARGIN * 2);
  const below = innerHeight - bounds.bottom - 12;
  const above = bounds.top - 12;
  const upwards = below < Math.min(MIN_SPACE_BELOW, height) && above > below;
  popover.style.width = `${width}px`;
  popover.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(bounds.right - width, innerWidth - width - VIEWPORT_MARGIN))}px`;
  popover.style.maxHeight = `${Math.max(100, Math.min(height, upwards ? above : below))}px`;
  popover.style.top = upwards ? "auto" : `${Math.max(VIEWPORT_MARGIN, bounds.bottom + GAP)}px`;
  popover.style.bottom = upwards ? `${Math.max(VIEWPORT_MARGIN, innerHeight - bounds.top + GAP)}px` : "auto";
}

/**
 * Sort order as a styled listbox in the top layer. The native popover handles light
 * dismissal; the list owns focus and arrow, Home, End, Escape and Tab keys.
 */
export function SortMenu({ value, onChange }: { value: SortOrder; onChange: (value: SortOrder) => void }) {
  const { t } = useLocale();
  const id = useId();
  const popover = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const selected = Math.max(0, SORT_ORDERS.indexOf(value));
  const options = () =>
    Array.from(popover.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? []);

  const close = (restoreFocus = true) => {
    popover.current?.hidePopover();
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  };

  const show = (focusIndex = selected) => {
    const node = popover.current;
    const button = trigger.current;
    if (!node || !button) return;
    node.showPopover();
    placePopover(node, button);
    setOpen(true);
    options()[focusIndex]?.focus({ preventScroll: true });
  };

  // Keep the popover attached to the trigger while the page scrolls or resizes.
  useEffect(() => {
    if (!open) return;
    const reposition = (event: Event) => {
      if (event.target instanceof Node && popover.current?.contains(event.target)) return;
      if (popover.current && trigger.current) placePopover(popover.current, trigger.current);
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  const listKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = options();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const targets: Record<string, number> = {
      Home: 0,
      End: items.length - 1,
      ArrowDown: (current + 1) % items.length,
      ArrowUp: (current - 1 + items.length) % items.length,
    };
    if (event.key in targets) {
      event.preventDefault();
      items[targets[event.key]!]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      close();
    }
  };

  return (
    <div className="catalog-sort">
      <button
        ref={trigger}
        className="catalog-sort-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${t(catalogueMessages.sort)}: ${t(SORT_NAMES[value])}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          show(event.key === "ArrowUp" ? SORT_ORDERS.length - 1 : selected);
        }}
      >
        <span>
          <span className="catalog-sort-label">{t(catalogueMessages.sort)}</span>
          <span>{t(SORT_NAMES[value])}</span>
        </span>
        <ChevronIcon />
      </button>
      <div
        id={id}
        className="catalog-sort-options"
        ref={popover}
        popover="auto"
        role="listbox"
        aria-label={t(catalogueMessages.sort)}
        onToggle={(event) => setOpen(event.newState === "open")}
        onKeyDown={listKeyDown}
      >
        {SORT_ORDERS.map((order) => (
          <button
            type="button"
            role="option"
            aria-selected={order === value}
            tabIndex={-1}
            key={order}
            onClick={() => {
              onChange(order);
              close();
            }}
          >
            <span>{t(SORT_NAMES[order])}</span>
            {order === value && <CheckIcon />}
          </button>
        ))}
      </div>
    </div>
  );
}
