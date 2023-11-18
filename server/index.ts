import { publicProcedure, createTRPCRouter } from "./trpc";
import { botConfigRouter } from "./routers/botConfigRouter";

export const appRouter = createTRPCRouter({
  botConfig: botConfigRouter,
});

export type AppRouter = typeof appRouter;
