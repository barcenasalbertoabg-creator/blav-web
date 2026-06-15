import type { PortableTextBlock } from "@/types/project";

export function generarFolio(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return `QRO-${String(Math.abs(hash) % 10000).padStart(4, "0")}`;
}

export function extractCoordsFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

export function portableTextToPlain(
  blocks: PortableTextBlock[] | string | null | undefined
): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => b.children.map((c) => c.text).join(""))
    .filter(Boolean)
    .join("\n\n");
}

export function formatPrecio(precio: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "MXN",
    maximumFractionDigits: 0,
  }).format(precio);
}
