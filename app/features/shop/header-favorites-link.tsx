import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";
import { HeartIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { useSavedProducts } from "./use-saved-products";

export function HeaderFavoritesLink() {
  const { t } = useLocale();
  const saved = useSavedProducts();
  return (
    <SiteLink
      to="favorites"
      className="shop-header-favorites"
      aria-label={t(common.favorites) + (saved.ready ? `: ${saved.items.length}` : "")}
    >
      <HeartIcon />
      <span aria-hidden="true">{saved.items.length}</span>
    </SiteLink>
  );
}
