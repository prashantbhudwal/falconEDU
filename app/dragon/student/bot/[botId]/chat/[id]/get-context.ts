import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test/messages";
import { getChatContextByChatId } from "@/app/dragon/ai/student-chat/prompts/chat/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson/queries";
import { TaskType } from "@/types";
import { getAITestContextByChatId } from "@/app/dragon/ai/student-chat/prompts/ai-test/queries";
export const getChatContext = async function (type: TaskType, chatId: string) {
  switch (type) {
    case "chat": {
      const chatContext = await getChatContextByChatId(chatId);
      return {
        stringifiedContext: JSON.stringify(chatContext),
        context: chatContext,
      };
    }
    case "test": {
      const parsedQuestions = await getTestQuestionsByBotChatId(chatId);
      return {
        stringifiedContext: JSON.stringify(parsedQuestions),
        context: parsedQuestions,
      };
    }
    case "lesson": {
      const lessonContext = await getLessonContextByChatId(chatId);
      return {
        stringifiedContext: JSON.stringify(lessonContext),
        context: lessonContext,
      };
    }
    case "ai-test": {
      const aiTestContext = await getAITestContextByChatId(chatId);
      return {
        stringifiedContext: JSON.stringify(aiTestContext),
        context: aiTestContext,
      };
    }
    default:
      throw new Error("Invalid type");
  }
};
