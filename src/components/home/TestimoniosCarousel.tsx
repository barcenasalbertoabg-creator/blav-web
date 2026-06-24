"use client";

import { useCallback, useEffect, useState } from "react";
import type { Testimonio } from "@/lib/testimonios";

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < n ? "fill-gold" : "fill-white/20"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonioCard({ t }: { t: Testimonio }) {
  return (
    <div className="border border-white/10 p-8 h-full flex flex-col hover:border-gold/30 transition-colors duration-300">
      <Estrellas n={t.calificacion} />
      <blockquote className="font-display text-lg text-white/90 leading-relaxed flex-1 mb-6">
        &ldquo;{t.texto}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 border-t border-white/10 pt-6">
        {t.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.foto}
            alt={t.nombre}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <span className="font-display text-gold text-sm font-semibold">
              {t.nombre.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-white">{t.nombre}</p>
          <p className="font-sans text-xs text-white/50 mt-0.5">{t.cargo_o_tipo_operacion}</p>
        </div>
        {t.foto_operacion && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.foto_operacion}
            alt="Propiedad"
            className="w-16 h-12 object-cover shrink-0 opacity-70"
          />
        )}
      </div>
    </div>
  );
}

interface Props {
  testimonios: Testimonio[];
}

const AUTO_ADVANCE_MS = 4500;

export default function TestimoniosCarousel({ testimonios }: Props) {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setItemsPerView(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pages = Math.max(1, Math.ceil(testimonios.length / itemsPerView));

  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [pages]);

  useEffect(() => {
    if (paused || pages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, pages]);

  const goTo = useCallback((i: number) => setPage(((i % pages) + pages) % pages), [pages]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="grid w-full shrink-0 gap-6"
              style={{ gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))` }}
            >
              {testimonios
                .slice(pageIndex * itemsPerView, pageIndex * itemsPerView + itemsPerView)
                .map((t) => (
                  <TestimonioCard key={t.nombre} t={t} />
                ))}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            type="button"
            aria-label="Testimonio anterior"
            onClick={() => goTo(page - 1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white hover:text-blav-black transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente testimonio"
            onClick={() => goTo(page + 1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white hover:text-blav-black transition-colors"
          >
            ›
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir al grupo de testimonios ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === page ? "bg-gold" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
