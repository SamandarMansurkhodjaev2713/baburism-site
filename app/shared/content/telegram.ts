const RESERVED_PATHS = new Set(["share", "joinchat", "addstickers", "proxy", "login", "contact", "addlist"]);
const USERNAME = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

/**
 * Extracts a public Telegram username from `@name`, `name` or `https://t.me/name`.
 * Returns null for anything that is not a plain public account link.
 */
export function telegramUsername(value: string | undefined): string | null {
  if (!value) return null;
  let username = value.trim();
  if (username.startsWith("https://")) {
    let url: URL;
    try {
      url = new URL(username);
    } catch {
      return null;
    }
    if (url.hostname !== "t.me" || url.username || url.password || url.port || url.search || url.hash)
      return null;
    username = url.pathname.replace(/^\//, "").replace(/\/$/, "");
  }
  username = username.replace(/^@/, "");
  return USERNAME.test(username) && !RESERVED_PATHS.has(username.toLowerCase()) ? username : null;
}

/** A link that opens a chat with the account and pre-fills (but never sends) the message. */
export function telegramChatUrl(username: string, text: string): string {
  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}
