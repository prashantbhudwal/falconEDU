import "server-only";
import { headers } from "next/headers";
import { appRouter } from "@/server";
import prisma from "@/prisma";

export const api = appRouter.createCaller({
  prisma,
  headers: headers(),
});
