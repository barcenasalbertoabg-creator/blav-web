import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAllArticulos, getArticuloBySlug, getArticuloSlugs } from "@/lib/articulos";
import { CATEGORIA_LABEL } from "@/types/articulo";
import type { PortableTextBlock } from "@/types/project";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getArticuloSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticuloBySlug(params.slug);
  if (!a) return {};
  const title = a.seo.titulo || a.titulo;
  const description = a.seo.descripcion || a.descripcion_corta;
  const image = a.seo.og_imagen || a.imagen_portada;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      url: `https://blav.com.mx/blog/${a.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

const portableComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-sans text-blav-grayMid leading-relaxed mb-5 text-base">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-blav-black mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl font-semibold text-blav-black mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-display text-lg font-semibold text-blav-black mt-6 mb-2">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-none space-y-2 mb-5 ml-0">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 mb-5 font-sans text-blav-grayMid">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3 font-sans text-blav-grayMid">
        <span className="text-gold mt-1 shrink-0">—</span>
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-blav-black">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
};

function formatFecha(fecha: string): string {
  return new Date(fecha + "T12:00:00").toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ArticuloPage({ params }: Props) {
  const [articulo, todos] = await Promise.all([
    getArticuloBySlug(params.slug),
    getAllArticulos(),
  ]);

  if (!articulo) notFound();

  const isPortableText = Array.isArray(articulo.contenido);
  const relacionados = todos.filter((a) => a.slug !== articulo.slug).slice(0, 2);

  const waUrl =
    "https://wa.me/524428378891?text=Hola%20Alberto%2C%20le%C3%AD%20el%20blog%20de%20BLAV%20y%20me%20gustar%C3%ADa%20platicar.";

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative bg-blav-black py-16 md:py-24 overflow-hidden">
        {articulo.imagen_portada && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url('${articulo.imagen_portada}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-blav-black/80 to-blav-black" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="font-sans text-xs text-white/40 hover:text-gold transition-colors">
              Blog
            </Link>
            <span className="text-white/20">›</span>
            <span className="font-sans text-xs text-gold">
              {CATEGORIA_LABEL[articulo.categoria] ?? articulo.categoria}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight mb-6">
            {articulo.titulo}
          </h1>
          <div className="flex items-center gap-4 text-white/50 font-sans text-sm">
            <span>{formatFecha(articulo.fecha)}</span>
            {articulo.tiempo_lectura && (
              <>
                <span>·</span>
                <span>{articulo.tiempo_lectura} min de lectura</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Imagen portada */}
      {articulo.imagen_portada && (
        <div className="relative aspect-[21/9] max-h-96 overflow-hidden bg-blav-gray">
          <Image
            src={articulo.imagen_portada}
            alt={articulo.titulo}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <AnimatedSection>
          <p className="font-sans text-lg text-blav-grayMid leading-relaxed mb-8 border-l-2 border-gold pl-5">
            {articulo.descripcion_corta}
          </p>

          {articulo.contenido && (
            <div className="prose-none">
              {isPortableText ? (
                <PortableText
                  value={articulo.contenido as PortableTextBlock[]}
                  components={portableComponents}
                />
              ) : (
                (articulo.contenido as string).split("\n\n").map((para, i) => (
                  <p key={i} className="font-sans text-blav-grayMid leading-relaxed mb-5 text-base">
                    {para}
                  </p>
                ))
              )}
            </div>
          )}
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.15}>
          <div className="mt-14 border border-gold/20 bg-blav-gray p-8">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              ¿Te quedaron dudas?
            </p>
            <h3 className="font-display text-2xl font-semibold text-blav-black mb-3">
              Platica con Alberto directamente
            </h3>
            <p className="font-sans text-sm text-blav-grayMid mb-6">
              Sin formularios ni tiempos de espera. Responde personalmente.
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Escribir por WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Artículos relacionados */}
      {relacionados.length > 0 && (
        <section className="py-16 md:py-20 bg-blav-gray border-t border-blav-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-blav-black mb-8">
              Más artículos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relacionados.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex gap-5 bg-white border border-blav-gray hover:border-gold/30 transition-colors p-5"
                >
                  {a.imagen_portada && (
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-blav-gray">
                      <Image src={a.imagen_portada} alt={a.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs text-gold mb-1">
                      {CATEGORIA_LABEL[a.categoria] ?? a.categoria}
                    </p>
                    <h3 className="font-display text-base font-semibold text-blav-black group-hover:text-gold transition-colors line-clamp-2">
                      {a.titulo}
                    </h3>
                    <p className="font-sans text-xs text-blav-grayMid mt-1">{formatFecha(a.fecha)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
