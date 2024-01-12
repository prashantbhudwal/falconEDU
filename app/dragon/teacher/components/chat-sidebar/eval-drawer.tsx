"use client";
import { evalDrawerAtom } from "@/lib/atoms/ui";
import { useAtomValue, useSetAtom } from "jotai";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useHotkeys } from "react-hotkeys-hook";
import { Chat } from "@/components/chat/chat-dragon";
import { getStudentChatApiURL } from "@/lib/urls";
import { getTaskProperties } from "../../utils";
import {
  getChatContextByConfigId,
  getLessonContextByConfigId,
  getTestQuestionsByBotConfigId,
} from "./queries";
import { useEffect, useState } from "react";
import { TaskType } from "@/types";

const getChatContext = async function ({
  type,
  configId,
}: {
  type: TaskType;
  configId: string;
}) {
  switch (type) {
    case "chat":
      const chatContext = await getChatContextByConfigId({
        configId: configId,
      });
      return JSON.stringify(chatContext);
    case "test":
      const parsedQuestions = await getTestQuestionsByBotConfigId({
        configId: configId,
      });
      return JSON.stringify(parsedQuestions);
    case "lesson":
      const lessonContext = await getLessonContextByConfigId({
        configId: configId,
      });
      return JSON.stringify(lessonContext);
    default:
      throw new Error("Invalid type");
  }
};

export function EvalDrawer({
  taskId,
  taskType,
}: {
  taskId: string;
  taskType: TaskType;
}) {
  const [context, setContext] = useState<string>();
  const isOpen = useAtomValue(evalDrawerAtom);
  const setEvalDrawer = useSetAtom(evalDrawerAtom);

  useHotkeys("ctrl+k", () => {
    setEvalDrawer(!isOpen);
  });

  useEffect(() => {
    if (!taskId) return;
    const getContext = async function () {
      const chatContext = await getChatContext({
        type: taskType,
        configId: taskId,
      });
      setContext(chatContext);
    };
    getContext();
  }, [taskId]);

  const emptyMessage = getTaskProperties(taskType).emptyChatMessage;
  const formattedType = getTaskProperties(taskType).formattedType;

  return (
    <Drawer open={isOpen} onOpenChange={setEvalDrawer}>
      <DrawerContent className="w-full h-[90%] px-4">
        <DrawerHeader>
          <DrawerTitle>Check your {formattedType}</DrawerTitle>
          <DrawerDescription>
            Test your {formattedType} before publishing.
          </DrawerDescription>
        </DrawerHeader>
        <div>
          <Chat
            apiPath={getStudentChatApiURL()}
            emptyMessage={emptyMessage}
            chatBody={{
              context,
              type: taskType,
              isTesting: true,
            }}
            type={taskType}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
