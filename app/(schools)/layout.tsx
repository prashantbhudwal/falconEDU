import { Inter } from "next/font/google";
import TRPCProvider from "../_trpc/provider";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { CelebrationConfetti } from "@/components/confetti/confetti";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

function generateTitle() {
  const isDev = process.env.NODE_ENV === "development";
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;
  const isTestUrl = url?.includes("chubbi.falconai.in");

  let title;
  if (isDev) {
    title = "🟠 DEV | FalconAI";
  } else if (isTestUrl) {
    title = "🟣 TEST | FalconAI";
  } else {
    title = "FalconAI";
  }

  return title;
}

const title = generateTitle();
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <main className="flex grow flex-col items-center">
            <CelebrationConfetti />
            <TRPCProvider headers={headers()}>{children}</TRPCProvider>
          </main>
          {/* TODO Style the toaster with tailwind colors */}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
