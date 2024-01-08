import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../../routers";
import { ClassNavbar } from "./components/class-navbar";

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  const classData = await db.class.getClassByClassId({ classId });
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });

  const classesWithConfigs = await db.class.getClassesByUserId({ userId });

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col h-full w-full">
        <div>
          <ClassNavbar
            classId={classId}
            userId={userId}
            classesWithConfigs={classesWithConfigs}
            grade={classData.grade}
            section={classData.section}
          />
        </div>
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-200">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10 min-h-screen">
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}
