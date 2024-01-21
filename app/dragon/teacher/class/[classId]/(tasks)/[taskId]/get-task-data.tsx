import { isNonEmptyObject } from "@/app/dragon/teacher/utils";
import { db } from "@/lib/routers";
import { TaskType } from "@/types";
import { z } from "zod";

export const getTaskData = async <Schema extends z.ZodType<any, any>>({
  taskId,
  taskType,
  schema,
}: {
  taskId: string;
  taskType: TaskType;
  schema: Schema;
}) => {
  const data = await db.botConfig.fetchConfigAndPreferences({
    configId: taskId,
    type: taskType,
  });

  const preferences = isNonEmptyObject(data?.preferences)
    ? (data?.preferences as z.infer<typeof schema>)
    : undefined;

  const config = data?.config;
  if (!config) {
    throw new Error("Bot config not found");
  }
  const Class = data.config?.Class;

  if (!Class) {
    throw new Error("Class not found");
  }

  const grade = Class.grade;

  return { preferences, config, grade };
};
