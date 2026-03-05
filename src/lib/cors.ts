export const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim() || "http://localhost:3000";

export const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

/**
 * Verifica se a origem é permitida.
 * Aceita o valor exato definido no .env OU qualquer variação de merali.com.br (com/sem www)
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;

    // 1. Verificação exata com o .env
    if (origin === allowedOrigin) return true;

    // 2. Regex de segurança para produção (cobre merali.com.br e www.merali.com.br)
    const meraliRegex = /^https?:\/\/(www\.)?merali\.com\.br$/;
    if (meraliRegex.test(origin)) return true;

    return false;
}
