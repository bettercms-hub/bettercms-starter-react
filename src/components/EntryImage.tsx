/**
 * An entry's image field as one `<img>`.
 *
 * BetterCMS media (a `/media/<id>/…` URL) goes through the adapter's <BcmsImage>: the media
 * transform endpoint, a srcset, the value's crop and focal point. Any other URL is drawn as
 * stored, because <BcmsImage> reads a non-media URL's last path segment as an asset id and would
 * point the picture at the CDN, where it does not exist.
 *
 * Given `path`, both declare the field the same way (`data-bcms-field` + `data-bcms-kind="image"`
 * on the `<img>` itself, which is where the editor's image reflection patches `.src`).
 */
import { BcmsImage } from "@bettercms-ai/react";
import type { Image } from "../lib/content";

const isMedia = (url: string): boolean => {
  try {
    return new URL(url, "https://site.invalid").pathname.startsWith("/media/");
  } catch {
    return false;
  }
};

export interface EntryImageProps {
  image: Image;
  /** The field path in the editor grammar. Omit on a page that is not this entry's own route. */
  path?: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

export function EntryImage({ image, path, className, sizes, loading = "lazy" }: EntryImageProps) {
  const alt = image.alt ?? "";
  if (isMedia(image.url)) {
    return <BcmsImage src={image} path={path} alt={alt} className={className} sizes={sizes} loading={loading} />;
  }
  return (
    <img
      className={className}
      src={image.url}
      alt={alt}
      loading={loading}
      data-bcms-field={path}
      data-bcms-kind={path ? "image" : undefined}
    />
  );
}
