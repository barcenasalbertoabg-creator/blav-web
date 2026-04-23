import { defineField, defineType } from "sanity";

export const testimonioType = defineType({
  name: "testimonio",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre completo",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "cargoOTipoOperacion",
      title: "Cargo o tipo de operación",
      type: "string",
      description: 'Ej: "Compradora de casa en Juriquilla" o "Inversionista"',
    }),
    defineField({
      name: "texto",
      title: "Testimonio",
      type: "text",
      rows: 5,
      validation: (R) => R.required().max(500),
    }),
    defineField({
      name: "calificacion",
      title: "Calificación (1-5 estrellas)",
      type: "number",
      initialValue: 5,
      validation: (R) => R.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "foto",
      title: "Foto del cliente (opcional)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "urlExterna", title: "URL externa", type: "url" }),
      ],
    }),
    defineField({
      name: "destacado",
      title: "⭐ Mostrar en inicio",
      type: "boolean",
      description: "Si está activo, aparece en la sección de testimonios del home",
      initialValue: false,
    }),
  ],

  preview: {
    select: { title: "nombre", subtitle: "cargoOTipoOperacion", media: "foto" },
    prepare({ title, subtitle, media }) {
      return { title: title ?? "Sin nombre", subtitle: subtitle ?? "", media };
    },
  },

  orderings: [
    { title: "Destacados primero", name: "destacadoDesc", by: [{ field: "destacado", direction: "desc" }] },
  ],
});
