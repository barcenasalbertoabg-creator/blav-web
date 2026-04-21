import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug, getProjectSlugs, getAllProjects } from "@/lib/projects";
import { projectWhatsAppUrl } from "@/lib/whatsapp";
import type { PortableTextBlock } from "@/types/project";
import ProjectGallery from "@/components/proyectos/ProjectGallery";
import ProjectKPIs from "@/components/proyectos/ProjectKPIs";
import ProjectPabellones from "@/components/proyectos/ProjectPabellones";
import ProjectContexto from "@/components/proyectos/ProjectContexto";
import ShareButtons from "@/components/proyectos/ShareButtons";
import LeadForm from "@/components/ui/LeadForm";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Revalida cada 60 segundos — cambios en Sanity aparecen en ~1 min
export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.seo.titulo,
    description: project.seo.descripcion,
    openGraph: {
      title: project.seo.titulo,
      description: project.seo.descripcion,
      images: project.seo.og_imagen ? [{ url: project.seo.og_imagen, width: 1200, height: 630 }] : [],
      url: `https://blav.com.mx/proyectos/${project.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.titulo,
      description: project.seo.descripcion,
      images: project.seo.og_imagen ? [project.seo.og_imagen] : [],
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

export default async function ProyectoPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const projectNames = allProjects.map((p) => p.nombre);
  const waUrl = projectWhatsAppUrl(project.nombre, project.whatsapp_mensaje);
  const pageUrl = `https://blav.com.mx/proyectos/${project.slug}`;
  const isPortableText = Array.isArray(project.descripcion_larga);

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative bg-blav-black min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
        {project.imagen_portada && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${project.imagen_portada}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-blav-black via-blav-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
          <span className="gold-label bg-white/10 text-gold border-gold/60 mb-4 inline-block">
            {project.categoria}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-2">
            {project.nombre}
          </h1>
          <p className="font-sans text-white/60 text-sm tracking-wide">
            {project.ubicacion?.zona} · {project.ubicacion?.ciudad}
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-px">
        <ProjectKPIs cifras={project.cifras_clave} />
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-16">
            <AnimatedSection>
              <h2 className="section-title mb-6">Sobre el proyecto</h2>
              {isPortableText ? (
                <PortableText
                  value={project.descripcion_larga as PortableTextBlock[]}
                  components={portableTextComponents}
                />
              ) : (
                (project.descripcion_larga as string).split("\n\n").map((para, i) => (
                  <p key={i} className="font-sans text-blav-grayMid leading-relaxed mb-4">{para}</p>
                ))
              )}
              {project.desarrollador && (
                <div className="mt-6 border-l-2 border-gold pl-5">
                  <p className="font-sans text-xs text-gold tracking-widest uppercase mb-1">Desarrollador</p>
                  <p className="font-sans text-sm font-medium text-blav-black">{project.desarrollador.nombre}</p>
                  <p className="font-sans text-sm text-blav-grayMid mt-1">{project.desarrollador.descripcion}</p>
                </div>
              )}
            </AnimatedSection>

            {(project.imagenes?.length ?? 0) > 0 && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Galería</h2>
                <ProjectGallery images={project.imagenes} alt={project.nombre} />
              </AnimatedSection>
            )}

            {(project.caracteristicas?.length ?? 0) > 0 && (
              <AnimatedSection>
                <h2 className="section-title mb-6">Características</h2>
                <div className="border border-blav-gray divide-y divide-blav-gray">
                  {project.caracteristicas.map(({ label, valor }) => (
                    <div key={label} className="grid grid-cols-2 px-4 py-3 hover:bg-blav-gray/50 transition-colors">
                      <span className="font-sans text-xs text-blav-grayMid tracking-wide">{label}</span>
                      <span className="font-sans text-sm text-blav-black font-medium">{valor}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {project.pabellones && project.pabellones.length > 0 && (
              <AnimatedSection>
                <ProjectPabellones pabellones={project.pabellones} />
              </AnimatedSection>
            )}

            {project.contexto_mercado && (
              <AnimatedSection>
                <ProjectContexto contexto={project.contexto_mercado} />
              </AnimatedSection>
            )}

            <AnimatedSection>
              <h2 className="section-title mb-6">Ubicación</h2>
              <p className="font-sans text-blav-grayMid mb-4">
                {project.ubicacion?.descripcion} · {project.ubicacion?.zona}, {project.ubicacion?.ciudad}
              </p>
              <a href={project.ubicacion?.maps_url} target="_blank" rel="noopener noreferrer" className="btn-outline-gold inline-flex">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Ver en Google Maps
              </a>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="font-display text-xl font-semibold text-blav-black mb-4">Compartir este proyecto</h2>
              <ShareButtons url={pageUrl} projectName={project.nombre} />
            </AnimatedSection>
          </div>

          {/* Columna derecha — sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AnimatedSection>
                <div className="bg-blav-gray p-6 border border-blav-gray">
                  <p className="font-sans text-xs text-gold tracking-widest uppercase mb-2">Precio</p>
                  <p className="font-display text-xl font-semibold text-blav-black mb-1">{project.nota_precio}</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full justify-center mt-4 text-xs">
                    {project.cta_label}
                  </a>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div className="bg-white border border-blav-gray p-6">
                  <h3 className="font-display text-lg font-semibold text-blav-black mb-5">Solicitar información</h3>
                  <LeadForm projects={projectNames} defaultProject={project.nombre} />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
