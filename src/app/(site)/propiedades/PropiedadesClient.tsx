"use client";

import { useState } from "react";
import type { Propiedad } from "@/types/propiedad";
import { TIPO_LABEL } from "@/types/propiedad";
import PropiedadCard from "@/components/propiedades/PropiedadCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  propiedades: Propiedad[];
  tipos: string[];
}

export default function PropiedadesClient({ propiedades, tipos }: Props) {
  const [activeTipo, setActiveTipo] = useState("Todos");
  const [activeOp, setActiveOp] = useState("Todos");

  const filtered = propiedades.filter((p) => {
    const tipoOk = activeTipo === "Todos" || p.tipo === activeTipo;
    const opOk = activeOp === "Todos" || p.operacion === activeOp;
    return tipoOk && opOk;
  });

  return (
    <>
      {/* Filtros */}
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
