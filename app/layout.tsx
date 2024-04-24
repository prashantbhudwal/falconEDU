import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Providers>{children}</Providers>
      <Analytics />
    </html>
  );
}
