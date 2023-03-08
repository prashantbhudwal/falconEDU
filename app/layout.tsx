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
      <body>{children}</body>
    </html>
  );
}
