import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "../components/providers";
import { Inter } from "next/font/google";
import TRPCProvider from "./_trpc/provider";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const isDev = process.env.NODE_ENV === "development";
const url = process.env.NEXT_PUBLIC_VERCEL_URL;
const isTestUrl = url?.includes("chubbi.falconai.in");

const title = isDev
  ? "🟠 DEV | FalconAI"
  : isTestUrl
    ? "🟣 TEST | FalconAI"
    : "FalconAI";

export const metadata = {
  title: title,
  description: "AI for Teachers, and Schools.",
  metadataBase: new URL("https://falconai.in"),
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="custom-scrollbar flex min-h-screen flex-col overflow-hidden bg-slate-900 text-slate-400">
        <Providers>
          <main className="flex grow flex-col items-center">
            <TRPCProvider headers={headers()}>{children}</TRPCProvider>
          </main>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
