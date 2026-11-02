import { useParams } from "react-router";
import { ProductPage } from "~/features/shop/product-page";
import { findProduct } from "~/shared/content";
import { pickLocalized } from "~/shared/i18n/locale";
import { localeFromParam, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/product";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "product" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) => {
  const locale = localeFromParam(params.locale);
  const product = findProduct(params.slug);
  return pageMeta({
    locale,
    path: `product/${params.slug}`,
    title: product && pickLocalized(product.title, locale),
    description: product && pickLocalized(product.description, locale),
    image: product?.image,
  });
};

export default function ProductRoute() {
  const product = findProduct(useParams().slug);
  if (!product) throw new Response(null, { status: 404 });
  return <ProductPage product={product} />;
}
