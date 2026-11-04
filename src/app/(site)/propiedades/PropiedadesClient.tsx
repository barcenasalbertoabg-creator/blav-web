"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import type { Propiedad } from "@/types/propiedad";
import { TIPO_LABEL } from "@/types/propiedad";
import PropiedadCard from "@/components/propiedades/PropiedadCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { zonaDe, normalizarTexto } from "@/lib/zonas";

// El mapa usa Leaflet, que necesita `window`: se carga solo en el navegador.
const MapaPropiedades = dynamic(() => import("@/components/propiedades/MapaPropiedades"), {
  ssr: false,
  loading: () => <div className="h-[520px] bg-blav-gray animate-pulse" />,
});

interface Props {
  propiedades: Propiedad[];
  tipos: string[];
}

const ESTATUS_OPTIONS = [
  { label: "Disponibles", param: "disponible", estados: ["disponible"] as string[] | null },
  { label: "Apartadas",   param: "apartada",   estados: ["reservado"] as string[] | null },
  { label: "Rentadas",    param: "rentada",    estados: ["rentado"] as string[] | null },
  { label: "Vendidas",    param: "vendida",    estados: ["vendido"] as string[] | null },
  { label: "Ver todas",   param: "todas",      estados: null },
];

const CATEGORIA_TIPOS: Record<string, string[]> = {
  residencial: ["casa", "departamento"],
  comercial: ["local", "oficina"],
  industrial: ["bodega"],
};

// Rangos de precio separados por operación: una renta y una venta no se
// comparan en la misma escala.
const RANGOS: Record<string, Array<{ label: string; min: number; max: number }>> = {
  renta: [
    { label: "Hasta $10,000", min: 0, max: 10000 },
    { label: "$10,000 – $15,000", min: 10000, max: 15000 },
    { label: "Más de $15,000", min: 15000, max: Infinity },
  ],
  venta: [
    { label: "Hasta $2 millones", min: 0, max: 2_000_000 },
    { label: "$2 – $3.5 millones", min: 2_000_000, max: 3_500_000 },
    { label: "Más de $3.5 millones", min: 3_500_000, max: Infinity },
  ],
};

const chip = (activo: boolean, oro = false) =>
  `font-sans text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200 ${
    activo
      ? oro
        ? "bg-gold text-white border-gold"
        : "bg-blav-black text-white border-blav-black"
      : `bg-white text-blav-grayMid border-blav-black/20 ${oro ? "hover:border-gold hover:text-gold" : "hover:border-blav-black hover:text-blav-black"}`
  }`;

