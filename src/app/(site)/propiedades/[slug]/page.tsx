import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPropiedadBySlug, getPropiedadSlugs, getAllPropiedades } from "@/lib/propiedades";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { PortableTextBlock } from "@/types/project";
import { TIPO_LABEL, TIPO_ICON, OPERACION_LABEL } from "@/types/propiedad";
import ProjectGallery from "@/components/proyectos/ProjectGallery";
import ShareButtons from "@/components/proyectos/ShareButtons";
import LeadForm from "@/components/ui/LeadForm";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getPropiedadSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPropiedadBySlug(params.slug);
  if (!p) return {};
  const title = p.seo.titulo || p.titulo;
  const description = p.seo.descripcion || p.descripcion_corta;
  const image = p.seo.og_imagen || p.imagen_portada;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      url: `https://blav.com.mx/propiedades/${p.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-sans text-blav-grayMid leading-relaxed mb-4">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl font-semibold text-blav-black mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-display text-lg font-semibold text-blav-black mt-4 mb-2">{children}</h4>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-blav-black">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  },
};

function formatPrecio(precio: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "MXN",
    maximumFractionDigits: 0,
  }).format(precio);
}

export default async function PropiedadPage({ params }: Props) {
  const p = await getPropiedadBySlug(params.slug);
  if (!p) notFound();

  const allPropiedades = await getAllPropiedades();
  const propiedadNames = allPropiedades.map((x) => x.titulo);
  const waUrl = buildWhatsAppUrl(p.whatsapp_mensaje);
  const pageUrl = `https://blav.com.mx/propiedades/${p.slug}`;
  const isPortableText = Array.isArray(p.descripcion_larga);

  const specs = [
    p.recamaras != null && { label: "Recámaras", valor: String(p.recamaras) },
    p.banos != null && { label: "Baños completos", valor: String(p.banos) },
    p.medios_banos != null && { label: "Medios baños", valor: String(p.medios_banos) },
    p.estacionamientos != null && { label: "Estacionamientos", valor: String(p.estacionamientos) },
    p.superficie != null && { label: "Superficie construida", valor: `${p.superficie} m²` },
    p.superficie_terreno != null && { label: "Superficie de terreno", valor: `${p.superficie_terreno} m²` },
    p.niveles != null && { label: "Niveles", valor: String(p.niveles) },
    p.antiguedad && { label: "Antigüedad", valor: p.antiguedad },
  ].filter(Boolean) as Array<{ label: string; valor: string }>;

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative bg-blav-black min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
        {p.imagen_portada && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${p.imagen_portada}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-blav-black via-blav-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="gold-label bg-white/10 text-gold border-gold/60">
              {TIPO_ICON[p.tipo]} {TIPO_LABEL[p.tipo]}
            </span>
            <span className="gold-label bg-white/10 text-white/80 border-white/20">
              {OPERACION_LABEL[p.operacion]}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-2">
            {p.titulo}
          </h1>
          {(p.ubicacion?.zona || p.ubicacion?.ciudad) && (
            <p className="font-sans text-white/60 text-sm tracking-wide">
              {p.ubicacion?.zona} {p.ubicacion?.zona && p.ubicacion?.ciudad ? "·" : ""} {p.ubicacion?.ciudad}
            </p>
          )}
        </div>
      </section>

      {/* Specs rápidos */}
      {specs.length > 0 && (
        <section className="border-b border-blav-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-blav-gray">
              {specs.slice(0, 4).map(({ label, valor }) => (
                <div key={label} className="px-6 py-5 text-center">
                  <p className="font-display text-xl font-semibold text-blav-black">{valor}</p>
                  <p className="font-sans text-xs text-blav-grayMid tracking-wide mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-16">

            {p.descripcion_larga && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Sobre la propiedad</h2>
                {isPortableText ? (
                  <PortableText
                    value={p.descripcion_larga as PortableTextBlock[]}
                    components={portableTextComponents}
                  />
                ) : (
                  (p.descripcion_larga as string).split("\n\n").map((para, i) => (
                    <p key={i} className="font-sans text-blav-grayMid leading-relaxed mb-4">{para}</p>
                  ))
                )}
              </AnimatedSection>
            )}

            {(p.imagenes?.length ?? 0) > 0 && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Galería</h2>
                <ProjectGallery images={p.imagenes} alt={p.titulo} />
              </AnimatedSection>
            )}

            {/* Ficha técnica completa */}
            {(specs.length > 0 || (p.caracteristicas?.length ?? 0) > 0) && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Ficha técnica</h2>
                <div className="border border-blav-gray divide-y divide-blav-gray">
                  {[...specs, ...(p.caracteristicas ?? [])].map(({ label, valor }) => (
                    <div key={label} className="grid grid-cols-2 px-4 py-3 hover:bg-blav-gray/50 transition-colors">
                      <span className="font-sans text-xs text-blav-grayMid tracking-wide">{label}</span>
                      <span className="font-sans text-sm text-blav-black font-medium">{valor}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Amenidades */}
            {(p.amenidades?.length ?? 0) > 0 && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Amenidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {p.amenidades!.map((a) => (
                    <div key={a} className="flex items-center gap-2 font-sans text-sm text-blav-grayMid">
                      <span className="text-gold">✓</span>
                      {a}
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Ubicación */}
            {p.ubicacion && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Ubicación</h2>
                {p.ubicacion.descripcion && (
                  <p className="font-sans text-blav-grayMid mb-4">
                    {p.ubicacion.descripcion}
                    {p.ubicacion.zona && ` · ${p.ubicacion.zona}`}
                    {p.ubicacion.ciudad && `, ${p.ubicacion.ciudad}`}
                  </p>
                )}
                {p.ubicacion.maps_url && (
                  <a
                    href={p.ubicacion.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold inline-flex"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Ver en Google Maps
                  </a>
                )}
              </AnimatedSection>
            )}

            <AnimatedSection>
              <h2 className="font-display text-xl font-semibold text-blav-black mb-4">
                Compartir esta propiedad
              </h2>
              <ShareButtons url={pageUrl} projectName={p.titulo} />
            </AnimatedSection>
          </div>

          {/* Sidebar sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AnimatedSection>
                <div className="bg-blav-gray p-6 border border-blav-gray">
                  <p className="font-sans text-xs text-gold tracking-widest uppercase mb-2">Precio</p>
                  {p.mostrar_precio && p.precio ? (
                    <p className="font-display text-2xl font-semibold text-blav-black mb-1">
                      {formatPrecio(p.precio, p.moneda)}
                      <span className="font-sans text-sm text-blav-grayMid ml-2">{p.moneda}</span>
                    </p>
                  ) : (
                    <p className="font-display text-lg font-semibold text-blav-black mb-1">
                      {p.nota_precio}
                    </p>
                  )}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold w-full justify-center mt-4 text-xs"
                  >
                    {p.cta_label || "Solicitar información"}
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="bg-white border border-blav-gray p-6">
                  <h3 className="font-display text-lg font-semibold text-blav-black mb-5">
                    Solicitar información
                  </h3>
                  <LeadForm projects={propiedadNames} defaultProject={p.titulo} />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
