import { z } from "zod";

// ── Salida estructurada del modelo ───────────────────────────
export const RespuestaModeloSchema = z.object({
  respuesta: z.string().describe("Texto para el visitante. 1 a 4 frases. Sin montos de dinero."),
  refs: z
    .array(z.string())
    .describe('"ref" (ej. "P3", "D1") de inventario_disponible a mostrar como tarjetas (máximo 3). Vacío si no aplica.'),
  derivarWhatsApp: z.boolean().describe("true si hay interés real o una duda que debe resolver un asesor."),
  mensajeWhatsApp: z
    .string()
    .describe("Mensaje prellenado en primera persona del visitante. Vacío si derivarWhatsApp es false."),
});
export type RespuestaModelo = z.infer<typeof RespuestaModeloSchema>;

// ── Entrada del navegador ────────────────────────────────────
export const MAX_CARACTERES = 500;
export const MAX_TURNOS = 12;
export const HISTORIAL_MENSAJES = 8; // últimos 4 intercambios

export const EntradaSchema = z.object({
  conversacionId: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
  mensajes: z
    .array(
      z.object({
        rol: z.enum(["usuario", "asistente"]),
        texto: z.string().max(2000),
        ids: z.array(z.string().max(120)).max(3).optional(),
      })
    )
    .min(1)
    .max(MAX_TURNOS * 2),
  contexto: z
    .object({ id: z.string().max(140).optional() })
    .optional(),
});
export type Entrada = z.infer<typeof EntradaSchema>;

// ── Detección de dinero ──────────────────────────────────────
// Los precios solo se muestran en las tarjetas (datos de Sanity). Cualquier monto
// en el texto del modelo se elimina, aunque sea correcto.
const PATRONES_DINERO: RegExp[] = [
  /\$\s?\d/,
  /\b(mxn|usd|us\$)\s?\d/i,
  /\d[\d.,]*\s?(k|mdp|mdd|m\.?n\.?)\b/i,
  /\d[\d.,]*\s?(mil\s+)?(pesos|d[oó]lares|mxn|usd)\b/i,
  /\b(mill[oó]n|millones|mdp|mdd)\b/i,
  /\b\d{1,3}([.,]\d{3}){2,}\b(?!\s?(m2|m²|mts|metros))/i, // 4,500,000
  /\b\d{6,}\b(?!\s?(m2|m²|mts|metros))/i, // 4500000
];

export function contieneDinero(texto: string): boolean {
  return PATRONES_DINERO.some((re) => re.test(texto));
}

/** Quita las frases que mencionan montos. */
export function quitarDinero(texto: string): string {
  if (!texto || !contieneDinero(texto)) return texto;
  return texto
    .split(/(?<=[.!?\n])\s+/)
    .filter((frase) => !contieneDinero(frase))
    .join(" ")
    .trim();
}

/** true si el texto contiene alguno de los precios ocultos (mostrarPrecio=false). */
export function filtraPrecioOculto(texto: string, preciosOcultos: number[]): boolean {
  if (preciosOcultos.length === 0) return false;
  const numeros = (texto.match(/\d[\d.,]*/g) ?? []).map((n) => Number(n.replace(/[.,]/g, "")));
  return numeros.some((n) => preciosOcultos.includes(n));
}

