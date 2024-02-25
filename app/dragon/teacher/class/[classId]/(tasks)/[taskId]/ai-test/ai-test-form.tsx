"use client";
import { generateLearningGoalsWithAI } from "@/app/dragon/ai/tasks/ai-test/goals-generator";
import { Processing } from "@/components/loading/processing";
import { Form } from "@/components/ui/form";
import { Paper } from "@/components/ui/paper";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { db } from "@/lib/routers";
import {
  AITestNameSchema,
  AITestPreferenceSchema,
  LIMITS_AITestPreferencesSchema,
} from "@/lib/schema";
import { getGptGenerationTime } from "@/lib/utils";
import { TaskType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade, type BotConfig } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MediumOfInstructionField } from "../../components/task-form";
import { MagicContentField } from "../../components/task-form/fields/magic-content";
import { HumorLevelField } from "../../components/task-form/fields/humor-level";
import { SubjectsField } from "../../components/task-form/fields/subjects-old";
import { TaskName } from "../../components/task-form/fields/task-name";
import { TopicField } from "../../components/task-form/fields/topic";
import { SaveButton } from "../../components/task-form/save-btn";
import { EquationsField } from "../../components/task-form/fields/equations";

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
  hasEquations: false,
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
  const taskType: TaskType = "ai-test";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEmpty = preferences === null || preferences === undefined;
  const form = useForm<z.infer<typeof AITestPreferenceSchema>>({
    resolver: zodResolver(AITestPreferenceSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (data: z.infer<typeof AITestPreferenceSchema>) => {
    setLoading(true);
    const { content } = data;
    try {
      const learningGoals = await generateLearningGoalsWithAI({ content });
      if (learningGoals) {
        const [updatedGoals, updatedConfig] = await Promise.all([
          db.learningGoals.saveLearningGoals({
            configId: taskId,
            learningGoals,
          }),
          db.botConfig.updateTaskConfig({
            classId,
            botId: taskId,
            data,
            configType: taskType,
          }),
        ]);
        setError("");
        setIsDirty(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const approxGenerationTime = getGptGenerationTime(
    form.watch("content").length || 1,
    "GPT3",
  );

  return (
    <Form {...form}>
      {loading && (
        <Processing
          steps={[
            {
              seconds: Math.ceil(approxGenerationTime * 0.2),
              step: "Sending the content to AI.",
            },
            {
              seconds: Math.ceil(approxGenerationTime * 0.6),
              step: "AI is learning from the content",
            },
            {
              seconds: Math.ceil(approxGenerationTime * 0.2),
              step: "AI is generating the learning goals",
            },
          ]}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Paper
          variant="gray"
          className="w-full max-w-5xl space-y-8 bg-base-200"
        >
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
          <MagicContentField
            classId={classId}
            grade={grade}
            name="content"
            maxChars={MAX_CHARS}
            placeholder="Enter manually"
            className="bg-base-200"
            type={taskType}
          />
          <MediumOfInstructionField name="mediumOfInstruction" />
          <EquationsField name="hasEquations" />
          <HumorLevelField name="humorLevel" />
        </Paper>
      </form>
    </Form>
  );
}
