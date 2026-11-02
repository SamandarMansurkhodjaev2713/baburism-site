import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useHydrated } from "./use-hydrated";

const EMPTY = new URLSearchParams();

/**
 * Query-string state for prerendered pages: reads as empty until hydration ends
 * (matching the static HTML), and writes with `replace` so filters do not flood history.
 */
export function useUrlSearchParams() {
  const hydrated = useHydrated();
  const [params, setParams] = useSearchParams();
  const replaceParams = useCallback(
    (next: URLSearchParams) => setParams(next, { replace: true, preventScrollReset: true }),
    [setParams],
  );
  return [hydrated ? params : EMPTY, replaceParams] as const;
}
