import { useState } from "react";
import { getVideoEmbedUrl } from "~/shared/content/video";
import { useLocale } from "~/shared/i18n/locale-context";
import { PlayIcon } from "~/shared/ui/icons";
import { journalMessages } from "./messages";

/** The third-party player loads only after the visitor asks for it. */
export function VideoBlock({ url, title }: { url: string; title: string }) {
  const { t } = useLocale();
  const [loaded, setLoaded] = useState(false);
  const embedUrl = getVideoEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="article-video">
      {loaded ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      ) : (
        <div className="video-prompt">
          <p>{t(journalMessages.video)}</p>
          <button className="action-link action-dark" onClick={() => setLoaded(true)}>
            <span>{t(journalMessages.loadVideo)}</span>
            <PlayIcon />
          </button>
          <span>{t(journalMessages.videoNotice)}</span>
        </div>
      )}
    </div>
  );
}
