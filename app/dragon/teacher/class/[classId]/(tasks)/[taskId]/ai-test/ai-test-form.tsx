"use client";
import { Grade, type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/routers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { FiInfo } from "react-icons/fi";
import { Paper } from "@/components/ui/paper";
import subjectsArray from "../../../../../../../data/subjects.json";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import TextAreaWithUpload from "../../_components/textarea-with-upload";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { SubjectsField } from "../../_components/task-form/fields/subjects-old";
import { HumorLevelField } from "../../_components/task-form/fields/humor-level";
import { TopicField } from "../../_components/task-form/fields/topic";
import { SaveButton } from "../../_components/task-form/save-btn";
import {
  AITestNameSchema,
  AITestPreferenceSchema,
  LIMITS_AITestPreferencesSchema,
} from "@/lib/schema";

const MAX_CHARS = LIMITS_AITestPreferencesSchema.content.maxLength;

const defaultValues: z.infer<typeof AITestPreferenceSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
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
  const [inputFocus, setInputFocus] = useState("");
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

  const updateSubjectsHandler = () => {
    const gradeNumber = getFormattedGrade({
      grade,
      options: { numberOnly: true },
    });
    const gradeObject = subjectsArray.filter(
      (subject) => subject.grade === gradeNumber,
    )[0];
    return gradeObject.subjects;
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
            <div className="flex flex-wrap justify-between p-5">
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
            {/* ------------------------Content ------------------------- */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex w-full justify-between align-middle font-bold ${
                      inputFocus === "content" ? "text-white" : ""
                    }`}
                  >
                    <div className="flex gap-2">
                      Content
                      <FiInfo />
                    </div>
                  </FormLabel>
                  <FormProvider {...form}>
                    <FormControl className="rounded-md border border-input">
                      <TextAreaWithUpload
                        placeholder="Add any additional reference material"
                        counter
                        maxChars={MAX_CHARS}
                        required
                        hasDocUploader
                        setIsDirty={setIsDirty}
                        className="border-none bg-base-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormProvider>
                </FormItem>
              )}
            />

            <HumorLevelField name="humorLevel" />
          </Paper>
        </form>
      </Form>
    </>
  );
}

/**
 *  
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="mb-5 flex items-center gap-2 font-bold">
                    Tone
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-x-6 space-y-1"
                    >
                      {tone.map((tone) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={tone}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={tone}
                              className=" transition-all duration-200 hover:scale-[1.2] active:scale-90"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{tone}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 *  <FormField
              control={form.control}
              name="languageProficiency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 font-bold">
                    Language Proficiency
                    <LanguageIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-x-6 space-y-1"
                    >
                      {languageProficiency.map((languageProficiency) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={languageProficiency}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={languageProficiency}
                              className=" transition-all duration-200 hover:scale-[1.2] active:scale-90"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {languageProficiency}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 * 
 */
