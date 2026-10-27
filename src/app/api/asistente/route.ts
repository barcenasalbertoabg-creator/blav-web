import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { buildWhatsAppUrl, defaultWhatsAppUrl } from "@/lib/whatsapp";
import { getCatalogoAsistente, normalizarBusqueda, type Catalogo, type Tarjeta } from "@/lib/asistente/catalogo";
import { REGLAS_ASISTENTE, bloqueCatalogo } from "@/lib/asistente/prompt";
import {
  EntradaSchema,
  HISTORIAL_MENSAJES,
  MAX_CARACTERES,
  RespuestaModeloSchema,
  contieneDinero,
  coincidenciasZona,
  datosConocidos,
  filtraPrecioOculto,
  operacionesDePresupuesto,
  presupuestoMaximo,
  quitarDinero,
  sanearTextoVisitante,
  type Entrada,
} from "@/lib/asistente/validar";
import {
  contar,
  huellaIp,
  ipDeRequest,
  permitirMensaje,
  permitirTurno,
  registrarPregunta,
} from "@/lib/asistente/limites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELO = process.env.ASISTENTE_MODEL || "claude-haiku-5-5";
const MAX_TARJETAS = 3;

let _anthropic: Anthropic | null = null;
function anthropic() {
  // La key solo vive en el servidor (ANTHROPIC_API_KEY), nunca en el bundle.
  if (!_anthropic) _anthropic = new Anthropic({ maxRetries: 1, timeout: 25_000 });
  return _anthropic;
}

export interface RespuestaAsistente {
  ok: boolean;
  respuesta: string;
  tarjetas: Tarjeta[];
  ids: string[];
  derivarWhatsApp: boolean;
  whatsappUrl: string;
  limite?: "hora" | "conversacion";
}

const MENSAJE_ERROR =
  "Perdón, en este momento no pude responder. Si quieres, Alberto te atiende directo por WhatsApp.";

function respuestaFija(respuesta: string, extra: Partial<RespuestaAsistente> = {}, status = 200) {
  const body: RespuestaAsistente = {
    ok: false,
    respuesta,
    tarjetas: [],
    ids: [],
    derivarWhatsApp: true,
    whatsappUrl: defaultWhatsAppUrl(),
    ...extra,
  };
  return NextResponse.json(body, { status });
}

