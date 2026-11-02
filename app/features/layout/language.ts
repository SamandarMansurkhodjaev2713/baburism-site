import { useCallback, useEffect, type RefObject } from "react";
import { useLocation, useNavigate } from "react-router";
import { isLocale, type Locale } from "~/shared/i18n/locale";

const PREFERRED_LANGUAGE_KEY = "baburism-language";
const FOCUS_LANGUAGE_KEY = "baburism-focus-language";
const FOCUS_ORIGIN_KEY = "baburism-focus-language-origin";

type SwitcherOrigin = "header" | "footer";

/** Storage can be unavailable (private mode, blocked cookies); language choice then simply is not remembered. */
function safely<T>(action: () => T): T | undefined {
  try {
    return action();
  } catch {
    return undefined;
  }
}

export function rememberLanguage(locale: Locale): void {
  safely(() => localStorage.setItem(PREFERRED_LANGUAGE_KEY, locale));
}

/** Saved choice first, then the browser language for Russian and Uzbek, otherwise English. */
export function preferredLanguage(): Locale {
  const saved = safely(() => localStorage.getItem(PREFERRED_LANGUAGE_KEY));
  if (isLocale(saved)) return saved;
  const browser = navigator.language.slice(0, 2);
  return browser === "ru" || browser === "uz" ? browser : "en";
}

function languageButton(origin: string | null | undefined, locale: Locale, headerPicker: HTMLElement | null) {
  return origin === "footer"
    ? document.querySelector<HTMLButtonElement>(`.footer-languages button[lang="${locale}"]`)
    : headerPicker?.querySelector("button");
}

/**
 * Switches the language while keeping the current page, query and hash. Focus returns to
 * the switcher the visitor used, which is re-created by the navigation.
 * With `detect`, the page (the bare site root) instead redirects to the visitor's language.
 */
export function useLanguageSwitch(
  locale: Locale,
  headerPicker: RefObject<HTMLElement | null>,
  detect: boolean,
) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (detect) {
      void navigate(`/${preferredLanguage()}`, { replace: true });
      return;
    }
    rememberLanguage(locale);
    if (safely(() => sessionStorage.getItem(FOCUS_LANGUAGE_KEY)) !== locale) return;
    const origin = safely(() => sessionStorage.getItem(FOCUS_ORIGIN_KEY));
    safely(() => {
      sessionStorage.removeItem(FOCUS_LANGUAGE_KEY);
      sessionStorage.removeItem(FOCUS_ORIGIN_KEY);
    });
    const frame = requestAnimationFrame(() =>
      languageButton(origin, locale, headerPicker.current)?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [locale, headerPicker, detect, navigate]);

  return useCallback(
    (next: Locale) => {
      const origin: SwitcherOrigin = document.activeElement?.closest(".footer-languages")
        ? "footer"
        : "header";
      rememberLanguage(next);
      if (next === locale) {
        requestAnimationFrame(() =>
          languageButton(origin, locale, headerPicker.current)?.focus({ preventScroll: true }),
        );
        return;
      }
      safely(() => {
        sessionStorage.setItem(FOCUS_LANGUAGE_KEY, next);
        sessionStorage.setItem(FOCUS_ORIGIN_KEY, origin);
      });
      const rest = location.pathname.replace(/^\/[^/]+/, "");
      void navigate(`/${next}${rest}${location.search}${location.hash}`, { preventScrollReset: true });
    },
    [locale, location, navigate, headerPicker],
  );
}
