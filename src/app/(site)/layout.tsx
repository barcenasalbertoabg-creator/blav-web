import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import AsistenteLauncher from "@/components/asistente/AsistenteLauncher";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // ASISTENTE_ENABLED=false apaga el botón (y la API responde 503) sin tocar código.
  const asistenteActivo = process.env.ASISTENTE_ENABLED === "true";
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {asistenteActivo && <AsistenteLauncher />}
      <WhatsAppFAB />
    </>
  );
}
