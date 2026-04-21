import AnimatedSection from "@/components/ui/AnimatedSection";

export default function SobreBlav() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
              Quiénes somos
            </p>
            <h2 className="section-title mb-6">
              Asesoría inmobiliaria con visión y experiencia
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p className="font-sans text-blav-grayMid leading-relaxed mb-4">
              BLAV Bienes Raíces es una inmobiliaria independiente con operación en
              Querétaro y Guanajuato, especializada en proyectos de alto valor
              residencial, comercial e industrial.
            </p>
            <p className="font-sans text-blav-grayMid leading-relaxed mb-6">
              Nuestro enfoque es claro: conectar a clientes con las mejores
              oportunidades del mercado, con acompañamiento personalizado desde la
              primera consulta hasta la firma final.
            </p>
            <a
              href="/nosotros"
              className="font-sans text-sm text-gold tracking-widest uppercase hover:text-gold-light transition-colors"
            >
              Conocer más →
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
