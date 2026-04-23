import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllArticulos } from "@/lib/articulos";
import { CATEGORIA_LABEL } from "@/types/articulo";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — BLAV Bienes Raíces",
  description:
    "Consejos, guías y análisis del mercado inmobiliario en Querétaro y Guanajuato. Todo lo que necesitas saber para comprar, rentar o invertir bien.",
};

function formatFecha(fecha: string): string {
  return new Date(fecha + "T12:00:00").toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPage() {
  const articulos = await getAllArticulos();

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-20 bg-blav-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Contenido de valor
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-4">
            Blog BLAV
          </h1>
          <p className="font-sans text-white/60 max-w-lg leading-relaxed">
            Guías prácticas, análisis de mercado y consejos reales para tomar mejores
            decisiones inmobiliarias.
          </p>
        </div>
      </section>

      {/* Grid de artículos */}
      <section className="py-16 md:py-24 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((articulo, i) => (
              <AnimatedSection key={articulo.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${articulo.slug}`}
                  className="group block bg-white border border-blav-gray hover:border-gold/30 transition-colors duration-300 overflow-hidden h-full flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-blav-gray shrink-0">
                    {articulo.imagen_portada ? (
                      <Image
                        src={articulo.imagen_portada}
                        alt={articulo.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                        <span className="font-display text-gold/30 text-5xl">B</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="gold-label bg-white/90 backdrop-blur-sm">
                        {CATEGORIA_LABEL[articulo.categoria] ?? articulo.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-sans text-xs text-blav-grayMid">
                        {formatFecha(articulo.fecha)}
                      </span>
                      {articulo.tiempo_lectura && (
                        <>
                          <span className="text-blav-grayMid/40">·</span>
                          <span className="font-sans text-xs text-blav-grayMid">
                            {articulo.tiempo_lectura} min de lectura
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-blav-black group-hover:text-gold transition-colors mb-3 leading-snug">
                      {articulo.titulo}
                    </h2>
                    <p className="font-sans text-sm text-blav-grayMid leading-relaxed line-clamp-3 flex-1">
                      {articulo.descripcion_corta}
                    </p>
                    <span className="font-sans text-xs tracking-widest uppercase text-gold group-hover:text-gold-light transition-colors mt-5 inline-block">
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
