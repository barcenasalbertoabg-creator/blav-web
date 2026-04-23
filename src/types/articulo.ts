import type { PortableTextBlock } from "./project";

export type CategoriaArticulo = "compra" | "renta" | "inversion" | "mercado" | "consejos";

export const CATEGORIA_LABEL: Record<CategoriaArticulo, string> = {
  compra:    "Compra",
  renta:     "Renta",
  inversion: "Inversión",
  mercado:   "Mercado",
  consejos:  "Consejos",
};

export interface Articulo {
  slug: string;
  titulo: string;
  categoria: CategoriaArticulo;
  descripcion_corta: string;
  imagen_portada: string;
  fecha: string;
  tiempo_lectura: number;
  contenido: PortableTextBlock[] | string | null;
  seo: {
    titulo: string;
    descripcion: string;
    og_imagen: string;
  };
}
