import { useParams } from "react-router";
import { ArtworkPage } from "~/features/artworks/artwork-page";
import { findArtwork } from "~/shared/content/artworks";
import { localeFromParam, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/artwork";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "artwork" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  const artwork = findArtwork(params.slug);
  return pageMeta({
    locale,
    path: `artwork/${params.slug}`,
    title: artwork?.title[locale],
    image: artwork?.image.path,
  });
};

export default function ArtworkRoute() {
  const artwork = findArtwork(useParams().slug ?? "");
  if (!artwork) throw new Response(null, { status: 404 });
  return <ArtworkPage artwork={artwork} />;
}
