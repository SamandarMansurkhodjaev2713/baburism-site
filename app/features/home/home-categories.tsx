import { categories } from "~/shared/content";
import { useLocale } from "~/shared/i18n/locale-context";
import { ShopArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { useCategoryArrivals } from "../layout/motion";
import { ShopImage } from "../shop/shop-image";
import { homeMessages } from "./messages";

/** Category tiles; each opens the catalogue filtered to it. */
export function HomeCategories() {
  const { t, text } = useLocale();
  useCategoryArrivals();
  return (
    <div className="home-categories">
      {categories.map((category, index) => (
        <SiteLink
          to={`catalog?category=${encodeURIComponent(category.id)}`}
          className={`home-category category-${index}`}
          key={category.id}
        >
          <div className="home-category-image">
            <ShopImage src={category.image} alt="" />
          </div>
          <div className="home-category-copy">
            <h3>{text(category.title)}</h3>
            <span className="category-link-arrow" aria-hidden="true">
              <ShopArrowIcon />
            </span>
            <p>{text(category.description)}</p>
          </div>
        </SiteLink>
      ))}
      <p className="category-art-note">{t(homeMessages.categoryArtNote)}</p>
    </div>
  );
}
