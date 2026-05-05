import AnimatedSection from "@/components/ui/AnimatedSection";
import { getFeaturedTestimonios } from "@/lib/testimonios";

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < n ? "fill-gold" : "fill-white/20"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function Testimonios() {
  const testimonios = await getFeaturedTestimonios();
  if (testimonios.length === 0) return null;

  const waUrl =
    "https://wa.me/524428378891?text=Hola%20Alberto%2C%20me%20gustar%C3%ADa%20compartir%20mi%20testimonio%20sobre%20el%20servicio%20de%20BLAV";

  return (
    <section className="py-20 md:py-28 bg-blav-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Clientes
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Lo que dicen de BLAV
            </h2>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-white text-xs shrink-0"
          >
            Comparte tu experiencia →
          </a>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonios.map((t, i) => (
            <AnimatedSection key={t.nombre} delay={i * 0.1}>
              <div className="border border-white/10 p-8 h-full flex flex-col hover:border-gold/30 transition-colors duration-300">
                <Estrellas n={t.calificacion} />
                <blockquote className="font-display text-lg text-white/90 leading-relaxed flex-1 mb-6">
                  &ldquo;{t.texto}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  {t.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto}
                      alt={t.nombre}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <span className="font-display text-gold text-sm font-semibold">
                        {t.nombre.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-white">{t.nombre}</p>
                    <p className="font-sans text-xs text-white/50 mt-0.5">
                      {t.cargo_o_tipo_operacion}
                    </p>
                  </div>
                  {t.foto_operacion && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto_operacion}
                      alt="Propiedad"
                      className="w-16 h-12 object-cover shrink-0 opacity-70"
                    />
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
