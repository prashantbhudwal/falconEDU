import { getTasksWithInteractions } from "@/lib/routers/student";
import { getTaskUrlByType } from "@/lib/urls";
import { TaskType } from "@/types";
import Link from "next/link";
import React, { Suspense } from "react";
import { type TasksWithInteractions } from "@/lib/routers/student";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  FaceFrownIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetFallback } from "./widget-fallback";

export const AnalyticsWidget = async ({ classId }: { classId: string }) => {
  const leastInteractedTasksList = await getTasksWithInteractions({ classId });
  const threeLeastInteractedTasks = leastInteractedTasksList?.slice(0, 3);
  const threeMostInteractedTasks = leastInteractedTasksList?.slice(-3);

  return (
    <Suspense fallback={<WidgetFallback />}>
      <Card>
        <CardHeader>
          <CardTitle>Student Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-9 text-xs text-slate-400">
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
        </CardContent>
      </Card>
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
