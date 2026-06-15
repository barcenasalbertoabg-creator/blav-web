/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // El studio de Sanity usa styled-components y otros paquetes que necesitan transpilación
  transpilePackages: ["@sanity/ui", "sanity", "@sanity/vision"],
  // Excluir del bundle de webpack; se cargan como módulos Node.js nativos en la API route
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
