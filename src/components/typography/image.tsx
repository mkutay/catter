import Image, { type ImageProps } from "next/image";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { getPlaceholder } from "@/lib/images";

/**
 * Renders an image with a placeholder if the source is a string.
 *
 * Uses Next.js's `Image` component in any case, with a custom `src` prop
 * that includes the placeholder data if the source is a string.
 *
 * @param props `img` tag props or `Image` component props
 */
export const image = async (
  props:
    | DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
    | ImageProps,
) => {
  const src = props.src;
  if (!src || src instanceof Blob) return;
  const alt = props.alt ?? "";

  if (typeof src !== "string")
    return (
      <Image
        {...props}
        src={src}
        alt={alt}
        width={Number(props.width)}
        height={Number(props.height)}
      />
    );

  const imageUrl = src.startsWith("/") ? src : `/${src}`;
  const { metadata, base64 } = await getPlaceholder(src).match(
    (placeholder) => ({
      metadata: placeholder.metadata,
      base64: placeholder.base64 as `data:image/${string}`,
    }),
    (err) => {
      throw new Error(err.message);
    },
  );

  return (
    <Image
      alt={alt}
      src={`/api${imageUrl}`}
      className="my-8 lg:rounded-md rounded-sm"
      width={metadata.width}
      height={metadata.height}
      placeholder={base64}
      quality={75}
    />
  );
};
