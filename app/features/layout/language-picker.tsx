import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router";
import { LOCALE_NAMES, LOCALES, type Locale } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { common } from "~/shared/i18n/common-messages";

type LanguagePickerProps = {
  pickerRef: RefObject<HTMLDivElement | null>;
  onChange: (locale: Locale) => void;
};

export function LanguagePicker({ pickerRef, onChange }: LanguagePickerProps) {
  const { locale, t } = useLocale();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  // A navigation closes the list (state adjusted during render, as React recommends over an effect).
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      pickerRef.current?.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyDown);
    };
  }, [open, pickerRef]);

  const choose = (code: Locale) => {
    setOpen(false);
    onChange(code);
  };

  return (
    <div className="language-picker" ref={pickerRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="language-options"
        aria-label={t(common.changeLanguage)}
      >
        {locale.toUpperCase()}
        <span className={open ? "chevron open" : "chevron"}>⌄</span>
      </button>
      {open && (
        <div className="language-options" id="language-options">
          {LOCALES.map((code) => (
            <button
              key={code}
              lang={code}
              aria-current={code === locale ? "true" : undefined}
              onClick={() => choose(code)}
            >
              {LOCALE_NAMES[code]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
