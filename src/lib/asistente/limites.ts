import "server-only";
import { createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { MAX_TURNOS } from "./validar";

const MENSAJES_POR_HORA = 20;
const EVENTOS_POR_HORA = 120;
const TTL_CONVERSACION = 60 * 60 * 6; // 6 h
const TTL_METRICAS = 60 * 60 * 24 * 400; // ~13 meses

// Vercel Marketplace (Upstash) crea KV_REST_API_*; Upstash directo crea UPSTASH_REDIS_REST_*.
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export const almacenamiento = redis ? "upstash" : "memoria";

// ── Fallback temporal en memoria ─────────────────────────────
// Solo sirve en local o como medida provisional: en Vercel cada instancia
// serverless tiene su propia memoria, así que el límite no es global.
const memoria = new Map<string, { n: number; expira: number }>();
let avisoMostrado = false;

function avisarMemoria() {
  if (avisoMostrado) return;
  avisoMostrado = true;
  console.warn("[asistente] Sin Upstash configurado: límites y métricas en memoria (temporal).");
}

function incrMemoria(clave: string, ttlSeg: number): number {
  const ahora = Date.now();
  const actual = memoria.get(clave);
  if (!actual || actual.expira < ahora) {
    memoria.set(clave, { n: 1, expira: ahora + ttlSeg * 1000 });
    return 1;
  }
  actual.n += 1;
  return actual.n;
}

async function incr(clave: string, ttlSeg: number): Promise<number> {
  if (!redis) {
    avisarMemoria();
    return incrMemoria(clave, ttlSeg);
  }
  const n = await redis.incr(clave);
  if (n === 1) await redis.expire(clave, ttlSeg);
  return n;
}

// ── Rate limit ───────────────────────────────────────────────
const limiteMensajes = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(MENSAJES_POR_HORA, "1 h"), prefix: "asistente:rl:msg" })
  : null;
const limiteEventos = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(EVENTOS_POR_HORA, "1 h"), prefix: "asistente:rl:evt" })
  : null;

/** La IP nunca se guarda en claro. */
export function huellaIp(ip: string): string {
  return createHash("sha256").update(`blav-asistente:${ip}`).digest("hex").slice(0, 32);
}

export function ipDeRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export async function permitirMensaje(huella: string): Promise<boolean> {
  if (limiteMensajes) return (await limiteMensajes.limit(huella)).success;
  const hora = Math.floor(Date.now() / 3_600_000);
  return incrMemoria(`rl:msg:${huella}:${hora}`, 3600) <= MENSAJES_POR_HORA;
}

export async function permitirEvento(huella: string): Promise<boolean> {
  if (limiteEventos) return (await limiteEventos.limit(huella)).success;
  const hora = Math.floor(Date.now() / 3_600_000);
  return incrMemoria(`rl:evt:${huella}:${hora}`, 3600) <= EVENTOS_POR_HORA;
}

/** Cuenta turnos por conversación en el servidor (el navegador podría mentir). */
export async function permitirTurno(conversacionId: string): Promise<boolean> {
  const n = await incr(`asistente:conv:${conversacionId}`, TTL_CONVERSACION);
  return n <= MAX_TURNOS;
}

// ── Métricas ─────────────────────────────────────────────────
export const EVENTOS = ["conversacion", "mensaje", "whatsapp_click", "tarjeta_click", "derivo_whatsapp", "error"] as const;
export type Evento = (typeof EVENTOS)[number];

function hoy(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
}

export async function contar(evento: Evento): Promise<void> {
  try {
    await incr(`asistente:metricas:${hoy()}:${evento}`, TTL_METRICAS);
  } catch (e) {
    console.error("[asistente] no se pudo registrar métrica", e);
  }
}

// ── Registro anónimo de preguntas (apagado por defecto) ──────
// Requiere ASISTENTE_LOG_PREGUNTAS=true. Solo guarda el texto y si derivó a
// WhatsApp; sin IP, sin id de conversación. Revisar aviso de privacidad antes.
export async function registrarPregunta(pregunta: string, derivo: boolean): Promise<void> {
  if (process.env.ASISTENTE_LOG_PREGUNTAS !== "true" || !redis) return;
  try {
    await redis.lpush("asistente:preguntas", JSON.stringify({ fecha: hoy(), pregunta, derivo }));
    await redis.ltrim("asistente:preguntas", 0, 4999);
  } catch (e) {
    console.error("[asistente] no se pudo registrar pregunta", e);
  }
}
