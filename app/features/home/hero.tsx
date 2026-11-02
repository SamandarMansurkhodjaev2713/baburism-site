import type { CSSProperties } from "react";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { isCompactViewport } from "~/shared/dom";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon, HeroStepIcon } from "~/shared/ui/icons";
import { artworkGallery } from "../artworks/artwork-gallery";
import { useShell } from "../layout/shell-context";
import { SiteLink } from "../layout/site-link";
import type { HeroSlide } from "./hero-slides";
import { HeroOrnament } from "./hero-ornament";
import { homeMessages } from "./messages";
import { useHeroRotation } from "./use-hero-rotation";

type HeroProps = { slides: readonly HeroSlide[]; index: number; onChange: (index: number) => void };

/** Opens the painting of the current slide in the variant matching the layout. */
export function useViewSlide(slide: HeroSlide | undefined) {
  const { locale } = useLocale();
  const { openLightbox } = useShell();
  return () => {
    if (!slide) return;
    const variant = isCompactViewport() ? slide.mobile : slide.desktop;
    openLightbox({ src: variant.src, title: variant.caption }, artworkGallery(locale));
  };
}

function SlideCaption({ slide }: { slide: HeroSlide }) {
  const { t } = useLocale();
  return (
    <span>
      <span className="art-hero-caption-desktop">{slide.desktop.caption}</span>
      <span className="art-hero-caption-mobile">{slide.mobile.caption}</span>
      <span className="art-hero-fragment">{t(homeMessages.artworkDetail)}</span>
    </span>
  );
}

function MobileCopy({ as: Element }: { as: "h1" | "p" }) {
  const { t } = useLocale();
  return (
    <>
      <p className="art-hero-eyebrow">{t(homeMessages.heroEyebrow)}</p>
      <Element className="art-hero-title">{t(common.artistName)}</Element>
      <p className="art-hero-description">{t(homeMessages.heroMobileDescription)}</p>
    </>
  );
}

/**
 * Home hero. Desktop: text on a light ground beside the whole painting in a dark frame.
 * Phones: a cropped painting above the text. Both share one slideshow.
 */
export function Hero({ slides, index, onChange }: HeroProps) {
  const { t } = useLocale();
  const { modalOpen } = useShell();
  const [heroRef, rotation] = useHeroRotation({ count: slides.length, index, onChange, blocked: modalOpen });
  const active = slides[index];
  const viewWhole = useViewSlide(active);
  const nextIndex = (index + 1) % slides.length;

  return (
    <section
      ref={heroRef}
      className="art-hero"
      data-chapter="Baburism"
      onFocusCapture={(event) => rotation.setKeyboardFocus(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) rotation.setKeyboardFocus(false);
      }}
      aria-label={t(homeMessages.heroLabel)}
    >
      <HeroOrnament />
      <div className="art-hero-scene" aria-hidden="true">
        {slides.map((slide, slideIndex) => (
          <picture
            key={slide.id}
            className={"art-hero-image" + (slideIndex === index ? " is-active" : "")}
            style={
              {
                "--art-position": slide.position,
                "--art-position-mobile": slide.mobilePosition,
              } as CSSProperties
            }
          >
            <source
              media="(max-width:700px)"
              srcSet={publicAsset(slide.mobile.src)}
              width={slide.mobile.width}
              height={slide.mobile.height}
            />
            <img
              src={publicAsset(slide.desktop.src)}
              alt=""
              width={slide.desktop.width}
              height={slide.desktop.height}
              loading={slideIndex === 0 || slideIndex === nextIndex ? "eager" : "lazy"}
              fetchPriority={slideIndex === 0 ? "high" : "auto"}
            />
          </picture>
        ))}
      </div>
      <div className="art-hero-shade" aria-hidden="true" />
      <div className="art-hero-top">
        <p>{t(common.location)}</p>
        <button className="art-hero-view" onClick={viewWhole}>
          <span className="view-symbol" aria-hidden="true" />
          {t(homeMessages.viewFullArtwork)}
        </button>
      </div>
      <div className="art-hero-pause" aria-hidden="true" />
      <div className="art-hero-body">
        <div className="art-hero-copy">
          <div className="art-hero-desktop-text">
            <h1>Baburism</h1>
            <p className="hero-desktop-lead">{t(homeMessages.heroLead)}</p>
            <p>{t(homeMessages.heroDescription)}</p>
          </div>
          <div className="art-hero-text">
            <MobileCopy as="h1" />
          </div>
          {/* Invisible copies reserve the height of the tallest slide text so the layout never jumps. */}
          {slides.map((slide) => (
            <div className="art-hero-reserve" key={slide.id} aria-hidden="true">
              <MobileCopy as="p" />
            </div>
          ))}
        </div>
        <div className="art-hero-actions">
          <SiteLink to="catalog" className="art-hero-primary">
            {t(common.catalogue)}
            <ArrowIcon diagonal />
          </SiteLink>
          <a href="#idea" className="art-hero-down" aria-label={t(homeMessages.continueToSpace)}>
            <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="art-hero-meta">
        <div className="art-hero-caption" aria-live={rotation.live}>
          <button
            className="art-hero-caption-link"
            onClick={viewWhole}
            aria-label={t(homeMessages.viewTheArtwork)}
          >
            {active && <SlideCaption slide={active} />}
            <span className="view-symbol" aria-hidden="true" />
          </button>
          {slides.map((slide) => (
            <div key={slide.id} className="art-hero-caption-reserve" aria-hidden="true">
              <SlideCaption slide={slide} />
              <span className="view-symbol" />
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <div
            className="art-hero-pager"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") rotation.setHovered(true);
            }}
            onPointerLeave={() => rotation.setHovered(false)}
          >
            <button
              className="hero-step hero-step-previous"
              onClick={() => rotation.manual((index + slides.length - 1) % slides.length)}
              aria-label={t(common.previous)}
            >
              <HeroStepIcon direction="previous" />
            </button>
            <span className="art-hero-slide-count" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button
              className="hero-step hero-step-next"
              onClick={() => rotation.manual(nextIndex)}
              aria-label={t(common.next)}
            >
              <HeroStepIcon direction="next" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
