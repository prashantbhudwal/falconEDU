"use client";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider>
        <NextIntlClientProvider locale="en">{children}</NextIntlClientProvider>
      </Provider>
    </SessionProvider>
  );
}
