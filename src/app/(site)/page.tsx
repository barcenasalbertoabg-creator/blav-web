export const revalidate = 60;

import Hero from "@/components/home/Hero";
import SobreBlav from "@/components/home/SobreBlav";
import Segmentos from "@/components/home/Segmentos";
import ProyectosDestacados from "@/components/home/ProyectosDestacados";
import PorQueBlav from "@/components/home/PorQueBlav";
import ZonasQueAtendemos from "@/components/home/ZonasQueAtendemos";
import FAQ from "@/components/home/FAQ";
import CTAFinal from "@/components/home/CTAFinal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SobreBlav />
      <Segmentos />
      <ProyectosDestacados />
      <PorQueBlav />
      <ZonasQueAtendemos />
      <FAQ />
      <CTAFinal />
    </>
  );
}
