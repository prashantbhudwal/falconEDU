import { TaskType } from "@/types";
import { getEngineeredAITestBotMessages } from "./ai-test/messages";
import { getEngineeredChatBotMessages } from "./chat/messages";
import { getEngineeredLessonBotMessages } from "./lesson/messages";
import { getEngineeredTestBotMessages } from "./test/messages";

const taskTypeEngineeredMessagesMap = {
  chat: getEngineeredChatBotMessages,
  test: getEngineeredTestBotMessages,
  lesson: getEngineeredLessonBotMessages,
  "ai-test": getEngineeredAITestBotMessages,
};

export const getEngineeredMessagesByType = async ({
  type,
  context,
}: {
  type: TaskType;
  context: any;
}) => {
  const func = taskTypeEngineeredMessagesMap[type];
  if (!func) {
    throw new Error("Invalid type");
  }
  console.log("context", context);
  return await func(context);
};
