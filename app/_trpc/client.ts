import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { type AppRouter } from "@/server";

export const api = createTRPCReact<AppRouter>({});
