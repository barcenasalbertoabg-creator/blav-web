import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Opinión de Valor Comercial · BLAV Bienes Raíces",
  description:
    "Análisis profesional del precio de mercado real de tu propiedad. No es un avalúo — es la herramienta más útil antes de vender o rentar. Entrega en 48–72 hrs.",
};

const WA_OVC = buildWhatsAppUrl(
  "Hola Alberto, me interesa solicitar una Opinión de Valor Comercial para mi propiedad. ¿Me puedes dar más información?"
);

const cards = [
  {
    titulo: "Análisis comparativo real",
    desc: "Comparamos tu propiedad con las activas hoy en el mercado, no con estimaciones genéricas.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V21h4.5v-7.5H3zm6.75-6V21H14.25V7.5H9.75zM16.5 3V21H21V3h-4.5z" />
      </svg>
    ),
  },
  {
    titulo: "Microzona exacta",
    desc: "El análisis se enfoca en tu zona directa — mismo desarrollo, mismas amenidades.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    titulo: "Documento profesional",
    desc: "PDF con gráficas, tabla de comparables, ajustes y rango recomendado.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    titulo: "Entrega en 48–72 hrs",
    desc: "Datos del inmueble hoy — análisis en tu correo en menos de 3 días hábiles.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const comparativa = [
  { label: "Objetivo", ovc: "Precio de mercado", avaluo: "Valor fiscal / legal" },
  { label: "Validez legal", ovc: "No aplica", avaluo: "Sí" },
  { label: "Costo", ovc: "$750 – $1,000", avaluo: "$3,000 – $8,000+" },
  { label: "Tiempo", ovc: "48 – 72 hrs", avaluo: "5 – 15 días hábiles" },
  { label: "¿Para qué sirve?", ovc: "Vender / rentar", avaluo: "Hipotecas / trámites legales" },
];

const ejemplos = [
  { caption: "Portada del documento" },
  { caption: "Tabla de comparables" },
  { caption: "Gráfica de posicionamiento" },
];

export default function OpinionDeValorPage() {
  return (
    <main className="pt-16 md:pt-20">

      {/* ─── BLOQUE 1 — HERO ─── */}
      <section className="bg-blav-navy py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="gold-label mb-8 inline-block">
              Servicio BLAV · Opinión de Valor Comercial
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Conoce el precio correcto de tu propiedad antes de salir al mercado
            </h1>
            <p className="font-sans text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
              Análisis profesional basado en el mercado real activo. No es un avalúo — es algo más útil
              para quien quiere vender o rentar al mejor precio, en el menor tiempo posible.
            </p>

            {/* Caja con borde dorado */}
            <div className="border-l-4 border-gold pl-6 py-2">
              <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed italic">
                "Puedes tener las mejores fotos, la descripción perfecta y responder al instante —
                pero si el precio no es el correcto, la propiedad se queda en el mercado. Y cada mes
                que pasa tiene un costo real."
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BLOQUE 2 — GRID 4 CARDS ─── */}
      <section className="py-20 md:py-28 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Qué incluye
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-blav-black leading-tight">
              Un análisis construido para el mercado real
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ titulo, desc, icon }, i) => (
              <AnimatedSection key={titulo} delay={i * 0.1}>
                <div className="bg-white p-8 h-full flex flex-col gap-5 hover:shadow-md transition-shadow duration-200">
                  <span className="text-gold">{icon}</span>
                  <h3 className="font-display text-lg font-semibold text-blav-black leading-snug">
                    {titulo}
                  </h3>
                  <p className="font-sans text-sm text-blav-grayMid leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOQUE 3 — COMPARATIVA OVC vs AVALÚO ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              ¿Cuál necesito?
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-blav-black leading-tight">
              Opinión de Valor vs Avalúo formal
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="overflow-hidden border border-blav-gray">
              {/* Encabezados */}
              <div className="grid grid-cols-3">
                <div className="bg-blav-gray px-6 py-4" />
                <div className="bg-blav-navy px-6 py-5 text-center">
                  <p className="font-display text-lg text-white font-semibold">Opinión de valor</p>
                  <span className="font-sans text-xs text-gold tracking-widest uppercase">(OVC)</span>
                </div>
                <div className="bg-blav-gray px-6 py-5 text-center border-l border-white/10">
                  <p className="font-display text-lg text-blav-black font-semibold">Avalúo formal</p>
                  <span className="font-sans text-xs text-blav-grayMid tracking-widest uppercase">certificado</span>
                </div>
              </div>

              {/* Filas */}
              {comparativa.map(({ label, ovc, avaluo }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-3 border-t border-blav-gray ${i % 2 === 1 ? "bg-blav-gray/40" : ""}`}
                >
                  <div className="px-6 py-4 flex items-center">
                    <span className="font-sans text-xs tracking-widest uppercase text-blav-grayMid">
                      {label}
                    </span>
                  </div>
                  <div className="bg-blav-navy px-6 py-4 text-center flex items-center justify-center border-l border-white/5">
                    <span className="font-sans text-sm text-white font-medium">{ovc}</span>
                  </div>
                  <div className="px-6 py-4 text-center flex items-center justify-center border-l border-blav-gray">
                    <span className="font-sans text-sm text-blav-black">{avaluo}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BLOQUE 4 — PRECIO ─── */}
      <section className="py-20 md:py-24 bg-blav-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-blav-grayMid mb-4">
                Precio del servicio
              </p>
              <p className="font-display text-7xl md:text-8xl text-blav-black font-semibold leading-none mb-4">
                $750
                <span className="font-sans text-xl text-blav-grayMid ml-2 font-normal">MXN</span>
              </p>
              <span className="inline-block bg-gold/10 border border-gold text-gold font-sans text-xs tracking-widest uppercase px-3 py-1">
                Precio de lanzamiento · Después $1,000
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="border-l-4 border-gold pl-8">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-blav-grayMid mb-3">
                  Entrega en
                </p>
                <p className="font-display text-5xl md:text-6xl text-blav-black font-semibold leading-none">
                  48–72 hrs
                </p>
                <p className="font-sans text-sm text-blav-grayMid mt-3 leading-relaxed">
                  A partir de que nos compartes los datos del inmueble
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── BLOQUE 5 — EJEMPLO DEL DOCUMENTO ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Vista previa
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-blav-black leading-tight">
              Así se ve tu Opinión de Valor
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ejemplos.map(({ caption }, i) => (
              <AnimatedSection key={caption} delay={i * 0.1}>
                <div className="flex flex-col gap-3">
                  {/* Placeholder de imagen — reemplazar con <Image> cuando estén listos los archivos */}
                  <div className="aspect-[4/3] bg-blav-gray flex items-center justify-center border border-blav-gray/80">
                    <div className="text-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-10 h-10 text-blav-grayMid/40 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="font-sans text-xs text-blav-grayMid/60">Imagen próximamente</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-blav-grayMid tracking-widest uppercase text-center">
                    {caption}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOQUE 6 — CTA OSCURO ─── */}
      <section className="py-20 md:py-28 bg-blav-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
              ¿Cuánto vale tu propiedad realmente?
              <br />
              <span className="text-gold/80">Descúbrelo antes de publicar.</span>
            </h2>
            <p className="font-sans text-white/50 text-sm md:text-base mb-10">
              Sin compromisos — solo te respondemos con el análisis que necesitas.
            </p>
            <a
              href={WA_OVC}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitar mi Opinión de Valor
            </a>
            <p className="font-sans text-xs text-white/30 mt-6">
              También puedes llamar: (442) 837 88 91 · Alberto Bárcenas
            </p>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
