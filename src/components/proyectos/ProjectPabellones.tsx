import type { Pabellon } from "@/types/project";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  pabellones: Pabellon[];
}

const icons = ["🏪", "🍽️", "💻", "🏥", "👗", "🛒", "🏋️", "🛍️", "🌿", "💼"];

export default function ProjectPabellones({ pabellones }: Props) {
  if (!pabellones || pabellones.length === 0) return null;

  return (
    <div>
      <AnimatedSection>
        <h2 className="section-title mb-2">Pabellones</h2>
        <p className="section-subtitle mb-10">
          {pabellones.length} pabellones especializados en un solo destino.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pabellones.map(({ nombre, detalle }, i) => (
          <AnimatedSection key={nombre} delay={i * 0.05}>
            <div className="bg-white border border-blav-gray p-6 hover:border-gold/30 transition-colors duration-300">
              <div className="text-2xl mb-3">{icons[i] ?? "🏢"}</div>
              <h3 className="font-display text-lg font-semibold text-blav-black mb-2">
                {nombre}
              </h3>
              <p className="font-sans text-sm text-blav-grayMid leading-relaxed">
                {detalle}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
