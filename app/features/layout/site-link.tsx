import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { scrollToTop } from "~/shared/dom";
import { useLocale } from "~/shared/i18n/locale-context";
import { localePath } from "~/shared/routing/urls";
import { useShell } from "./shell-context";

type SiteLinkProps = {
  /** Route inside the current language, e.g. "catalog" or "product/cup"; "" is the home page. */
  to?: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | "true";
};

/** Client-side link within the current language. Following a link to the current page scrolls to its top. */
export function SiteLink({ to = "", children, className, ...aria }: SiteLinkProps) {
  const { locale } = useLocale();
  const { closeMenu } = useShell();
  const location = useLocation();
  const target = localePath(locale, to);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    closeMenu();
    if (target === location.pathname + location.search + location.hash) {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <Link {...aria} to={target} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
