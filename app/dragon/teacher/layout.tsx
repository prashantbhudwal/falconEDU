import Navbar from "@/components/navbar/navbar";
export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-full h-screen">
      <Navbar />
      {children}
    </div>
  );
}
