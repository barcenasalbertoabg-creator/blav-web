import { defineArrayMember, defineField, defineType } from "sanity";

// Campo requerido: título con asterisco para indicar obligatorio
const req = (label: string) => `${label} *`;

export const propiedadType = defineType({
  name: "propiedad",
  title: "Propiedad",
  type: "document",
  groups: [
    { name: "info",    title: "Info principal", default: true },
    { name: "media",   title: "Imágenes" },
    { name: "details", title: "Detalles" },
    { name: "contact", title: "Contacto" },
    { name: "seo",     title: "SEO" },
  ],
  fields: [
    // ── INFO PRINCIPAL ──────────────────────────────────────────
    defineField({
      name: "titulo",
      title: req("Título de la propiedad"),
      type: "string",
      group: "info",
      description: 'Ej: "Casa en Juriquilla con alberca" o "Local comercial en El Pueblito"',
      validation: (R) => R.required().min(10).max(120),
    }),
    defineField({
      name: "slug",
      title: req("Slug (URL)"),
      type: "slug",
      group: "info",
      options: { source: "titulo", maxLength: 96 },
      description: "Se genera automáticamente del título",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tipo",
      title: req("Tipo de propiedad"),
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "🏠 Casa",          value: "casa" },
          { title: "🏢 Departamento",  value: "departamento" },
          { title: "🏪 Local comercial", value: "local" },
          { title: "🏭 Bodega / Nave", value: "bodega" },
          { title: "📐 Terreno",       value: "terreno" },
          { title: "🏗️ Oficina",       value: "oficina" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "operacion",
      title: req("Operación"),
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "💰 Venta",   value: "venta" },
          { title: "🔑 Renta",   value: "renta" },
          { title: "📋 Preventa", value: "preventa" },
        ],
        layout: "radio",
      },
      initialValue: "venta",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "estado",
      title: req("Estado"),
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "✅ Disponible",  value: "disponible" },
          { title: "🔒 Reservado",  value: "reservado" },
          { title: "🏁 Vendido / Rentado", value: "cerrado" },
        ],
        layout: "radio",
      },
      initialValue: "disponible",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "destacado",
      title: "⭐ Propiedad destacada",
      type: "boolean",
      group: "info",
      description: "Aparece primero en el catálogo y en el home",
      initialValue: false,
    }),
    defineField({
      name: "descripcionCorta",
      title: req("Descripción corta"),
      type: "text",
      group: "info",
      rows: 3,
      description: "Aparece en la tarjeta del catálogo y en WhatsApp al compartir. Máx 300 caracteres.",
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: "precio",
      title: "Precio (opcional si se oculta)",
      type: "number",
      group: "info",
      description: "En la moneda seleccionada abajo. Dejar vacío si se usa nota de precio.",
    }),
    defineField({
      name: "mostrarPrecio",
      title: "Mostrar precio al público",
      type: "boolean",
      group: "info",
      initialValue: true,
      description: "Si está desactivado, se muestra la nota de precio en su lugar",
    }),
    defineField({
      name: "moneda",
      title: "Moneda",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "MXN — Pesos mexicanos", value: "MXN" },
          { title: "USD — Dólares",         value: "USD" },
        ],
        layout: "radio",
      },
      initialValue: "MXN",
    }),
    defineField({
      name: "notaPrecio",
      title: "Nota de precio (si no se publica el número)",
      type: "string",
      group: "info",
      initialValue: "Solicitar información para precio y disponibilidad",
    }),
    defineField({
      name: "proyecto",
      title: "Proyecto al que pertenece (opcional)",
      type: "reference",
      group: "info",
      to: [{ type: "project" }],
      description: "Si esta propiedad es parte de un desarrollo, vincúlala aquí",
    }),

    // ── IMÁGENES ─────────────────────────────────────────────────
    defineField({
      name: "imagenPortada",
      title: req("Imagen de portada"),
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Principal. Aparece en la tarjeta y como hero. Recomendado: 1200×800 px",
      validation: (R) => R.required(),
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
      title: "Galería de fotos (opcional)",
      type: "array",
      group: "media",
      description: "Mínimo recomendado: 5 fotos. Máximo: 20.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "urlExterna", title: "URL externa", type: "url" }),
            defineField({ name: "alt", title: "Descripción de la foto", type: "string" }),
          ],
        }),
      ],
      validation: (R) => R.max(20),
    }),

    // ── DETALLES ──────────────────────────────────────────────────
    defineField({
      name: "superficie",
      title: "Superficie construida m² (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "superficieTerreno",
      title: "Superficie de terreno m² (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "recamaras",
      title: "Recámaras (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "banos",
      title: "Baños completos (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "mediosBanos",
      title: "Medios baños (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "estacionamientos",
      title: "Cajones de estacionamiento (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "niveles",
      title: "Niveles / pisos (opcional)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "antiguedad",
      title: "Antigüedad (opcional)",
      type: "string",
      group: "details",
      description: 'Ej: "Nueva", "5 años", "A estrenar"',
    }),
    defineField({
      name: "amenidades",
      title: "Amenidades (opcional)",
      type: "array",
      group: "details",
      description: "Lista rápida: alberca, gimnasio, vigilancia, etc.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          "Alberca",
          "Gimnasio",
          "Vigilancia 24/7",
          "Área verde",
          "Salón de eventos",
          "Roof garden",
          "Bodega",
          "Elevador",
          "Estacionamiento de visitas",
          "Circuito cerrado",
          "Pet friendly",
          "Acceso controlado",
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "caracteristicas",
      title: "Características adicionales (opcional)",
      type: "array",
      group: "details",
      description: "Tabla de ficha técnica. Cada fila es etiqueta + valor.",
      of: [
        defineArrayMember({
          type: "object",
          preview: { select: { title: "label", subtitle: "valor" } },
          fields: [
            defineField({ name: "label", title: "Etiqueta", type: "string", description: 'Ej: "Zona"' }),
            defineField({ name: "valor", title: "Valor",    type: "string", description: 'Ej: "Juriquilla"' }),
          ],
        }),
      ],
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción completa (opcional)",
      type: "array",
      group: "details",
      description: "Editor de texto enriquecido para la página de detalle",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal",   value: "normal" },
            { title: "Título",   value: "h3" },
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
      name: "ubicacion",
      title: "Ubicación (opcional)",
      type: "object",
      group: "details",
      fields: [
        defineField({ name: "ciudad",      title: "Ciudad",           type: "string" }),
        defineField({ name: "zona",        title: "Zona o colonia",   type: "string" }),
        defineField({ name: "descripcion", title: "Descripción de acceso", type: "string" }),
        defineField({
          name: "maps_url",
          title: "URL de Google Maps",
          type: "url",
          description: "Link de Maps para el botón 'Ver ubicación'",
        }),
      ],
    }),

    // ── CONTACTO ──────────────────────────────────────────────────
    defineField({
      name: "whatsappMensaje",
      title: "Mensaje de WhatsApp predeterminado",
      type: "string",
      group: "contact",
      initialValue: "Hola, me interesa la propiedad [título]. ¿Pueden darme más información?",
      description: "El prospecto verá este mensaje pre-llenado al hacer clic en WhatsApp",
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón principal",
      type: "string",
      group: "contact",
      initialValue: "Solicitar información",
    }),

    // ── SEO ───────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO y redes sociales",
      type: "object",
      group: "seo",
      description: "Si se dejan vacíos, se usan automáticamente el título y la descripción corta",
      fields: [
        defineField({
          name: "titulo",
          title: "Título SEO (opcional — se autogenera del título)",
          type: "string",
          description: "Aparece en Google y en la pestaña del navegador. Máx 70 caracteres.",
          validation: (R) => R.max(70),
        }),
        defineField({
          name: "descripcion",
          title: "Meta descripción (opcional — se autogenera de la descripción corta)",
          type: "text",
          rows: 3,
          description: "Aparece en Google y al compartir en WhatsApp. Máx 160 caracteres.",
          validation: (R) => R.max(160),
        }),
        defineField({
          name: "ogImagen",
          title: "Imagen para compartir (opcional — se usa la portada si está vacío)",
          type: "image",
          description: "Tamaño ideal: 1200×630 px",
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

  preview: {
    select: {
      title:    "titulo",
      subtitle: "tipo",
      media:    "imagenPortada",
    },
    prepare({ title, subtitle, media }) {
      const iconos: Record<string, string> = {
        casa: "🏠", departamento: "🏢", local: "🏪",
        bodega: "🏭", terreno: "📐", oficina: "🏗️",
      };
      return {
        title:    title ?? "Sin título",
        subtitle: subtitle ? `${iconos[subtitle] ?? ""} ${subtitle}` : "",
        media,
      };
    },
  },

  orderings: [
    {
      title: "Destacadas primero",
      name: "destacadoDesc",
      by: [
        { field: "destacado", direction: "desc" },
        { field: "titulo",    direction: "asc" },
      ],
    },
    {
      title: "Más recientes",
      name: "fechaDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
