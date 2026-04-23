import { client } from "@/../../sanity/lib/client";
import {
  ALL_PROPIEDADES_QUERY,
  FEATURED_PROPIEDADES_QUERY,
  PROPIEDAD_BY_SLUG_QUERY,
  ALL_PROPIEDAD_SLUGS_QUERY,
} from "@/../../sanity/lib/queries";
import { resolveImageUrl } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";
import type { Propiedad } from "@/types/propiedad";

type SanityImageRaw = {
  urlExterna?: string | null;
  asset?: { url?: string; _id?: string } | null;
};

type SanityPropiedadRaw = Omit<Propiedad, "imagen_portada" | "imagenes" | "seo"> & {
  imagenPortadaRaw: SanityImageRaw;
  imagenesRaw: SanityImageRaw[];
  seo: Omit<Propiedad["seo"], "og_imagen"> & { ogImagenRaw: SanityImageRaw };
};

function normalizePropiedad(raw: SanityPropiedadRaw): Propiedad {
  const waMsg = raw.whatsapp_mensaje?.replace("[título]", raw.titulo) ??
    `Hola, me interesa la propiedad "${raw.titulo}". ¿Pueden darme más información?`;

  return {
    ...raw,
    imagen_portada: resolveImageUrl(raw.imagenPortadaRaw),
    imagenes: (raw.imagenesRaw ?? []).map((img) => resolveImageUrl(img)).filter(Boolean),
    whatsapp_mensaje: waMsg,
    seo: {
      titulo: raw.seo?.titulo || raw.titulo,
      descripcion: raw.seo?.descripcion || raw.descripcion_corta,
      og_imagen: resolveImageUrl(raw.seo?.ogImagenRaw) || raw.imagenPortadaRaw ? resolveImageUrl(raw.imagenPortadaRaw) : "",
    },
  };
}

function isSanityConfigured(): boolean {
  return !!projectId;
}

export async function getAllPropiedades(): Promise<Propiedad[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw: SanityPropiedadRaw[] = await client.fetch(ALL_PROPIEDADES_QUERY);
    return (raw ?? []).map(normalizePropiedad);
  } catch {
    return [];
  }
}

export async function getPropiedadBySlug(slug: string): Promise<Propiedad | null> {
  if (!isSanityConfigured()) return null;
  try {
    const raw: SanityPropiedadRaw | null = await client.fetch(PROPIEDAD_BY_SLUG_QUERY, { slug });
    if (!raw) return null;
    return normalizePropiedad(raw);
  } catch {
    return null;
  }
}

export async function getPropiedadSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  try {
    const slugs: (string | null)[] = await client.fetch(ALL_PROPIEDAD_SLUGS_QUERY);
    return (slugs ?? []).filter((s): s is string => !!s);
  } catch {
    return [];
  }
}

export async function getFeaturedPropiedades(): Promise<Propiedad[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw: SanityPropiedadRaw[] = await client.fetch(FEATURED_PROPIEDADES_QUERY);
    return (raw ?? []).map(normalizePropiedad);
  } catch {
    return [];
  }
}
