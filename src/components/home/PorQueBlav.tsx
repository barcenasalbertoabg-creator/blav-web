import AnimatedSection from "@/components/ui/AnimatedSection";

const diferenciadores = [
  {
    num: "01",
    titulo: "Asesoría personalizada",
    desc: "Un asesor dedicado te acompaña desde la búsqueda inicial hasta el cierre. Sin intermediarios adicionales ni colas de espera.",
  },
  {
    num: "02",
    titulo: "Conocimiento local profundo",
    desc: "Operamos exclusivamente en Querétaro y Guanajuato. Conocemos cada zona, tendencia de precios y oportunidad del mercado.",
  },
  {
    num: "03",
    titulo: "Proyectos verificados",
    desc: "Solo presentamos proyectos con desarrolladores sólidos, documentación en regla y potencial real de plusvalía.",
  },
  {
    num: "04",
    titulo: "Sin cobro de consulta",
    desc: "La asesoría inicial es gratuita. Nuestros honorarios se integran en la operación y son transparentes desde el primer día.",
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
