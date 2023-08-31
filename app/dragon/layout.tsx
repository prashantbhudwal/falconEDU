import Navbar from "@/components/Navbar";

export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-w-full flex-col">
      {children}
    </div>
  );
}
