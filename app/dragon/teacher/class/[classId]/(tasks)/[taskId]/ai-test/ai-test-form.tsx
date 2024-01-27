"use client";
import { Grade, type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/routers";
import { Form } from "@/components/ui/form";
import { Paper } from "@/components/ui/paper";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { SubjectsField } from "../../_components/task-form/fields/subjects-old";
import { HumorLevelField } from "../../_components/task-form/fields/humor-level";
import { TopicField } from "../../_components/task-form/fields/topic";
import { SaveButton } from "../../_components/task-form/save-btn";
import {
  AITestNameSchema,
  AITestPreferenceSchema,
  LIMITS_AITestPreferencesSchema,
} from "@/lib/schema";
import { MediumOfInstructionField } from "../../_components/task-form";
import { TextAreaField } from "../../_components/task-form/fields/textarea";

const MAX_CHARS = LIMITS_AITestPreferencesSchema.content.maxLength;

const defaultValues: z.infer<typeof AITestPreferenceSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
};

type AITestFormProps = {
  preferences?: z.infer<typeof AITestPreferenceSchema>;
  classId: string;
  taskId: string;
  taskConfig: BotConfig | null;
  grade: Grade;
};

export default function AITestForm({
  preferences,
  classId,
  taskId,
  taskConfig,
  grade,
}: AITestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [AITestName, setAITestName] = useState<string | undefined>(
    taskConfig?.name,
  );

  const form = useForm<z.infer<typeof AITestPreferenceSchema>>({
    resolver: zodResolver(AITestPreferenceSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const isEmpty = preferences === null || preferences === undefined;

  const onSubmit = async (data: z.infer<typeof AITestPreferenceSchema>) => {
    setLoading(true);
    const result = await db.botConfig.updateBotConfig({
      classId,
      botId: taskId,
      data,
      configType: "ai-test",
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

  const updateBotNameHandler = async () => {
    const isValidName = AITestNameSchema.safeParse({ name: AITestName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Names should be between 3 and 30 characters in length.",
      ); // set the error message
      setAITestName(taskConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId: taskId,
      name: AITestName || "AI Test Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAITestName(e.target.value);
    const isValidName = AITestNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Warning: Message length is out of the 3-30 character limit."); // set the error message
      return;
    }
    setError("");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Paper variant="gray" className="w-full max-w-5xl bg-base-200">
            <div className="flex flex-wrap justify-between ">
              <div className="w-[50%]">
                <Input
                  type="text"
                  value={AITestName}
                  onChange={onBotNameChange}
                  onBlur={updateBotNameHandler}
                  className="border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-3xl "
                />
                {error && (
                  <div className="mt-3 text-sm text-red-500">{error}</div>
                )}
              </div>
              <SaveButton
                isLoading={loading}
                isDisabled={(isEmpty && !isDirty) || !isDirty}
                hasUnsavedChanges={isDirty}
              />
            </div>
            <TopicField name="topic" />
            <SubjectsField name="subjects" grade={grade} />
            <TextAreaField
              name="content"
              maxChars={MAX_CHARS}
              placeholder="Add any additional reference material"
              label="Content"
            />
            <MediumOfInstructionField name="mediumOfInstruction" />
            <HumorLevelField name="humorLevel" />
          </Paper>
        </form>
      </Form>
    </>
  );
}
