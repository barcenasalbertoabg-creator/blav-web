import { client } from "@/../../sanity/lib/client";
import {
  ALL_PROJECTS_QUERY,
  ALL_SLUGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "@/../../sanity/lib/queries";
import { resolveImageUrl } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";
import type { Project } from "@/types/project";

type SanityImageRaw = {
  urlExterna?: string | null;
  asset?: { url?: string; _id?: string } | null;
};

type SanityProjectRaw = Omit<Project, "imagen_portada" | "imagenes" | "seo"> & {
  imagenPortadaRaw: SanityImageRaw;
  imagenesRaw: SanityImageRaw[];
  seo: Omit<Project["seo"], "og_imagen"> & { ogImagenRaw: SanityImageRaw };
};

function normalizeProject(raw: SanityProjectRaw): Project {
  return {
    ...raw,
    imagen_portada: resolveImageUrl(raw.imagenPortadaRaw),
    imagenes: (raw.imagenesRaw ?? []).map((img) => resolveImageUrl(img)).filter(Boolean),
    seo: {
      ...raw.seo,
      og_imagen: resolveImageUrl(raw.seo?.ogImagenRaw),
    },
  };
}

// Si no hay projectId configurado (build sin .env.local), retorna vacío
function isSanityConfigured(): boolean {
  return !!projectId;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw: SanityProjectRaw[] = await client.fetch(ALL_PROJECTS_QUERY);
    return (raw ?? []).map(normalizeProject);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSanityConfigured()) return null;
  try {
    const raw: SanityProjectRaw | null = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug });
    if (!raw) return null;
    return normalizeProject(raw);
  } catch {
    return null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  try {
    const slugs: (string | null)[] = await client.fetch(ALL_SLUGS_QUERY);
    return (slugs ?? []).filter((s): s is string => !!s);
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw: SanityProjectRaw[] = await client.fetch(FEATURED_PROJECTS_QUERY);
    return (raw ?? []).map(normalizeProject);
  } catch {
    return [];
  }
}
