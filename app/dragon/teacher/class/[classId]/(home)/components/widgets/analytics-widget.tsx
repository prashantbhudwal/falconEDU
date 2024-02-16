import { getTasksWithInteractions } from "@/lib/routers/studentRouter";
import { getTaskUrlByType } from "@/lib/urls";
import { TaskType } from "@/types";
import Link from "next/link";
import React, { Suspense } from "react";
import { type TasksWithInteractions } from "@/lib/routers/studentRouter";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  FaceFrownIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const AnalyticsWidget = async ({ classId }: { classId: string }) => {
  const leastInteractedTasksList = await getTasksWithInteractions({ classId });
  const threeLeastInteractedTasks = leastInteractedTasksList?.slice(0, 3);
  const threeMostInteractedTasks = leastInteractedTasksList?.slice(-3);

  return (
    <Suspense fallback={<AnalyticsWidgetFallback />}>
      <div className="flex w-[250px] flex-col space-y-4 rounded-xl border border-base-200 p-3">
        <h3 className="flex w-full items-center gap-2 rounded-xl text-sm text-slate-500">
          <span>Student Activity</span>
        </h3>
        <div className="flex flex-col space-y-9 text-xs text-slate-400">
          <section className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-destructive/80">
              <h4>Least Active Tasks</h4>
              <ArrowTrendingDownIcon className="h-3 w-3" />
            </div>
            <TaskList taskList={threeLeastInteractedTasks} classId={classId} />
          </section>
          <section className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-primary/80">
              <h4>Most Active Tasks</h4>
              <ArrowTrendingUpIcon className="h-3 w-3" />
            </div>
            <TaskList taskList={threeMostInteractedTasks} classId={classId} />
          </section>
        </div>
      </div>
    </Suspense>
  );
};

const TaskList = async ({
  taskList,
  classId,
}: {
  taskList: TasksWithInteractions | undefined;
  classId: string;
}) => {
  return (
    <div>
      {taskList && taskList.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {taskList.map((taskItem) => (
            <Link
              href={getTaskUrlByType({
                classId: classId,
                configId: taskItem.task.id,
                type: taskItem.task.type as TaskType,
              })}
              key={taskItem.task.id}
              className="group flex w-full items-center justify-between gap-2 rounded-xl text-xs transition-colors duration-200"
            >
              <h5 className="truncate group-hover:underline group-hover:underline-offset-1">
                {taskItem.task.name}
              </h5>
              <div className="flex items-center gap-1">
                <UserIcon className="w-3" />
                <span className="tracking-wider">{`${taskItem.interactedStudents}/${taskItem.totalStudents}`}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center py-2">
          <FaceFrownIcon className="mr-2 h-4 w-4 text-slate-500" />
          <p className="text-xs text-slate-500">No student activity yet</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;

const AnalyticsWidgetFallback = () => {
  return (
    <div className="h-[200px] w-[250px] rounded-xl bg-base-200 p-3">
      <div className="h-7 animate-pulse rounded-xl bg-base-100"></div>
      <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
      <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
    </div>
  );
};
