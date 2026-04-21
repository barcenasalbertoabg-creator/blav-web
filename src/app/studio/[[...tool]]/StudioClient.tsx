"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

// SSR deshabilitado: el studio de Sanity es 100% client-side
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((m) => m.NextStudio),
  { ssr: false }
);

export default function StudioClient() {
  return <NextStudio config={config} />;
}
