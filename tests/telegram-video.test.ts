import { describe, expect, it } from "vitest";
import { telegramChatUrl, telegramUsername } from "~/shared/content/telegram";
import { getVideoEmbedUrl } from "~/shared/content/video";

describe("telegramUsername", () => {
  it.each([
    ["@baburism_shop", "baburism_shop"],
    ["baburism_shop", "baburism_shop"],
    ["https://t.me/baburism_shop", "baburism_shop"],
    ["https://t.me/baburism_shop/", "baburism_shop"],
    ["  @baburism_shop  ", "baburism_shop"],
  ])("accepts %j", (input, expected) => {
    expect(telegramUsername(input)).toBe(expected);
  });

  it.each([
    "",
    "@abc",
    "@1abcde",
    "@has space",
    "https://t.me/joinchat",
    "https://t.me/share",
    "https://t.me/user?start=1",
    "https://example.com/baburism_shop",
    "http://t.me/baburism_shop",
    "https://user:pass@t.me/baburism_shop",
  ])("rejects %j", (input) => {
    expect(telegramUsername(input)).toBeNull();
  });

  it("builds a chat link that carries the text without sending it", () => {
    expect(telegramChatUrl("baburism_shop", "Hi & bye\nline")).toBe(
      "https://t.me/baburism_shop?text=Hi%20%26%20bye%0Aline",
    );
  });
});

describe("getVideoEmbedUrl", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://vimeo.com/123456789", "https://player.vimeo.com/video/123456789"],
    ["https://player.vimeo.com/video/123456789", "https://player.vimeo.com/video/123456789"],
  ])("embeds %s", (input, expected) => {
    expect(getVideoEmbedUrl(input)).toBe(expected);
  });

  it.each([
    "",
    "not a url",
    "http://youtu.be/dQw4w9WgXcQ",
    "https://youtu.be/short",
    "https://evil.example/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com:8443/watch?v=dQw4w9WgXcQ",
    "https://vimeo.com/abc",
  ])("rejects %j", (input) => {
    expect(getVideoEmbedUrl(input)).toBeNull();
  });
});
