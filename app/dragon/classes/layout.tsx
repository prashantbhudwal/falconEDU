import Navbar from "@/components/navbar";

export default function DragonLayout({
  children,
  bots,
  students,
}: {
  children: React.ReactNode;
  bots: React.ReactNode;
  students: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-col gap-4">
        {bots}
        {students}
      </div>
    </div>
  );
}
