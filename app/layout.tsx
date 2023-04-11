import Header from "@/app/Header";
import Footer from "@/app/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AtomProviders from "./atoms/providers";

export const metadata = {
  title: "Falcon",
  description: "Your AI Co-Teacher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
