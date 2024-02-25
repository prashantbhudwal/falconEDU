"use client";
import React, { useState, ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { db } from "@/lib/routers";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BotConfig } from "@prisma/client";
import { z } from "zod";
import { botNameSchema, botPreferencesSchema } from "@/lib/schema";

type TaskHeaderProps = {
  taskConfig: BotConfig | null;
  classId: string;
  botId: string;
};

export const TaskHeader = ({ classId, botId, taskConfig }: TaskHeaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useFormContext();
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const [taskName, setTaskName] = useState<string | undefined>(
    taskConfig?.name,
  );

  const onSubmit = async (data: z.infer<typeof botPreferencesSchema>) => {
    setLoading(true);
    const result = await db.botConfig.updateBotConfig({
      classId,
      botId,
      data,
      configType: "chat",
    });
    setLoading(false);
    if (result.success) {
      setIsDirty(false);
      setError(null); // clear any existing error
    } else {
      console.error("Update failed:", result.error);
      setError("Failed to update bot config. Please try again."); // set the error message
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    const isValidName = botNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Warning: Message length is out of the 3-30 character limit."); // set the error message
      return;
    }
    setError("");
  };

  const updateBotNameHandler = async () => {
    const isValidName = botNameSchema.safeParse({ name: taskName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length.",
      ); // set the error message
      setTaskName(taskConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId,
      name: taskName || "Bot Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  return (
    <div className="flex flex-wrap justify-between p-5">
      <div className="w-[50%]">
        <Input
          type="text"
          value={taskName}
          onChange={onBotNameChange}
          onBlur={updateBotNameHandler}
          className="border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-3xl"
        />
        {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-row gap-6">
          <Button
            type="submit"
            disabled={loading || !isDirty}
            // onClick={form.handleSubmit(onSubmit)}
          >
            {loading ? "Saving" : "Save"}
          </Button>
        </div>
        {isDirty && (
          <div className="text-sm text-slate-500">Unsaved changes</div>
        )}
      </div>
    </div>
  );
};
