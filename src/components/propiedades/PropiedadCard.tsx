import Link from "next/link";
import Image from "next/image";
import type { Propiedad } from "@/types/propiedad";
import { TIPO_LABEL, TIPO_ICON, OPERACION_LABEL } from "@/types/propiedad";

interface Props {
  propiedad: Propiedad;
}

function formatPrecio(precio: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "MXN",
    maximumFractionDigits: 0,
  }).format(precio);
}

function getBadge(estado: Propiedad["estado"]): string | null {
  if (estado === "vendido") return "VENDIDA";
  if (estado === "rentado") return "RENTADA";
  if (estado === "cerrado") return "NO DISPONIBLE";
  return null;
}

export default function PropiedadCard({ propiedad }: Props) {
  const {
    slug, titulo, tipo, operacion, estado, descripcion_corta,
    precio, mostrar_precio, moneda, nota_precio,
    imagen_portada, superficie, recamaras, banos, ubicacion,
  } = propiedad;

  const badge = getBadge(estado);

  return (
    <Link
      href={`/propiedades/${slug}`}
      className="group block bg-white border border-blav-gray hover:border-gold/30 transition-colors duration-300 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-[16/9] overflow-hidden bg-blav-gray">
        {imagen_portada ? (
          <Image
            src={imagen_portada}
            alt={titulo}
            fill
            className={`object-cover transition-transform duration-500 ${badge ? "opacity-70" : "group-hover:scale-105"}`}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-blav-grayMid/30">
            {TIPO_ICON[tipo]}
          </div>
        )}

        {/* Badge VENDIDA / RENTADA */}
        {badge && (
          <div className="absolute top-0 right-0 bg-red-600 text-white font-sans text-xs font-bold tracking-[0.15em] px-3 py-1.5">
            {badge}
          </div>
        )}

        {/* Labels tipo y operación */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="gold-label bg-white/90 backdrop-blur-sm">
            {TIPO_ICON[tipo]} {TIPO_LABEL[tipo]}
          </span>
          <span className="gold-label bg-blav-black/80 text-white border-transparent backdrop-blur-sm">
            {OPERACION_LABEL[operacion]}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-blav-black mb-1 group-hover:text-gold transition-colors line-clamp-1">
          {titulo}
        </h3>
        {(ubicacion?.zona || ubicacion?.ciudad) && (
          <p className="font-sans text-xs text-blav-grayMid tracking-wide mb-3">
            {ubicacion.zona} {ubicacion.zona && ubicacion.ciudad ? "·" : ""} {ubicacion.ciudad}
          </p>
        )}
        <p className="font-sans text-sm text-blav-grayMid leading-relaxed line-clamp-2 mb-5">
          {descripcion_corta}
        </p>

        {/* Specs rápidos */}
        {(recamaras || banos || superficie) && (
          <div className="flex gap-4 border-t border-blav-gray pt-4 mb-4">
            {recamaras != null && (
              <div className="flex items-center gap-1.5">
                <span className="text-base">🛏</span>
                <span className="font-sans text-sm text-blav-black font-medium">{recamaras}</span>
              </div>
            )}
            {banos != null && (
              <div className="flex items-center gap-1.5">
                <span className="text-base">🚿</span>
                <span className="font-sans text-sm text-blav-black font-medium">{banos}</span>
              </div>
            )}
            {superficie != null && (
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xs text-blav-grayMid">{superficie} m²</span>
              </div>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            {badge ? (
              <p className="font-sans text-xs text-red-500 font-semibold tracking-wide">
                {badge === "NO DISPONIBLE" ? "No disponible" : badge === "VENDIDA" ? "Propiedad vendida" : "Propiedad rentada"}
              </p>
            ) : mostrar_precio && precio ? (
              <p className="font-display text-lg font-semibold text-gold">
                {formatPrecio(precio, moneda)}
                <span className="font-sans text-xs text-blav-grayMid ml-1">{moneda}</span>
              </p>
            ) : (
              <p className="font-sans text-xs text-blav-grayMid">{nota_precio}</p>
            )}
          </div>
          <span className="font-sans text-xs tracking-widest uppercase text-gold group-hover:text-gold-light transition-colors">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
