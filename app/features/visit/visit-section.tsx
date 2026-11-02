import { settings } from "~/shared/content";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { ArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { ContactForm } from "./contact-form";
import { ContactLinks } from "./contact-links";
import { visitMessages } from "./messages";
import { SpaceGallery } from "./space-gallery";
import { SpaceMap } from "./space-map";

type VisitSectionProps = {
  /** The full Visit page: a page heading, the map and the contact form. */
  full?: boolean;
  showGallery?: boolean;
};

function VisitDetails() {
  const { t, text } = useLocale();
  const hours = text(settings.hours);
  return (
    <div className="visit-details">
      <p>{settings.address || t(common.location)}</p>
      {hours ? <p>{hours}</p> : !settings.address && <p>{t(visitMessages.comingSoon)}</p>}
      {settings.mapUrl && (
        <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="action-link">
          {t(visitMessages.directions)}
          <ArrowIcon diagonal />
        </a>
      )}
      <ContactLinks />
    </div>
  );
}

export function VisitSection({ full = false, showGallery = true }: VisitSectionProps) {
  const { t } = useLocale();
  const Title = full ? "h1" : "h2";
  return (
    <section
      className={"visit-section section " + (full ? "visit-page" : "")}
      id="visit"
      data-chapter={t(common.visit)}
    >
      <div className="visit-top reveal">
        {!full && <p className="section-label">{t(common.visit)}</p>}
        <Title className="expressive">{t(visitMessages.title)}</Title>
        <div className="visit-copy">
          <p>{t(visitMessages.body)}</p>
          <VisitDetails />
          {!full && (
            <SiteLink to="visit" className="action-link action-dark">
              {t(visitMessages.planVisit)}
              <ArrowIcon />
            </SiteLink>
          )}
        </div>
      </div>
      {showGallery && <SpaceGallery />}
      {full && <SpaceMap />}
      {full && (
        <div className="contact-section reveal">
          <ContactForm />
        </div>
      )}
    </section>
  );
}
