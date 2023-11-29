import { ClassSidebar } from "../../components/class-sidebar/class-sidebar";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../routers";

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
  const configs = await db.botConfig.getConfigs({ userId, classId });

  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-[240px]">
        <ClassSidebar
          userId={userId}
          classId={classId}
          nameOfClass={nameOfClass}
          configs={configs}
        />
      </div>
      <Paper className="flex flex-col shadow-inner shadow-slate-900 flex-1 bg-slate-950 h-full p-0 pb-24">
        {children}
      </Paper>
      <Toaster />
    </div>
  );
}
