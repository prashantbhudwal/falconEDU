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
import { generateLearningGoalsWithAI } from "@/app/dragon/ai/tasks/ai-test/goals-generator";
import { TaskName } from "../../_components/task-form/fields/task-name";
import { getGptGenerationTime } from "@/lib/utils";
import { Processing } from "@/components/loading/processing";

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

  const onSubmit = async (data: z.infer<typeof AITestPreferenceSchema>) => {
    setLoading(true);
    const { content } = data;
    try {
      const learningGoals = await generateLearningGoalsWithAI({ content });
      if (learningGoals) {
        const updatedGoals = await db.learningGoals.saveLearningGoals({
          configId: taskId,
          learningGoals,
        });
        const updatedConfig = await db.botConfig.updateTaskConfig({
          classId,
          botId: taskId,
          data,
          configType: "ai-test",
        });
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
