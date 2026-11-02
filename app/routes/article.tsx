import { useParams } from "react-router";
import { ArticlePage } from "~/features/journal/article-page";
import { findArticle } from "~/shared/content";
import { pickLocalized } from "~/shared/i18n/locale";
import { localeFromParam, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/article";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "journal" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  const article = findArticle(params.slug);
  return pageMeta({
    locale,
    path: `journal/${params.slug}`,
    title: article && pickLocalized(article.title, locale),
    description: article && pickLocalized(article.description, locale),
    image: article?.image || undefined,
  });
};

export default function ArticleRoute() {
  const article = findArticle(useParams().slug);
  if (!article) throw new Response(null, { status: 404 });
  return <ArticlePage article={article} />;
}
