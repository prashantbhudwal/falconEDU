"use client";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/ui/paper";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { db } from "@/lib/routers";
import {
  LIMITS_lessonPreferencesSchema,
  lessonNameSchema,
  lessonPreferencesSchema,
} from "@/lib/schema";
import { TaskType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade, type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MediumOfInstructionField } from "../../components/task-form";
import { MagicContentField } from "../../components/task-form/fields/magic-content";
import { HumorLevelField } from "../../components/task-form/fields/humor-level";
import { SubjectsField } from "../../components/task-form/fields/subjects-old";
import { TopicField } from "../../components/task-form/fields/topic";
import { VideoField } from "../../components/task-form/fields/videos";
import { SaveButton } from "../../components/task-form/save-btn";
import { EquationsField } from "../../components/task-form/fields/equations";
const MAX_CHARS = LIMITS_lessonPreferencesSchema.content.maxLength;

const defaultValues: z.infer<typeof lessonPreferencesSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
  videos: [],
  hasEquations: false,
};

type LessonFormProps = {
  preferences?: z.infer<typeof lessonPreferencesSchema>;
  classId: string;
  taskId: string;
  taskConfig: BotConfig | null;
  grade: Grade;
};

export default function LessonForm({
  preferences,
  classId,
  taskId,
  taskConfig,
  grade,
}: LessonFormProps) {
  const taskType: TaskType = "lesson";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonName, setLessonName] = useState<string | undefined>(
    taskConfig?.name,
  );

  const form = useForm<z.infer<typeof lessonPreferencesSchema>>({
    resolver: zodResolver(lessonPreferencesSchema),
    defaultValues: preferences || defaultValues,
    mode: "onBlur",
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const isEmpty = preferences === null || preferences === undefined;

  const onSubmit = async (data: z.infer<typeof lessonPreferencesSchema>) => {
    setLoading(true);
    const result = await db.botConfig.updateBotConfig({
      classId,
      botId: taskId,
      data,
      configType: taskType,
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
    const isValidName = lessonNameSchema.safeParse({ name: lessonName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length.",
      ); // set the error message
      setLessonName(taskConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId: taskId,
      name: lessonName || "Lesson Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLessonName(e.target.value);
    const isValidName = lessonNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Warning: Message length is out of the 3-30 character limit."); // set the error message
      return;
    }
    setError("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Paper
          variant="gray"
          className="min-h-screen w-full max-w-5xl space-y-8  bg-base-200"
        >
          <div className="flex flex-wrap justify-between">
            <div className="w-[50%]">
              <Input
                type="text"
                value={lessonName}
                onChange={onBotNameChange}
                onBlur={updateBotNameHandler}
                className="border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-xl "
              />
              {error && (
                <div className="mt-3 text-xs text-red-500">{error}</div>
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
          <MagicContentField
            classId={classId}
            grade={grade}
            name="content"
            maxChars={MAX_CHARS}
            placeholder="Enter manually"
            className="bg-base-200"
            type={taskType}
          />
          <VideoField name="videos" />
          <EquationsField name="hasEquations" />
          <div className="grid grid-cols-6 gap-2">
            <MediumOfInstructionField
              name="mediumOfInstruction"
              className="col-span-3 col-start-1"
            />
            <HumorLevelField
              name="humorLevel"
              className="col-span-3 col-start-4"
            />
          </div>
        </Paper>
      </form>
    </Form>
  );
}
