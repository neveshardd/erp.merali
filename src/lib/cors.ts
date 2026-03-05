export const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim() || "http://localhost:3000";

export const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

/**
 * Verifica se a origem é permitida.
 * Aceita o valor exato definido no .env OU qualquer subdomínio de merali.com.br
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;

    // 1. Verificação exata com o .env
    if (origin === allowedOrigin) return true;

    // 2. Regex que aceita:
    // - merali.com.br
    // - www.merali.com.br
    // - erp.merali.com.br
    // - qualquer-coisa.merali.com.br
    const meraliRegex = /^https?:\/\/([a-z0-9-]+\.)*merali\.com\.br$/i;
    if (meraliRegex.test(origin)) return true;

    // 3. Verificação explícita por segurança
    const knownOrigins = [
        "https://merali.com.br",
        "https://www.merali.com.br",
        "https://erp.merali.com.br"
    ];
    if (knownOrigins.includes(origin)) return true;

    return false;
}
