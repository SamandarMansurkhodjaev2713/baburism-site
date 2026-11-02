import type { Locale, Localized } from "~/shared/i18n/locale";

export type ContactDraft = { name: string; contact: string; message: string };
export type ContactField = keyof ContactDraft;
export type ContactValidation = { valid: true } | { valid: false; field: ContactField; error: Localized };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,40}$/;
const MESSENGER = /^@[a-zA-Z0-9_]{4,64}$/;

const errors = {
  name: {
    ru: "Укажите имя длиной не менее 2 символов.",
    uz: "Ismingizni kamida 2 ta belgi bilan kiriting.",
    en: "Enter your name using at least 2 characters.",
  },
  contact: {
    ru: "Укажите e-mail, телефон с кодом страны (от 7 до 18 цифр) или @имя в мессенджере.",
    uz: "E-mail, mamlakat kodi bilan telefon (7 tadan 18 tagacha raqam) yoki @foydalanuvchi nomini kiriting.",
    en: "Enter an email, a phone number with country code (7 to 18 digits), or an @messenger username.",
  },
  message: {
    ru: "Напишите сообщение длиной не менее 3 символов.",
    uz: "Kamida 3 ta belgidan iborat xabar yozing.",
    en: "Write a message with at least 3 characters.",
  },
} as const satisfies Record<ContactField, Localized>;

export function isValidContact(value: string): boolean {
  const digits = value.replace(/\D/g, "").length;
  return EMAIL.test(value) || (PHONE.test(value) && digits >= 7 && digits <= 18) || MESSENGER.test(value);
}

export function validateContact(draft: ContactDraft): ContactValidation {
  if (draft.name.length < 2) return { valid: false, field: "name", error: errors.name };
  if (!isValidContact(draft.contact)) return { valid: false, field: "contact", error: errors.contact };
  if (draft.message.length < 3) return { valid: false, field: "message", error: errors.message };
  return { valid: true };
}

const labels = {
  greeting: {
    ru: "Здравствуйте! Пишу с сайта Baburism.",
    uz: "Salom! Baburism saytidan yozyapman.",
    en: "Hello! I am writing from the Baburism website.",
  },
  subject: { ru: "Предмет", uz: "Buyum", en: "Object" },
  name: { ru: "Имя", uz: "Ism", en: "Name" },
  contact: { ru: "Контакт", uz: "Aloqa", en: "Contact" },
} as const satisfies Record<string, Localized>;

/** Message text for the chat; the subject names the object when the form is on a product page. */
export function composeContactMessage(draft: ContactDraft, locale: Locale, subject = ""): string {
  const heading = [labels.greeting[locale], ...(subject ? [`${labels.subject[locale]}: ${subject}`] : [])];
  return [
    ...heading,
    "",
    draft.message,
    "",
    `${labels.name[locale]}: ${draft.name}`,
    `${labels.contact[locale]}: ${draft.contact}`,
  ].join("\n");
}
