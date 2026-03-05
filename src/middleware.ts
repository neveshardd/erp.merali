import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isOriginAllowed, corsHeaders } from "./lib/cors";

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");

    // Lidar com Preflight Requests (OPTIONS)
    if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 204 });

        if (origin && isOriginAllowed(origin)) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            Object.entries(corsHeaders).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }
        return response;
    }

    // Prosseguir com a requisição normal
    const response = NextResponse.next();

    if (origin && isOriginAllowed(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
    }

    return response;
}

// Rodar apenas nas rotas de API
export const config = {
    matcher: "/api/:path*",
};
