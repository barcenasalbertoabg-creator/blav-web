import type { Metadata, Viewport } from "next";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "BLAV Studio — Panel de administración",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function StudioPage() {
  return <StudioClient />;
}
