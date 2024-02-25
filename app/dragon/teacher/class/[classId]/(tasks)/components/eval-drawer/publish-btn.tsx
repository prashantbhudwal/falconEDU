"use client";

import { BotConfig } from "@prisma/client";
import { useConfigPublishing } from "@/app/dragon/teacher/hooks/use-config-publishing";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { AlertDialogComponent } from "../../[taskId]/test/components/alertDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { useEffect, useState } from "react";
import { TaskType } from "@/types";
import { evalDrawerAtom } from "@/lib/atoms/ui";
import { useSetAtom } from "jotai";

export const PublishButton = function ({
  task: initialTask,
  classId,
  cancelPublish,
  isEmptyTest,
}: {
  task: BotConfig;
  classId: string;
  cancelPublish: boolean;
  isEmptyTest: boolean;
}) {
  const setEvalDrawer = useSetAtom(evalDrawerAtom);
  const [task, SetTask] = useState<BotConfig>(initialTask);
  const [hover, setHover] = useState(false);
  const isPublished = task.published;
  const taskId = task.id;
  const type = task.type as TaskType;
  const { Icon, iconColor, formattedType } = getTaskProperties(type);

  const {
    onPublish,
    onUnPublish,
    loading,
    error: publishingError,
    config: updatedTask,
  } = useConfigPublishing({
    classId,
    botId: taskId,
    type,
  });

  useEffect(() => {
    if (updatedTask) {
      SetTask(updatedTask);
      setEvalDrawer(false);
    }
  }, [updatedTask, taskId, publishingError]);

  const title = isPublished
    ? `Unpublish ${formattedType}`
    : `Publish ${formattedType}`;
  const description = isPublished
    ? `Unpublishing will make the ${formattedType} unavailable for all students.`
    : `Publishing will make the ${formattedType} available for all students.`;
  const action = isPublished ? onUnPublish : onPublish;

  if ((cancelPublish || isEmptyTest) && !isPublished) {
    const description = isEmptyTest
      ? "The test cannot be empty. Please add some questions before publishing."
      : "The test cannot exceed 10 questions. Please delete some questions before publishing.";
    return (
      <AlertDialogComponent title="Alert" description={description}>
        <Button
          type="button"
          variant={"default"}
          size="sm"
          className={cn({
            "text-primary hover:bg-destructive ": isPublished,
          })}
          disabled={loading}
        >
          Publish
        </Button>
      </AlertDialogComponent>
    );
  }
  return (
    <>
      {task.isActive && (
        <ClassDialog
          title={title}
          description={description}
          action={action}
          trigger={
            <Button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              type="button"
              variant={isPublished ? "outline" : "default"}
              size="sm"
              className={cn({
                "text-primary hover:bg-destructive ": isPublished,
              })}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isPublished
                  ? "Unpublish"
                  : "Publish"}
            </Button>
          }
        />
      )}
    </>
  );
};
