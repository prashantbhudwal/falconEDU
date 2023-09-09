import Navbar from "@/components/navbar";

export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
