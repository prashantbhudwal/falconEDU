import { TeacherNav } from "../../components/teacher-nav";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { Toaster } from "@/components/ui/toaster";

export default function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;

  return (
    <div className="flex flex-row h-full w-full">
      <div className="min-w-[280px]">
        <TeacherNav classId={classId} />
      </div>
      <Paper className="flex flex-col shadow-inner shadow-slate-900 flex-1 bg-slate-950 h-full p-0 pb-24">
        {children}
      </Paper>
      <Toaster />
    </div>
  );
}
