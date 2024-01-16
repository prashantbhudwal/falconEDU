import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Paper } from "@/components/ui/paper";
import TaskList from "./components/task-list";
import { db } from "../../../routers";
import Link from "next/link";
import AnalyticsWidget from "./components/analytics/analytics-widget";
import { Suspense } from "react";
import AnalyticsWidgetFallback from "./components/analytics/analytics-widget-fallback";
import { cn } from "@/lib/utils";

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
    <Paper className="h-full flex flex-col items-center justify-between space-y-2">
      {!classDetails.isActive && <ArchivedClass classId={classId} />}
      <div
        className={cn(
          "w-full flex flex-col items-center md:relative lg:relative",
          {
            "brightness-50": !classDetails.isActive,
          }
        )}
      >
        <div className="md:fixed lg:fixed top-20 right-5">
          <Suspense fallback={<AnalyticsWidgetFallback />}>
            <AnalyticsWidget classId={classId} />
          </Suspense>
        </div>
        <div className="w-8/12 max-w-6xl flex flex-col space-y-6">
          <TaskList tasks={allConfigs} classId={classId} userId={userId} />
        </div>
      </div>
    </Paper>
  );
}

const ArchivedClass = ({ classId }: { classId: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-3 w-full pb-5">
      <h2 className="text-2xl font-semibold">Class is archived</h2>
      <p className="text-sm text-slate-500">
        <Link
          className="underline cursor-pointer hover:text-warning"
          href={`${classId}/dashboard`}
        >
          Activate
        </Link>{" "}
        it to start using it again
      </p>
    </div>
  );
};
