import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// Provide a dummy connection string during Next.js build if DATABASE_URL is missing
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"

const adapter = new PrismaPg({ connectionString })

// Function to check if the client is valid (has the required models)
function isClientValid(client: any): boolean {
    return !!(client && client.budget && client.invoice && client.configGroup && client.config)
}

// @ts-ignore
let prismaInstance: PrismaClient | undefined = globalForPrisma.prisma

// If in development and client is not valid, recreate it
if (process.env.NODE_ENV !== "production" && prismaInstance && !isClientValid(prismaInstance)) {
    prismaInstance = undefined
}

export const prisma = prismaInstance || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any
