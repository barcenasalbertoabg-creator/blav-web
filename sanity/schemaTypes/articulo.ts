import { defineArrayMember, defineField, defineType } from "sanity";

export const articuloType = defineType({
  name: "articulo",
  title: "Artículo de Blog",
  type: "document",
  groups: [
    { name: "info",      title: "Información",  default: true },
    { name: "contenido", title: "Contenido" },
    { name: "seo",       title: "SEO" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "info",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "info",
      options: { source: "titulo", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "Compra",    value: "compra" },
          { title: "Renta",     value: "renta" },
          { title: "Inversión", value: "inversion" },
          { title: "Mercado",   value: "mercado" },
          { title: "Consejos",  value: "consejos" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta",
      type: "text",
      group: "info",
      rows: 3,
      description: "Aparece en la tarjeta del blog. Máx 200 caracteres.",
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      group: "info",
      options: { hotspot: true },
      fields: [
        defineField({ name: "urlExterna", title: "URL externa", type: "url" }),
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
    defineField({
      name: "fecha",
      title: "Fecha de publicación",
      type: "date",
      group: "info",
      initialValue: () => new Date().toISOString().split("T")[0],
    }),
    defineField({
      name: "tiempoLectura",
      title: "Tiempo de lectura (minutos)",
      type: "number",
      group: "info",
    }),
    defineField({
      name: "contenido",
      title: "Contenido",
      type: "array",
      group: "contenido",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal",     value: "normal" },
            { title: "Título H2",  value: "h2" },
            { title: "Título H3",  value: "h3" },
            { title: "Título H4",  value: "h4" },
          ],
          lists: [
            { title: "Bullet",   value: "bullet" },
            { title: "Numerada", value: "number" },
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
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "titulo",      title: "Título SEO",       type: "string", validation: (R) => R.max(70) }),
        defineField({ name: "descripcion", title: "Meta descripción", type: "text",   rows: 3, validation: (R) => R.max(160) }),
        defineField({
          name: "ogImagen",
          title: "Imagen para compartir",
          type: "image",
          fields: [defineField({ name: "urlExterna", title: "URL externa", type: "url" })],
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "titulo", subtitle: "categoria", media: "imagenPortada" },
    prepare({ title, subtitle, media }) {
      const cats: Record<string, string> = {
        compra: "Compra", renta: "Renta", inversion: "Inversión",
        mercado: "Mercado", consejos: "Consejos",
      };
      return { title: title ?? "Sin título", subtitle: cats[subtitle] ?? subtitle ?? "", media };
    },
  },

  orderings: [
    { title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] },
  ],
});
