import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { allowedOrigin } from "./cors";

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "fallback_secret_for_development_purposes_only_32_chars",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://erpmerali-production.up.railway.app"
      : "http://localhost:3000"),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
    allowedOrigin,
    "https://merali.com.br",
    "https://www.merali.com.br",
    "https://erp.merali.com.br",
  ].filter(Boolean),
});
