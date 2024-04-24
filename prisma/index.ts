import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: {
      timeout: 10000, // 10 seconds
      maxWait: 5000, // 5 seconds
    },
    // log: ["error", "info", "query", "warn"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
