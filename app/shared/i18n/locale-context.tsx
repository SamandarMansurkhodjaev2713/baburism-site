import { createContext, useContext, useMemo, type ReactNode } from "react";
import { pickLocalized, type Locale, type Localized, type LocalizedDraft } from "./locale";

type LocaleContextValue = {
  locale: Locale;
  /** Translates a message from a typed catalogue. */
  t: (message: Localized) => string;
  /** Reads editable content, falling back to Russian when a translation is missing. */
  text: (value: LocalizedDraft | undefined) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: (message) => message[locale],
      text: (content) => pickLocalized(content, locale),
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside <LocaleProvider>.");
  return value;
}
