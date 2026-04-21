import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import ProjectCard from "@/components/proyectos/ProjectCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function ProyectosDestacados() {
  const featured = await getFeaturedProjects();

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Portafolio
            </p>
            <h2 className="section-title">Proyectos destacados</h2>
          </div>
          <Link
            href="/proyectos"
            className="font-sans text-sm text-gold tracking-widest uppercase hover:text-gold-light transition-colors shrink-0"
          >
            Ver todos →
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
