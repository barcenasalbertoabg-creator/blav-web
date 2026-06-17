/**
 * Crea el artículo "Póliza jurídica de arrendamiento" en Sanity.
 * Requiere SANITY_API_TOKEN en .env.local (token con permisos de Editor).
 * Uso: npm run crear-articulo
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

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
    console.error("❌ No se encontró .env.local");
    process.exit(1);
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;

if (!projectId) { console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID no configurado"); process.exit(1); }
if (!token)     { console.error("❌ SANITY_API_TOKEN no configurado — agrégalo en .env.local\n   Créalo en: sanity.io/manage → API → Tokens → Add API token (Editor)"); process.exit(1); }

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const articulo = {
  _id:   "articulo-poliza-juridica-arrendamiento-queretaro",
  _type: "articulo",
  titulo: "Qué es la póliza jurídica de arrendamiento y por qué te conviene tenerla",
  slug: { _type: "slug", current: "poliza-juridica-arrendamiento-queretaro" },
  categoria: "legal",
  descripcionCorta: "La póliza jurídica de arrendamiento se menciona mucho pero pocas veces se explica bien. Aquí te decimos qué cubre realmente, qué exige y por qué le da tranquilidad tanto al propietario como al inquilino.",
  fecha: "2026-06-16",
  tiempoLectura: 5,
  contenido: [
    { _type: "block", _key: "blk1", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s1", marks: [], text: "Si has rentado o estás por rentar una propiedad en Querétaro, es probable que hayas escuchado el término \"póliza jurídica\" sin que nadie te explique bien qué hace en realidad. Aquí te lo explicamos sin vueltas." }] },
    { _type: "block", _key: "blk2", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s2", marks: [], text: "Una póliza jurídica de arrendamiento es un servicio legal que contratas con un despacho especializado para que, si el inquilino incumple el contrato —principalmente por falta de pago—, un equipo de abogados intervenga directamente para resolverlo. No es un seguro en el sentido tradicional ni elimina el riesgo por completo: es respaldo legal especializado actuando desde el momento en que algo se sale del contrato." }] },
    { _type: "block", _key: "blk3", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s3", marks: [], text: "¿Por qué importa? Porque en México, recuperar una propiedad de un inquilino que dejó de pagar puede ser un proceso largo y desgastante si lo enfrentas solo, sin asesoría jurídica constante. La póliza no evita que existan conflictos, pero sí evita que tengas que resolverlos tú mismo mientras el tiempo —y la renta no pagada— sigue corriendo." }] },
    { _type: "block", _key: "blk4", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s4", marks: [], text: "En BLAV trabajamos directamente con Peñaloza Consultoría Integral, despacho con más de 40 años de trayectoria en derecho inmobiliario e hipotecario en Querétaro. Así es como funciona en la práctica:" }] },
    { _type: "block", _key: "blk5", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s5", marks: [], text: "La póliza cubre que el contrato de arrendamiento se cumpla a cabalidad. Si el inquilino deja de pagar, el despacho interviene legalmente para gestionar las rentas adeudadas y resolver el incumplimiento. No hay un número fijo de meses \"cubiertos\": el respaldo legal acompaña el proceso hasta resolverlo." }] },
    { _type: "block", _key: "blk6", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s6", marks: [], text: "Sí exige un obligado solidario con comprobantes de ingresos. Esto hay que decirlo de frente: esta póliza no es de las que se anuncian como \"sin aval\". Si no tienes quién pueda respaldarte de esta forma, es algo que hay que resolver antes de avanzar con la renta." }] },
    { _type: "block", _key: "blk7", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s7", marks: [], text: "Normalmente la paga el inquilino, aunque en algunos casos se puede dividir el costo con el propietario si ambas partes están de acuerdo." }] },
    { _type: "block", _key: "blk8", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s8", marks: [], text: "¿El beneficio real? Para el propietario, tranquilidad de que su patrimonio no depende solo de la buena voluntad del inquilino. Para el inquilino con buen perfil, formalizar la renta con este respaldo suele agilizar la aprobación, porque le da al propietario una garantía adicional más allá de la confianza personal." }] },
    { _type: "block", _key: "blk9", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s9", marks: [], text: "Si estás rentando o poniendo en renta una propiedad en Querétaro y quieres saber si esta póliza aplica a tu caso, en BLAV te explicamos el proceso completo antes de firmar nada." }] },
  ],
};

console.log("📝 Creando artículo en Sanity...");
try {
  const result = await client.createOrReplace(articulo);
  console.log(`✅ Artículo creado: ${result._id}`);
  console.log(`   Slug: /blog/${articulo.slug.current}`);
} catch (err) {
  console.error("❌ Error al crear el artículo:", err.message);
  process.exit(1);
}
