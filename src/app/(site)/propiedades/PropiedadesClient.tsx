"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Propiedad } from "@/types/propiedad";
import { TIPO_LABEL } from "@/types/propiedad";
import PropiedadCard from "@/components/propiedades/PropiedadCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

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

export default function PropiedadesClient({ propiedades, tipos }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTipo, setActiveTipo] = useState("Todos");
  const [activeOp, setActiveOp] = useState("Todos");

  const estatusParam = searchParams.get("estatus") ?? "disponible";
  const activeEstatus = ESTATUS_OPTIONS.find((o) => o.param === estatusParam) ?? ESTATUS_OPTIONS[0];

  function setEstatus(param: string) {
    const qs = param === "disponible" ? "" : `?estatus=${param}`;
    router.push(`/propiedades${qs}`);
  }

  const filtered = propiedades.filter((p) => {
    const tipoOk  = activeTipo === "Todos" || p.tipo === activeTipo;
    const opOk    = activeOp === "Todos" || p.operacion === activeOp;
    const estadoOk = activeEstatus.estados === null || activeEstatus.estados.includes(p.estado);
    return tipoOk && opOk && estadoOk;
  });

  return (
    <>
      {/* Filtro de estatus */}
      <AnimatedSection className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {ESTATUS_OPTIONS.map((o) => (
            <button
              key={o.param}
              onClick={() => setEstatus(o.param)}
              className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 border transition-colors duration-200 ${
                activeEstatus.param === o.param
                  ? "bg-blav-black text-white border-blav-black"
                  : "bg-white text-blav-grayMid border-blav-black/20 hover:border-blav-black hover:text-blav-black"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Filtros tipo y operación */}
      <AnimatedSection className="mb-10 space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {["Todos", ...tipos].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTipo(t)}
              className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 border transition-colors duration-200 ${
                activeTipo === t
                  ? "bg-gold text-white border-gold"
                  : "bg-white text-blav-grayMid border-blav-black/20 hover:border-gold hover:text-gold"
              }`}
            >
              {t === "Todos" ? "Todos" : TIPO_LABEL[t as keyof typeof TIPO_LABEL] ?? t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {["Todos", "venta", "renta", "preventa"].map((op) => (
            <button
              key={op}
              onClick={() => setActiveOp(op)}
              className={`font-sans text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200 ${
                activeOp === op
                  ? "bg-blav-black text-white border-blav-black"
                  : "bg-white text-blav-grayMid border-blav-black/20 hover:border-blav-black hover:text-blav-black"
              }`}
            >
              {op === "Todos" ? "Venta + Renta" : op}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Grid */}
      {filtered.length === 0 ? (
        <AnimatedSection>
          <p className="font-sans text-blav-grayMid text-center py-16">
            No hay propiedades disponibles con estos filtros.
          </p>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <AnimatedSection key={p.slug} delay={i * 0.07}>
              <PropiedadCard propiedad={p} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </>
  );
}
