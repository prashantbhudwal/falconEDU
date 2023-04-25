import Header from "@/app/Header";
import Footer from "@/app/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AtomProviders from "./atoms/providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "FalconAI | Your Personal Teaching Assistant",
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
        <AtomProviders>
          <Header />
          <main className="flex-grow mx-5 my-4 flex flex-col items-center">
            {children}
          </main>
          <Footer />
        </AtomProviders>
        <Analytics />
      </body>
    </html>
  );
}
