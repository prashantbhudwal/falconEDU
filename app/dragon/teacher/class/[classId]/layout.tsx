import { TeacherNav } from "../../components/teacher-nav";

export default function DragonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;

  return (
    <div className="flex flex-row h-full overflow-hidden">
      <div className="min-w-[280px] overflow-y-auto">
        <TeacherNav />
      </div>
      <div className="shadow-inner shadow-slate-900 p-8 flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-950">
        {children}
      </div>
    </div>
  );
}
