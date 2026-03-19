import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Melhor compatibilidade com Vercel e pacotes externos
  serverExternalPackages: ["@prisma/client"],
  serverActions: {
    bodySizeLimit: "20mb",
  },
  experimental: {
    // Otimizações para Next 15
  },
};

export default nextConfig;
