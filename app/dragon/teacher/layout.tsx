import Navbar from "@/components/navbar/navbar";
import { TeacherNav } from "./components/teacher-nav";
export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col h-screen">
      <Navbar />
      <div className="flex flex-row h-full overflow-hidden">
        <div className="min-w-[280px]">
          <TeacherNav />
        </div>
        <div className="shadow-inner shadow-slate-900 p-8 flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-950">
          {children}
        </div>
      </div>
    </div>
  );
}
