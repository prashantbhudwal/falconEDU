"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./client";
export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const url =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000/api/trpc"
      : process.env.VERCEL_BRANCH_URL ?? "";
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url })],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
