"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FotoCierre } from "@/lib/galeriaCierres";

const POR_PAGINA = 9;

// 1 columna en pantallas muy angostas, 2 desde 480px, 3 desde 1024px
function useColumnas() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 3 : w >= 480 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return cols;
}

// Reparte las fotos en la columna más corta para que el collage quede
// balanceado y se lea, aproximadamente, de izquierda a derecha según "orden".
function repartir(fotos: FotoCierre[], cols: number) {
  const columnas: { foto: FotoCierre; index: number }[][] = Array.from({ length: cols }, () => []);
  const alturas = new Array(cols).fill(0);
  fotos.forEach((foto, index) => {
    const destino = alturas.indexOf(Math.min(...alturas));
    columnas[destino].push({ foto, index });
    alturas[destino] += foto.height / foto.width;
  });
  return columnas;
}

export default function GaleriaCierresMasonry({ fotos }: { fotos: FotoCierre[] }) {
  const cols = useColumnas();
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [abierta, setAbierta] = useState<number | null>(null);

  const columnas = useMemo(() => repartir(fotos.slice(0, visibles), cols), [fotos, visibles, cols]);

  return (
    <>
      <div className="flex gap-3 md:gap-4 items-start">
        {columnas.map((columna, c) => (
          <div key={c} className="flex-1 min-w-0 flex flex-col gap-3 md:gap-4">
            {columna.map(({ foto, index }) => (
              <motion.button
                key={foto.id}
                type="button"
                onClick={() => setAbierta(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: (index % 3) * 0.08 }}
                className="group relative block w-full overflow-hidden bg-blav-gray text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                style={{
                  aspectRatio: `${foto.width} / ${foto.height}`,
                  backgroundImage: foto.lqip ? `url(${foto.lqip})` : undefined,
                  backgroundSize: "cover",
                }}
                aria-label={foto.pie ? `Ver foto: ${foto.pie}` : "Ver foto de cierre"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto.src}
                  srcSet={foto.srcSet}
                  sizes="(min-width: 1280px) 410px, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
                  width={foto.width}
                  height={foto.height}
                  alt={foto.pie || "Cierre de operación BLAV"}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {foto.pie && (
                  <p className="absolute left-0 right-0 bottom-0 p-4 font-sans text-xs md:text-sm text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {foto.pie}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      {visibles < fotos.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + POR_PAGINA)}
            className="font-sans text-xs tracking-[0.2em] uppercase text-blav-black border border-blav-black/20 px-8 py-3 hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Ver más cierres
          </button>
        </div>
      )}

      <AnimatePresence>
        {abierta !== null && (
          <Lightbox
            fotos={fotos}
            index={abierta}
            onChange={setAbierta}
            onClose={() => setAbierta(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Lightbox({
  fotos,
  index,
  onChange,
  onClose,
}: {
  fotos: FotoCierre[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const foto = fotos[index];
  const total = fotos.length;
  const touchX = useRef<number | null>(null);

  const prev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange]);
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next]);

  // Precarga la siguiente para que la navegación se sienta inmediata
  useEffect(() => {
    if (total < 2) return;
    const img = new Image();
    img.src = fotos[(index + 1) % total].srcGrande;
  }, [index, total, fotos]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center px-4 py-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de cierres"
    >
      <button
        type="button"
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white font-sans text-3xl leading-none p-2"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            className="hidden sm:block absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white font-sans text-4xl leading-none p-3"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="hidden sm:block absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white font-sans text-4xl leading-none p-3"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.figure
          key={foto.id}
          className="flex flex-col items-center max-w-full"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={foto.srcGrande}
            alt={foto.pie || "Cierre de operación BLAV"}
            width={foto.width}
            height={foto.height}
            className="max-h-[78vh] md:max-h-[82vh] w-auto max-w-full object-contain"
            style={{ backgroundImage: foto.lqip ? `url(${foto.lqip})` : undefined, backgroundSize: "cover" }}
          />
          {(foto.pie || total > 1) && (
            <figcaption className="mt-4 text-center">
              {foto.pie && (
                <p className="font-display text-lg md:text-xl text-white/90">{foto.pie}</p>
              )}
              {total > 1 && (
                <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/40 mt-1">
                  {index + 1} / {total}
                </p>
              )}
            </figcaption>
          )}
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
}
