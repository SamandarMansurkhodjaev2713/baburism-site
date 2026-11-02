import { settings } from "~/shared/content";

/** Phone and email from settings, as tappable links. Renders nothing for missing values. */
export function ContactLinks() {
  return (
    <>
      {settings.phone && <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>{settings.phone}</a>}
      {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
    </>
  );
}
