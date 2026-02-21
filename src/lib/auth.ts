import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = process.env.DATABASE_URL 
    ? new PrismaPg({ connectionString: process.env.DATABASE_URL }) 
    : undefined;

const prisma = adapter 
    ? new PrismaClient({ adapter }) 
    : new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
});