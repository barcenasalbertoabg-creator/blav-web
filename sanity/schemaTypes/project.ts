import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  groups: [
    { name: "info", title: "Información general", default: true },
    { name: "media", title: "Imágenes" },
    { name: "content", title: "Contenido" },
    { name: "location", title: "Ubicación" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── INFORMACIÓN GENERAL ──
    defineField({
      name: "nombre",
      title: "Nombre del proyecto",
      type: "string",
      group: "info",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL del proyecto)",
      type: "slug",
      group: "info",
      options: { source: "nombre", maxLength: 96 },
      description: 'Se genera automáticamente del nombre. Ej: "distrito-comercial-2-17"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "Residencial", value: "Residencial" },
          { title: "Comercial", value: "Comercial" },
          { title: "Industrial", value: "Industrial" },
          { title: "Inversión", value: "Inversión" },
          { title: "Preventa", value: "Preventa" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "estado",
      title: "Estado del proyecto",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "✅ Activo", value: "activo" },
          { title: "🏁 Vendido / Rentado", value: "vendido" },
          { title: "🔜 Próximamente", value: "proximamente" },
        ],
        layout: "radio",
      },
      initialValue: "activo",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "destacado",
      title: "⭐ Mostrar en Home como proyecto destacado",
      type: "boolean",
      group: "info",
      initialValue: false,
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta",
      type: "text",
      group: "info",
      rows: 3,
      description: "Aparece en tarjetas y en el preview de WhatsApp. Máximo 300 caracteres.",
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: "notaPrecio",
      title: "Nota de precio",
      type: "string",
      group: "info",
      initialValue: "Solicitar información para precios y disponibilidad",
    }),
    defineField({
      name: "precioDesde",
      title: "Precio desde (opcional)",
      type: "number",
      group: "info",
      description: "Dejar vacío si no se publica el precio",
    }),
    defineField({
      name: "moneda",
      title: "Moneda",
      type: "string",
      group: "info",
      initialValue: "MXN",
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón principal",
      type: "string",
      group: "info",
      initialValue: "Solicitar información",
    }),
    defineField({
      name: "whatsappMensaje",
      title: "Mensaje de WhatsApp predeterminado",
      type: "string",
      group: "info",
      description: "Mensaje que se pre-llena cuando el usuario contacta desde este proyecto",
    }),

    // ── IMÁGENES ──
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Aparece en la tarjeta del catálogo y como fondo del hero. Recomendado: 1200×675 px",
      fields: [
        defineField({
          name: "urlExterna",
          title: "URL externa (placeholder temporal)",
          type: "url",
          description: "Usa esto mientras no subas la imagen real",
        }),
      ],
    }),
    defineField({
      name: "imagenes",
      title: "Galería de imágenes",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "urlExterna",
              title: "URL externa (placeholder temporal)",
              type: "url",
            }),
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            }),
          ],
        }),
      ],
    }),

    // ── CONTENIDO ──
    defineField({
      name: "descripcionLarga",
      title: "Descripción completa",
      type: "array",
      group: "content",
      description: "Editor de texto enriquecido. Usa negrita, listas y párrafos.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Título", value: "h3" },
            { title: "Subtítulo", value: "h4" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "cifrasClave",
      title: "Cifras clave (KPIs)",
      type: "array",
      group: "content",
      description: "Números destacados que aparecen como grandes indicadores visuales",
      of: [
        defineArrayMember({
          type: "object",
          preview: {
            select: { title: "numero", subtitle: "descripcion" },
          },
          fields: [
            defineField({ name: "numero", title: "Número", type: "string", description: 'Ej: "28,844" o "+160K"' }),
            defineField({ name: "unidad", title: "Unidad", type: "string", description: 'Ej: "m²" o "locales"' }),
            defineField({ name: "descripcion", title: "Descripción", type: "string", description: 'Ej: "de construcción total"' }),
          ],
        }),
      ],
    }),
    defineField({
      name: "caracteristicas",
      title: "Tabla de características",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          preview: {
            select: { title: "label", subtitle: "valor" },
          },
          fields: [
            defineField({ name: "label", title: "Etiqueta", type: "string", description: 'Ej: "Desarrollador"' }),
            defineField({ name: "valor", title: "Valor", type: "string", description: 'Ej: "GESS Inmobiliaria"' }),
          ],
        }),
      ],
    }),
    defineField({
      name: "pabellones",
      title: "Pabellones o zonas",
      type: "array",
      group: "content",
      description: "Secciones o zonas dentro del proyecto (aplica a desarrollos comerciales)",
      of: [
        defineArrayMember({
          type: "object",
          preview: {
            select: { title: "nombre", subtitle: "detalle" },
          },
          fields: [
            defineField({ name: "nombre", title: "Nombre del pabellón", type: "string" }),
            defineField({ name: "detalle", title: "Descripción", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "contextoMercado",
      title: "Contexto de mercado / Por qué invertir",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "titulo", title: "Título de la sección", type: "string" }),
        defineField({
          name: "puntos",
          title: "Puntos de venta",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Cada punto aparece con un checkmark verde",
        }),
      ],
    }),
    defineField({
      name: "desarrollador",
      title: "Desarrollador del proyecto",
      type: "object",
      group: "content",
      description: "Quién construye el proyecto. BLAV es el broker, no el desarrollador.",
      fields: [
        defineField({ name: "nombre", title: "Nombre de la empresa", type: "string" }),
        defineField({ name: "descripcion", title: "Descripción breve", type: "text", rows: 3 }),
      ],
    }),

    // ── UBICACIÓN ──
    defineField({
      name: "ubicacion",
      title: "Ubicación",
      type: "object",
      group: "location",
      fields: [
        defineField({ name: "ciudad", title: "Ciudad", type: "string" }),
        defineField({ name: "zona", title: "Zona o colonia", type: "string" }),
        defineField({ name: "descripcion", title: "Descripción de acceso", type: "string" }),
        defineField({
          name: "maps_url",
          title: "URL de Google Maps",
          type: "url",
          description: "Link corto de Google Maps para el botón 'Ver en Maps'",
        }),
      ],
    }),

    // ── SEO ──
    defineField({
      name: "seo",
      title: "SEO y redes sociales",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "titulo",
          title: "Título SEO",
          type: "string",
          description: "Aparece en Google y en la pestaña del navegador",
          validation: (R) => R.max(70),
        }),
        defineField({
          name: "descripcion",
          title: "Meta descripción",
          type: "text",
          rows: 3,
          description: "Aparece en Google y como descripción al compartir en WhatsApp. Máx 160 caracteres.",
          validation: (R) => R.max(160),
        }),
        defineField({
          name: "ogImagen",
          title: "Imagen para compartir (WhatsApp / redes)",
          type: "image",
          description: "Tamaño recomendado: 1200×630 px",
          fields: [
            defineField({
              name: "urlExterna",
              title: "URL externa (placeholder temporal)",
              type: "url",
            }),
          ],
        }),
      ],
    }),
  ],

  // Vista previa en el estudio
  preview: {
    select: {
      title: "nombre",
      subtitle: "categoria",
      media: "imagenPortada",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Sin nombre",
        subtitle: subtitle ?? "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Destacados primero",
      name: "destacadoDesc",
      by: [{ field: "destacado", direction: "desc" }, { field: "nombre", direction: "asc" }],
    },
  ],
});
