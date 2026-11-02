import { useId, useRef, useState, type RefObject } from "react";
import type { Product } from "~/shared/content";
import { prefersReducedMotion } from "~/shared/dom";
import { useModalDialog } from "~/shared/hooks/use-modal-dialog";
import { useLocale } from "~/shared/i18n/locale-context";
import { CrossIcon, ShopArrowIcon } from "~/shared/ui/icons";
import { FilterFields } from "./filter-fields";
import { EMPTY_FILTERS, type CatalogueFilters } from "./filters";
import { catalogueMessages } from "./messages";

type FilterDialogProps = {
  opener: RefObject<HTMLButtonElement | null>;
  value: CatalogueFilters;
  onApply: (value: CatalogueFilters) => void;
  onClose: () => void;
  collections: readonly string[];
  products: readonly Product[];
  /** Number of results the draft would produce, shown on the apply button. */
  count: (value: CatalogueFilters) => number;
};

/**
 * Phone filter sheet. Edits a draft: Apply commits it, Reset clears the draft,
 * and closing discards unapplied changes. Mounted only while open.
 */
export function FilterDialog({
  opener,
  value,
  onApply,
  onClose,
  collections,
  products,
  count,
}: FilterDialogProps) {
  const { t } = useLocale();
  const titleId = useId();
  const [draft, setDraft] = useState(value);
  const closing = useRef(false);
  const dialog = useModalDialog({
    returnFocusTo: opener,
    enter: { fromY: 28, fromOpacity: 0.5, duration: 260 },
    onOpen: (node) => {
      const body = node.querySelector<HTMLElement>(".catalog-filter-dialog-body");
      if (body) body.scrollTop = 0;
    },
  });

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const node = dialog.current;
    if (!node || prefersReducedMotion()) {
      onClose();
      return;
    }
    const exit = node.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(20px)" },
      ],
      { duration: 160, easing: "ease-in" },
    );
    exit.finished.then(onClose, onClose);
  };

  return (
    <dialog
      className="catalog-filter-dialog"
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApply(draft);
          close();
        }}
      >
        <header>
          <h2 id={titleId}>{t(catalogueMessages.filters)}</h2>
          <button
            type="button"
            className="catalog-icon-button"
            aria-label={t(catalogueMessages.closeFilters)}
            onClick={close}
          >
            <CrossIcon />
          </button>
        </header>
        <div className="catalog-filter-dialog-body">
          <FilterFields value={draft} onChange={setDraft} collections={collections} products={products} />
        </div>
        <footer>
          <button type="button" className="shop-text-button" onClick={() => setDraft(EMPTY_FILTERS)}>
            {t(catalogueMessages.reset)}
          </button>
          <button type="submit" className="catalog-apply">
            {t(catalogueMessages.showObjects)}
            <span>{count(draft)}</span>
            <ShopArrowIcon />
          </button>
        </footer>
      </form>
    </dialog>
  );
}
