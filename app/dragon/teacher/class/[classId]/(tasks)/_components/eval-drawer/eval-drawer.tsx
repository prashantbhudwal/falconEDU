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
import { getTaskProperties } from "../../../../../utils";
import {
  getAITestContextByConfigId,
  getChatContextByConfigId,
  getLessonContextByConfigId,
  getTestQuestionsByBotConfigId,
} from "./queries";
import { useEffect, useState } from "react";
import { TaskType } from "@/types";

import { typeGetBotConfigByConfigId } from "@/app/dragon/teacher/routers/botConfigRouter";
import { PublishButton } from "./publish-btn";
import { Separator } from "@/components/ui/separator";

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
    case "ai-test":
      const aiTestContext = await getAITestContextByConfigId({
        configId: configId,
      });
      return JSON.stringify(aiTestContext);
    default:
      throw new Error("Invalid type");
  }
};

export function EvalDrawer({
  taskId,
  taskType,
  classId,
  userId,
  task,
  totalParsedQuestions,
}: {
  taskId: string;
  taskType: TaskType;
  classId: string;
  userId: string;
  task: NonNullable<typeGetBotConfigByConfigId>;
  totalParsedQuestions: number | undefined;
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
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-2">
            <DrawerTitle>Check what students see.</DrawerTitle>
            <DrawerDescription className="">
              Check your {formattedType.toLocaleLowerCase()} before publishing.
            </DrawerDescription>
          </div>
          <PublishButton
            task={task}
            classId={classId}
            cancelPublish={Number(totalParsedQuestions) > 10}
            isEmptyTest={
              task.type === "test" &&
              (Number(totalParsedQuestions) === 0 || !totalParsedQuestions)
            }
          />
        </DrawerHeader>
        <Separator />
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
