import Navbar from "@/components/navbar/navbar";
export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col h-screen">
      <Navbar />
      {children}
    </div>
  );
}
