import { ClassSidebar } from "../../components/class-sidebar/class-sidebar";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { Toaster } from "@/components/ui/toaster";
import prisma from "@/prisma";
import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UnwrapPromise } from "@/app/dragon/student/queries";

export type BotConfigs = UnwrapPromise<ReturnType<typeof getBotConfigs>>;
const getBotConfigs = cache(
  async (userId: string, classId: string, configType: string) => {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      throw new Error(`TeacherProfile with userId ${userId} not found`);
    }
    const botConfigs = await prisma.botConfig.findMany({
      where: {
        teacherId: teacherProfile.id,
        classId,
        type: configType.toLocaleLowerCase(),
      },
    });
    return botConfigs;
  }
);

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
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const testConfigs = await getBotConfigs(userId, classId, "test");
  const botConfigs = await getBotConfigs(userId, classId, "chat");

  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-[240px]">
        <ClassSidebar
          classId={classId}
          nameOfClass={nameOfClass}
          testConfigs={testConfigs}
          botConfigs={botConfigs}
        />
      </div>
      <Paper className="flex flex-col shadow-inner shadow-slate-900 flex-1 bg-slate-950 h-full p-0 pb-24">
        {children}
      </Paper>
      <Toaster />
    </div>
  );
}
