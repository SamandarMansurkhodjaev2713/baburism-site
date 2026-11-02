import { useState } from "react";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { ArrowIcon } from "~/shared/ui/icons";
import { TitleLines } from "~/shared/ui/title-lines";
import { ArtworkExplorer } from "../explorer/artwork-explorer";
import { JournalCards } from "../journal/journal-cards";
import { journalMessages } from "../journal/messages";
import { SiteLink } from "../layout/site-link";
import { VisitSection } from "../visit/visit-section";
import { CuratedRibbon } from "./curated-ribbon";
import { Hero } from "./hero";
import { heroSlides } from "./hero-slides";
import { HomeCategories } from "./home-categories";
import { IntroArtwork } from "./intro-artwork";
import { homeMessages } from "./messages";

export function HomePage() {
  const { locale, t } = useLocale();
  const slides = heroSlides(locale);
  // Shared by the hero and the introduction, which shows the same painting whole.
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide = slides[slideIndex] ?? slides[0]!;

  return (
    <>
      <div className="opening-sequence">
        <div className="hero-runway">
          <Hero slides={slides} index={slideIndex} onChange={setSlideIndex} />
        </div>
        <section className="intro-section section" id="idea" data-chapter={t(common.about)}>
          <div className="intro-heading reveal">
            <h2 className="expressive">
              <TitleLines>{t(homeMessages.introTitle)}</TitleLines>
            </h2>
          </div>
          <div className="intro-layout">
            <div className="intro-image">
              <IntroArtwork slide={activeSlide} />
            </div>
            <div className="intro-copy reveal">
              <p className="lead">{t(homeMessages.introLead)}</p>
              <p>{t(homeMessages.introBody)}</p>
              <SiteLink to="about" className="action-link">
                {t(common.about)}
                <ArrowIcon />
              </SiteLink>
            </div>
          </div>
        </section>
        <section className="collection-section section" data-chapter={t(common.collection)}>
          <div className="section-heading reveal">
            <div>
              <h2 className="expressive">{t(homeMessages.categories)}</h2>
            </div>
            <SiteLink to="catalog" className="action-link">
              {t(homeMessages.fullCatalogue)}
              <ArrowIcon />
            </SiteLink>
          </div>
          <HomeCategories />
        </section>
      </div>
      <div className="painting-sequence">
        <CuratedRibbon />
        <ArtworkExplorer
          collectionLink={
            <SiteLink to="catalog" className="explorer-collection-link">
              {t(common.openCatalogue)}
              <ArrowIcon />
            </SiteLink>
          }
        />
      </div>
      <div className="journal-sequence">
        <section className="journal-section section" data-chapter="Journal">
          <div className="section-heading reveal">
            <div>
              <h2 className="expressive">
                <TitleLines>{t(journalMessages.homeHeading)}</TitleLines>
              </h2>
            </div>
            <SiteLink to="journal" className="action-link">
              {t(common.allStories)}
              <ArrowIcon />
            </SiteLink>
          </div>
          <JournalCards />
        </section>
        <VisitSection />
      </div>
    </>
  );
}
