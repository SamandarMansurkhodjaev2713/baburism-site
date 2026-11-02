/** A saved object and the variant chosen for it ("" when none is chosen yet). */
export type SavedProduct = { id: string; variant: string };

export const MAX_SAVED = 40;

const MAX_CODE_LENGTH = 6600;
const SAFE_ID = /^[a-zA-Z0-9-]{1,80}$/;

const isSafeId = (value: unknown): value is string => typeof value === "string" && SAFE_ID.test(value);

/** Normalises untrusted data (local storage, links): drops malformed and duplicate entries and caps the size. */
export function cleanSaved(value: unknown): SavedProduct[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, MAX_SAVED).flatMap((item: unknown) => {
    if (!item || typeof item !== "object") return [];
    const { id, variant } = item as Record<string, unknown>;
    if (!isSafeId(id) || seen.has(id) || (variant !== "" && !isSafeId(variant))) return [];
    seen.add(id);
    return [{ id, variant }];
  });
}

/** Compact, URL-safe form: `id~variant.id2.id3~variant`. */
export function encodeSelection(items: readonly SavedProduct[]): string {
  return cleanSaved(items)
    .map((item) => item.id + (item.variant ? `~${item.variant}` : ""))
    .join(".");
}

/** Strict inverse of `encodeSelection`; returns null for any tampered or truncated code. */
export function decodeSelection(code: string): SavedProduct[] | null {
  if (!code || code.length > MAX_CODE_LENGTH || !/^[a-zA-Z0-9~.-]+$/.test(code)) return null;
  const parts = code.split(".");
  if (parts.length > MAX_SAVED) return null;
  const values: SavedProduct[] = [];
  for (const part of parts) {
    const bits = part.split("~");
    const [id, variant = ""] = bits;
    if (
      bits.length > 2 ||
      (bits.length === 2 && !variant) ||
      !isSafeId(id) ||
      (variant && !isSafeId(variant))
    ) {
      return null;
    }
    values.push({ id, variant });
  }
  const result = cleanSaved(values);
  return result.length === values.length ? result : null;
}

export function toggleSaved(items: readonly SavedProduct[], id: string, variant = ""): SavedProduct[] {
  if (items.some((item) => item.id === id)) return items.filter((item) => item.id !== id);
  return items.length >= MAX_SAVED ? [...items] : [...items, { id, variant }];
}

/** Adds a shared selection to the saved list; shared variants win for objects already saved. */
export function mergeSaved(
  items: readonly SavedProduct[],
  incoming: readonly SavedProduct[],
): SavedProduct[] {
  return cleanSaved([
    ...items.map((item) => incoming.find((other) => other.id === item.id) ?? item),
    ...incoming.filter((other) => !items.some((item) => item.id === other.id)),
  ]).slice(0, MAX_SAVED);
}
