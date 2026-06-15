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

type Params = { tipo: string; slug: string };

const OPERACION_MAP: Record<OperacionPropiedad, string> = {
  venta: "EN VENTA",
  renta: "EN RENTA",
  preventa: "EN PREVENTA",
};

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

function optimizeImg(url: string, w = 800, q = 65): string {
  if (!url || !url.includes("cdn.sanity.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&fm=jpg&q=${q}`;
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
  const incluirContacto = req.nextUrl.searchParams.get("contacto") !== "false";

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

    docProps = {
      titulo: p.titulo,
      subtitulo: `${TIPO_LABEL[p.tipo].toUpperCase()} ${OPERACION_MAP[p.operacion] ?? p.operacion.toUpperCase()}`,
      ubicacionTexto: [p.ubicacion?.zona, p.ubicacion?.ciudad].filter(Boolean).join(" · "),
      precio: p.mostrar_precio && p.precio ? formatPrecio(p.precio, p.moneda) : null,
      notaPrecio: p.nota_precio,
      mostrarPrecio: p.mostrar_precio,
      imagenPortada: optimizeImg(p.imagen_portada, 1100, 70),
      imagenes: (p.imagenes ?? []).slice(0, 10).map((u) => optimizeImg(u, 700)),
      specs,
      mantenimiento: mantStr,
      folio: generarFolio(slug),
      descripcion: portableTextToPlain(p.descripcion_larga as PortableTextBlock[] | string | null),
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

    docProps = {
      titulo: proj.nombre,
      subtitulo: `PROYECTO ${(proj.categoria ?? "").toUpperCase()}`,
      ubicacionTexto: [proj.ubicacion?.zona, proj.ubicacion?.ciudad].filter(Boolean).join(" · "),
      precio: proj.precio_desde ? formatPrecio(proj.precio_desde, proj.moneda) : null,
      notaPrecio: proj.nota_precio,
      mostrarPrecio: !!proj.precio_desde,
      imagenPortada: optimizeImg(proj.imagen_portada, 1100, 70),
      imagenes: (proj.imagenes ?? []).slice(0, 10).map((u) => optimizeImg(u, 700)),
      specs,
      mantenimiento: null,
      folio: generarFolio(slug),
      descripcion: portableTextToPlain(proj.descripcion_larga as PortableTextBlock[] | string | null),
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
      },
    });
  } catch (err) {
    console.error("[ficha-tecnica] render error:", err);
    return new NextResponse("Error al generar el PDF", { status: 500 });
  }
}
