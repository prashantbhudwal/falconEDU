import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The root layout must contain an html element with a body element
    <html>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
