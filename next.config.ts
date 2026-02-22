import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Melhor compatibilidade com Vercel e pacotes externos
    serverExternalPackages: ["@prisma/client"],
    experimental: {
        // Otimizações para Next 15
    },
    outputFileTracingExcludes: {
        '*': [
            'node_modules/@react-pdf/renderer/**/*',
            'node_modules/yoga-layout-prebuilt/**/*',
            'node_modules/fontkit/**/*',
            'node_modules/@react-pdf/font/**/*'
        ],
    },
};

export default nextConfig;
