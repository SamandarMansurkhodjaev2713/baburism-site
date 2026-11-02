import { articles, type Article } from "~/shared/content";
import { common } from "~/shared/i18n/common-messages";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";
import { useShell } from "../layout/shell-context";
import { SiteLink } from "../layout/site-link";
import { journalMessages, TOPIC_NAMES } from "./messages";
import { VideoBlock } from "./video-block";

const RELATED_COUNT = 2;

export function ArticlePage({ article }: { article: Article }) {
  const { t, text } = useLocale();
  const { openLightbox } = useShell();
  const title = text(article.title);
  const quote = text(article.quote);
  const quoteAuthor = text(article.quoteAuthor);
  const gallery = article.images.map((src) => ({ src, title }));
  const related = articles
    .filter((item) => item.slug !== article.slug && item.topic === article.topic)
    .slice(0, RELATED_COUNT);

  return (
    <article className="section article-page">
      <SiteLink to="journal" className="back-link">
        <span className="arrow-back">
          <ArrowIcon />
        </span>
        Journal
      </SiteLink>
      <h1 className="expressive">{title}</h1>
      <p className="article-topic">{t(TOPIC_NAMES[article.topic])}</p>
      <p className="lead">{text(article.description)}</p>
      {article.image && <img src={publicAsset(article.image)} alt={title} loading="eager" />}
      <div className="article-body">
        {text(article.body)
          .split("\n\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>
      {quote && (
        <blockquote className="article-quote">
          <p>{quote}</p>
          {quoteAuthor && <cite>{quoteAuthor}</cite>}
        </blockquote>
      )}
      {gallery.length > 0 && (
        <div className="article-gallery">
          {gallery.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              aria-label={`${t(journalMessages.viewImage)} ${index + 1}`}
              onClick={() => openLightbox(image, gallery)}
            >
              <img src={publicAsset(image.src)} alt={`${title} / ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {article.videoUrl && <VideoBlock key={article.videoUrl} url={article.videoUrl} title={title} />}
      <div className="article-ending">
        {article.sourceUrl && (
          <a className="text-link" href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
            {t(common.openSource)}
            <ArrowIcon diagonal />
          </a>
        )}
        <SiteLink to="journal" className="action-link">
          {t(journalMessages.moreStories)}
          <ArrowIcon />
        </SiteLink>
      </div>
      {related.length > 0 && (
        <section className="related-articles">
          <h2>{t(journalMessages.keepReading)}</h2>
          {related.map((item) => (
            <SiteLink key={item.slug} to={`journal/${item.slug}`}>
              {item.image && <img src={publicAsset(item.image)} alt="" loading="lazy" />}
              <span>{text(item.title)}</span>
              <ArrowIcon />
            </SiteLink>
          ))}
        </section>
      )}
    </article>
  );
}
