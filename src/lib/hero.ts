import { getAllFeaturedProjects } from "@/lib/projects";
import { getAllFeaturedPropiedades } from "@/lib/propiedades";

export interface HeroImage {
  src: string;
  alt: string;
}

// Fallback: la imagen del acueducto que ya usaba el hero antes del slideshow
const FALLBACK_IMAGE: HeroImage = {
  src: "https://images.unsplash.com/photo-1679157381710-42b20b9eb032?w=1920&q=80",
  alt: "BLAV Bienes Raíces",
};

const MIN_IMAGES = 3;

export async function getHeroImages(): Promise<HeroImage[]> {
  const [proyectos, propiedades] = await Promise.all([
    getAllFeaturedProjects(),
    getAllFeaturedPropiedades(),
  ]);

  const proyectoImages: HeroImage[] = proyectos
    .filter((p) => p.imagen_portada)
    .map((p) => ({ src: p.imagen_portada, alt: p.nombre }));

  const propiedadImages: HeroImage[] = propiedades
    .filter((p) => p.imagen_portada)
    .map((p) => ({ src: p.imagen_portada, alt: p.titulo }));

  // Alterna proyecto/propiedad para variar el tipo de foto en el slideshow
  const images: HeroImage[] = [];
  const max = Math.max(proyectoImages.length, propiedadImages.length);
  for (let i = 0; i < max; i++) {
    if (proyectoImages[i]) images.push(proyectoImages[i]);
    if (propiedadImages[i]) images.push(propiedadImages[i]);
  }

  while (images.length < MIN_IMAGES) {
    images.push(FALLBACK_IMAGE);
  }

  return images;
}
