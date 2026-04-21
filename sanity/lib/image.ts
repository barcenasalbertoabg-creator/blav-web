import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) throw new Error("Sanity no configurado");
  return builder.image(source);
}

export function resolveImageUrl(
  imageField:
    | { asset?: { url?: string } | null; urlExterna?: string | null }
    | null
    | undefined
): string {
  if (!imageField) return "";
  if (imageField.urlExterna) return imageField.urlExterna;
  if (imageField.asset?.url) return imageField.asset.url;
  return "";
}
