import Navbar from "@/components/Navbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 w-screen">
        {children}
      </main>
    </div>
  );
}
