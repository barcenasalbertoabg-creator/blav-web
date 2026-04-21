import type { ContextoMercado } from "@/types/project";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  contexto: ContextoMercado;
}

export default function ProjectContexto({ contexto }: Props) {
  return (
    <div className="bg-blav-black text-white rounded-none p-8 md:p-12">
      <AnimatedSection>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-8">
          {contexto.titulo}
        </h2>
        <ul className="space-y-4">
          {(contexto.puntos ?? []).map((punto) => (
            <li key={punto} className="flex gap-4">
              <span className="text-gold mt-1 shrink-0">✓</span>
              <span className="font-sans text-sm text-white/75 leading-relaxed">{punto}</span>
            </li>
          ))}
        </ul>
      </AnimatedSection>
    </div>
  );
}
