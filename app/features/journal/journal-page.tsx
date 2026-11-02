import { ARTICLE_TOPICS } from "~/shared/content/schema";
import { useUrlSearchParams } from "~/shared/hooks/use-url-search-params";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { JournalCards, type TopicFilter } from "./journal-cards";
import { journalMessages, TOPIC_NAMES } from "./messages";

function parseTopic(value: string | null): TopicFilter {
  return ARTICLE_TOPICS.find((topic) => topic === value) ?? "all";
}

export function JournalPage() {
  const { t } = useLocale();
  const [params, setParams] = useUrlSearchParams();
  const topic = parseTopic(params.get("topic"));

  const chooseTopic = (next: TopicFilter) => {
    const query = new URLSearchParams(params);
    if (next === "all") query.delete("topic");
    else query.set("topic", next);
    setParams(query);
  };

  return (
    <section className="section journal-page">
      <div className="inner-hero">
        <h1 className="expressive">{t(journalMessages.pageTitle)}</h1>
        <p className="inner-intro">{t(journalMessages.pageIntro)}</p>
      </div>
      <div className="journal-tabs" role="group" aria-label={t(journalMessages.topic)}>
        <button aria-pressed={topic === "all"} onClick={() => chooseTopic("all")}>
          {t(common.allStories)}
        </button>
        {ARTICLE_TOPICS.map((item) => (
          <button key={item} aria-pressed={topic === item} onClick={() => chooseTopic(item)}>
            {t(TOPIC_NAMES[item])}
          </button>
        ))}
      </div>
      <JournalCards full topic={topic} onTopicChange={chooseTopic} />
    </section>
  );
}
