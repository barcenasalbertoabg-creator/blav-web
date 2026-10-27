import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CATALOGO_TAG } from "@/lib/asistente/catalogo";

export const runtime = "nodejs";

// Webhook de Sanity (Manage → API → Webhooks). Al publicar una propiedad o
// proyecto, el asistente vuelve a leer el catálogo en la siguiente pregunta.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Falta SANITY_REVALIDATE_SECRET" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
    if (!isValidSignature) return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 401 });
    if (body?._type && !["propiedad", "project"].includes(body._type)) {
      return NextResponse.json({ ok: true, ignorado: body._type });
    }
    revalidateTag(CATALOGO_TAG);
    return NextResponse.json({ ok: true, revalidado: CATALOGO_TAG, tipo: body?._type ?? null });
  } catch (e) {
    console.error("[revalidate]", e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
