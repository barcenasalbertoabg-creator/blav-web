"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Propiedad } from "@/types/propiedad";
import PropiedadCard from "@/components/propiedades/PropiedadCard";

interface Props {
  propiedades: Propiedad[];
}

export default function PropiedadesCarousel({ propiedades }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (propiedades.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {propiedades.map((propiedad) => (
          <div
            key={propiedad.slug}
            className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <PropiedadCard propiedad={propiedad} />
          </div>
        ))}
      </div>

      {propiedades.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Propiedad anterior"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center w-10 h-10 rounded-full border border-gold/40 bg-white text-blav-black hover:bg-gold hover:text-white hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente propiedad"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center w-10 h-10 rounded-full border border-gold/40 bg-white text-blav-black hover:bg-gold hover:text-white hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
