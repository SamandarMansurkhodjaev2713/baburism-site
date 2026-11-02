import { useState } from "react";
import { useLocale } from "~/shared/i18n/locale-context";
import { publicAsset } from "~/shared/routing/urls";
import { shopMessages } from "./messages";

type ShopImageProps = { src: string; alt: string; eager?: boolean };

/** Product imagery with a quiet text placeholder when a file is missing or fails to load. */
export function ShopImage({ src, alt, eager = false }: ShopImageProps) {
  const { t } = useLocale();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <span className="shop-photo-empty">{t(shopMessages.imageUnavailable)}</span>;
  }
  return (
    <img
      src={publicAsset(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailedSrc(src)}
    />
  );
}
