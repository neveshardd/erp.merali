import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
    const session = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // 1. Excluir Explicitamente Assets e API
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // 2. Rotas de Auth não precisam de sessão
    if (pathname.startsWith("/auth")) {
        // Se já está logado e tenta ir pro signin, manda pra home
        if (session && pathname === "/auth/signin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // 3. Proteção: Se não há sessão, vai pro Login
    if (!session) {
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Matcher recomendado pela Vercel/Next.js para evitar loops
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
