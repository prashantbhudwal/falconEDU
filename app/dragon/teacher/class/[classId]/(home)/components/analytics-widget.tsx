import { getLeastInteractedTasks } from "@/app/dragon/teacher/routers/studentRouter";
import { getTaskUrlByType } from "@/lib/urls";
import { TaskType } from "@/types";
import Link from "next/link";
import React from "react";
import { BiChat } from "react-icons/bi";
import { LuActivity } from "react-icons/lu";
import { FaBookOpenReader } from "react-icons/fa6";

const AnalyticsWidget = async ({ classId }: { classId: string }) => {
  const leastInteractedTasksList = await getLeastInteractedTasks({ classId });

  return (
    <div className="p-3 rounded-xl bg-base-200 w-[250px]">
      <h3 className="flex gap-2 items-center justify-center py-2 bg-accent/90 text-accent-content rounded-xl w-full">
        <LuActivity className="text-xl" /> Analytics
      </h3>
      <p className="text-xs text-center my-2">Low Activiy Tasks</p>
      {leastInteractedTasksList?.slice(0, 3).map((taskItem) => {
        const interactionPercentage =
          (taskItem.interactedStudents / taskItem.totalStudents) * 100;
        return (
          <Link
            href={getTaskUrlByType({
              classId: classId,
              configId: taskItem.task.id,
              type: taskItem.task.type as TaskType,
            })}
            key={taskItem.task.id}
            className="flex gap-2 items-center w-full justify-between rounded-xl py-2 px-4 my-2 bg-base-100"
          >
            <h5 className="text-sm truncate">{taskItem.task.name}</h5>
            <div className="flex items-center gap-1">
              <FaBookOpenReader />
              <span className="text-xs">{interactionPercentage}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AnalyticsWidget;
