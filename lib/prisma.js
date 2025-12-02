import { PrismaClient } from "@prisma/client";

// Use globalThis to store the PrismaClient instance so it persists across Next.js reloads
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Access the global variable, or use a fallback if it's not available
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || prismaClientSingleton();

// In non-production environments, assign the instance to the global variable
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;