import { client } from "@/../../sanity/lib/client";
import { GALERIA_CIERRES_QUERY } from "@/../../sanity/lib/queries";
import { urlFor } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";

export interface FotoCierre {
  id: string;
  pie?: string;
  width: number;
  height: number;
  lqip?: string;
  src: string;      // versión media para el collage
  srcSet: string;   // anchos para el collage
  srcGrande: string; // versión para el lightbox
}

type SanityFotoCierreRaw = {
  _id: string;
  pie?: string | null;
  imagen: {
    asset: { _ref: string };
    hotspot?: unknown;
    crop?: unknown;
    width?: number;
    height?: number;
    lqip?: string;
  };
};

const ANCHOS = [400, 640, 800, 1200];

function normalizeFoto(raw: SanityFotoCierreRaw): FotoCierre {
  const img = raw.imagen;
  const base = () => urlFor(img).auto("format").fit("max").quality(80);
  return {
    id: raw._id,
    pie: raw.pie ?? undefined,
    width: img.width ?? 4,
    height: img.height ?? 3,
    lqip: img.lqip,
    src: base().width(800).url(),
    srcSet: ANCHOS.map((w) => `${base().width(w).url()} ${w}w`).join(", "),
    srcGrande: base().width(1800).quality(85).url(),
  };
}

export async function getGaleriaCierres(): Promise<FotoCierre[]> {
  if (!projectId) return [];
  try {
    const raw: SanityFotoCierreRaw[] = await client.fetch(GALERIA_CIERRES_QUERY);
    return (raw ?? []).filter((r) => r.imagen?.asset).map(normalizeFoto);
  } catch {
    return [];
  }
}
