"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroImage } from "@/lib/hero";

const AUTO_ADVANCE_MS = 5500;

interface Props {
  images: HeroImage[];
}

export default function HeroSlideshow({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop || paused || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isDesktop, paused, images.length]);

  if (images.length === 0) return null;

  // Mobile: una sola imagen fija (la más destacada), sin slideshow ni carga extra
  if (!isDesktop) {
    return (
      <div className="absolute inset-0">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div
          key={`${img.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
