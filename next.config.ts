import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Melhor compatibilidade com Vercel e pacotes externos
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    // Otimizações para Next 15
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
          },

          {
            key: "Access-Control-Allow-Methods",
            value: process.env.CORS_ALLOWED_METHODS || "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              process.env.CORS_ALLOWED_HEADERS ||
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
