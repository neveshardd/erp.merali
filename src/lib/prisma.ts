import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

const adapter = process.env.DATABASE_URL 
    ? new PrismaPg({ connectionString: process.env.DATABASE_URL }) 
    : undefined

// Function to check if the client is valid (has the required models)
function isClientValid(client: any): boolean {
    return !!(client && client.budget && client.invoice)
}

// @ts-ignore
let prismaInstance: PrismaClient | undefined = globalForPrisma.prisma

// If in development and client is not valid, recreate it
if (process.env.NODE_ENV !== "production" && prismaInstance && !isClientValid(prismaInstance)) {
    prismaInstance = undefined
}

// Avoid passing { adapter: undefined } which can trigger validation errors
export const prisma = prismaInstance || (adapter ? new PrismaClient({ adapter }) : new PrismaClient())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any
