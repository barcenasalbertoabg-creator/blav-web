import type { PortableTextBlock } from "./project";

export type TipoPropiedad = "casa" | "departamento" | "local" | "bodega" | "terreno" | "oficina";
export type OperacionPropiedad = "venta" | "renta" | "preventa";
export type EstadoPropiedad = "disponible" | "reservado" | "vendido" | "rentado" | "cerrado";

export interface PropiedadSEO {
  titulo: string;
  descripcion: string;
  og_imagen: string;
}

export interface Propiedad {
  slug: string;
  titulo: string;
  tipo: TipoPropiedad;
  operacion: OperacionPropiedad;
  estado: EstadoPropiedad;
  destacado: boolean;
  descripcion_corta: string;
  precio: number | null;
  mostrar_precio: boolean;
  moneda: string;
  nota_precio: string;
  proyecto?: { slug: string; nombre: string } | null;
  imagen_portada: string;
  imagenes: string[];
  superficie?: number | null;
  superficie_terreno?: number | null;
  recamaras?: number | null;
  banos?: number | null;
  medios_banos?: number | null;
  estacionamientos?: number | null;
  niveles?: number | null;
  antiguedad?: string | null;
  amenidades?: string[] | null;
  caracteristicas?: Array<{ label: string; valor: string }> | null;
  descripcion_larga?: PortableTextBlock[] | string | null;
  ubicacion?: {
    ciudad?: string;
    zona?: string;
    descripcion?: string;
    maps_url?: string;
  } | null;
  whatsapp_mensaje: string;
  cta_label: string;
  seo: PropiedadSEO;
}

export const TIPO_LABEL: Record<TipoPropiedad, string> = {
  casa: "Casa",
  departamento: "Departamento",
  local: "Local comercial",
  bodega: "Bodega / Nave",
  terreno: "Terreno",
  oficina: "Oficina",
};

export const TIPO_ICON: Record<TipoPropiedad, string> = {
  casa: "🏠",
  departamento: "🏢",
  local: "🏪",
  bodega: "🏭",
  terreno: "📐",
  oficina: "🏗️",
};

export const OPERACION_LABEL: Record<OperacionPropiedad, string> = {
  venta: "Venta",
  renta: "Renta",
  preventa: "Preventa",
};
