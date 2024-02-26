import { TaskType } from "@/types";
import { db } from "@/lib/routers";
import { TaskContextMap, Contexts } from "@/lib/routers/contextRouter/queries";

const taskTypeContextMap = {
  chat: db.context.query.chat,
  test: db.context.query.test,
  lesson: db.context.query.lesson,
  "ai-test": db.context.query.aiTest,
};

// TODO refactor this to not return true when undefined
const getAutoCheck = (context: Contexts, type: TaskType) => {
  // get autoCheck from preferences based on task type
  if (type === "ai-test") {
    const autoCheck = (context as TaskContextMap["ai-test"])?.lessonPreferences
      ?.autoCheck;
    return autoCheck === undefined ? true : autoCheck;
  }
  if (type === "test") {
    const taskContext = context as TaskContextMap["test"];
    const autoCheck = taskContext?.preferences?.autoCheck;
    return autoCheck === undefined ? true : autoCheck;
  }
  return true;
};

export const getChatContext = async function ({
  type,
  chatId,
  configId,
}: {
  type: TaskType;
  chatId?: string;
  configId?: string;
}) {
  const func = taskTypeContextMap[type];
  if (!func) {
    throw new Error("Invalid type");
  }
  const chatContext = await func({ chatId, configId });
  const autoCheck = getAutoCheck(chatContext, type);
  return {
    stringifiedContext: JSON.stringify(chatContext),
    context: chatContext,
    autoCheck,
  };
};
