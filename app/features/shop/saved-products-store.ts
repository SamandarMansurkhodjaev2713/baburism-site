import { cleanSaved, type SavedProduct } from "./selection";

const STORAGE_KEY = "baburism-saved-v1";

export type SavedSnapshot = {
  items: readonly SavedProduct[];
  /** False while prerendering and hydrating: storage has not been read yet. */
  ready: boolean;
  /** Storage is unavailable (private mode, quota); favourites last only for this page session. */
  error: boolean;
};

export const SERVER_SNAPSHOT: SavedSnapshot = { items: [], ready: false, error: false };

const listeners = new Set<() => void>();
/** Fallback when storage is unavailable, so the list still works until the tab closes. */
let memory: SavedProduct[] = [];
let failed = false;
let cached: { raw: string | null; failed: boolean; snapshot: SavedSnapshot } | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    failed = true;
    return null;
  }
}

function parse(raw: string | null): SavedProduct[] {
  if (!raw) return [];
  try {
    return cleanSaved(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Returns the same object while nothing changed, as `useSyncExternalStore` requires. */
export function getSnapshot(): SavedSnapshot {
  const raw = readRaw();
  if (cached && cached.raw === raw && cached.failed === failed) return cached.snapshot;
  const snapshot: SavedSnapshot = { items: failed ? memory : parse(raw), ready: true, error: failed };
  cached = { raw, failed, snapshot };
  return snapshot;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const fromOtherTab = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", fromOtherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", fromOtherTab);
  };
}

export function updateSaved(change: (items: readonly SavedProduct[]) => SavedProduct[]): void {
  const next = cleanSaved(change(getSnapshot().items));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    failed = true;
  }
  memory = next;
  cached = null;
  listeners.forEach((listener) => listener());
}
