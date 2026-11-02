import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during prerendering and the hydration pass, true afterwards. Pages are
 * prerendered without a query string, so state read from the URL must wait for it
 * to keep the first client render identical to the static HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