export default function PropiedadesClient({ propiedades, tipos }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriaParam = searchParams.get("categoria");
  const [activeTipo, setActiveTipo] = useState("Todos");
  const [activeOp, setActiveOp] = useState("Todos");
  const [activeCategoria] = useState<string | null>(categoriaParam);
  const [zona, setZona] = useState("Todas");
  const [texto, setTexto] = useState("");
  const [rango, setRango] = useState("");
  const [recamaras, setRecamaras] = useState(0);
  const [vista, setVista] = useState<"lista" | "mapa">("lista");

  const estatusParam = searchParams.get("estatus") ?? "disponible";
  const activeEstatus = ESTATUS_OPTIONS.find((o) => o.param === estatusParam) ?? ESTATUS_OPTIONS[0];

  function setEstatus(param: string) {
    const qs = param === "disponible" ? "" : `?estatus=${param}`;
    router.push(`/propiedades${qs}`);
  }

  // Filtros "de base" (estatus, tipo, operación, búsqueda, precio, recámaras).
  // Las pestañas de zona se calculan sobre este resultado para mostrar solo
  // zonas que tienen algo que ver con lo que la persona está buscando.
  const base = useMemo(() => {
    const q = normalizarTexto(texto.trim());
    const rangos = activeOp === "venta" || activeOp === "renta" ? RANGOS[activeOp] : [];
    const r = rangos.find((x) => x.label === rango);
    return propiedades.filter((p) => {
      const tipoOk =
        activeTipo === "Todos"
          ? activeCategoria
            ? (CATEGORIA_TIPOS[activeCategoria]?.includes(p.tipo) ?? true)
            : true
          : p.tipo === activeTipo;
      const opOk = activeOp === "Todos" || p.operacion === activeOp;
      const estadoOk = activeEstatus.estados === null || activeEstatus.estados.includes(p.estado);
      const textoOk =
        !q ||
        normalizarTexto(
          [p.titulo, p.descripcion_corta, p.ubicacion?.zona, p.ubicacion?.ciudad, zonaDe(p), TIPO_LABEL[p.tipo]]
            .filter(Boolean)
            .join(" "),
        ).includes(q);
      const precioOk = !r || (p.precio != null && p.precio >= r.min && p.precio < r.max);
      const recOk = !recamaras || (p.recamaras ?? 0) >= recamaras;
      return tipoOk && opOk && estadoOk && textoOk && precioOk && recOk;
    });
  }, [propiedades, activeTipo, activeOp, activeCategoria, activeEstatus, texto, rango, recamaras]);

  const zonas = useMemo(() => {
    const conteo = new Map<string, number>();
    base.forEach((p) => conteo.set(zonaDe(p), (conteo.get(zonaDe(p)) ?? 0) + 1));
    return Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]);
  }, [base]);

  const zonaActiva = zona !== "Todas" && zonas.some(([z]) => z === zona) ? zona : "Todas";
  const filtered = zonaActiva === "Todas" ? base : base.filter((p) => zonaDe(p) === zonaActiva);

  const hayFiltrosExtra = !!texto || !!rango || !!recamaras || zonaActiva !== "Todas";

  return (
    <>
      {/* Buscador */}
      <AnimatedSection className="mb-6">
        <div className="max-w-xl mx-auto max-md:px-16">
          <label htmlFor="buscar-propiedad" className="sr-only">Buscar propiedad</label>
          <input
            id="buscar-propiedad"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Busca por zona, fraccionamiento o tipo (ej. Meseta, Tres Cantos, bodega)"
            className="w-full font-sans text-sm border border-blav-black/20 px-4 py-3 focus:outline-none focus:border-gold bg-white"
          />
        </div>
      </AnimatedSection>

      {/* Filtro de estatus.
          En móvil, max-md:px-16 deja libre la columna derecha de los botones flotantes
          (WhatsApp y asistente) para que nunca tapen un filtro, en cualquier posición del scroll. */}
      <AnimatedSection className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center max-md:px-16">
          {ESTATUS_OPTIONS.map((o) => (
            <button key={o.param} onClick={() => setEstatus(o.param)} className={chip(activeEstatus.param === o.param)}>
              {o.label}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Filtros tipo y operación */}
      <AnimatedSection className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-3 justify-center max-md:px-16">
          {["Todos", ...tipos].map((t) => (
            <button key={t} onClick={() => setActiveTipo(t)} className={chip(activeTipo === t, true)}>
              {t === "Todos" ? "Todos" : TIPO_LABEL[t as keyof typeof TIPO_LABEL] ?? t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-md:px-16">
          {["Todos", "venta", "renta", "preventa"].map((op) => (
            <button
              key={op}
              onClick={() => {
                setActiveOp(op);
                setRango("");
              }}
              className={chip(activeOp === op)}
            >
              {op === "Todos" ? "Venta + Renta" : op}
            </button>
          ))}
        </div>

        {/* Precio (solo cuando se eligió venta o renta) y recámaras */}
        <div className="flex flex-wrap gap-3 justify-center items-center max-md:px-16">
          {(activeOp === "venta" || activeOp === "renta") && (
            <select
              aria-label="Rango de precio"
              value={rango}
              onChange={(e) => setRango(e.target.value)}
              className="font-sans text-xs tracking-wide border border-blav-black/20 px-3 py-2 bg-white"
            >
              <option value="">Cualquier precio</option>
              {RANGOS[activeOp].map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
          )}
          <select
            aria-label="Recámaras"
            value={recamaras}
            onChange={(e) => setRecamaras(Number(e.target.value))}
            className="font-sans text-xs tracking-wide border border-blav-black/20 px-3 py-2 bg-white"
          >
            <option value={0}>Recámaras: cualquiera</option>
            <option value={1}>1 o más</option>
            <option value={2}>2 o más</option>
            <option value={3}>3 o más</option>
            <option value={4}>4 o más</option>
          </select>
          {hayFiltrosExtra && (
            <button
              onClick={() => {
                setTexto("");
                setRango("");
                setRecamaras(0);
                setZona("Todas");
              }}
              className="font-sans text-xs underline text-blav-grayMid hover:text-blav-black"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </AnimatedSection>

      {/* Pestañas de zona: solo las que tienen propiedades con los filtros actuales */}
      {zonas.length > 1 && (
        <AnimatedSection className="mb-8">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold text-center mb-3">Zonas</p>
          <div className="flex flex-wrap gap-2 justify-center max-md:px-16">
            <button onClick={() => setZona("Todas")} className={chip(zonaActiva === "Todas", true)}>
              Todas ({base.length})
            </button>
            {zonas.map(([z, n]) => (
              <button key={z} onClick={() => setZona(z)} className={chip(zonaActiva === z, true)}>
                {z} ({n})
              </button>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Lista / Mapa */}
      <div className="flex justify-center gap-2 mb-8 max-md:px-16">
        <button onClick={() => setVista("lista")} className={chip(vista === "lista")}>Lista</button>
        <button onClick={() => setVista("mapa")} className={chip(vista === "mapa")}>Mapa</button>
      </div>

      {filtered.length === 0 ? (
        <AnimatedSection>
          <p className="font-sans text-blav-grayMid text-center py-16">
            No hay propiedades con estos filtros.
          </p>
        </AnimatedSection>
      ) : vista === "mapa" ? (
        <MapaPropiedades propiedades={filtered} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <AnimatedSection key={p.slug} delay={Math.min(i, 8) * 0.07}>
              <PropiedadCard propiedad={p} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </>
  );
}
