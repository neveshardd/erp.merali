import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Melhor compatibilidade com Vercel e pacotes externos
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    // Otimizações para Next 15
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
