import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "../components/providers";
import { Inter } from "next/font/google";
import Chubbi from "../components/Chubbi";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "FalconAI | Teaching Assistant",
  description:
    "Create lesson plans specific to your curriculum, with effortless drag and drop.",
  metadataBase: new URL("https://falconai.in"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen flex-col bg-slate-900 text-slate-400 custom-scrollbar">
        <Providers>
          <main className="flex min-h-screen grow flex-col items-center">
            {children}
            <Chubbi />
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
