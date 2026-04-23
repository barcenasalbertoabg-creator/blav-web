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

  const hasProyectos   = proyectos.length > 0;
  const hasPropiedades = propiedades.length > 0;

  if (!hasProyectos && !hasPropiedades) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Portafolio
          </p>
          <h2 className="section-title">Lo que tenemos para ti</h2>
        </AnimatedSection>

        <div className={`grid grid-cols-1 gap-16 ${hasProyectos && hasPropiedades ? "lg:grid-cols-2" : ""}`}>

          {/* Proyectos destacados */}
          {hasProyectos && (
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
              <div className="space-y-6">
                {proyectos.slice(0, 3).map((project, i) => (
                  <AnimatedSection key={project.slug} delay={i * 0.1}>
                    <ProjectCard project={project} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* Propiedades destacadas */}
          {hasPropiedades && (
            <div>
              <AnimatedSection className="flex items-end justify-between mb-8">
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
              <div className="space-y-6">
                {propiedades.slice(0, 3).map((propiedad, i) => (
                  <AnimatedSection key={propiedad.slug} delay={i * 0.1}>
                    <PropiedadCard propiedad={propiedad} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
