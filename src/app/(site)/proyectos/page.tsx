import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portafolio de proyectos residenciales, comerciales e industriales de BLAV Bienes Raíces en Querétaro y Guanajuato.",
};

export const revalidate = 60;

export default async function ProyectosPage() {
  const projects = await getAllProjects();
  const categories = Array.from(new Set(projects.map((p) => p.categoria)));

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-20 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Portafolio
          </p>
          <h1 className="section-title mb-4">Proyectos</h1>
          <p className="section-subtitle max-w-xl">
            Descubre las oportunidades inmobiliarias que BLAV asesora en
            Querétaro y Guanajuato.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsClient projects={projects} categories={categories} />
        </div>
      </section>
    </div>
  );
}
