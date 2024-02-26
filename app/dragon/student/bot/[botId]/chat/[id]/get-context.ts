import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test/messages";
import {
  getChatContextByChatId,
  isEmptyObject,
} from "@/app/dragon/ai/student-chat/prompts/chat/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson/queries";
import { TaskType } from "@/types";
import { getAITestContextByChatId } from "@/app/dragon/ai/student-chat/prompts/ai-test/queries";
import { AITestContextByChatId } from "@/app/dragon/ai/student-chat/prompts/ai-test/queries";
import { UnwrapPromise } from "@/app/dragon/student/queries";

export type TaskContext =
  | UnwrapPromise<ReturnType<typeof getAITestContextByChatId>>
  | UnwrapPromise<ReturnType<typeof getChatContextByChatId>>
  | UnwrapPromise<ReturnType<typeof getLessonContextByChatId>>
  | UnwrapPromise<ReturnType<typeof getTestQuestionsByBotChatId>>;

export type ContextMap = {
  chat: UnwrapPromise<ReturnType<typeof getChatContextByChatId>>;
  test: UnwrapPromise<ReturnType<typeof getTestQuestionsByBotChatId>>;
  lesson: UnwrapPromise<ReturnType<typeof getLessonContextByChatId>>;
  "ai-test": UnwrapPromise<ReturnType<typeof getAITestContextByChatId>>;
};

const taskTypeContextMap = {
  chat: getChatContextByChatId,
  test: getTestQuestionsByBotChatId,
  lesson: getLessonContextByChatId,
  "ai-test": getAITestContextByChatId,
};

// TODO refactor this to not return true when undefined
const getAutoCheck = (context: TaskContext, type: TaskType) => {
  // get autoCheck from preferences based on task type
  if (type === "ai-test") {
    const taskContext = context as ContextMap["ai-test"];
    const preferences = taskContext?.lessonPreferences;
    if (!preferences || Object.keys(preferences).length === 0) {
      return true;
    } else if ("autoCheck" in preferences) {
      return preferences.autoCheck;
    } else {
      return true;
    }
  }
  if (type === "test") {
    const taskContext = context as ContextMap["test"];
    const preferences = taskContext?.preferences;
    if (!preferences || Object.keys(preferences).length === 0) {
      return true;
    } else if ("autoCheck" in preferences) {
      return preferences.autoCheck;
    } else {
      return true;
    }
  }
  return true;
};

export const getChatContext = async function (type: TaskType, chatId: string) {
  const func = taskTypeContextMap[type];
  if (!func) {
    throw new Error("Invalid type");
  }
  const chatContext = await func(chatId);
  const autoCheck = getAutoCheck(chatContext, type);

  return {
    stringifiedContext: JSON.stringify(chatContext),
    context: chatContext,
    autoCheck,
  };
};
