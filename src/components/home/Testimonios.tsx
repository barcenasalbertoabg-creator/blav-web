import AnimatedSection from "@/components/ui/AnimatedSection";
import TestimoniosCarousel from "@/components/home/TestimoniosCarousel";
import { getFeaturedTestimonios } from "@/lib/testimonios";

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

        <AnimatedSection delay={0.1}>
          <TestimoniosCarousel testimonios={testimonios} />
        </AnimatedSection>
      </div>
    </section>
  );
}
