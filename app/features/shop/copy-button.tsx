import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale } from "~/shared/i18n/locale-context";
import { shopMessages } from "./messages";

type CopyState = { value: string; status: "copied" | "error" } | null;

/** Copies text to the clipboard; if the browser refuses, shows the text selected for manual copying. */
export function CopyButton({ value, children }: { value: string; children: ReactNode }) {
  const { t } = useLocale();
  const [state, setState] = useState<CopyState>(null);
  const fallback = useRef<HTMLTextAreaElement>(null);
  // A result belongs to the text it was produced for.
  const status = state?.value === value ? state.status : "idle";

  useEffect(() => {
    if (status !== "error") return;
    const frame = requestAnimationFrame(() => {
      fallback.current?.focus();
      fallback.current?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState({ value, status: "copied" });
    } catch {
      setState({ value, status: "error" });
    }
  };

  return (
    <div className="shop-copy">
      <button className="shop-text-button" disabled={!value} onClick={() => void copy()}>
        {status === "copied" ? t(shopMessages.copied) : children}
      </button>
      <span className="sr-only" role="status">
        {status === "copied" ? t(shopMessages.copiedToClipboard) : ""}
      </span>
      {status === "error" && (
        <label>
          <span>{t(shopMessages.copyBlocked)}</span>
          <textarea ref={fallback} readOnly value={value} rows={4} />
        </label>
      )}
    </div>
  );
}
