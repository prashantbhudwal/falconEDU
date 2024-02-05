"use client";

import { Input } from "@/components/ui/input";
import { db } from "@/lib/routers";
import { ChangeEvent, useState } from "react";
import { ZodTypeAny } from "zod";

export function TaskName({
  initialName,
  taskNameSchema, // https://github.com/vercel/next.js/discussions/46795#discussioncomment-5248407
  classId,
  taskId,
  defaultName = "Untitled Task",
}: Readonly<{
  initialName: string;
  taskNameSchema: ZodTypeAny;
  classId: string;
  taskId: string;
  defaultName?: string;
}>) {
  const [error, setError] = useState<string | null>(null);
  const [taskName, setTaskName] = useState<string | undefined>(initialName);

  const updateBotNameHandler = async () => {
    const isValidName = taskNameSchema.safeParse({ name: taskName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Names should be between 3 and 30 characters in length.",
      );
      setTaskName(taskName);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId: taskId,
      name: taskName ?? defaultName,
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update task name. Please try again.");
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    const isValidName = taskNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Names should be between 3 and 30 characters in length.");
      return;
    }
    setError("");
  };

  return (
    <div className="w-[50%]">
      <Input
        type="text"
        value={taskName}
        onChange={onBotNameChange}
        onBlur={updateBotNameHandler}
        className="border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-3xl "
      />
      {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
    </div>
  );
}
