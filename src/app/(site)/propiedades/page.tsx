import type { Metadata } from "next";
import { getAllPropiedades } from "@/lib/propiedades";
import PropiedadesClient from "./PropiedadesClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Propiedades en venta y renta — BLAV Bienes Raíces",
  description:
    "Casas, departamentos, locales y terrenos en Querétaro y Guanajuato. BLAV asesora en la compra, venta y renta de propiedades de alto nivel.",
};

export default async function PropiedadesPage() {
  const propiedades = await getAllPropiedades();
  const tipos = Array.from(new Set(propiedades.map((p) => p.tipo)));

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-20 bg-blav-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Catálogo
          </p>
          <h1 className="section-title mb-4">Propiedades</h1>
          <p className="section-subtitle max-w-xl">
            Casas, departamentos, locales y terrenos disponibles en Querétaro y
            Guanajuato. Asesoría directa, sin intermediarios innecesarios.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {propiedades.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-blav-black mb-3">
                Catálogo en construcción
              </p>
              <p className="font-sans text-blav-grayMid mb-8">
                Pronto tendremos propiedades disponibles. Contáctanos para
                recibir opciones según tu perfil.
              </p>
              <a
                href="https://wa.me/524428378891?text=Hola%2C%20me%20interesa%20ver%20propiedades%20disponibles%20con%20BLAV."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Consultar disponibilidad
              </a>
            </div>
          ) : (
            <PropiedadesClient propiedades={propiedades} tipos={tipos} />
          )}
        </div>
      </section>
    </div>
  );
}
