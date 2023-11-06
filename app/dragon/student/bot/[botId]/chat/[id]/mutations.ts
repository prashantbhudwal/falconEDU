"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma";
import { ReportType } from "@/app/dragon/teacher/class/[classId]/tests/edit-test/[testBotId]/report/[studentBotId]/page";

export const submitTestBot = async function (botId: string) {
  try {
    await prisma.bot.update({
      where: { id: botId },
      data: {
        isSubmitted: true,
      },
    });
    revalidatePath("/dragon/student/");
  } catch (error) {
    console.error("Error updating Bot:", error);
    throw new Error("Failed to update Bot");
  }
};

export const createReportForStudents = async function (
  studentBotId: string,
  report: ReportType[]
) {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingBotChat = await prisma.botChat.findFirst({
        where: { botId: studentBotId },
      });
      console.log(existingBotChat);

      if (!existingBotChat) {
        return null;
      }
      const response = await prisma.botChatQuestions.createMany({
        data: report.map((ques) => ({
          botChatId: existingBotChat?.id,
          question: ques.question,
          question_number: ques.question_number,
          question_type: "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
          correct_answer: ques.correct_answer,
          isCorrect: ques.isCorrect,
          student_answer: ques.student_answer,
        })),
      });

      console.log(response);
    });
    console.log("report created successfully", transaction);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create Report");
  }
};
