import type { Localized } from "~/shared/i18n/locale";
import { useLocale } from "~/shared/i18n/locale-context";
import { ArrowIcon } from "~/shared/ui/icons";
import { SiteLink } from "../layout/site-link";

const messages = {
  title: { ru: "Ваши данные", uz: "Maʼlumotlaringiz", en: "Your information" },
  messages: {
    ru: "Сайт не хранит сообщения. Форма и подборка готовят текст, который открывается в Telegram: вы видите его целиком и отправляете сами. Дальше переписка подчиняется правилам Telegram.",
    uz: "Sayt xabarlarni saqlamaydi. Shakl va tanlov Telegramda ochiladigan matnni tayyorlaydi: uni toʻliq koʻrasiz va oʻzingiz yuborasiz. Keyingi yozishmalar Telegram qoidalariga boʻysunadi.",
    en: "The site does not store messages. The form and your selection prepare a text that opens in Telegram, where you see it in full and send it yourself. The conversation then follows Telegram’s terms.",
  },
  browser: {
    ru: "В браузере сохраняются выбранный язык и избранные предметы. Они не покидают ваше устройство. Рекламные и аналитические трекеры на сайте не используются.",
    uz: "Brauzerda tanlangan til va saralangan buyumlar saqlanadi. Ular qurilmangizdan chiqmaydi. Saytda reklama va analitika trekerlari ishlatilmaydi.",
    en: "Your language choice and saved objects are kept in your browser and never leave your device. The site uses no advertising or analytics trackers.",
  },
  hosting: {
    ru: "Сайт размещён на GitHub Pages; сервис хостинга может вести технические журналы посещений. Реквизиты оператора и отдельный контакт по вопросам персональных данных пока не опубликованы.",
    uz: "Sayt GitHub Pages’da joylashgan; xosting xizmati tashriflarning texnik jurnallarini yuritishi mumkin. Operator maʼlumotlari va shaxsiy maʼlumotlar boʻyicha alohida aloqa manzili hali eʼlon qilinmagan.",
    en: "The site is hosted on GitHub Pages, which may keep technical access logs. Operator details and a dedicated privacy contact have not yet been published.",
  },
  contact: { ru: "Связаться с пространством", uz: "Makon bilan bogʻlanish", en: "Contact the space" },
} as const satisfies Record<string, Localized>;

export function PrivacyPage() {
  const { t } = useLocale();
  return (
    <section className="section privacy-page">
      <h1 className="expressive">{t(messages.title)}</h1>
      <div className="article-body">
        <p>{t(messages.messages)}</p>
        <p>{t(messages.browser)}</p>
        <p>{t(messages.hosting)}</p>
        <SiteLink to="visit" className="action-link">
          {t(messages.contact)}
          <ArrowIcon />
        </SiteLink>
      </div>
    </section>
  );
}
