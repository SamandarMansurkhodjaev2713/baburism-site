const STORAGE_KEY = "baburism-catalog-query";

/** Remembers the catalogue filters so "Back to catalogue" on a product page restores them. */
export function rememberCatalogueQuery(search: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, search);
  } catch {
    // Without session storage the link simply returns to the unfiltered catalogue.
  }
}

/** Catalogue route with the remembered filters, e.g. `catalog?category=prints`. */
export function catalogueReturnTarget(): string {
  try {
    const query = sessionStorage.getItem(STORAGE_KEY);
    return query?.startsWith("?") ? `catalog${query}` : "catalog";
  } catch {
    return "catalog";
  }
}
