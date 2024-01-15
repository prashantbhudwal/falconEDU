import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../../../routers";
import { ClassNavbar } from "../../(home)/components/class-navbar";
import { TasksNavbar } from "../_components/tasks-navbar";
import { typeGetBotConfigByConfigId } from "@/app/dragon/teacher/routers/botConfigRouter";
import { EvalDrawer } from "@/app/dragon/teacher/class/[classId]/(tasks)/_components/eval-drawer/eval-drawer";
import { TaskType } from "@/types";

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string; taskId: string };
}) {
  const { classId, taskId } = params;
  const nameOfTask = await db.botConfig.getConfigNameByConfigId({
    configId: taskId,
  });
  const task = await db.botConfig.getBotConfigByConfigId({ configId: taskId });
  if (!task) return null;
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const { archivedParsedQuestions, activeParsedQuestions } =
    await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
      botConfigId: taskId,
    });

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col h-full w-full">
        <div>
          <TasksNavbar
            classId={classId}
            userId={userId}
            task={task}
            totalParsedQuestions={activeParsedQuestions?.length}
          />
        </div>
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-200">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10 min-h-screen">
            {children}
            <Toaster />
            <EvalDrawer
              taskId={taskId}
              taskType={task.type as TaskType}
              task={task}
              totalParsedQuestions={activeParsedQuestions?.length}
              classId={classId}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
