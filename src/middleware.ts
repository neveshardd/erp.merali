import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allowedOrigins } from "@/lib/cors";

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");

    // Apenas processa CORS para rotas de API
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const isAllowed = origin && allowedOrigins.includes(origin);

        // Se for um request OPTIONS (preflight)
        if (request.method === "OPTIONS") {
            const response = new NextResponse(null, { status: 204 });
            if (isAllowed) {
                response.headers.set("Access-Control-Allow-Origin", origin);
            } else if (allowedOrigins.length > 0) {
                response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
            }

            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
            response.headers.set("Access-Control-Allow-Credentials", "true");
            return response;
        }

        const response = NextResponse.next();
        if (isAllowed) {
            response.headers.set("Access-Control-Allow-Origin", origin);
        } else if (allowedOrigins.length > 0) {
            response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
        }

        response.headers.set("Access-Control-Allow-Credentials", "true");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
