import { useId, type CSSProperties } from "react";
import { CURRENCIES, STOCK_STATES, type Currency, type Product } from "~/shared/content";
import { INTL_LOCALES } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { priceRange, type CatalogueFilters } from "./filters";
import { catalogueMessages, STOCK_NAMES } from "./messages";

type FilterFieldsProps = {
  value: CatalogueFilters;
  onChange: (value: CatalogueFilters) => void;
  collections: readonly string[];
  products: readonly Product[];
};

/** Availability, price and collection controls, shared by the desktop sidebar and the phone sheet. */
export function FilterFields({ value, onChange, collections, products }: FilterFieldsProps) {
  const { locale, t } = useLocale();
  const id = useId();
  const range = priceRange(products, value.currency);
  // A typed amount above the published range stretches the slider instead of being clipped.
  const rangeMax = Math.max(range?.max ?? 0, Number(value.maxPrice) || 0);
  const amount = value.maxPrice === "" ? rangeMax : Number(value.maxPrice);
  const format = (number: number) =>
    new Intl.NumberFormat(INTL_LOCALES[locale], {
      maximumFractionDigits: value.currency === "UZS" ? 0 : 2,
    }).format(number);
  const budgetText =
    value.maxPrice === "" ? t(catalogueMessages.noLimit) : `${format(amount)} ${value.currency}`;
  const fill = rangeMax ? Math.min(100, Math.max(0, (amount / rangeMax) * 100)) : 0;

  return (
    <div className="catalog-filter-fields">
      <fieldset>
        <legend>{t(catalogueMessages.availability)}</legend>
        {(["", ...STOCK_STATES] as const).map((stock) => (
          <label className="catalog-radio" key={stock}>
            <input
              type="radio"
              name={`${id}-stock`}
              value={stock}
              checked={value.stock === stock}
              onChange={() => onChange({ ...value, stock })}
            />
            <span>{t(stock ? STOCK_NAMES[stock] : catalogueMessages.allObjects)}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t(catalogueMessages.price)}</legend>
        <div className="catalog-range-value" aria-live="off">
          {budgetText}
        </div>
        <input
          className="catalog-price-range"
          type="range"
          min="0"
          max={rangeMax || 1}
          step={range?.step ?? 1}
          value={amount}
          disabled={!range || range.max === 0}
          aria-label={`${t(catalogueMessages.maximumPrice)} ${value.currency}`}
          aria-valuetext={budgetText}
          aria-describedby={`${id}-price-hint`}
          style={{ "--range-fill": `${fill}%` } as CSSProperties}
          onChange={(event) =>
            onChange({ ...value, maxPrice: Number(event.target.value) >= rangeMax ? "" : event.target.value })
          }
        />
        <div className="catalog-range-limits" aria-hidden="true">
          <span>0</span>
          <span>{range ? `${format(rangeMax)} ${value.currency}` : "—"}</span>
        </div>
        <div className="catalog-budget">
          <label>
            <span>{t(catalogueMessages.priceUpTo)}</span>
            <input
              aria-label={t(catalogueMessages.priceUpTo)}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="—"
              value={value.maxPrice}
              onChange={(event) =>
                onChange({
                  ...value,
                  maxPrice: event.target.value === "" ? "" : String(Math.max(0, Number(event.target.value))),
                })
              }
            />
          </label>
          <label>
            <span>{t(catalogueMessages.currency)}</span>
            <select
              value={value.currency}
              // A bound in one currency means nothing in another, so it is cleared.
              onChange={(event) =>
                onChange({ ...value, currency: event.target.value as Currency, maxPrice: "" })
              }
            >
              {CURRENCIES.map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
          </label>
        </div>
        <p id={`${id}-price-hint`}>
          {t(range ? catalogueMessages.rangeHint : catalogueMessages.rangePending)}
        </p>
      </fieldset>
      {collections.length > 0 && (
        <fieldset>
          <legend>{t(catalogueMessages.collection)}</legend>
          <label className="catalog-collection-select">
            <span className="sr-only">{t(catalogueMessages.collection)}</span>
            <select
              value={value.collection}
              onChange={(event) => onChange({ ...value, collection: event.target.value })}
            >
              <option value="">{t(catalogueMessages.allCollections)}</option>
              {collections.map((collection) => (
                <option key={collection}>{collection}</option>
              ))}
            </select>
          </label>
        </fieldset>
      )}
    </div>
  );
}
