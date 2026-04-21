import type { CifrasClave } from "@/types/project";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  cifras: CifrasClave[];
}

export default function ProjectKPIs({ cifras }: Props) {
  if (!cifras || cifras.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-blav-gray border border-blav-gray">
      {cifras.map((c, i) => (
        <AnimatedSection key={c.descripcion} delay={i * 0.1}>
          <div className="bg-white px-6 py-8 text-center">
            <p className="font-display text-3xl md:text-4xl font-semibold text-gold leading-none mb-1">
              {c.numero}
              <span className="text-xl ml-1">{c.unidad}</span>
            </p>
            <p className="font-sans text-xs text-blav-grayMid tracking-wide mt-2">
              {c.descripcion}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
