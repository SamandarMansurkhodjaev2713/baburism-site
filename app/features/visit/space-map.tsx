import { useState } from "react";
import { settings } from "~/shared/content";
import { useLocale } from "~/shared/i18n/locale-context";
import { ArrowIcon } from "~/shared/ui/icons";
import { visitMessages } from "./messages";

type MapMode = "closed" | "embedded" | "external";

/** The embedded map is heavy and needs WebGL; it loads only on request, with a plain link otherwise. */
function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

export function SpaceMap() {
  const { t } = useLocale();
  const [mode, setMode] = useState<MapMode>("closed");
  const { latitude, longitude } = settings;
  if (latitude === null || longitude === null) return null;

  const bbox = [
    Math.max(-180, longitude - 0.006),
    Math.max(-90, latitude - 0.004),
    Math.min(180, longitude + 0.006),
    Math.min(90, latitude + 0.004),
  ].join(",");
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${latitude},${longitude}`)}`;
  const mapUrl =
    settings.mapUrl ||
    `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;

  const externalLink = (
    <a
      className={mode === "embedded" ? "map-external-link" : "action-link"}
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t(visitMessages.openInMaps)}
      <ArrowIcon diagonal />
    </a>
  );

  return (
    <div className="space-map">
      {mode === "embedded" ? (
        <>
          <iframe
            src={embedUrl}
            title={t(visitMessages.mapTitle)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {externalLink}
        </>
      ) : (
        <div className="map-prompt">
          <h2>{t(visitMessages.findUs)}</h2>
          {settings.address && <p>{settings.address}</p>}
          {mode === "closed" ? (
            <button
              className="action-link"
              onClick={() => setMode(supportsWebGl() ? "embedded" : "external")}
            >
              {t(visitMessages.openMap)}
              <ArrowIcon diagonal />
            </button>
          ) : (
            <>
              <p>{t(visitMessages.mapFallback)}</p>
              {externalLink}
            </>
          )}
        </div>
      )}
    </div>
  );
}
