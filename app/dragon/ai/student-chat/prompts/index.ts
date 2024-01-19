import { TaskType } from "@/types";
import { getEngineeredAITestBotMessages } from "./ai-test/messages";
import { AITestContextByChatId } from "./ai-test/queries";
import { getEngineeredChatBotMessages } from "./chat/messages";
import { ChatContextByChatId } from "./chat/queries";
import { getEngineeredLessonBotMessages } from "./lesson/messages";
import { LessonContextByChatId } from "./lesson/queries";
import {
  TestContextByChatId,
  getEngineeredTestBotMessages,
} from "./test/messages";

export const getEngineeredMessagesByType = async ({
  type,
  context,
}: {
  type: TaskType;
  context: any;
}) => {
  switch (type) {
    case "chat":
      return await getEngineeredChatBotMessages(context as ChatContextByChatId);
    case "test":
      return await getEngineeredTestBotMessages(context as TestContextByChatId);
    case "lesson":
      return await getEngineeredLessonBotMessages(
        context as LessonContextByChatId
      );
    case "ai-test":
      return await getEngineeredAITestBotMessages(
        context as AITestContextByChatId
      );
    default:
      return await getEngineeredChatBotMessages(context);
  }
};
