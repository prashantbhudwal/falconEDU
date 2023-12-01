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
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });

  const classesWithConfigs = await db.class.getClassesByUserId({ userId });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-row h-full w-full">
        <div className="w-[240px]">
          <ClassSidebar
            userId={userId}
            classId={classId}
            nameOfClass={nameOfClass}
            configs={classConfigs}
            classesWithConfigs={classesWithConfigs}
          />
        </div>
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-200 pt-1">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10 min-h-screen">
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}
