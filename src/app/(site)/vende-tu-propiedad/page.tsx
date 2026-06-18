import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import VenderRentarForm from "@/components/ui/VenderRentarForm";

export const metadata: Metadata = {
  title: "Vende o renta tu propiedad",
  description:
    "Conectamos tu propiedad con compradores e inquilinos calificados en Querétaro y Guanajuato. Asesoría personalizada de inicio a fin con BLAV Bienes Raíces.",
};

const beneficios = [
  {
    titulo: "Asesoría personalizada",
    desc: "Un asesor te acompaña desde el primer contacto, sin importar si buscas vender o rentar.",
  },
  {
    titulo: "Mayor exposición",
    desc: "Promovemos tu propiedad ante compradores e inquilinos activos en Querétaro y Guanajuato.",
  },
  {
    titulo: "Negociación profesional",
    desc: "Te representamos para conseguir las mejores condiciones para tu propiedad.",
  },
  {
    titulo: "Proceso claro",
    desc: "Te mantenemos informado en cada etapa, desde el contacto inicial hasta el cierre.",
  },
];

const pasos = [
  {
    titulo: "Nos cuentas sobre tu propiedad",
    desc: "Tipo de inmueble, zona y lo que buscas.",
  },
  {
    titulo: "Un asesor te contacta",
    desc: "Para conocer más detalles y definir la estrategia adecuada.",
  },
  {
    titulo: "Conectamos tu propiedad con interesados",
    desc: "Buscamos al comprador o inquilino ideal para tu propiedad.",
  },
  {
    titulo: "Te acompañamos hasta el cierre",
    desc: "Coordinamos cada paso hasta cerrar el trato.",
  },
];

export default function VendeTuPropiedadPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-20 md:py-28 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Propietarios
          </p>
          <h1 className="section-title mb-4">Vende o renta tu propiedad con BLAV</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Conectamos tu propiedad con compradores e inquilinos calificados.
            Te acompañamos en todo el proceso, desde el primer contacto hasta el cierre.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: beneficios + proceso */}
            <AnimatedSection>
              <div className="space-y-12">
                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">
                    Por qué trabajar con BLAV
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {beneficios.map((b) => (
                      <div key={b.titulo}>
                        <h3 className="font-display text-lg font-semibold text-blav-black mb-1">
                          {b.titulo}
                        </h3>
                        <p className="font-sans text-sm text-blav-grayMid leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">
                    Qué sigue después de contactarnos
                  </p>
                  <ol className="space-y-5">
                    {pasos.map((p, i) => (
                      <li key={p.titulo} className="flex gap-4">
                        <span className="font-display text-xl font-semibold text-gold shrink-0 w-7">
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="font-sans text-sm font-medium text-blav-black mb-0.5">
                            {p.titulo}
                          </h4>
                          <p className="font-sans text-sm text-blav-grayMid leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: selector + form */}
            <AnimatedSection delay={0.15}>
              <div className="bg-white border border-blav-gray p-8">
                <h2 className="font-display text-2xl font-semibold text-blav-black mb-6">
                  Cuéntanos sobre tu propiedad
                </h2>
                <VenderRentarForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
