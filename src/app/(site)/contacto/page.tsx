import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import LeadForm from "@/components/ui/LeadForm";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a BLAV Bienes Raíces. Asesoría en proyectos inmobiliarios en Querétaro y Guanajuato. WhatsApp: (442) 837 88 91.",
};

export const revalidate = 60;

export default async function ContactoPage() {
  const projects = await getAllProjects();
  const projectNames = [
    "Información general",
    ...projects.map((p) => p.nombre),
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-20 md:py-28 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Contacto
          </p>
          <h1 className="section-title mb-4">Hablemos</h1>
          <p className="section-subtitle max-w-lg">
            Cuéntanos qué buscas. Un asesor te responde en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: info */}
            <AnimatedSection>
              <div className="space-y-10">
                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
                    Asesor directo
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-blav-black mb-4">
                    Alberto Bárcenas
                  </h2>
                  <div className="space-y-3">
                    <a
                      href="tel:4428378891"
                      className="flex items-center gap-3 font-sans text-sm text-blav-grayMid hover:text-blav-black transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gold shrink-0">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      (442) 837 88 91
                    </a>
                    <a
                      href="https://wa.me/524428378891?text=Hola%20Alberto%2C%20vi%20el%20sitio%20de%20BLAV%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-sans text-sm text-whatsapp hover:text-green-700 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp directo
                    </a>
                    <a
                      href="https://www.facebook.com/Blavbienesraices"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-sans text-sm text-blav-grayMid hover:text-gold transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gold shrink-0">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook BLAV
                    </a>
                  </div>
                </div>

                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
                    Cobertura
                  </p>
                  <p className="font-sans text-sm text-blav-grayMid leading-relaxed">
                    Querétaro y Guanajuato, México
                  </p>
                </div>

                <div className="bg-blav-gray p-6">
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
                    Tiempo de respuesta
                  </p>
                  <p className="font-sans text-sm text-blav-grayMid leading-relaxed">
                    Respondemos en menos de 24 horas en días hábiles. WhatsApp
                    generalmente el mismo día.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: form */}
            <AnimatedSection delay={0.15}>
              <div className="bg-white border border-blav-gray p-8">
                <h2 className="font-display text-2xl font-semibold text-blav-black mb-6">
                  Enviar consulta
                </h2>
                <LeadForm projects={projectNames} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
