"use client";
import { Provider } from "jotai";
import { headers } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import TRPCProvider from "@/app/_trpc/provider";
import { NextIntlClientProvider } from "next-intl";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <Provider>
          <NextIntlClientProvider locale="en">
            {children}
          </NextIntlClientProvider>
        </Provider>
      </SessionProvider>
    </ThemeProvider>
  );
}
