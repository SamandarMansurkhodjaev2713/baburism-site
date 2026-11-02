import { Link } from "react-router";
import type { Locale, Localized } from "~/shared/i18n/locale";
import { localePath } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";

const messages = {
  notFoundTitle: { ru: "Страница не найдена", uz: "Sahifa topilmadi", en: "Page not found" },
  notFoundBody: {
    ru: "Этот адрес больше не доступен. Продолжите знакомство с пространством на главной.",
    uz: "Bu manzil endi mavjud emas. Makon bilan tanishishni bosh sahifada davom ettiring.",
    en: "This address is no longer available. Continue exploring the space from the home page.",
  },
  errorTitle: { ru: "Что-то пошло не так", uz: "Nimadir notoʻgʻri ketdi", en: "Something went wrong" },
  errorBody: {
    ru: "Страницу не удалось показать. Попробуйте обновить её или вернитесь на главную.",
    uz: "Sahifani koʻrsatib boʻlmadi. Uni yangilang yoki bosh sahifaga qayting.",
    en: "This page could not be shown. Try reloading it or return to the home page.",
  },
  home: { ru: "На главную", uz: "Bosh sahifaga", en: "Back to home" },
} as const satisfies Record<string, Localized>;

/** A standalone page, outside the site shell, for unknown addresses and unexpected errors. */
export function NotFoundPage({
  locale,
  kind = "not-found",
}: {
  locale: Locale;
  kind?: "not-found" | "error";
}) {
  const home = localePath(locale);
  const notFound = kind === "not-found";
  return (
    <main className="not-found-page" lang={locale}>
      <Link to={home} className="wordmark">
        baburism
      </Link>
      {notFound && <p className="not-found-code">404</p>}
      <h1>{(notFound ? messages.notFoundTitle : messages.errorTitle)[locale]}</h1>
      <p>{(notFound ? messages.notFoundBody : messages.errorBody)[locale]}</p>
      <Link to={home} className="text-link">
        {messages.home[locale]}
        <ArrowIcon />
      </Link>
    </main>
  );
}
