import Footer from "@/app/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "../providers/providers";
import { Inter } from "next/font/google";
import Upgrade from "./Upgrade";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "FalconAI | Teaching Assistant",
  description:
    "Create lesson plans specific to your curriculum, with effortless drag and drop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col min-h-screen bg-slate-900 text-slate-400">
        <Providers>
          <main className="flex-grow mx-5 flex flex-col items-center min-h-screen">
            <Upgrade>{children}</Upgrade>
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
