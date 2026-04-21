"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import ProjectCard from "@/components/proyectos/ProjectCard";
import ProjectFilter from "@/components/proyectos/ProjectFilter";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  projects: Project[];
  categories: string[];
}

export default function ProjectsClient({ projects, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos" ? projects : projects.filter((p) => p.categoria === active);

  return (
    <>
      <AnimatedSection className="mb-12">
        <ProjectFilter categories={categories} active={active} onChange={setActive} />
      </AnimatedSection>

      {filtered.length === 0 ? (
        <AnimatedSection>
          <p className="font-sans text-blav-grayMid text-center py-16">
            No hay proyectos en esta categoría por el momento.
          </p>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.07}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </>
  );
}
