import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { BotConfig } from "@prisma/client";
import { TaskCard } from "./task-card";
import Link from "next/link";
import { getTaskUrlByType } from "@/lib/urls";

type GroupedTasks = {
  [key: string]: BotConfig[];
};

type TaskListProps = {
  tasks: BotConfig[];
  classId: string;
  userId: string;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, classId, userId }) => {
  const groupTasks = (sortedTasks: BotConfig[]): GroupedTasks => {
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
          <h2 className="font-semibold mb-2">{group}</h2>
          <div className="flex flex-col space-y-4 mb-3">
            {groupedTasks[group].map((task: BotConfig) => (
              <Link
                href={getTaskUrlByType({
                  classId: classId,
                  configId: task.id,
                  type: task.type,
                })}
                key={task.id}
              >
                <TaskCard
                  key={task.id}
                  config={task}
                  classId={classId}
                  userId={userId}
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default TaskList;
