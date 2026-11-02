import { useEffect, useState } from "react";
import { useUrlSearchParams } from "~/shared/hooks/use-url-search-params";
import { parseCatalogueQuery, writeCatalogueQuery, type CatalogueQuery } from "./filters";

/** Typing writes the URL only after a pause: Safari throttles frequent history updates. */
const SEARCH_DEBOUNCE_MS = 250;

/**
 * Catalogue state lives in the URL, so filtered views can be shared and restored.
 * The search box keeps a local draft that is written to the URL after typing pauses;
 * a navigation that changes the query from outside replaces the draft.
 */
export function useCatalogueQuery() {
  const [params, setParams] = useUrlSearchParams();
  const urlQuery = parseCatalogueQuery(params);
  const [search, setSearch] = useState(urlQuery.search);
  const [sync, setSync] = useState({ seen: urlQuery.search, written: urlQuery.search });

  // Adjusting state while rendering, as React recommends for reacting to changed inputs.
  if (sync.seen !== urlQuery.search) {
    const external = urlQuery.search !== sync.written;
    setSync({ seen: urlQuery.search, written: external ? urlQuery.search : sync.written });
    if (external) setSearch(urlQuery.search);
  }

  useEffect(() => {
    const current = parseCatalogueQuery(params);
    if (search === current.search) return;
    const timer = window.setTimeout(() => {
      setSync((state) => ({ ...state, written: search }));
      setParams(writeCatalogueQuery({ ...current, search }, params));
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search, params, setParams]);

  const update = (patch: Partial<CatalogueQuery>) => {
    const next = { ...urlQuery, search, ...patch };
    if (patch.search !== undefined) {
      setSearch(patch.search);
      setSync((current) => ({ ...current, written: next.search }));
    }
    setParams(writeCatalogueQuery(next, params));
  };

  return { query: { ...urlQuery, search }, setSearch, update };
}
