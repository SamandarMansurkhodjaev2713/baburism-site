import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useLocation } from "react-router";

export type PageId =
  | "home"
  | "about"
  | "catalog"
  | "favorites"
  | "works"
  | "artwork"
  | "product"
  | "journal"
  | "visit"
  | "privacy";

export type LightboxImage = { src: string; title: string };

type LightboxState = { current: LightboxImage; gallery: readonly LightboxImage[] };

type CursorPointer = { pointerType: string; clientX: number; clientY: number };

type ShellValue = {
  page: PageId;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  lightbox: LightboxState | null;
  /** Opens an image; arrows browse `gallery` when it holds more than the image itself. */
  openLightbox: (image: LightboxImage, gallery?: readonly LightboxImage[]) => void;
  closeLightbox: () => void;
  moveLightbox: (step: 1 | -1) => void;
  /** True while the menu or lightbox covers the page; the page behind becomes inert. */
  modalOpen: boolean;
  cursorRef: RefObject<HTMLSpanElement | null>;
  showArtCursor: (pointer: CursorPointer) => void;
  hideArtCursor: () => void;
};

const ShellContext = createContext<ShellValue | null>(null);

const CURSOR_OFFSET = { x: 20, y: 22, flipX: 20, flipY: 18, margin: 12 };

export function ShellProvider({ page, children }: { page: PageId; children: ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Any navigation, including history buttons, closes the menu.
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setMenuOpen(false);
  }

  const hideArtCursor = useCallback(() => cursorRef.current?.classList.remove("visible"), []);

  useEffect(() => {
    hideArtCursor();
  }, [pathname, hideArtCursor]);

  // The label must never linger after scrolling, leaving the window or keyboard navigation.
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") hideArtCursor();
    };
    window.addEventListener("scroll", hideArtCursor, { passive: true });
    window.addEventListener("blur", hideArtCursor);
    document.addEventListener("keydown", keyDown);
    return () => {
      window.removeEventListener("scroll", hideArtCursor);
      window.removeEventListener("blur", hideArtCursor);
      document.removeEventListener("keydown", keyDown);
    };
  }, [hideArtCursor]);

  /** A "View artwork" label follows the mouse over artworks, flipping near viewport edges. */
  const showArtCursor = useCallback((pointer: CursorPointer) => {
    const cursor = cursorRef.current;
    if (pointer.pointerType !== "mouse" || !cursor) return;
    const { x: offsetX, y: offsetY, flipX, flipY, margin } = CURSOR_OFFSET;
    let x = pointer.clientX + offsetX;
    let y = pointer.clientY + offsetY;
    if (x + cursor.offsetWidth > window.innerWidth - margin) x = pointer.clientX - cursor.offsetWidth - flipX;
    if (y + cursor.offsetHeight > window.innerHeight - margin)
      y = pointer.clientY - cursor.offsetHeight - flipY;
    cursor.style.transform = `translate3d(${Math.max(margin, x)}px,${Math.max(margin, y)}px,0)`;
    cursor.classList.add("visible");
  }, []);

  const openMenu = useCallback(() => {
    hideArtCursor();
    setMenuOpen(true);
  }, [hideArtCursor]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openLightbox = useCallback(
    (image: LightboxImage, gallery: readonly LightboxImage[] = [image]) => {
      hideArtCursor();
      setLightbox({
        current: image,
        gallery: gallery.some((item) => item.src === image.src) ? gallery : [image],
      });
    },
    [hideArtCursor],
  );
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const moveLightbox = useCallback((step: 1 | -1) => {
    setLightbox((state) => {
      if (!state || state.gallery.length < 2) return state;
      const index = state.gallery.findIndex((item) => item.src === state.current.src);
      const next = state.gallery[(index + step + state.gallery.length) % state.gallery.length];
      return next ? { ...state, current: next } : state;
    });
  }, []);

  const value = useMemo<ShellValue>(
    () => ({
      page,
      menuOpen,
      openMenu,
      closeMenu,
      lightbox,
      openLightbox,
      closeLightbox,
      moveLightbox,
      modalOpen: menuOpen || lightbox !== null,
      cursorRef,
      showArtCursor,
      hideArtCursor,
    }),
    [
      page,
      menuOpen,
      openMenu,
      closeMenu,
      lightbox,
      openLightbox,
      closeLightbox,
      moveLightbox,
      showArtCursor,
      hideArtCursor,
    ],
  );
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellValue {
  const value = useContext(ShellContext);
  if (!value) throw new Error("useShell must be used inside <ShellProvider>.");
  return value;
}
