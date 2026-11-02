import { HomePage } from "~/features/home/home-page";
import { localeFromParam, pageMeta } from "~/shared/routing/meta";
import type { Route } from "./+types/home";
import type { PageHandle } from "./locale-layout";

export const handle = { page: "home" } satisfies PageHandle;

export const meta = ({ params }: Route.MetaArgs) =>
  pageMeta({ locale: localeFromParam(params.locale), path: "" });

export default HomePage;
