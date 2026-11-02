import { useRef, useState, type FormEvent } from "react";
import { settings } from "~/shared/content";
import { telegramChatUrl, telegramUsername } from "~/shared/content/telegram";
import { useLocale } from "~/shared/i18n/locale-context";
import { documentPath, localePath } from "~/shared/routing/urls";
import { ArrowIcon } from "~/shared/ui/icons";
import { composeContactMessage, validateContact, type ContactDraft } from "./contact-message";
import { contactMessages } from "./messages";

type ContactFormProps = {
  /** Object name when the form is on a product page. */
  subject?: string;
  /** Object reference appended to the subject. */
  subjectReference?: string;
};

type Status = { state: "editing"; error: string } | { state: "sent" };

function readDraft(form: HTMLFormElement): ContactDraft {
  const data = new FormData(form);
  const field = (name: keyof ContactDraft) => {
    const value = data.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  return { name: field("name"), contact: field("contact"), message: field("message") };
}

/**
 * The site has no server, so the form prepares a Telegram message to the team and opens
 * the chat; the visitor sends it there. Without a configured account the form stays disabled.
 */
export function ContactForm({ subject = "", subjectReference = "" }: ContactFormProps) {
  const { locale, t } = useLocale();
  const recipient = telegramUsername(settings.salesTelegram);
  const [status, setStatus] = useState<Status>({ state: "editing", error: "" });
  const successRef = useRef<HTMLDivElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recipient) return;
    const form = event.currentTarget;
    const draft = readDraft(form);
    const result = validateContact(draft);
    if (!result.valid) {
      setStatus({ state: "editing", error: t(result.error) });
      form.querySelector<HTMLElement>(`[name="${result.field}"]`)?.focus();
      return;
    }
    const fullSubject = subject + (subjectReference ? ` [${subjectReference}]` : "");
    window.open(
      telegramChatUrl(recipient, composeContactMessage(draft, locale, fullSubject)),
      "_blank",
      "noopener",
    );
    setStatus({ state: "sent" });
    requestAnimationFrame(() => successRef.current?.focus());
  };

  if (status.state === "sent") {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
        <h3>{t(contactMessages.sentTitle)}</h3>
        <p>{t(contactMessages.sentBody)}</p>
        <button className="text-link" onClick={() => setStatus({ state: "editing", error: "" })}>
          {t(contactMessages.writeAnother)}
          <ArrowIcon />
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h2 className="expressive form-title">
        {t(subject ? contactMessages.aboutObject : contactMessages.startConversation)}
      </h2>
      {subject && <p className="inquiry-item">{subject}</p>}
      <div className="form-row">
        <label>
          {t(contactMessages.name)}
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            placeholder={t(contactMessages.namePlaceholder)}
          />
        </label>
        <label>
          {t(contactMessages.contact)}
          <input
            name="contact"
            autoComplete="email"
            required
            minLength={5}
            maxLength={254}
            placeholder={t(contactMessages.contactPlaceholder)}
          />
        </label>
      </div>
      <label>
        {t(contactMessages.message)}
        <textarea
          name="message"
          required
          minLength={3}
          maxLength={4000}
          rows={3}
          placeholder={t(subject ? contactMessages.objectQuestion : contactMessages.generalQuestion)}
        />
      </label>
      {status.error && (
        <p className="form-error" role="alert">
          {status.error}
        </p>
      )}
      <div className="form-actions">
        <p>
          {t(recipient ? contactMessages.consent : contactMessages.unavailable)}{" "}
          <a
            href={documentPath(localePath(locale, "privacy"))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(contactMessages.privacyNewTab)}
          >
            {t(contactMessages.details)}
          </a>
        </p>
        <button className="button button-dark" disabled={!recipient}>
          {t(contactMessages.submit)}
          <ArrowIcon />
        </button>
      </div>
    </form>
  );
}
