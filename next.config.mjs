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
};

export default nextConfig;
