import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "blav",
  title: "BLAV Bienes Raíces",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("BLAV CMS")
          .items([
            S.listItem()
              .title("Proyectos")
              .icon(() => "🏢")
              .child(
                S.documentList()
                  .title("Proyectos")
                  .filter('_type == "project"')
                  .defaultOrdering([{ field: "destacado", direction: "desc" }])
              ),
            S.listItem()
              .title("Propiedades")
              .icon(() => "🏠")
              .child(
                S.list()
                  .title("Propiedades")
                  .items([
                    S.listItem()
                      .title("Todas")
                      .child(
                        S.documentList()
                          .title("Todas las propiedades")
                          .filter('_type == "propiedad"')
                          .defaultOrdering([{ field: "destacado", direction: "desc" }])
                      ),
                    S.listItem()
                      .title("✅ Disponibles")
                      .child(
                        S.documentList()
                          .title("Disponibles")
                          .filter('_type == "propiedad" && estado == "disponible"')
                      ),
                    S.listItem()
                      .title("🔒 Reservadas")
                      .child(
                        S.documentList()
                          .title("Reservadas")
                          .filter('_type == "propiedad" && estado == "reservado"')
                      ),
                    S.listItem()
                      .title("🏁 Cerradas")
                      .child(
                        S.documentList()
                          .title("Vendidas / Rentadas")
                          .filter('_type == "propiedad" && estado == "cerrado"')
                      ),
                  ])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
