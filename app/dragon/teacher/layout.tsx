import Navbar from "@/components/navbar/navbar";
import { Paper } from "@/components/ui/Paper";
import ClassBreadcrumbs from "./components/class-breadcrumbs";
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
        <TeacherNav />
        <Paper className="flex-1 mx-auto max-w-screen-xl flex flex-col space-y-4 h-full overflow-y-auto custom-scrollbar bg-slate-950">
          {children}
        </Paper>
      </div>
    </div>
  );
}
