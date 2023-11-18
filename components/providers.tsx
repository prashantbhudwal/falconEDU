"use client";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import TRPCProvider from "@/app/_trpc/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <Provider>
          <TRPCProvider>{children}</TRPCProvider>
        </Provider>
      </SessionProvider>
    </ThemeProvider>
  );
}
