"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
}

export default function ProjectGallery({ images, alt }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className={`relative overflow-hidden bg-blav-gray group ${
              i === 0 ? "col-span-2 row-span-2 aspect-[16/9]" : "aspect-square"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-sans text-xs tracking-widest uppercase">
                Ver
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white font-sans text-2xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-sans text-3xl leading-none"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="relative w-full max-w-4xl aspect-[16/9]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox]}
              alt={`${alt} ${lightbox + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-sans text-3xl leading-none"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
            aria-label="Siguiente"
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-xs text-white/40">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
