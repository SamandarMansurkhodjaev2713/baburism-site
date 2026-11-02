import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  // The bare site root shows the Russian home page and then moves the visitor to their language.
  index("routes/root-index.tsx"),
  route(":locale", "routes/locale-layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("catalog", "routes/catalog.tsx"),
    route("favorites", "routes/favorites.tsx"),
    route("works", "routes/works.tsx"),
    route("artwork/:slug", "routes/artwork.tsx"),
    route("product/:slug", "routes/product.tsx"),
    route("journal", "routes/journal.tsx"),
    route("journal/:slug", "routes/article.tsx"),
    route("visit", "routes/visit.tsx"),
    route("privacy", "routes/privacy.tsx"),
  ]),
  route("*", "routes/unmatched.tsx"),
] satisfies RouteConfig;
