import { NextResponse } from "next/server";
import { EVENTOS, contar, huellaIp, ipDeRequest, permitirEvento, type Evento } from "@/lib/asistente/limites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Solo los eventos que mide el navegador; "mensaje" y "conversacion" se cuentan en /api/asistente.
const DEL_CLIENTE: Evento[] = ["whatsapp_click", "tarjeta_click"];

export async function POST(req: Request) {
  if (process.env.ASISTENTE_ENABLED !== "true") return new NextResponse(null, { status: 204 });
  let tipo: unknown;
  try {
    tipo = (await req.json())?.tipo;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!EVENTOS.includes(tipo as Evento) || !DEL_CLIENTE.includes(tipo as Evento)) {
    return new NextResponse(null, { status: 400 });
  }
  if (await permitirEvento(huellaIp(ipDeRequest(req)))) await contar(tipo as Evento);
  return new NextResponse(null, { status: 204 });
}
