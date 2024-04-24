import { Assistant } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { CelebrationConfetti } from "@/components/confetti/confetti";
import { ThemeProvider } from "@/components/theme-provider";
import TRPCProvider from "../_trpc/provider";

const assistant = Assistant({
  subsets: ["latin"],
  display: "swap",
});

function generateTitle() {
  const isDev = process.env.NODE_ENV === "development";
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;
  const isTestUrl = url?.includes("chubbi.falconai.in");

  let title;
  if (isDev) {
    title = "🟠 DEV | Falcoo";
  } else if (isTestUrl) {
    title = "🟣 TEST | Falcoo";
  } else {
    title = "Falcoo";
  }

  return title;
}

const title = generateTitle();
export const metadata = {
  title: title,
  description: "Learn by Teaching.",
  metadataBase: new URL("https://falconai.in/play"),
  // manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={assistant.className}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <main>
            <TRPCProvider headers={headers()}>{children}</TRPCProvider>
          </main>
          <Toaster richColors />
          <CelebrationConfetti />
        </ThemeProvider>
      </body>
    </html>
  );
}
