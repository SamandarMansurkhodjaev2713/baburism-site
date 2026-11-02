import type { ReactNode } from "react";
import { articles, type ArticleTopic } from "~/shared/content";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";
import { INTERVIEWS } from "./interviews";
import { journalMessages, TOPIC_NAMES } from "./messages";

export type TopicFilter = ArticleTopic | "all";

const HOME_CARD_COUNT = 3;

type JournalCard = {
  id: string;
  topic: ArticleTopic;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  meta: string;
  source: string;
  /** Internal article route, or an external interview URL. */
  link: { kind: "internal"; to: string } | { kind: "external"; href: string };
};

function useJournalCards(): JournalCard[] {
  const { t, text } = useLocale();
  const internal = articles.map<JournalCard>((article) => ({
    id: article.slug,
    topic: article.topic,
    title: text(article.title),
    description: text(article.description),
    image: article.image,
    imageAlt: text(article.title),
    label: t(TOPIC_NAMES[article.topic]),
    meta: "",
    source: "",
    link: { kind: "internal", to: `journal/${article.slug}` },
  }));
  const interviews = INTERVIEWS.map<JournalCard>((interview, index) => ({
    id: interview.id,
    topic: "interviews",
    title: t(interview.title),
    description: t(interview.summary),
    image: interview.image,
    // The first interview is illustrated with the artist's portrait.
    imageAlt: index === 0 ? t(common.artistName) : t(interview.title),
    label: t(journalMessages.interview),
    meta: `${interview.publisher} / ${interview.year}`,
    source: t(journalMessages.interviewInRussian),
    link: { kind: "external", href: interview.url },
  }));
  return [...internal, ...interviews];
}

type JournalCardsProps = {
  /** The full journal shows every card for the topic; the home page shows the first three. */
  full?: boolean;
  topic?: TopicFilter;
  onTopicChange?: (topic: TopicFilter) => void;
};

export function JournalCards({ full = false, topic = "all", onTopicChange }: JournalCardsProps) {
  const { t } = useLocale();
  const cards = useJournalCards();
  const visible = full
    ? cards.filter((card) => topic === "all" || card.topic === topic)
    : cards.slice(0, HOME_CARD_COUNT);

  return (
    <div className={"journal-grid" + (full ? " journal-full" : "")}>
      {visible.map((card, index) => {
        const className = `journal-card reveal journal-${index}` + (card.image ? "" : " without-image");
        const content = (
          <>
            {card.image && (
              <div className="journal-image">
                <img src={publicAsset(card.image)} alt={card.imageAlt} loading="lazy" />
                <span className="card-arrow">
                  <ArrowIcon diagonal />
                </span>
              </div>
            )}
            <div className="journal-card-copy">
              <div className="journal-meta">
                <span>{card.label}</span>
                {card.meta && <span>{card.meta}</span>}
              </div>
              <h3 className="expressive">{card.title}</h3>
              <p className="journal-card-description">{card.description}</p>
              <span className="journal-read">
                {t(card.link.kind === "external" ? common.readInterview : journalMessages.readStory)}
                <ArrowIcon diagonal={card.link.kind === "external"} />
              </span>
              {card.source && <small>{card.source}</small>}
            </div>
          </>
        );
        return (
          <CardLink key={card.id} link={card.link} className={className}>
            {content}
          </CardLink>
        );
      })}
      {!visible.length && (
        <div className="journal-empty">
          <h2>{t(journalMessages.emptyTitle)}</h2>
          <p>{t(journalMessages.emptyBody)}</p>
          <button className="action-link" onClick={() => onTopicChange?.("interviews")}>
            {t(journalMessages.readInterviews)}
            <ArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function CardLink({
  link,
  className,
  children,
}: {
  link: JournalCard["link"];
  className: string;
  children: ReactNode;
}) {
  if (link.kind === "external") {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <SiteLink to={link.to} className={className}>
      {children}
    </SiteLink>
  );
}
