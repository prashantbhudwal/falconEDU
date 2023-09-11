import Navbar from "@/components/navbar";

export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
  bots: React.ReactNode;
  students: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col">
      <Navbar />
      {children}
    </div>
  );
}