// ── Presupuesto ──────────────────────────────────────────────
// Los modelos pequeños comparan mal cifras; el filtro por presupuesto lo hace el servidor.
const RE_PRESUPUESTO =
  /(menos de|hasta|m[aá]ximo|no m[aá]s de|debajo de|tope de|presupuesto de|under|less than|up to|max)\s*(\$|mxn)?\s*(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(millones?|mill[oó]n|mdp|m\b|mil|k\b)?/gi;

/** Monto máximo (MXN) en el texto del visitante, o null si no menciona presupuesto. */
export function presupuestoMaximo(texto: string): number | null {
  let max: number | null = null;
  for (const m of Array.from(texto.matchAll(RE_PRESUPUESTO))) {
    const unidad = (m[4] ?? "").toLowerCase();
    const crudo = m[3];
    // "2.5" / "2,5" con unidad = decimal; "2,500,000" sin unidad = separador de miles.
    const n = unidad ? Number(crudo.replace(",", ".")) : Number(crudo.replace(/[.,]/g, ""));
    if (!Number.isFinite(n) || n <= 0) continue;
    // "hasta 3 recámaras" no es presupuesto: sin unidad ni $ se exige un monto realista.
    if (!unidad && !m[2] && n < 1000) continue;
    let valor = n;
    if (/^(mill|mdp|m$)/.test(unidad)) valor = n * 1_000_000;
    else if (unidad === "mil" || unidad === "k") valor = n * 1_000;
    max = valor; // el último mencionado manda
  }
  return max;
}

// ── Zonas ────────────────────────────────────────────────────
// El modelo a veces niega una zona que sí existe (p. ej. confunde las rentadas con
// las disponibles). El servidor detecta la zona escrita, con tolerancia a errores de dedo.

function distancia(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** ¿La frase de zona ("tres cantos") aparece en el texto, permitiendo 1 error por palabra larga? */
function contieneFrase(palabras: string[], frase: string): boolean {
  const objetivo = frase.split(" ");
  for (let i = 0; i + objetivo.length <= palabras.length; i++) {
    const coincide = objetivo.every((w, k) => {
      const p = palabras[i + k];
      return p === w || (w.length >= 5 && p.length >= 4 && distancia(p, w) <= 1);
    });
    if (coincide) return true;
  }
  return false;
}

/** ids cuya zona menciona el visitante, con la frase que coincidió. */
export function coincidenciasZona(
  textoNormalizado: string,
  zonas: Map<string, string[]>
): { ids: string[]; frases: string[] } {
  const palabras = textoNormalizado.split(" ").filter(Boolean);
  const ids: string[] = [];
  const frases = new Set<string>();
  zonas.forEach((frasesId, id) => {
    const hit = frasesId.find((f) => contieneFrase(palabras, f));
    if (hit) {
      ids.push(id);
      frases.add(hit);
    }
  });
  return { ids, frases: Array.from(frases) };
}

// ── ¿Ya hay suficiente información para recomendar? ─────────
const RE_TIPO = /\b(casas?|dep(a|as|artamentos?|tos?)|locale?s?|bodegas?|naves?|terrenos?|lotes?|oficinas?|houses?|apartments?|condos?|offices?|warehouses?|land)\b/i;
const RE_OPERACION = /\b(rentas?|rentar|alquil\w*|ventas?|vender|compra\w*|comprar|preventa|rent|buy|sale)\b/i;

/** Cuántos de tipo / operación / zona / presupuesto mencionó el visitante. */
export function datosConocidos(textoNormalizado: string, hayZona: boolean, hayPresupuesto: boolean): number {
  // "Quiero vender mi casa" es un propietario, no alguien buscando inmueble.
  if (/\b(vender|rentar|poner en renta|alquilar)\s+(mi|mis|nuestra|nuestro)\b|\bmi (casa|depa|departamento|propiedad|terreno|local|inmueble)\b/.test(textoNormalizado)) return 0;
  return [RE_TIPO.test(textoNormalizado), RE_OPERACION.test(textoNormalizado), hayZona, hayPresupuesto].filter(Boolean)
    .length;
}

/** Venta vs renta según la escala del presupuesto. */
export function operacionesDePresupuesto(max: number): ("venta" | "renta" | "preventa")[] {
  return max >= 200_000 ? ["venta", "preventa"] : ["renta"];
}

/** Evita que el visitante cierre la etiqueta que envuelve su mensaje. */
export function sanearTextoVisitante(texto: string): string {
  return texto.replace(/[<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_CARACTERES);
}
