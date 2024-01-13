import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Paper } from "@/components/ui/paper";
import TaskList from "./components/task-list";
import { db } from "../../../routers";
import Link from "next/link";
import { BsInfoCircleFill } from "react-icons/bs";
import AnalyticsWidget from "./components/analytics-widget";
import { Suspense } from "react";
import AnalyticsWidgetFallback from "./components/analytics-widget-fallback";

export default async function Classes({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  // const classesWithConfigs = await db.class.getClassesByUserId({ userId });
  // const nameOfClass = await db.class.getClassNameByClassId(classId);
  const classDetails = await db.class.getClassByClassId({ classId });
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });
  const allConfigs = classConfigs.all;

  return (
    <Paper className="h-full flex flex-col relative items-center w-5/6 overflow-y-auto custom-scrollbar justify-between">
      {!classDetails.isActive && (
        <p className="flex items-center text-warning/80 pb-5">
          <BsInfoCircleFill className="w-3 h-3 mr-2" /> Class is archived
          <Link
            className="underline cursor-pointer px-2 hover:text-warning"
            href={`${classId}/dashboard`}
          >
            Activate
          </Link>
          it to enable the execution of operations.
        </p>
      )}
      <div className="w-8/12 max-w-6xl flex flex-col space-y-6">
        <TaskList tasks={allConfigs} classId={classId} userId={userId} />
      </div>
      <div className="fixed top-20 right-10">
        <Suspense fallback={<AnalyticsWidgetFallback />}>
          <AnalyticsWidget classId={classId} />
        </Suspense>
      </div>
    </Paper>
  );
}
