import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function VendeTuPropiedad() {
  return (
    <section className="py-20 md:py-28 bg-blav-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Propietarios
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-5">
            Vende o renta tu propiedad con BLAV
          </h2>
          <p className="font-sans text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Te ayudamos a encontrar al comprador o inquilino ideal.
          </p>
          <Link href="/vende-tu-propiedad" className="btn-gold">
            Quiero vender o rentar
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
