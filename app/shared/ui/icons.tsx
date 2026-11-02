/** Decorative line icons. All are `aria-hidden`; the control that contains them carries the label. */

export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/** The rounded arrow used across the shop. */
export function ShopArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CrossIcon({ size = 20 }: { size?: 20 | 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.2 5.8a5.1 5.1 0 0 0-7.2 0L12 6.9l-1.1-1.1a5.1 5.1 0 0 0-7.2 7.2L12 21l8.2-8a5.1 5.1 0 0 0 0-7.2Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 17h16M9 4v6m6 4v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryGridIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M3 3h8v8H3zM17 3h8v8h-8zM3 17h8v8H3zM17 17h8v8h-8z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 11 7-11 7V5Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Long, light arrows of the hero slideshow controls. */
export function HeroStepIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <path
        d={direction === "previous" ? "M24 12H4m7-7-7 7 7 7" : "M4 12h20m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const VIEWER_PATHS = {
  plus: "M5 12h14M12 5v14",
  minus: "M5 12h14",
  expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
  fit: "M3 9V3h6m6 0h6v6M3 15v6h6m12-6v6h-6",
  close: "m6 6 12 12M6 18 18 6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
} as const;

/** Icons of the artwork viewer toolbar. */
export function ViewerIcon({ name }: { name: keyof typeof VIEWER_PATHS }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={VIEWER_PATHS[name]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
