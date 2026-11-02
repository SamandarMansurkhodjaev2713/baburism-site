import type { Product } from "~/shared/content";
import { useLocale } from "~/shared/i18n/locale-context";
import { shopMessages } from "./messages";

type VariantPickerProps = {
  product: Product;
  value: string;
  onChange: (variant: string) => void;
  id: string;
};

export function VariantPicker({ product, value, onChange, id }: VariantPickerProps) {
  const { t, text } = useLocale();
  if (!product.variants.length) return null;
  return (
    <label className="shop-variant" htmlFor={id}>
      <span>{t(shopMessages.variant)}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{t(shopMessages.chooseVariant)}</option>
        {product.variants.map((variant) => (
          <option key={variant.id} value={variant.id} disabled={variant.stock === "sold"}>
            {text(variant.title)}
            {variant.stock === "sold" ? ` · ${t(shopMessages.variantUnavailable)}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
