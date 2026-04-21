import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce BLAV Bienes Raíces — inmobiliaria independiente con operación en Querétaro y Guanajuato. Asesoría de alto nivel en propiedades residenciales, comerciales e industriales.",
};

const valores = [
  {
    titulo: "Transparencia",
    desc: "Compartimos toda la información relevante de cada proyecto, sin letra chica ni sorpresas.",
  },
  {
    titulo: "Compromiso",
    desc: "Cada cliente recibe atención personalizada. No somos un call center inmobiliario.",
  },
  {
    titulo: "Criterio",
    desc: "Solo presentamos proyectos que nosotros mismos consideraríamos como inversión.",
  },
  {
    titulo: "Conocimiento local",
    desc: "Años operando exclusivamente en Querétaro y Guanajuato nos dan una ventaja real.",
  },
];

const zonas = [
  {
    ciudad: "Querétaro",
    areas: ["Zona Norte", "Zona Norponiente", "Zona Sur", "El Marqués", "Corregidora"],
  },
  {
    ciudad: "Guanajuato",
    areas: ["León", "San Miguel de Allende", "Celaya", "Irapuato"],
  },
];

export default function NosotrosPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-20 md:py-28 bg-blav-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Quiénes somos
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight max-w-2xl">
            Inmobiliaria de alto nivel, trato humano.
          </h1>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
                La empresa
              </p>
              <h2 className="section-title mb-6">Historia de BLAV</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <p className="font-sans text-blav-grayMid leading-relaxed mb-4">
                BLAV Bienes Raíces nació de la convicción de que el mercado
                inmobiliario mexicano necesitaba asesores con criterio propio y
                compromiso real con sus clientes.
              </p>
              <p className="font-sans text-blav-grayMid leading-relaxed mb-4">
                Operamos en Querétaro y Guanajuato — dos de los estados de mayor
                crecimiento económico del Bajío — con enfoque en proyectos que
                ofrecen valor real: ubicación estratégica, desarrolladores
                probados y potencial de plusvalía fundamentado.
              </p>
              <p className="font-sans text-blav-grayMid leading-relaxed">
                Somos un equipo pequeño por decisión: preferimos la calidad del
                servicio sobre el volumen de operaciones.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Asesor */}
      <section className="py-20 md:py-28 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
                Asesor
              </p>
              <h2 className="section-title mb-4">Alberto Bárcenas</h2>
              <p className="font-sans text-blav-grayMid leading-relaxed mb-6">
                Asesor inmobiliario con experiencia en proyectos residenciales,
                comerciales e industriales en el Bajío. Especializado en
                acompañamiento al cliente desde la identificación de oportunidades
                hasta el cierre de operaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:4428378891"
                  className="btn-outline-gold text-xs"
                >
                  (442) 837 88 91
                </a>
                <a
                  href="https://wa.me/524428378891?text=Hola%20Alberto%2C%20vi%20el%20sitio%20de%20BLAV%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-xs"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Principios
            </p>
            <h2 className="section-title">Nuestros valores</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {valores.map(({ titulo, desc }, i) => (
              <AnimatedSection key={titulo} delay={i * 0.1}>
                <div className="border-l-2 border-gold pl-6">
                  <h3 className="font-display text-xl font-semibold text-blav-black mb-2">
                    {titulo}
                  </h3>
                  <p className="font-sans text-sm text-blav-grayMid leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Zonas */}
      <section className="py-20 md:py-28 bg-blav-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Cobertura
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Zonas de operación
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {zonas.map(({ ciudad, areas }, i) => (
              <AnimatedSection key={ciudad} delay={i * 0.1}>
                <div className="border border-white/10 p-8 hover:border-gold/30 transition-colors">
                  <h3 className="font-display text-2xl font-semibold text-white mb-4">
                    {ciudad}
                  </h3>
                  <ul className="space-y-2">
                    {areas.map((area) => (
                      <li key={area} className="flex gap-3 font-sans text-sm text-white/60">
                        <span className="text-gold">—</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-6">
              ¿Listo para empezar?
            </h2>
            <a
              href="/contacto"
              className="btn-outline-white"
            >
              Contáctanos
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
