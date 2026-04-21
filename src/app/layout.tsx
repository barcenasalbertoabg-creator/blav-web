import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BLAV Bienes Raíces | Querétaro y Guanajuato",
    template: "%s | BLAV Bienes Raíces",
  },
  description:
    "BLAV Bienes Raíces — Soluciones de propiedades en Querétaro y Guanajuato. Proyectos residenciales, comerciales e industriales de alto nivel.",
  metadataBase: new URL("https://blav.com.mx"),
  openGraph: {
    siteName: "BLAV Bienes Raíces",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
