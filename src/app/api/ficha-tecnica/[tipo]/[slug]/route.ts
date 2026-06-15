import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { getPropiedadBySlug } from "@/lib/propiedades";
import { getProjectBySlug } from "@/lib/projects";
import {
  generarFolio,
  extractCoordsFromMapsUrl,
  portableTextToPlain,
  formatPrecio,
} from "@/lib/pdf/utils";
import { createFichaTecnicaElement } from "@/lib/pdf/FichaTecnicaDoc";
import type { Propiedad, OperacionPropiedad } from "@/types/propiedad";
import type { Project } from "@/types/project";
import type { PortableTextBlock } from "@/types/project";
import { TIPO_LABEL } from "@/types/propiedad";

// Prevent Next.js from caching this route — the ?contacto param must always be read fresh
export const dynamic = "force-dynamic";

type Params = { tipo: string; slug: string };

const OPERACION_MAP: Record<OperacionPropiedad, string> = {
  venta: "EN VENTA",
  renta: "EN RENTA",
  preventa: "EN PREVENTA",
};

// ── PDF layout constants (must stay in sync with FichaTecnicaDoc.tsx) ────────
const _CW   = 595 - 36 - 36;                          // 523 pt usable width
const _ROW_H = 158;
const _MAIN_W = Math.round((_CW - 5) * (2 / 3));      // 345 pt
const _SEC_W  = _CW - _MAIN_W - 5;                    // 173 pt
const _SEC_H  = Math.floor((_ROW_H - 5) / 2);         // 76 pt
const _GAL_W  = Math.floor((_CW - 6) / 2);            // 258 pt
const _GAL_H  = 155;

/**
 * Request a Sanity CDN image optimized by width only (no crop).
 * Preserves full aspect ratio so objectFit:"contain" in the PDF shows the complete image.
 * Images are requested at 2× PDF points for sharp rendering.
 */
