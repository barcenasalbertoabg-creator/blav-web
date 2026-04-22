"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const preguntas = [
  {
    pregunta: "¿Cómo funciona el proceso de compra con BLAV?",
    respuesta:
      "Te asignamos un asesor dedicado que te guía en cada paso: desde entender tus necesidades, presentarte opciones alineadas a tu presupuesto, acompañarte en visitas, negociar el precio, coordinar la notaría y cerrar la operación. Todo el proceso, contigo.",
  },
  {
    pregunta: "¿Cuánto cobran por sus servicios?",
    respuesta:
      "La consulta inicial es completamente gratuita. Nuestros honorarios se integran en la operación inmobiliaria de forma transparente; te informamos desde el primer momento sin letra pequeña ni sorpresas.",
  },
  {
    pregunta: "¿Trabajan con crédito hipotecario?",
    respuesta:
      "Sí. Te orientamos con los principales bancos e Infonavit para que encuentres el esquema de financiamiento más conveniente. También coordinamos con el desarrollador cuando el proyecto ofrece crédito directo.",
  },
  {
    pregunta: "¿Puedo vender mi propiedad con BLAV?",
    respuesta:
      "Por supuesto. Evaluamos tu inmueble, definimos la estrategia de precio y lo promovemos activamente en los canales correctos. Nos encargamos de todo el proceso de venta para que tú no tengas que preocuparte.",
  },
  {
    pregunta: "¿En qué zonas operan?",
    respuesta:
      "Atendemos Querétaro (Juriquilla, El Marqués, Sonterra, Centro Histórico, Corregidora y Libramiento Norponiente) y Guanajuato (Apaseo el Grande y San Miguel de Allende). Contactanos si tienes dudas sobre tu zona específica.",
  },
];

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-blav-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            ¿Tienes dudas?
          </h2>
        </AnimatedSection>

        <div className="space-y-3">
          {preguntas.map(({ pregunta, respuesta }, i) => {
            const isOpen = abierto === i;
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="border border-white/10 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setAbierto(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base md:text-lg text-white font-medium leading-snug">
                      {pregunta}
                    </span>
                    <span
                      className={`shrink-0 w-5 h-5 flex items-center justify-center text-gold transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-4 h-4"
                      >
                        <line x1="8" y1="1" x2="8" y2="15" />
                        <line x1="1" y1="8" x2="15" y2="8" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="font-sans text-sm text-white/60 leading-relaxed px-6 pb-6 pt-1">
                      {respuesta}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
