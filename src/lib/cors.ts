export const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim()).filter(Boolean);

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Será sobrescrito dinamicamente se necessário ou usado como fallback
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export function getCorsHeaders(origin: string | null) {
    const headers = { ...corsHeaders };

    if (origin && allowedOrigins.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    } else if (allowedOrigins.length > 0) {
        headers["Access-Control-Allow-Origin"] = allowedOrigins[0];
    }

    return headers;
}
