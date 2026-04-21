import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="group block bg-white border border-blav-gray hover:border-gold/30 transition-colors duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-blav-gray">
        <Image
          src={project.imagen_portada}
          alt={project.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-4 left-4">
          <span className="gold-label bg-white/90 backdrop-blur-sm">
            {project.categoria}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-blav-black mb-1 group-hover:text-gold transition-colors">
          {project.nombre}
        </h3>
        <p className="font-sans text-xs text-blav-grayMid tracking-wide mb-3">
          {project.ubicacion?.zona} · {project.ubicacion?.ciudad}
        </p>
        <p className="font-sans text-sm text-blav-grayMid leading-relaxed line-clamp-2 mb-5">
          {project.descripcion_corta}
        </p>

        {/* KPIs mini */}
        {(project.cifras_clave?.length ?? 0) > 0 && (
          <div className="flex gap-4 border-t border-blav-gray pt-4">
            {project.cifras_clave!.slice(0, 3).map((c) => (
              <div key={c.descripcion} className="flex-1 min-w-0">
                <p className="font-display text-lg font-semibold text-gold truncate">
                  {c.numero}
                  <span className="text-sm ml-0.5">{c.unidad}</span>
                </p>
                <p className="font-sans text-[11px] text-blav-grayMid leading-tight truncate">
                  {c.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <span className="font-sans text-xs tracking-widest uppercase text-gold group-hover:text-gold-light transition-colors">
            Ver proyecto →
          </span>
        </div>
      </div>
    </Link>
  );
}
