import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Paper } from "@/components/ui/paper";
import TaskList from "./components/task-list";
import { db } from "../../../../../../lib/routers";
import Link from "next/link";
import AnalyticsWidget from "./components/analytics/analytics-widget";
import { Suspense } from "react";
import AnalyticsWidgetFallback from "./components/analytics/analytics-widget-fallback";
import { cn } from "@/lib/utils";
import { EmptyClassCard } from "./components/empty-class-card";

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
  const { students } = await db.class.getStudentsByClassId(classId);
  const noStudents = students && students.length === 0;
  const allConfigs = classConfigs.all;
  const isEmpty = allConfigs.length === 0;
  const isArchived = !classDetails.isActive;

  if (isEmpty) {
    return (
      <Paper className="flex h-full flex-col items-center justify-between space-y-2">
        <EmptyClassCard classId={classId} noStudents={!!noStudents} />
      </Paper>
    );
  }
  return (
    <Paper className="flex h-full flex-col items-center justify-between space-y-2">
      {isArchived && <ArchivedClass classId={classId} />}
      <div
        className={cn(
          "flex w-full flex-col items-center md:relative lg:relative",
          {
            "brightness-50": isArchived,
          },
        )}
      >
        <div className="right-5 top-20 md:fixed lg:fixed">
          <Suspense fallback={<AnalyticsWidgetFallback />}>
            <AnalyticsWidget classId={classId} />
          </Suspense>
        </div>
        <div className="flex w-8/12 max-w-6xl flex-col space-y-6">
          <TaskList tasks={allConfigs} classId={classId} userId={userId} />
        </div>
      </div>
    </Paper>
  );
}

const ArchivedClass = ({ classId }: { classId: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-3 pb-5">
      <h2 className="text-2xl font-semibold">Class is archived</h2>
      <p className="text-sm text-slate-500">
        <Link
          className="cursor-pointer underline hover:text-warning"
          href={`${classId}/dashboard`}
        >
          Activate
        </Link>{" "}
        it to start using it again
      </p>
    </div>
  );
};
