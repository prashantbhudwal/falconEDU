import { checkTest } from "@/app/dragon/ai/test-checker";
import { checkAITest } from "@/app/dragon/ai/tasks/ai-test/submission";
import {
  saveFeedbackByBotChatId,
  saveGoalAssessmentByBotChatId,
} from "@/app/dragon/ai/tasks/ai-test/submission/mutations";
import { saveTestResultsByBotChatId, submitBotChat } from "./mutations";
import { TaskType } from "@/types";

const testHandler = async (botChatId: string, autoCheck: boolean) => {
  if (autoCheck) {
    const testResults = await checkTest({ botChatId: botChatId });
    if (testResults) {
      await saveTestResultsByBotChatId({
        botChatId,
        testResults,
      });
    }
    await submitBotChat({ botChatId });
  }
};

const aiTestHandler = async (botChatId: string, autoCheck: boolean) => {
  if (autoCheck) {
    const { finalTestResults: goals, studentFeedback } = await checkAITest({
      botChatId,
    });
    if (goals) {
      await saveGoalAssessmentByBotChatId({ botChatId, goals });
    }
    if (studentFeedback) {
      await saveFeedbackByBotChatId({ botChatId, feedback: studentFeedback });
    }
  }
  await submitBotChat({ botChatId });
};

const lessonHandler = async (botChatId: string) => {
  await submitBotChat({ botChatId });
};

const chatHandler = async (botChatId: string) => {
  await submitBotChat({ botChatId });
};

export const taskSubmissionHandlers: {
  [key in TaskType]: (botChatId: string, autoCheck: boolean) => Promise<void>;
} = {
  test: testHandler,
  "ai-test": aiTestHandler,
  lesson: lessonHandler,
  chat: chatHandler,
};
