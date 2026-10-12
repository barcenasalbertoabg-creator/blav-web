import { defineField, defineType } from "sanity";

export const galeriaCierreType = defineType({
  name: "galeriaCierre",
  title: "Galería de cierres",
  type: "document",
  fields: [
    defineField({
      name: "imagen",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "pie",
      title: "Pie de foto (opcional)",
      type: "string",
      description: 'Ej: "Entrega de casa en Juriquilla"',
      validation: (R) => R.max(140),
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      description: "Número menor aparece primero. Si se deja vacío, va al final.",
      validation: (R) => R.integer(),
    }),
  ],

  preview: {
    select: { pie: "pie", orden: "orden", media: "imagen" },
    prepare({ pie, orden, media }) {
      return {
        title: pie || "Foto de cierre",
        subtitle: typeof orden === "number" ? `Orden: ${orden}` : "Sin orden",
        media,
      };
    },
  },

  orderings: [
    { title: "Orden", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
  ],
});