/** Las referencias internas ("P3", "D1") nunca llegan al visitante: se cambian por el título real. */
function sinRefs(texto: string, catalogo: Catalogo): string {
  return texto
    .replace(/\b([PD]\d{1,3})\b/g, (ref) => {
      const id = catalogo.refAId.get(ref);
      return id ? `"${catalogo.tarjetas.get(id)!.titulo}"` : "";
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** ids que caben en el presupuesto que mencionó el visitante (null si no mencionó). */
function candidatosPresupuesto(entrada: Entrada, catalogo: Catalogo): { max: number; ids: string[] } | null {
  const textos = entrada.mensajes.slice(-HISTORIAL_MENSAJES).filter((m) => m.rol === "usuario").map((m) => m.texto);
  const max = presupuestoMaximo(textos.join(" \n "));
  if (max === null) return null;
  const ops = operacionesDePresupuesto(max);
  const ids = Array.from(catalogo.precios.entries())
    .filter(([, p]) => p.precio !== null && p.precio <= max && ops.includes(p.operacion as "venta"))
    .map(([id]) => id);
  return { max, ids };
}

/** Historial → mensajes para la API. El texto del visitante va envuelto y saneado. */
function construirMensajes(
  entrada: Entrada,
  catalogo: Catalogo,
  presupuesto: { ids: string[] } | null
): Anthropic.MessageParam[] {
  const recientes = entrada.mensajes.slice(-HISTORIAL_MENSAJES);
  // La conversación debe empezar con el visitante.
  while (recientes.length && recientes[0].rol !== "usuario") recientes.shift();

  const mensajes: Anthropic.MessageParam[] = recientes.map((m, i) => {
    if (m.rol === "asistente") {
      const refs = (m.ids ?? []).map((id) => catalogo.idARef.get(id)).filter(Boolean);
      const texto = m.texto.slice(0, 800) || "(sin texto)";
      return {
        role: "assistant",
        content: refs.length ? `${texto}\n[Inmuebles mostrados: ${refs.join(", ")}]` : texto,
      };
    }
    const esUltimo = i === recientes.length - 1;
    const bloques: Anthropic.TextBlockParam[] = [];
    if (esUltimo && entrada.contexto?.id) {
      const tarjeta = catalogo.tarjetas.get(entrada.contexto.id);
      if (tarjeta) {
        bloques.push({
          type: "text",
          text: `<contexto_pagina>El visitante está viendo la ficha de: "${tarjeta.titulo}" (ref: ${catalogo.idARef.get(tarjeta.id)}).</contexto_pagina>`,
        });
      }
    }
    if (esUltimo) {
      const zona = coincidenciasZona(normalizarBusqueda(m.texto), catalogo.zonas);
      // Con dos datos o más (en esta conversación) ya no se pregunta: se recomienda.
      const textoVisitante = normalizarBusqueda(
        recientes.filter((x) => x.rol === "usuario").map((x) => x.texto).join(" ")
      );
      if (datosConocidos(textoVisitante, zona.ids.length > 0, !!presupuesto) >= 2) {
        bloques.push({
          type: "text",
          text: "<suficiente_informacion>El visitante ya dio al menos dos datos (tipo, operación, zona o presupuesto). No preguntes primero: muestra ahora hasta 3 opciones que cumplan en \"refs\" y, si quieres, cierra con una pregunta para afinar. Si ninguna cumple, dilo.</suficiente_informacion>",
        });
      }
      if (zona.ids.length) {
        const refs = zona.ids.map((id) => catalogo.idARef.get(id)).join(", ");
        bloques.push({
          type: "text",
          text: `<coincidencias_zona>El visitante mencionó una zona que SÍ existe en el inventario disponible (${zona.frases.join(", ")}). Inmuebles disponibles en esa zona: ${refs}. Revisa su tipo y operación antes de decir que no hay algo ahí.</coincidencias_zona>`,
        });
      }
    }
    if (esUltimo && presupuesto) {
      bloques.push({
        type: "text",
        text: presupuesto.ids.length
          ? `<filtro_presupuesto>El visitante mencionó un presupuesto máximo. Calculado por el sistema, los ÚNICOS inmuebles que caben son estos refs: ${presupuesto.ids.map((id) => catalogo.idARef.get(id)).join(", ")}. Recomienda solo de esta lista (según tipo y zona que pida). Si ninguno encaja con lo demás que pide, dilo.</filtro_presupuesto>`
          : `<filtro_presupuesto>El visitante mencionó un presupuesto máximo y, según el sistema, ningún inmueble con precio publicado cabe en él. Dile que hoy no tienes opciones en ese presupuesto y ofrece avisarle por WhatsApp. No pongas refs.</filtro_presupuesto>`,
      });
    }
    bloques.push({
      type: "text",
      text: `<mensaje_visitante>${sanearTextoVisitante(m.texto)}</mensaje_visitante>`,
    });
    return { role: "user", content: bloques };
  });
  return mensajes;
}

export async function POST(req: Request) {
  if (process.env.ASISTENTE_ENABLED !== "true") {
    return respuestaFija("El asistente no está disponible por ahora. Escríbenos por WhatsApp.", {}, 503);
  }

  let entrada: Entrada;
  try {
    entrada = EntradaSchema.parse(await req.json());
  } catch {
    return respuestaFija(MENSAJE_ERROR, {}, 400);
  }

  const ultimo = entrada.mensajes[entrada.mensajes.length - 1];
  if (ultimo.rol !== "usuario" || !ultimo.texto.trim()) return respuestaFija(MENSAJE_ERROR, {}, 400);
  if (ultimo.texto.length > MAX_CARACTERES) {
    return respuestaFija(`Tu mensaje es muy largo. Intenta con menos de ${MAX_CARACTERES} caracteres.`, { derivarWhatsApp: false }, 400);
  }

  // ── Límites ──
  const huella = huellaIp(ipDeRequest(req));
  // El script de evaluación (scripts/eval-asistente.mjs) salta el límite por IP, solo en desarrollo.
  const esEval = process.env.NODE_ENV !== "production" && req.headers.get("x-asistente-eval") === "1";
  if (!esEval && !(await permitirMensaje(huella))) {
    return respuestaFija(
      "Por ahora alcanzaste el límite de mensajes del asistente. Alberto puede seguir ayudándote por WhatsApp.",
      { limite: "hora" },
      429
    );
  }
  if (!(await permitirTurno(entrada.conversacionId))) {
    return respuestaFija(
      "Esta conversación ya es larga. Para seguir, lo mejor es que Alberto te atienda directo por WhatsApp.",
      { limite: "conversacion" },
      429
    );
  }

  const nuevaConversacion = entrada.mensajes.filter((m) => m.rol === "usuario").length === 1;
  void contar("mensaje");
  if (nuevaConversacion) void contar("conversacion");

  // ── Catálogo + modelo ──
  let catalogo: Catalogo;
  try {
    catalogo = await getCatalogoAsistente();
  } catch (e) {
    console.error("[asistente] catálogo", e);
    void contar("error");
    return respuestaFija(MENSAJE_ERROR);
  }

  const presupuesto = candidatosPresupuesto(entrada, catalogo);

  let salida;
  try {
    const respuesta = await anthropic().messages.parse({
      model: MODELO,
      max_tokens: 1024,
      system: [
        { type: "text", text: REGLAS_ASISTENTE },
        { type: "text", text: bloqueCatalogo(catalogo.textoModelo), cache_control: { type: "ephemeral" } },
      ],
      messages: construirMensajes(entrada, catalogo, presupuesto),
      output_config: { format: zodOutputFormat(RespuestaModeloSchema), effort: "low" },
    });
    if (respuesta.stop_reason !== "end_turn" || !respuesta.parsed_output) {
      console.warn("[asistente] salida no válida", respuesta.stop_reason);
      void contar("error");
      return respuestaFija(MENSAJE_ERROR);
    }
    salida = respuesta.parsed_output;
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) console.warn("[asistente] rate limit de Anthropic");
    else if (e instanceof Anthropic.APIError) console.error(`[asistente] API ${e.status}`, e.message);
    else console.error("[asistente] error", e);
    void contar("error");
    return respuestaFija(MENSAJE_ERROR);
  }

  // ── Validación posterior: nada de lo que ve el visitante depende ciegamente del modelo ──
  // 1) Solo ids que existen en el inventario disponible, máximo 3.
  const traducidos = salida.refs.map((ref) => catalogo.refAId.get(ref.trim().toUpperCase()));
  const validos = Array.from(new Set(traducidos.filter((id): id is string => !!id && catalogo.tarjetas.has(id))));
  const descartados = salida.refs.filter((_, i) => !traducidos[i]);
  if (descartados.length) console.warn("[asistente] refs descartados:", descartados);
  // 1b) Si hubo presupuesto, solo lo que de verdad cabe (lo calcula el servidor, no el modelo).
  const enPresupuesto = presupuesto ? validos.filter((id) => presupuesto.ids.includes(id)) : validos;
  const ids = enPresupuesto.slice(0, MAX_TARJETAS);
  // 2) Tarjetas armadas con datos de Sanity.
  const tarjetas = ids.map((id) => catalogo.tarjetas.get(id)!);

  // 3) Sin montos en el texto. Si al quitarlos no queda nada útil, respuesta genérica.
  let texto = sinRefs(salida.respuesta.trim(), catalogo);
  if (enPresupuesto.length < validos.length) {
    // El texto podía describir opciones que se quitaron: mejor uno genérico y correcto.
    texto = tarjetas.length
      ? "Estas son las opciones que tengo dentro de tu presupuesto; el precio de cada una aparece en su tarjeta. ¿Quieres que Alberto te comparta más detalles por WhatsApp?"
      : "Por ahora no tengo opciones con precio publicado dentro de ese presupuesto. Si quieres, Alberto te avisa por WhatsApp cuando haya algo.";
  }
  if (contieneDinero(texto) || filtraPrecioOculto(texto, catalogo.preciosOcultos)) {
    texto = quitarDinero(texto);
    if (filtraPrecioOculto(texto, catalogo.preciosOcultos)) texto = "";
    if (texto.length < 20) {
      texto = tarjetas.length
        ? "Te dejo abajo las opciones que encontré; el precio de cada una aparece en su tarjeta. Alberto te confirma cualquier detalle por WhatsApp."
        : "Los precios y condiciones te los confirma Alberto directamente por WhatsApp.";
    }
  }
  if (!texto) texto = MENSAJE_ERROR;

  // 4) Mensaje de WhatsApp sin montos; si no sirve, uno armado con el título real.
  let mensajeWa = quitarDinero(sinRefs(salida.mensajeWhatsApp.trim(), catalogo)).slice(0, 400);
  if (filtraPrecioOculto(mensajeWa, catalogo.preciosOcultos)) mensajeWa = "";
  if (!mensajeWa || mensajeWa.length < 15) {
    mensajeWa = tarjetas.length
      ? `Hola Alberto, vi en el asistente del sitio "${tarjetas[0].titulo}" y me gustaría más información.`
      : "Hola Alberto, vengo del asistente del sitio de BLAV y me gustaría información.";
  }

  void registrarPregunta(sanearTextoVisitante(ultimo.texto), salida.derivarWhatsApp);
  if (salida.derivarWhatsApp) void contar("derivo_whatsapp");

  const body: RespuestaAsistente = {
    ok: true,
    respuesta: texto,
    tarjetas,
    ids,
    derivarWhatsApp: salida.derivarWhatsApp,
    whatsappUrl: buildWhatsAppUrl(mensajeWa),
  };
  return NextResponse.json(body);
}
