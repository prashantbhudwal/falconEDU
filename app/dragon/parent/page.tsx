import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { db } from "../teacher/routers";
import prisma from "@/prisma";
import { cache } from "react";

const TEST_STUDENT_EMAIL = "cashflow.prashant@gmail.com";

const getTasksByStudentId = cache(async (studentId: string) => {
  const bots = await prisma.bot.findMany({
    where: { studentId: studentId },
    include: {
      BotChat: true,
    },
  });
  const botChats = bots.flatMap((bot) => bot.BotChat);
  return botChats;
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
    <div className="w-full">
      <h1>Parent</h1>
      <h2>Tasks</h2>
      <div className="text-white font-medium text-xs">
        {tasks?.map((task) => (
          <div key={task.id}>
            <>Test</>
            <h3>{task.id}</h3>
            <p>{task.isSubmitted ? "Submitted" : "Unsubmitted"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
