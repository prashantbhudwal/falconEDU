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
import { getTaskProperties } from "../../../../../../../../lib/helpers";
import { TaskType } from "@/types";
import { typeGetBotConfigByConfigId } from "@/lib/routers/botConfigRouter";
import { PublishButton } from "./publish-btn";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { getChatContext } from "@/app/dragon/student/bot/[botId]/chat/[id]/get-context";

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
  const isOpen = useAtomValue(evalDrawerAtom);
  const setEvalDrawer = useSetAtom(evalDrawerAtom);

  useHotkeys("ctrl+k", () => {
    setEvalDrawer(!isOpen);
  });

  const { data, isLoading } = useQuery({
    queryKey: ["chatContext", taskId, taskType, task],
    queryFn: () => getChatContext({ type: taskType, configId: taskId }),
    enabled: !!taskId && isOpen,
  });

  const context = data?.stringifiedContext;
  const emptyMessage = getTaskProperties(taskType).emptyChatMessage;
  const formattedType = getTaskProperties(taskType).formattedType;

  return (
    <Drawer open={isOpen} onOpenChange={setEvalDrawer}>
      <DrawerContent className="h-[90%] w-full px-4">
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
          {isOpen && !isLoading && (
            <Chat
              key={taskId}
              apiPath={getStudentChatApiURL()}
              emptyMessage={emptyMessage}
              chatBody={{
                context,
                type: taskType,
                isTesting: true,
              }}
              type={taskType}
              id={nanoid()}
              taskId={taskId}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
