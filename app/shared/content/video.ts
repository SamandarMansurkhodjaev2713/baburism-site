const YOUTUBE_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
];
const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;

/** Converts a public YouTube or Vimeo link to its privacy-friendly embed URL. Anything else is rejected. */
export function getVideoEmbedUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);

  let youtubeId: string | null = null;
  if (host === "youtu.be" || host === "www.youtu.be") {
    if (parts.length === 1) youtubeId = parts[0] ?? null;
  } else if (YOUTUBE_HOSTS.includes(host)) {
    if (url.pathname === "/watch") youtubeId = url.searchParams.get("v");
    else if (parts.length === 2 && (parts[0] === "embed" || parts[0] === "shorts"))
      youtubeId = parts[1] ?? null;
  }
  if (youtubeId && YOUTUBE_ID.test(youtubeId)) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;

  if (
    (host === "vimeo.com" || host === "www.vimeo.com") &&
    parts.length === 1 &&
    VIMEO_ID.test(parts[0] ?? "")
  ) {
    return `https://player.vimeo.com/video/${parts[0]}`;
  }
  if (
    host === "player.vimeo.com" &&
    parts.length === 2 &&
    parts[0] === "video" &&
    VIMEO_ID.test(parts[1] ?? "")
  ) {
    return `https://player.vimeo.com/video/${parts[1]}`;
  }
  return null;
}
