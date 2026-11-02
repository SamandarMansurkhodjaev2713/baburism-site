import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import type { HeroSlide } from "./hero-slides";
import { useViewSlide } from "./hero";
import { homeMessages } from "./messages";

/** The painting currently shown in the hero, presented whole beside the introduction. */
export function IntroArtwork({ slide }: { slide: HeroSlide }) {
  const { t } = useLocale();
  const view = useViewSlide(slide);
  return (
    <figure className="intro-whole">
      <button className="intro-whole-image" onClick={view} aria-label={t(homeMessages.viewCompleteArtwork)}>
        <picture>
          <source
            media="(max-width:700px)"
            srcSet={publicAsset(slide.mobile.src)}
            width={slide.mobile.width}
            height={slide.mobile.height}
          />
          <img
            src={publicAsset(slide.desktop.src)}
            width={slide.desktop.width}
            height={slide.desktop.height}
            alt={t(homeMessages.openingArtwork)}
            loading="lazy"
          />
        </picture>
        <span className="intro-view-label">
          <span className="view-symbol" aria-hidden="true" />
          {t(common.viewArtwork)}
        </span>
      </button>
      <figcaption>
        <span className="art-hero-caption-desktop">{slide.desktop.caption}</span>
        <span className="art-hero-caption-mobile">{slide.mobile.caption}</span>
        <span>{t(homeMessages.completePainting)}</span>
      </figcaption>
    </figure>
  );
}
