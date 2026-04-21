/**
 * Script de migración: sube los proyectos del JSON local a Sanity.
 * Uso: npm run migrate
 * Requiere SANITY_API_TOKEN y NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local
 */

import { createClient } from "@sanity/client";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Lee .env.local manualmente (Node --env-file no está en todas las versiones)
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf-8");
    raw.split("\n").forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && !key.startsWith("#") && rest.length > 0) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    });
  } catch {
    console.error("❌ No se encontró .env.local. Copia .env.local.example y rellena los valores.");
    process.exit(1);
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || projectId === "tu-project-id-aqui") {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID no está configurado en .env.local");
  process.exit(1);
}
if (!token || token === "tu-token-aqui") {
  console.error("❌ SANITY_API_TOKEN no está configurado en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

// Convierte texto plano a bloques de Portable Text
function textToBlocks(text) {
  if (!text) return [];
  return text.split("\n\n").filter(Boolean).map((para) => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 9),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 9), text: para, marks: [] }],
  }));
}

// Lee todos los archivos JSON en data/projects/
function readProjects() {
  const dir = join(ROOT, "data", "projects");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")));
}

function jsonToSanityDoc(p) {
  return {
    _type: "project",
    _id: `project-${p.slug}`,  // ID determinístico para idempotencia
    nombre: p.nombre,
    slug: { _type: "slug", current: p.slug },
    categoria: p.categoria,
    estado: p.estado,
    destacado: p.destacado ?? false,
    descripcionCorta: p.descripcion_corta,
    descripcionLarga: textToBlocks(p.descripcion_larga),
    notaPrecio: p.nota_precio,
    precioDesde: p.precio_desde ?? undefined,
    moneda: p.moneda ?? "MXN",
    ctaLabel: p.cta_label,
    whatsappMensaje: p.whatsapp_mensaje,
    // Imagen de portada: guarda la URL como urlExterna
    imagenPortada: p.imagen_portada ? { _type: "image", urlExterna: p.imagen_portada } : undefined,
    // Galería: cada imagen como urlExterna
    imagenes: (p.imagenes ?? []).map((url, i) => ({
      _type: "image",
      _key: `img-${i}`,
      urlExterna: url,
    })),
    ubicacion: p.ubicacion
      ? {
          ciudad: p.ubicacion.ciudad,
          zona: p.ubicacion.zona,
          descripcion: p.ubicacion.descripcion,
          maps_url: p.ubicacion.maps_url,
        }
      : undefined,
    cifrasClave: (p.cifras_clave ?? []).map((c, i) => ({
      _key: `kpi-${i}`,
      numero: c.numero,
      unidad: c.unidad,
      descripcion: c.descripcion,
    })),
    caracteristicas: (p.caracteristicas ?? []).map((c, i) => ({
      _key: `car-${i}`,
      label: c.label,
      valor: c.valor,
    })),
    pabellones: (p.pabellones ?? []).map((pab, i) => ({
      _key: `pab-${i}`,
      nombre: pab.nombre,
      detalle: pab.detalle,
    })),
    contextoMercado: p.contexto_mercado
      ? {
          titulo: p.contexto_mercado.titulo,
          puntos: p.contexto_mercado.puntos,
        }
      : undefined,
    desarrollador: p.desarrollador
      ? { nombre: p.desarrollador.nombre, descripcion: p.desarrollador.descripcion }
      : undefined,
    seo: p.seo
      ? {
          titulo: p.seo.titulo,
          descripcion: p.seo.descripcion,
          ogImagen: p.seo.og_imagen ? { _type: "image", urlExterna: p.seo.og_imagen } : undefined,
        }
      : undefined,
  };
}

async function migrate() {
  const projects = readProjects();
  console.log(`\n🏢 Migrando ${projects.length} proyecto(s) a Sanity...\n`);

  for (const project of projects) {
    const doc = jsonToSanityDoc(project);
    try {
      // createOrReplace es idempotente — puedes correr el script múltiples veces
      await client.createOrReplace(doc);
      console.log(`  ✅ ${project.nombre} (slug: ${project.slug})`);
    } catch (err) {
      console.error(`  ❌ Error en ${project.nombre}:`, err.message);
    }
  }

  console.log("\n✨ Migración completa.");
  console.log(`   Abre tu studio en: http://localhost:3000/studio\n`);
}

migrate();
