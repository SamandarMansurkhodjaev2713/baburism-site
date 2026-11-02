import { useId, useRef, useState, type RefObject } from "react";
import type { Category, Product } from "~/shared/content";
import { useModalDialog } from "~/shared/hooks/use-modal-dialog";
import { useLocale } from "~/shared/i18n/locale-context";
import { CategoryGridIcon, CheckIcon, ChevronIcon, CrossIcon } from "~/shared/ui/icons";
import { ShopImage } from "../shop/shop-image";
import { catalogueMessages } from "./messages";

type Choice = { id: string; title: string; image: string; count: number };

type CategoryPickerProps = {
  categories: readonly Category[];
  products: readonly Product[];
  value: string;
  onChange: (category: string) => void;
};

function CategoryPicture({ image }: { image: string }) {
  return (
    <span className="catalog-category-picture">
      {image ? <ShopImage src={image} alt="" /> : <CategoryGridIcon />}
    </span>
  );
}

/** Large category buttons on desktop; on phones a single control that opens the full list in a sheet. */
export function CategoryPicker({ categories, products, value, onChange }: CategoryPickerProps) {
  const { t, text } = useLocale();
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const showCounts = products.length > 0;

  const choices: Choice[] = [
    { id: "", title: t(catalogueMessages.allObjects), image: "", count: products.length },
    ...categories.map((category) => ({
      id: category.id,
      title: text(category.title),
      image: category.image,
      count: products.filter((product) => product.category === category.id).length,
    })),
  ];
  const selected = choices.find((choice) => choice.id === value) ?? {
    id: value,
    title: value,
    image: "",
    count: 0,
  };

  return (
    <>
      <nav className="catalog-category-tabs" aria-label={t(catalogueMessages.productCategories)}>
        {choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            aria-pressed={value === choice.id}
            onClick={() => onChange(choice.id)}
          >
            {choice.image && <CategoryPicture image={choice.image} />}
            <span>{choice.title}</span>
            {showCounts && <span className="catalog-category-count">{choice.count}</span>}
          </button>
        ))}
      </nav>
      <div className="catalog-category-mobile">
        <button
          type="button"
          ref={opener}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <CategoryPicture image={selected.image} />
          <span className="catalog-category-current">
            <span>{t(catalogueMessages.category)}</span>
            <span>{selected.title}</span>
          </span>
          {showCounts && <span className="catalog-category-count">{selected.count}</span>}
          <ChevronIcon />
        </button>
      </div>
      {open && (
        <CategoryDialog
          choices={choices}
          value={value}
          showCounts={showCounts}
          opener={opener}
          onChoose={(id) => {
            onChange(id);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

type CategoryDialogProps = {
  choices: readonly Choice[];
  value: string;
  showCounts: boolean;
  opener: RefObject<HTMLButtonElement | null>;
  onChoose: (id: string) => void;
  onClose: () => void;
};

function CategoryDialog({ choices, value, showCounts, opener, onChoose, onClose }: CategoryDialogProps) {
  const { t } = useLocale();
  const titleId = useId();
  const dialog = useModalDialog({
    returnFocusTo: opener,
    enter: { fromY: 20, fromOpacity: 0.7, duration: 220 },
    onOpen: (node) => {
      const list = node.querySelector<HTMLElement>(".catalog-category-options");
      if (list) list.scrollTop = 0;
      const current = node.querySelector<HTMLButtonElement>("[aria-pressed=true]");
      current?.focus({ preventScroll: true });
      current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    },
  });

  return (
    <dialog
      className="catalog-category-dialog"
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header>
        <h2 id={titleId}>{t(catalogueMessages.categories)}</h2>
        <button
          className="catalog-icon-button"
          type="button"
          aria-label={t(catalogueMessages.closeCategories)}
          onClick={onClose}
        >
          <CrossIcon size={22} />
        </button>
      </header>
      <div className="catalog-category-options">
        {choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            aria-pressed={value === choice.id}
            onClick={() => onChoose(choice.id)}
          >
            <CategoryPicture image={choice.image} />
            <span>{choice.title}</span>
            {showCounts && <span className="catalog-category-count">{choice.count}</span>}
            <span className="catalog-category-check">{value === choice.id && <CheckIcon />}</span>
          </button>
        ))}
      </div>
    </dialog>
  );
}
