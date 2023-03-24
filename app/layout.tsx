import { AppProvider } from "./context/app-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "FalconOne",
  description: "Learn Something New Today",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-900 text-slate-400">
        <AppProvider>
          <Header />
          <main className="flex-grow mx-5 my-4 flex flex-col items-center">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
