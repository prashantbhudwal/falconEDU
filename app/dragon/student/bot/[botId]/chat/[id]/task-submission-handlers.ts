import { checkTest } from "@/app/dragon/ai/test-checker";
import { checkAITest } from "@/app/dragon/ai/tasks/ai-test/submission";
import {
  saveFeedbackByBotChatId,
  saveGoalAssessmentByBotChatId,
} from "@/app/dragon/ai/tasks/ai-test/submission/mutations";
import { saveTestResultsByBotChatId, submitBotChat } from "./mutations";
import { TaskType } from "@/types";
import { db } from "@/lib/routers";

const testHandler = async ({
  attemptId,
  autoCheck,
}: {
  attemptId: string;
  autoCheck: boolean;
}) => {
  if (autoCheck) {
    const testResults = await checkTest({ botChatId: attemptId });
    if (testResults) {
      await saveTestResultsByBotChatId({
        botChatId: attemptId,
        testResults,
      });
    }
    await db.attempt.submit({ attemptId });
  }
};

const aiTestHandler = async ({
  attemptId,
  autoCheck,
}: {
  attemptId: string;
  autoCheck: boolean;
}) => {
  if (autoCheck) {
    const { finalTestResults: goals, studentFeedback } = await checkAITest({
      botChatId: attemptId,
    });
    if (goals) {
      await saveGoalAssessmentByBotChatId({ botChatId: attemptId, goals });
    }
    if (studentFeedback) {
      await saveFeedbackByBotChatId({
        botChatId: attemptId,
        feedback: studentFeedback,
      });
    }
  }
  await db.attempt.submit({ attemptId });
};

const lessonHandler = async ({
  attemptId,
  autoCheck,
}: {
  attemptId: string;
  autoCheck: boolean;
}) => {
  await db.attempt.submit({ attemptId });
};

const chatHandler = async ({
  attemptId,
  autoCheck,
}: {
  attemptId: string;
  autoCheck: boolean;
}) => {
  await db.attempt.submit({ attemptId });
};

export const taskSubmissionHandlers: {
  [key in TaskType]: ({
    attemptId,
    autoCheck,
  }: {
    attemptId: string;
    autoCheck: boolean;
  }) => Promise<void>;
} = {
  test: testHandler,
  "ai-test": aiTestHandler,
  lesson: lessonHandler,
  chat: chatHandler,
};
