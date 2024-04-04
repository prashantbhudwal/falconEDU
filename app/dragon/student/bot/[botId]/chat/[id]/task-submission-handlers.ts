import { checkTest } from "@/app/dragon/ai/test-checker";
import { checkAITest } from "@/app/dragon/ai/tasks/ai-test/submission";

import { TaskType } from "@/types";
import { db } from "@/lib/routers";

const testHandler = async ({
  attemptId,
  autoCheck,
  userId,
}: {
  attemptId: string;
  autoCheck: boolean;
  userId: string;
}) => {
  if (autoCheck) {
    const testResults = await checkTest({ botChatId: attemptId });
    if (testResults) {
      await db.student.botChat.saveTestResultsByBotChatId({
        botChatId: attemptId,
        testResults,
      });
    }
    await db.attempt.submit({ attemptId, userId });
  }
};

const aiTestHandler = async ({
  attemptId,
  autoCheck,
  userId,
}: {
  attemptId: string;
  autoCheck: boolean;
  userId: string;
}) => {
  if (autoCheck) {
    const { finalTestResults: goals, studentFeedback } = await checkAITest({
      botChatId: attemptId,
    });
    if (goals) {
      await db.student.botChat.saveGoalAssessmentByBotChatId({
        botChatId: attemptId,
        goals,
      });
    }
    if (studentFeedback) {
      await db.student.botChat.saveFeedbackByBotChatId({
        botChatId: attemptId,
        feedback: studentFeedback,
      });
    }
  }
  await db.attempt.submit({ attemptId, userId });
};

const lessonHandler = async ({
  attemptId,
  autoCheck,
  userId,
}: {
  attemptId: string;
  autoCheck: boolean;
  userId: string;
}) => {
  await db.attempt.submit({ attemptId, userId });
};

const chatHandler = async ({
  attemptId,
  autoCheck,
  userId,
}: {
  attemptId: string;
  autoCheck: boolean;
  userId: string;
}) => {
  await db.attempt.submit({ attemptId, userId });
};

export const taskSubmissionHandlers: {
  [key in TaskType]: ({
    attemptId,
    autoCheck,
    userId,
  }: {
    attemptId: string;
    autoCheck: boolean;
    userId: string;
  }) => Promise<void>;
} = {
  test: testHandler,
  "ai-test": aiTestHandler,
  lesson: lessonHandler,
  chat: chatHandler,
};
