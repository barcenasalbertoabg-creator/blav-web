#!/usr/bin/env node
/**
 * Métricas del Asistente IA guardadas en Upstash (el plan Hobby de Vercel no
 * incluye eventos personalizados de Analytics).
 *
 *   node scripts/metricas-asistente.mjs [días=30]
 *
 * Lee UPSTASH_REDIS_REST_URL/TOKEN (o KV_REST_API_URL/TOKEN) de .env.local o del entorno.
 */
import fs from "node:fs";

const env = { ...process.env };
if (fs.existsSync(".env.local")) {
  for (const l of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}
const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error("Falta configurar Upstash (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).");
  process.exit(1);
}

const EVENTOS = ["conversacion", "mensaje", "derivo_whatsapp", "whatsapp_click", "tarjeta_click", "error"];
const dias = Number(process.argv[2] ?? 30);
const fechas = Array.from({ length: dias }, (_, i) => {
  const d = new Date(Date.now() - i * 86_400_000);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
}).reverse();

const claves = fechas.flatMap((f) => EVENTOS.map((e) => `asistente:metricas:${f}:${e}`));
const res = await fetch(`${url}/mget/${claves.map(encodeURIComponent).join("/")}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { result } = await res.json();

const filas = fechas.map((f, i) => {
  const fila = { fecha: f };
  EVENTOS.forEach((e, j) => (fila[e] = Number(result[i * EVENTOS.length + j] ?? 0)));
  return fila;
});
const total = Object.fromEntries(EVENTOS.map((e) => [e, filas.reduce((s, f) => s + f[e], 0)]));
console.table(filas.filter((f) => EVENTOS.some((e) => f[e] > 0)));
console.log("Total", total);
