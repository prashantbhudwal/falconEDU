import Navbar from "@/components/Navbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
}
