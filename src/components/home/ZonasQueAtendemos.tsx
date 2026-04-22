import AnimatedSection from "@/components/ui/AnimatedSection";

const zonas = [
  {
    estado: "Querétaro",
    colonias: [
      "Juriquilla",
      "El Marqués",
      "Sonterra",
      "Centro Histórico",
      "Corregidora",
      "Libramiento Norponiente",
    ],
  },
  {
    estado: "Guanajuato",
    colonias: [
      "Apaseo el Grande",
      "San Miguel de Allende",
    ],
  },
];

export default function ZonasQueAtendemos() {
  return (
    <section className="py-20 md:py-28 bg-blav-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Cobertura
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-blav-black leading-tight">
            Zonas que atendemos
          </h2>
          <p className="mt-4 font-sans text-base text-blav-grayMid max-w-xl mx-auto">
            Presencia y conocimiento profundo en los mercados inmobiliarios más
            dinámicos del Bajío.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {zonas.map(({ estado, colonias }, i) => (
            <AnimatedSection key={estado} delay={i * 0.15}>
              <div className="bg-white rounded-sm border border-gold/20 p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-gold" />
                  <h3 className="font-display text-2xl font-semibold text-blav-black">
                    {estado}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {colonias.map((colonia) => (
                    <li key={colonia} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span className="font-sans text-sm text-blav-grayMid">
                        {colonia}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
