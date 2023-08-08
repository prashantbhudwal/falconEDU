import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

//TODO Use the following code for initialization in production
/*
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
*/
