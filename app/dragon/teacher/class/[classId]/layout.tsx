import { TeacherNav } from "../../components/teacher-nav";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { Toaster } from "@/components/ui/toaster";
import prisma from "@/prisma";
import { cache } from "react";

const getClassNameByClassId = cache(async (classId: string) => {
  const classData = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      name: true,
    },
  });
  if (!classData) return "";
  return classData.name;
});

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  const nameOfClass = await getClassNameByClassId(classId);

  return (
    <div className="flex flex-row h-full w-full">
      <div className="min-w-[280px]">
        <TeacherNav classId={classId} nameOfClass={nameOfClass} />
      </div>
      <Paper className="flex flex-col shadow-inner shadow-slate-900 flex-1 bg-slate-950 h-full p-0 pb-24">
        {children}
      </Paper>
      <Toaster />
    </div>
  );
}
