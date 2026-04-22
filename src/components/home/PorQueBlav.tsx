import AnimatedSection from "@/components/ui/AnimatedSection";

const diferenciadores = [
  {
    num: "01",
    titulo: "Atención personalizada",
    desc: "Un asesor dedicado te acompaña en cada etapa del proceso. Sin intermediarios, sin filas de espera: trato directo y cercano.",
  },
  {
    num: "02",
    titulo: "Acompañamiento integral",
    desc: "Estamos contigo desde la búsqueda inicial hasta la firma final. Coordinamos trámites, notaría y financiamiento para que no tengas que preocuparte.",
  },
  {
    num: "03",
    titulo: "Conocimiento del mercado",
    desc: "Operamos exclusivamente en Querétaro y Guanajuato. Conocemos cada zona, tendencias de precios y las mejores oportunidades de plusvalía.",
  },
  {
    num: "04",
    titulo: "Compra, renta e inversión",
    desc: "Cubrimos todo el espectro inmobiliario: vivienda, comercio, industria e inversión. Una sola agencia para todas tus necesidades.",
  },
  {
    num: "05",
    titulo: "Seguimiento ágil",
    desc: "Respuesta rápida y comunicación constante. Nunca quedas sin saber qué sigue en tu proceso.",
  },
  {
    num: "06",
    titulo: "Profesionalismo y confianza",
    desc: "Trabajamos con transparencia, ética y documentación en regla. Tu tranquilidad es nuestra prioridad en cada operación.",
  },
];

export default function PorQueBlav() {
  return (
    <section className="py-20 md:py-28 bg-blav-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Ventajas
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            ¿Por qué elegir BLAV?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diferenciadores.map(({ num, titulo, desc }, i) => (
            <AnimatedSection key={num} delay={i * 0.1}>
              <div className="flex gap-6 group">
                <span className="font-display text-4xl text-gold/30 font-semibold leading-none shrink-0 group-hover:text-gold/60 transition-colors">
                  {num}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">
                    {titulo}
                  </h3>
                  <p className="font-sans text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
