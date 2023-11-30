import { ClassSidebar } from "../../components/class-sidebar/class-sidebar";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../routers";
import { ClassNavbar } from "../../components/class-navbar/navbar";

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  const nameOfClass = await db.class.getClassNameByClassId(classId);
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });

  const classesWithConfigs = await db.class.getClassesByUserId({ userId });

  return (
    <div className="flex flex-col h-full w-full">
      <ClassNavbar
        classId={classId}
        userId={userId}
        classesWithConfigs={classesWithConfigs}
      />
      <div className="flex flex-row h-full w-full">
        <div className="w-[240px]">
          <ClassSidebar
            userId={userId}
            classId={classId}
            nameOfClass={nameOfClass}
            configs={classConfigs}
          />
        </div>
        <Paper className="flex flex-col shadow-inner shadow-slate-900 flex-1 bg-slate-950 h-full p-0 pb-24">
          {children}
        </Paper>
        <Toaster />
      </div>
    </div>
  );
}
