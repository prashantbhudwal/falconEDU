import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test/messages";
import { getChatContextByChatId } from "@/app/dragon/ai/student-chat/prompts/chat/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson/queries";
import { TaskType } from "@/types";
import { getAITestContextByChatId } from "@/app/dragon/ai/student-chat/prompts/ai-test/queries";

const taskTypeContextMap = {
  chat: getChatContextByChatId,
  test: getTestQuestionsByBotChatId,
  lesson: getLessonContextByChatId,
  "ai-test": getAITestContextByChatId,
};

export const getChatContext = async function (type: TaskType, chatId: string) {
  const func = taskTypeContextMap[type];
  if (!func) {
    throw new Error("Invalid type");
  }
  const chatContext = await func(chatId);
  return {
    stringifiedContext: JSON.stringify(chatContext),
    context: chatContext,
  };
};