function sanityImg(url: string, wPt: number, _hPt: number, q = 65): string {
  if (!url || !url.includes("cdn.sanity.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  const w = Math.round(wPt * 2);
  return `${url}${sep}w=${w}&fm=jpg&q=${q}`;
}

function imgToBase64(filename: string): string {
  const filePath = path.join(process.cwd(), "public", "images", filename);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function fetchMapImage(lat: number, lng: number): Promise<string | null> {
  try {
    const key = process.env.GOOGLE_MAPS_STATIC_KEY;
    const url = key
      ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${key}`
      : `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=600x300`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

function resolveCoords(
  coordenadas?: { lat: number; lng: number } | null,
  mapsUrl?: string | null
): { lat: number; lng: number } | null {
  if (coordenadas?.lat && coordenadas?.lng) return coordenadas;
  if (mapsUrl) return extractCoordsFromMapsUrl(mapsUrl);
  return null;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { tipo, slug } = params;
  const contactoParam = req.nextUrl.searchParams.get("contacto");
  const incluirContacto = contactoParam !== "false";

  console.log(`[ficha-tecnica] tipo=${tipo} slug=${slug} contacto_param="${contactoParam}" incluirContacto=${incluirContacto}`);

  if (tipo !== "propiedad" && tipo !== "proyecto") {
    return new NextResponse("Tipo inválido", { status: 400 });
  }

  // ── Fetch data ──────────────────────────────────────────────────
  const docData: Propiedad | Project | null =
    tipo === "propiedad"
      ? await getPropiedadBySlug(slug)
      : await getProjectBySlug(slug);

  if (!docData) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  // ── Static assets ────────────────────────────────────────────────
  const logoBase64 = imgToBase64("logo-blav.png");
  const albertoBase64 = incluirContacto ? imgToBase64("alberto-barcenas.png") : null;

  // ── QR code ──────────────────────────────────────────────────────
  const pageUrl =
    tipo === "propiedad"
      ? `https://blav.com.mx/propiedades/${slug}`
      : `https://blav.com.mx/proyectos/${slug}`;
  const qrDataUrl = await QRCode.toDataURL(pageUrl, { margin: 1, width: 120 });

  // ── Map image ────────────────────────────────────────────────────
  let mapDataUrl: string | null = null;
  if (tipo === "propiedad") {
    const p = docData as Propiedad;
    const coords = resolveCoords(p.ubicacion?.coordenadas, p.ubicacion?.maps_url);
    if (coords) mapDataUrl = await fetchMapImage(coords.lat, coords.lng);
  } else {
    const proj = docData as Project;
    const coords = resolveCoords(proj.ubicacion?.coordenadas, proj.ubicacion?.maps_url);
    if (coords) mapDataUrl = await fetchMapImage(coords.lat, coords.lng);
  }

  // ── Build doc props ──────────────────────────────────────────────
  let docProps;

  if (tipo === "propiedad") {
    const p = docData as Propiedad;

    const specs = [
      p.recamaras != null ? { label: "Recámaras", valor: String(p.recamaras) } : null,
      p.banos != null ? { label: "Baños", valor: String(p.banos) } : null,
      p.estacionamientos != null ? { label: "Estac.", valor: String(p.estacionamientos) } : null,
      p.superficie != null ? { label: "M² Const.", valor: String(p.superficie) } : null,
      p.superficie_terreno != null ? { label: "M² Terreno", valor: String(p.superficie_terreno) } : null,
      p.niveles != null ? { label: "Niveles", valor: String(p.niveles) } : null,
      p.antiguedad ? { label: "Antigüedad", valor: p.antiguedad } : null,
    ].filter(Boolean) as Array<{ label: string; valor: string }>;

    const mantStr =
      p.mantenimiento && p.operacion === "venta"
        ? formatPrecio(p.mantenimiento, "MXN") + " /mes"
        : null;

    const descRaw = portableTextToPlain(p.descripcion_larga as PortableTextBlock[] | string | null);
    const descripcion = descRaw.length > 380 ? descRaw.slice(0, 380).trimEnd() + "…" : descRaw;

    // Pre-crop images to exact PDF container dimensions using Sanity CDN
    const rawImages = (p.imagenes ?? []).slice(0, 20);
    const hasSecImg = rawImages.length > 0;

    docProps = {
      titulo: p.titulo,
      subtitulo: `${TIPO_LABEL[p.tipo].toUpperCase()} ${OPERACION_MAP[p.operacion] ?? p.operacion.toUpperCase()}`,
      ubicacionTexto: [p.ubicacion?.zona, p.ubicacion?.ciudad].filter(Boolean).join(" · "),
      precio: p.mostrar_precio && p.precio ? formatPrecio(p.precio, p.moneda) : null,
      notaPrecio: p.nota_precio,
      mostrarPrecio: p.mostrar_precio,
      imagenPortada: sanityImg(p.imagen_portada, hasSecImg ? _MAIN_W : _CW, _ROW_H, 70),
      imagenes: rawImages.map((u, i) =>
        i < 2 ? sanityImg(u, _SEC_W, _SEC_H) : sanityImg(u, _GAL_W, _GAL_H)
      ),
      specs,
      mantenimiento: mantStr,
      folio: generarFolio(slug),
      descripcion,
      amenidades: p.amenidades ?? null,
      qrDataUrl,
      mapDataUrl,
      logoBase64,
      albertoBase64,
      incluirContacto,
    };
  } else {
    const proj = docData as Project;

    const specs = (proj.caracteristicas ?? []).map(({ label, valor }) => ({ label, valor }));

    const descRaw = portableTextToPlain(proj.descripcion_larga as PortableTextBlock[] | string | null);
    const descripcion = descRaw.length > 380 ? descRaw.slice(0, 380).trimEnd() + "…" : descRaw;

    const rawImages = (proj.imagenes ?? []).slice(0, 20);
    const hasSecImg = rawImages.length > 0;

    docProps = {
      titulo: proj.nombre,
      subtitulo: `PROYECTO ${(proj.categoria ?? "").toUpperCase()}`,
      ubicacionTexto: [proj.ubicacion?.zona, proj.ubicacion?.ciudad].filter(Boolean).join(" · "),
      precio: proj.precio_desde ? formatPrecio(proj.precio_desde, proj.moneda) : null,
      notaPrecio: proj.nota_precio,
      mostrarPrecio: !!proj.precio_desde,
      imagenPortada: sanityImg(proj.imagen_portada, hasSecImg ? _MAIN_W : _CW, _ROW_H, 70),
      imagenes: rawImages.map((u, i) =>
        i < 2 ? sanityImg(u, _SEC_W, _SEC_H) : sanityImg(u, _GAL_W, _GAL_H)
      ),
      specs,
      mantenimiento: null,
      folio: generarFolio(slug),
      descripcion,
      amenidades: proj.amenidades ?? null,
      qrDataUrl,
      mapDataUrl,
      logoBase64,
      albertoBase64,
      incluirContacto,
    };
  }

  // ── Render ───────────────────────────────────────────────────────
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(createFichaTecnicaElement(docProps) as any);
    return new NextResponse(new Uint8Array(pdfBuffer as Buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ficha-tecnica-${slug}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[ficha-tecnica] render error:", err);
    return new NextResponse("Error al generar el PDF", { status: 500 });
  }
}
