import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { db } from "../../../../lib/routers";
import prisma from "@/prisma";
import { cache } from "react";
import { Card } from "@/components/ui/card";
import { compareDesc, format } from "date-fns";
import Link from "next/link";
import { getParentReportUrlByTaskId } from "@/lib/urls";

const TEST_STUDENT_EMAIL = "cashflow.prashant@gmail.com";

const getTasksByStudentId = cache(async (studentId: string) => {
  const bots = await prisma.bot.findMany({
    where: { studentId: studentId },
    include: {
      BotChat: true,
      BotConfig: true,
    },
  });
  const botChats = bots.flatMap((bot) => bot.BotChat);
  let botChatsWithConfigNames = bots.flatMap((bot) =>
    bot.BotChat.map((botChat) => ({
      ...botChat,
      botConfigName: bot.BotConfig.name, // Include the name of the BotConfig
    })),
  );
  botChatsWithConfigNames = botChatsWithConfigNames.sort((a, b) =>
    compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
  );

  return botChatsWithConfigNames;
});

const getTasksByStudentEmail = cache(async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      StudentProfile: true,
    },
  });

  const studentId = user?.StudentProfile?.id;

  if (!studentId) {
    return null;
  }

  const tasks = await getTasksByStudentId(studentId);
  return tasks;
});

export default async function Page() {
  const session = await getServerSession(authOptions);
  const tasks = await getTasksByStudentEmail(TEST_STUDENT_EMAIL);

  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  return (
    <div className="max-w-xl flex-col gap-10 pt-2 font-medium">
      {tasks?.map((task) => (
        <Link
          href={getParentReportUrlByTaskId({ taskId: task.id })}
          key={task.id}
        >
          <Card key={task.id} className="flex-col space-y-2 bg-base-200 p-2">
            <h3 className="font-medium">{task.botConfigName}</h3>
            <div className="flex flex-row justify-between space-x-2">
              <p className="text-xs">
                {format(new Date(task.createdAt), "PPP")} {/* Format date */}
              </p>
              <p className="w-fit rounded-sm text-xs">
                {task.isSubmitted ? (
                  <span className="text-primary">Completed</span>
                ) : (
                  <span className="text-accent">Not Completed</span>
                )}
              </p>
            </div>
            {task.attemptNumber > 1 && (
              <p className="text-xs">{"Attempt " + task.attemptNumber}</p>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
