import { isToday, isThisWeek, isThisMonth } from "date-fns";
import { TaskCard } from "./task-card";
import Link from "next/link";
import { getTaskResponsesUrlByType, getTaskUrlByType } from "@/lib/urls";
import { TaskType } from "@/types/dragon";
import { AllConfigsInClass } from "@/lib/routers/botConfig";

type GroupedTasks = {
  [key: string]: AllConfigsInClass["all"];
};

type TaskListProps = {
  tasks: AllConfigsInClass["all"];
  classId: string;
  userId: string;
};

const getTaskLink = (classId: string, task: AllConfigsInClass["all"][0]) => {
  const configId = task.id;
  const type = task.type as TaskType;
  if (task.published) {
    return getTaskResponsesUrlByType({
      classId,
      configId,
      type,
    });
  }
  return getTaskUrlByType({
    classId,
    configId,
    type,
  });
};

export const TaskList = ({ tasks, classId, userId }: TaskListProps) => {
  const groupTasks = (sortedTasks: AllConfigsInClass["all"]): GroupedTasks => {
    return sortedTasks.reduce((acc: GroupedTasks, task) => {
      const date = new Date(task.createdAt);
      let groupName = "Older than a month";

      if (isToday(date)) {
        groupName = "Today";
      } else if (isThisWeek(date)) {
        groupName = "This Week";
      } else if (isThisMonth(date)) {
        groupName = "This Month";
      }

      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(task);
      return acc;
    }, {} as GroupedTasks);
  };

  // Sort tasks by createdAt in descending order
  const sortedTasks = tasks.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groupedTasks = groupTasks(sortedTasks);

  return (
    <>
      {Object.keys(groupedTasks).map((group) => (
        <section key={group}>
          <h2 className="mb-2 font-semibold">{group}</h2>
          <div className="mb-3 flex flex-col space-y-4">
            {groupedTasks[group].map((task) => {
              const taskLink = getTaskLink(classId, task);
              return (
                <Link href={taskLink} key={task.id}>
                  <TaskCard
                    key={task.id}
                    config={task}
                    classId={classId}
                    userId={userId}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
};
