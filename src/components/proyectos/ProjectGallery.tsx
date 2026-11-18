"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  alt: string;
}

/**
 * Galería de propiedad / proyecto.
 * - Carrusel principal: se desliza con el dedo (scroll-snap nativo), flechas en
 *   escritorio, avance automático que se detiene en cuanto el usuario interactúa.
 * - Tira de miniaturas para saltar a cualquier foto.
 * - Visor a pantalla completa: deslizar con el dedo, flechas grandes, teclado
 *   (← → Esc), contador, y cada foto ocupa todo el alto (sin recortes ni marco
 *   16:9 que haga pequeñas las fotos verticales).
 */
export default function ProjectGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const n = images?.length ?? 0;

  const scrollTrackTo = useCallback((i: number, smooth = true) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const scrollBoxTo = useCallback((i: number, smooth = true) => {
    const el = boxRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Índice activo según el desplazamiento del carrusel.
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  const onBoxScroll = () => {
    const el = boxRef.current;
    if (!el || lightbox === null) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== lightbox) setLightbox(i);
  };

  // Avance automático (se apaga al tocar, arrastrar o abrir el visor).
  useEffect(() => {
    if (!auto || lightbox !== null || n < 2) return;
    const t = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % n;
        scrollTrackTo(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [auto, lightbox, n, scrollTrackTo]);

  const stopAuto = () => setAuto(false);

  const go = (i: number) => {
    stopAuto();
    const k = (i + n) % n;
    setActive(k);
    scrollTrackTo(k);
  };

  const openBox = (i: number) => {
    stopAuto();
    setLightbox(i);
  };

  const closeBox = useCallback(() => {
    setLightbox((cur) => {
      if (cur !== null) {
        setActive(cur);
        requestAnimationFrame(() => scrollTrackTo(cur, false));
      }
      return null;
    });
  }, [scrollTrackTo]);

  const boxGo = useCallback(
    (i: number) => {
      const k = (i + n) % n;
      setLightbox(k);
      scrollBoxTo(k);
    },
    [n, scrollBoxTo]
  );

  // Al abrir el visor: colocarlo en la foto elegida, bloquear el scroll de la
  // página y activar el teclado.
  useEffect(() => {
    if (lightbox === null) return;
    requestAnimationFrame(() => scrollBoxTo(lightbox, false));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBox();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox === null]);

  // Re-registrar teclado con el índice actual.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); boxGo(lightbox + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); boxGo(lightbox - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, boxGo]);

  if (!images || n === 0) return null;

  const arrow =
    "absolute top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white text-2xl leading-none backdrop-blur-sm hover:bg-black/65 transition-colors";

  return (
    <>
      {/* Carrusel principal */}
      <div className="relative bg-blav-gray select-none" onPointerDown={stopAuto}>
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openBox(i)}
              className="relative w-full flex-none snap-center aspect-[4/3] md:aspect-[16/10] bg-black/5"
              aria-label={`Ampliar foto ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                loading={i < 2 ? "eager" : "lazy"}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </button>
          ))}
        </div>

        {n > 1 && (
          <>
            <button type="button" className={`${arrow} left-3 hidden md:flex`} onClick={() => go(active - 1)} aria-label="Foto anterior">‹</button>
            <button type="button" className={`${arrow} right-3 hidden md:flex`} onClick={() => go(active + 1)} aria-label="Foto siguiente">›</button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 font-sans text-xs text-white">
              {active + 1} / {n}
            </span>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {n > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((src, i) => (
            <button
              key={"t" + src + i}
              type="button"
              onClick={() => go(i)}
              className={`relative h-16 w-20 flex-none overflow-hidden border-2 transition-opacity ${
                i === active ? "border-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Visor a pantalla completa */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] bg-black" role="dialog" aria-modal="true" aria-label="Galería de fotos">
          <div
            ref={boxRef}
            onScroll={onBoxScroll}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((src, i) => (
              <div key={"l" + src + i} className="relative h-full w-full flex-none snap-center flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  loading={Math.abs(i - lightbox) <= 1 ? "eager" : "lazy"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl leading-none text-white hover:bg-white/30"
            style={{ top: "max(12px, env(safe-area-inset-top))" }}
            onClick={closeBox}
            aria-label="Cerrar"
          >
            ×
          </button>
          {n > 1 && (
            <>
              <button type="button" className={`${arrow} left-3 hidden sm:flex`} onClick={() => boxGo(lightbox - 1)} aria-label="Foto anterior">‹</button>
              <button type="button" className={`${arrow} right-3 hidden sm:flex`} onClick={() => boxGo(lightbox + 1)} aria-label="Foto siguiente">›</button>
            </>
          )}
          <p
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 font-sans text-xs text-white"
            style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
            {lightbox + 1} / {n} · desliza para ver más
          </p>
        </div>
      )}
    </>
  );
}
