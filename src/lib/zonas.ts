import type { Propiedad } from "@/types/propiedad";

// Zonas para filtrar el catálogo. En Sanity el campo "Zona o colonia" se ha
// capturado de muchas formas ("Meseta", "Ciudad Meseta – Condominio Piamonte",
// "Tres Cantos, Perugia"...). Para no duplicar pestañas, se agrupa aquí con
// reglas simples. Si una propiedad trae "zonaFiltro" elegida en el Studio,
// esa manda sobre estas reglas.
const REGLAS: Array<[RegExp, string]> = [
  [/meseta|payunia|piamonte|varella|arimatea|isla 3|privalto/i, "Ciudad Meseta"],
  [/tres cantos|prato|spezia|perugia/i, "Tres Cantos"],
  [/juriquilla|antea|cumbres del lago/i, "Juriquilla"],
  [/zibat[aá]/i, "Zibatá"],
  [/zir[eé]/i, "ZIRÉ"],
  [/villas del refugio/i, "Villas del Refugio"],
  [/ciudad del sol|stanza/i, "Ciudad del Sol"],
  [/villalba|santa fe corregidora|corregidora/i, "Corregidora"],
  [/sonterra/i, "Sonterra"],
  [/el mirador/i, "El Mirador"],
  [/puertas? del encino|puertas? de san miguel/i, "Puerta de San Miguel"],
  [/terranova|jacal/i, "El Jacal"],
  [/vi[ñn]edos|arag[oó]n/i, "Viñedos"],
  [/terra park|centenario/i, "Terra Park"],
  [/bluhen|el marqu[eé]s/i, "El Marqués"],
  [/business park|qbp/i, "Querétaro Business Park"],
  [/san mateo/i, "San Mateo"],
  [/praderas del bosque/i, "Praderas del Bosque"],
  [/distrito comercial|norponiente/i, "Norponiente"],
];

export function zonaDe(p: Pick<Propiedad, "titulo" | "ubicacion">): string {
  const manual = p.ubicacion?.zonaFiltro?.trim();
  if (manual) return manual;
  const texto = [p.ubicacion?.zona, p.ubicacion?.ciudad, p.titulo].filter(Boolean).join(" ");
  for (const [re, zona] of REGLAS) if (re.test(texto)) return zona;
  const z = (p.ubicacion?.zona || "").split(/[–\-,/]/)[0].trim();
  return z || "Otras zonas";
}

export function normalizarTexto(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
