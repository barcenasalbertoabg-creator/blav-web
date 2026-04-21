import AnimatedSection from "@/components/ui/AnimatedSection";

const segmentos = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-gold fill-none" strokeWidth={1.2}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    titulo: "Residencial",
    desc: "Casas, departamentos y desarrollos habitacionales en las mejores zonas de Querétaro y Guanajuato.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-gold fill-none" strokeWidth={1.2}>
        <rect x="2" y="7" width="20" height="14" rx="1" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    titulo: "Comercial",
    desc: "Locales, plazas comerciales y desarrollos de uso mixto con alto potencial de afluencia.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-gold fill-none" strokeWidth={1.2}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    titulo: "Industrial",
    desc: "Naves industriales, parques y espacios logísticos en corredores estratégicos del Bajío.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-gold fill-none" strokeWidth={1.2}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    titulo: "Inversión",
    desc: "Oportunidades de preventa y proyectos en desarrollo con rendimientos atractivos.",
  },
];

export default function Segmentos() {
  return (
    <section className="py-20 md:py-28 bg-blav-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Especialidades
          </p>
          <h2 className="section-title">Lo que hacemos</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {segmentos.map(({ icon, titulo, desc }, i) => (
            <AnimatedSection key={titulo} delay={i * 0.1}>
              <div className="bg-white p-8 h-full border border-white hover:border-gold/30 transition-colors duration-300">
                <div className="mb-6">{icon}</div>
                <h3 className="font-display text-xl font-semibold text-blav-black mb-3">
                  {titulo}
                </h3>
                <p className="font-sans text-sm text-blav-grayMid leading-relaxed">{desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
