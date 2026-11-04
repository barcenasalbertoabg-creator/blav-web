"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import type { Propiedad } from "@/types/propiedad";
import { TIPO_LABEL, OPERACION_LABEL } from "@/types/propiedad";

interface Props {
  propiedades: Propiedad[];
}

// Centro por defecto: Querétaro capital.
const CENTRO: [number, number] = [20.5888, -100.3899];

// Por privacidad del propietario no se marca el punto exacto: se dibuja un
// círculo de ~350 m alrededor de la ubicación capturada en el Studio.
const RADIO_M = 350;

const ESTADO_TXT: Record<string, string> = {
  reservado: "Apartada",
  rentado: "Rentada",
  vendido: "Vendida",
  cerrado: "No disponible",
};

function precioTexto(p: Propiedad): string {
  if (!p.mostrar_precio || p.precio == null) return "Precio a consultar";
  const v = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: p.moneda === "USD" ? "USD" : "MXN",
    maximumFractionDigits: 0,
  }).format(p.precio);
  return p.operacion === "renta" ? `${v} / mes` : v;
}

export default function MapaPropiedades({ propiedades }: Props) {
  const conCoord = propiedades.filter(
    (p) => p.ubicacion?.coordenadas?.lat != null && p.ubicacion?.coordenadas?.lng != null,
  );
  const sinCoord = propiedades.length - conCoord.length;

  // Varias propiedades del mismo condominio comparten punto: se agrupan en un
  // solo círculo cuyo popup las lista todas.
  const porPunto = new Map<string, { key: string; centro: [number, number]; items: Propiedad[] }>();
  conCoord.forEach((p) => {
    const { lat, lng } = p.ubicacion!.coordenadas!;
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    if (!porPunto.has(key)) porPunto.set(key, { key, centro: [lat, lng], items: [] });
    porPunto.get(key)!.items.push(p);
  });
  const grupos = Array.from(porPunto.values());

  const puntos = conCoord.map((p) => [p.ubicacion!.coordenadas!.lat, p.ubicacion!.coordenadas!.lng] as [number, number]);
  const centro: [number, number] = puntos.length
    ? [puntos.reduce((s, x) => s + x[0], 0) / puntos.length, puntos.reduce((s, x) => s + x[1], 0) / puntos.length]
    : CENTRO;

  return (
    <div>
      <div className="h-[520px] w-full border border-blav-gray relative z-0">
        <MapContainer center={centro} zoom={puntos.length ? 12 : 11} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {grupos.map((g) => {
            const disponible = g.items.some((p) => p.estado === "disponible");
            return (
              <Circle
                key={g.key}
                center={g.centro}
                radius={RADIO_M}
                pathOptions={{
                  color: disponible ? "#706a00" : "#777777",
                  fillColor: disponible ? "#b5a642" : "#999999",
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="font-sans" style={{ minWidth: 200, maxHeight: 260, overflowY: "auto" }}>
                    {g.items.map((p) => (
                      <div key={p.slug} style={{ padding: "6px 0", borderBottom: g.items.length > 1 ? "1px solid #eee" : "none" }}>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#706a00", margin: 0 }}>
                          {TIPO_LABEL[p.tipo] ?? p.tipo} · {OPERACION_LABEL[p.operacion] ?? p.operacion}
                          {p.estado !== "disponible" ? ` · ${ESTADO_TXT[p.estado] ?? p.estado}` : ""}
                        </p>
                        <p style={{ fontWeight: 600, margin: "2px 0" }}>{p.titulo}</p>
                        <p style={{ margin: "0 0 4px" }}>{precioTexto(p)}</p>
                        <Link href={`/propiedades/${p.slug}`} style={{ color: "#706a00", textDecoration: "underline" }}>
                          Ver propiedad
                        </Link>
                      </div>
                    ))}
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
      <p className="font-sans text-xs text-blav-grayMid text-center mt-3">
        Ubicaciones aproximadas.
        {sinCoord > 0 && ` ${sinCoord} ${sinCoord === 1 ? "propiedad aún no aparece" : "propiedades aún no aparecen"} en el mapa; puedes verlas en la vista de lista.`}
      </p>
    </div>
  );
}
