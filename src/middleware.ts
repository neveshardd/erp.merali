import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
    const session = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // Se o usuário está logado e tenta acessar a página de login → redireciona para a raiz
    if (session && pathname.startsWith("/auth/signin")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Se não há sessão e NÃO está em uma rota de auth → redireciona para login
    if (!session && !pathname.startsWith("/auth")) {
        const loginUrl = new URL("/auth/signin", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)"],
};
