"use client";
import { Grade, type BotConfig } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/routers";
import { Form } from "@/components/ui/form";
import { Paper } from "@/components/ui/paper";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
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
import { generateLearningGoals } from "@/app/dragon/ai/tasks/ai-test/goals-generator";
import { LearningGoals } from "@/app/dragon/ai/tasks/ai-test/goals-generator/model";
import { TaskName } from "../../_components/task-form/fields/task-name";

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
  const isEmpty = preferences === null || preferences === undefined;
  const form = useForm<z.infer<typeof AITestPreferenceSchema>>({
    resolver: zodResolver(AITestPreferenceSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const getLearningGoals = async (
    content: z.infer<(typeof AITestPreferenceSchema)["shape"]["content"]>,
  ) => {
    const { goals, error, message } = await generateLearningGoals({ content });
    if (error || !goals) {
      setError(message);
      return;
    }
    return goals;
  };

  const saveLearningGoals = async (goals: LearningGoals) => {
    await db.learningGoals.createLearningGoals({
      configId: taskId,
      learningGoals: goals,
    });
  };

  const onSubmit = async (data: z.infer<typeof AITestPreferenceSchema>) => {
    setLoading(true);
    const { content } = data;
    const goals = await getLearningGoals(content);

    if (goals) {
      const test = await saveLearningGoals(goals);
    }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Paper variant="gray" className="w-full max-w-5xl bg-base-200">
          <div className="flex flex-wrap justify-between ">
            <TaskName
              initialName={taskConfig?.name || "AI Test Preferences"}
              taskNameSchema={AITestNameSchema}
              classId={classId}
              taskId={taskId}
            />
            <SaveButton
              isLoading={loading}
              isDisabled={(isEmpty && !isDirty) || !isDirty}
              hasUnsavedChanges={isDirty}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
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
  );
}
