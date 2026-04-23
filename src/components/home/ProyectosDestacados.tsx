import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { getFeaturedPropiedades } from "@/lib/propiedades";
import ProjectCard from "@/components/proyectos/ProjectCard";
import PropiedadCard from "@/components/propiedades/PropiedadCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function ProyectosDestacados() {
  const [proyectos, propiedades] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPropiedades(),
  ]);

  if (proyectos.length === 0 && propiedades.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Portafolio
          </p>
          <h2 className="section-title">Lo que tenemos para ti</h2>
        </AnimatedSection>

        {/* Dos columnas siempre: proyectos | propiedades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Columna izquierda — Proyectos */}
          <div>
            <AnimatedSection className="flex items-end justify-between mb-8">
              <h3 className="font-display text-2xl font-semibold text-blav-black">
                Proyectos destacados
              </h3>
              <Link
                href="/proyectos"
                className="font-sans text-sm text-gold tracking-widest uppercase hover:text-gold-light transition-colors shrink-0 ml-4"
              >
                Ver todos →
              </Link>
            </AnimatedSection>

            {proyectos.length > 0 ? (
              <div className="space-y-6">
                {proyectos.slice(0, 3).map((project, i) => (
                  <AnimatedSection key={project.slug} delay={i * 0.1}>
                    <ProjectCard project={project} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <AnimatedSection>
                <div className="border border-dashed border-gold/20 p-10 text-center">
                  <p className="font-display text-lg text-blav-grayMid mb-2">Próximamente</p>
                  <p className="font-sans text-sm text-blav-grayMid/60">
                    Estamos preparando nuevos proyectos.
                  </p>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Columna derecha — Propiedades */}
          <div>
            <AnimatedSection className="flex items-end justify-between mb-8" delay={0.05}>
              <h3 className="font-display text-2xl font-semibold text-blav-black">
                Propiedades destacadas
              </h3>
              <Link
                href="/propiedades"
                className="font-sans text-sm text-gold tracking-widest uppercase hover:text-gold-light transition-colors shrink-0 ml-4"
              >
                Ver todas →
              </Link>
            </AnimatedSection>

            {propiedades.length > 0 ? (
              <div className="space-y-6">
                {propiedades.slice(0, 3).map((propiedad, i) => (
                  <AnimatedSection key={propiedad.slug} delay={i * 0.1 + 0.05}>
                    <PropiedadCard propiedad={propiedad} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <AnimatedSection delay={0.05}>
                <div className="border border-dashed border-gold/20 p-10 text-center">
                  <p className="font-display text-lg text-blav-grayMid mb-2">Próximamente</p>
                  <p className="font-sans text-sm text-blav-grayMid/60">
                    Estamos cargando propiedades disponibles.
                  </p>
                </div>
              </AnimatedSection>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
