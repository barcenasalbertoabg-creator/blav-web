// Bloque de Portable Text (editor enriquecido de Sanity)
export type PortableTextBlock = {
  _type: "block";
  _key: string;
  style?: string;
  markDefs?: unknown[];
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks?: string[];
  }>;
};

export interface ProjectUbicacion {
  ciudad: string;
  zona: string;
  descripcion: string;
  maps_url: string;
  maps_embed_url: string;
}

export interface CifrasClave {
  numero: string;
  unidad: string;
  descripcion: string;
}

export interface Caracteristica {
  label: string;
  valor: string;
}

export interface Pabellon {
  nombre: string;
  detalle: string;
}

export interface ContextoMercado {
  titulo: string;
  puntos: string[];
}

export interface Desarrollador {
  nombre: string;
  descripcion: string;
}

export interface ProjectSEO {
  titulo: string;
  descripcion: string;
  og_imagen: string;
}

export interface Project {
  slug: string;
  nombre: string;
  categoria: "Residencial" | "Comercial" | "Industrial" | "Inversión" | "Preventa";
  estado: "activo" | "vendido" | "proximamente";
  destacado: boolean;
  ubicacion: ProjectUbicacion;
  precio_desde: number | null;
  moneda: string;
  nota_precio: string;
  descripcion_corta: string;
  // Portable Text desde Sanity, o string plano (legacy JSON)
  descripcion_larga: PortableTextBlock[] | string;
  cifras_clave: CifrasClave[];
  caracteristicas: Caracteristica[];
  pabellones?: Pabellon[];
  contexto_mercado?: ContextoMercado;
  imagenes: string[];
  imagen_portada: string;
  whatsapp_mensaje: string;
  cta_label: string;
  desarrollador?: Desarrollador;
  seo: ProjectSEO;
}
