// Proyección reutilizable para normalizar imágenes
// coalesce(urlExterna, asset->url) → URL string en ambos casos
const IMAGE_FIELDS = `{
  "urlExterna": urlExterna,
  "asset": asset->{ url, _id }
}`;

const PROJECT_FIELDS = `
  "slug": slug.current,
  nombre,
  categoria,
  estado,
  destacado,
  ubicacion {
    ciudad,
    zona,
    descripcion,
    maps_url,
    "maps_embed_url": ""
  },
  "precio_desde": precioDesde,
  "moneda": coalesce(moneda, "MXN"),
  "nota_precio": notaPrecio,
  "descripcion_corta": descripcionCorta,
  "descripcion_larga": descripcionLarga,
  "cifras_clave": cifrasClave[]{ numero, unidad, descripcion },
  "caracteristicas": caracteristicas[]{ label, valor },
  "pabellones": pabellones[]{ nombre, detalle },
  "contexto_mercado": contextoMercado{ titulo, puntos },
  "imagenPortadaRaw": imagenPortada ${IMAGE_FIELDS},
  "imagenesRaw": imagenes[]${IMAGE_FIELDS},
  "whatsapp_mensaje": whatsappMensaje,
  "cta_label": ctaLabel,
  "desarrollador": desarrollador{ nombre, descripcion },
  "seo": seo{
    titulo,
    descripcion,
    "ogImagenRaw": ogImagen ${IMAGE_FIELDS}
  }
`;

export const ALL_PROJECTS_QUERY = `
  *[_type == "project" && estado == "activo"] | order(destacado desc, nombre asc) {
    ${PROJECT_FIELDS}
  }
`;

export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && estado == "activo" && destacado == true][0...3] | order(nombre asc) {
    ${PROJECT_FIELDS}
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_FIELDS}
  }
`;

export const ALL_SLUGS_QUERY = `
  *[_type == "project"]{ "slug": slug.current }.slug
`;

// ── PROPIEDADES ──────────────────────────────────────────────────────────────

const PROPIEDAD_FIELDS = `
  "slug": slug.current,
  titulo,
  tipo,
  operacion,
  estado,
  destacado,
  "descripcion_corta": descripcionCorta,
  precio,
  "mostrar_precio": coalesce(mostrarPrecio, true),
  "moneda": coalesce(moneda, "MXN"),
  "nota_precio": notaPrecio,
  "proyecto": proyecto->{ "slug": slug.current, nombre },
  "imagenPortadaRaw": imagenPortada ${IMAGE_FIELDS},
  "imagenesRaw": imagenes[]${IMAGE_FIELDS},
  superficie,
  "superficie_terreno": superficieTerreno,
  recamaras,
  banos,
  "medios_banos": mediosBanos,
  estacionamientos,
  niveles,
  antiguedad,
  amenidades,
  "caracteristicas": caracteristicas[]{ label, valor },
  "descripcion_larga": descripcionLarga,
  "ubicacion": ubicacion{ ciudad, zona, descripcion, maps_url },
  "whatsapp_mensaje": whatsappMensaje,
  "cta_label": ctaLabel,
  "seo": seo{
    titulo,
    descripcion,
    "ogImagenRaw": ogImagen ${IMAGE_FIELDS}
  }
`;

export const ALL_PROPIEDADES_QUERY = `
  *[_type == "propiedad" && estado == "disponible"] | order(destacado desc, _createdAt desc) {
    ${PROPIEDAD_FIELDS}
  }
`;

export const PROPIEDAD_BY_SLUG_QUERY = `
  *[_type == "propiedad" && slug.current == $slug][0] {
    ${PROPIEDAD_FIELDS}
  }
`;

export const ALL_PROPIEDAD_SLUGS_QUERY = `
  *[_type == "propiedad"]{ "slug": slug.current }.slug
`;
