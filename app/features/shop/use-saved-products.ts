import { useSyncExternalStore } from "react";
import { getSnapshot, SERVER_SNAPSHOT, subscribe, updateSaved } from "./saved-products-store";
import { mergeSaved, toggleSaved, type SavedProduct } from "./selection";

const actions = {
  toggle: (id: string, variant = "") => updateSaved((items) => toggleSaved(items, id, variant)),
  remove: (id: string) => updateSaved((items) => items.filter((item) => item.id !== id)),
  setVariant: (id: string, variant: string) =>
    updateSaved((items) => items.map((item) => (item.id === id ? { ...item, variant } : item))),
  merge: (incoming: readonly SavedProduct[]) => updateSaved((items) => mergeSaved(items, incoming)),
};

/** Favourites without an account, persisted in local storage and synchronised across tabs. */
export function useSavedProducts() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  return { ...snapshot, ...actions };
}
