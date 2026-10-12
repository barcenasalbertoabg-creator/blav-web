import AnimatedSection from "@/components/ui/AnimatedSection";
import GaleriaCierresMasonry from "@/components/home/GaleriaCierresMasonry";
import { getGaleriaCierres } from "@/lib/galeriaCierres";

export default async function GaleriaCierres() {
  const fotos = await getGaleriaCierres();
  if (fotos.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 md:mb-14 max-w-2xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Operaciones cerradas
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-blav-black leading-tight">
            Cierres BLAV
          </h2>
          <p className="font-sans text-sm md:text-base text-blav-grayMid mt-4 leading-relaxed">
            Cada entrega de llaves es el resultado de un proceso ordenado y transparente.
          </p>
        </AnimatedSection>

        <GaleriaCierresMasonry fotos={fotos} />
      </div>
    </section>
  );
}
