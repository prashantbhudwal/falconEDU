import { getTasksWithInteractions } from "@/app/dragon/teacher/routers/studentRouter";
import { getTaskUrlByType } from "@/lib/urls";
import { TaskType } from "@/types";
import Link from "next/link";
import React from "react";
import { type TasksWithInteractions } from "@/app/dragon/teacher/routers/studentRouter";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";

const AnalyticsWidget = async ({ classId }: { classId: string }) => {
  const leastInteractedTasksList = await getTasksWithInteractions({ classId });
  const threeLeastInteractedTasks = leastInteractedTasksList?.slice(0, 3);
  const threeMostInteractedTasks = leastInteractedTasksList?.slice(-3);

  return (
    <div className="p-3 rounded-xl border border-base-200 w-[250px] flex flex-col space-y-4">
      <h3 className="flex gap-2 rounded-xl w-full text-sm items-center text-slate-500">
        <span>Student Activity</span>
      </h3>
      <div className="flex flex-col space-y-9 text-xs text-slate-400">
        <section className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-destructive/80">
            <h4>Least Active Tasks</h4>
            <ArrowTrendingDownIcon className="w-3 h-3" />
          </div>
          <TaskList taskList={threeLeastInteractedTasks} classId={classId} />
        </section>
        <section className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-primary/80">
            <h4>Most Active Tasks</h4>
            <ArrowTrendingUpIcon className="w-3 h-3" />
          </div>
          <TaskList taskList={threeMostInteractedTasks} classId={classId} />
        </section>
      </div>
    </div>
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
              className="flex gap-2 items-center w-full justify-between rounded-xl text-xs transition-colors duration-200 group"
            >
              <h5 className="truncate group-hover:underline-offset-1 group-hover:underline">
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
          <FaceFrownIcon className="w-4 h-4 mr-2 text-slate-500" />
          <p className="text-xs text-slate-500">No student activity yet</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;
