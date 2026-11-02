import { products, settings } from "~/shared/content";
import { useHydrated } from "~/shared/hooks/use-hydrated";
import type { Locale, Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { absoluteUrl, localePath } from "~/shared/routing/urls";
import { ShopArrowIcon } from "~/shared/ui/icons";
import { CopyButton } from "./copy-button";
import { prepareEnquiry, type Enquiry, type EnquiryLinks } from "./enquiry";
import { shopMessages } from "./messages";
import type { SavedProduct } from "./selection";

export function enquiryLinks(locale: Locale): EnquiryLinks {
  return {
    product: (slug) => absoluteUrl(localePath(locale, `product/${encodeURIComponent(slug)}`)),
    selection: (code) => absoluteUrl(localePath(locale, `favorites?items=${code}`)),
  };
}

function hint(items: readonly SavedProduct[], enquiry: Enquiry): Localized {
  if (!items.length) return shopMessages.selectAtLeastOne;
  if (!enquiry.valid) return shopMessages.checkSelection;
  if (!settings.salesTelegram) return shopMessages.recipientPending;
  if (enquiry.tooLong) return shopMessages.draftTooLong;
  return shopMessages.chatOpens;
}

/** Prepares a Telegram message about the chosen objects. The visitor reviews and sends it themselves. */
export function EnquiryPanel({ items }: { items: readonly SavedProduct[] }) {
  const { locale, t } = useLocale();
  // Links carry the visitor's origin, which is only known in the browser.
  const hydrated = useHydrated();
  const enquiry = prepareEnquiry(items, products, locale, enquiryLinks(locale), settings.salesTelegram);
  const draft = hydrated ? enquiry.text : "";
  const chatUrl = hydrated ? enquiry.url : null;

  return (
    <div className="shop-enquiry">
      {chatUrl ? (
        <a className="button button-dark" href={chatUrl} target="_blank" rel="noopener noreferrer">
          {t(shopMessages.discussInTelegram)}
          <ShopArrowIcon />
        </a>
      ) : (
        <button className="button button-dark" disabled>
          {t(shopMessages.discussInTelegram)}
          <ShopArrowIcon />
        </button>
      )}
      <p className="shop-enquiry-hint" role="status">
        {t(hint(items, enquiry))}
      </p>
      {items.length > 0 && (
        <details className="shop-draft">
          <summary>{t(shopMessages.enquiryDraft)}</summary>
          <textarea
            aria-label={t(shopMessages.preparedMessage)}
            readOnly
            value={draft}
            rows={Math.min(12, 5 + items.length * 3)}
          />
          {enquiry.compact && <p>{t(shopMessages.compactDraft)}</p>}
          <CopyButton value={draft}>{t(shopMessages.copyDraft)}</CopyButton>
        </details>
      )}
    </div>
  );
}
