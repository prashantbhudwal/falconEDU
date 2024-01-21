"use client";
import { Grade, type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/app/dragon/teacher/routers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  lessonPreferencesSchema,
  lessonNameSchema,
} from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { FiInfo } from "react-icons/fi";
import { Paper } from "@/components/ui/paper";
import { LIMITS_lessonPreferencesSchema } from "../../../../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import TextAreaWithUpload from "../../_components/textAreaWithUpload";
import { HumorLevelField } from "../../_components/form/humor-level";
import { SubjectsField } from "../../_components/form/subjects-old";
import { TopicField } from "../../_components/form/topic";
const MAX_CHARS = LIMITS_lessonPreferencesSchema.content.maxLength;

const defaultValues: z.infer<typeof lessonPreferencesSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const [lessonName, setLessonName] = useState<string | undefined>(
    taskConfig?.name,
  );

  const form = useForm<z.infer<typeof lessonPreferencesSchema>>({
    resolver: zodResolver(lessonPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const isEmpty = preferences === null || preferences === undefined;

  const onSubmit = async (data: z.infer<typeof lessonPreferencesSchema>) => {
    setLoading(true);
    const result = await db.botConfig.updateBotConfig({
      classId,
      botId: taskId,
      data,
      configType: "lesson",
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Paper
            variant="gray"
            className="min-h-screen w-full max-w-5xl space-y-12 bg-base-200"
          >
            <div className="flex flex-wrap justify-between px-5">
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
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-row gap-6">
                  <Button
                    type="submit"
                    className="text-xs"
                    size={"sm"}
                    disabled={(isEmpty && !isDirty) || !isDirty}
                  >
                    {loading ? "Saving" : isDirty ? "Save" : "Saved"}
                  </Button>
                </div>
                {isDirty && (
                  <div className="text-xs text-slate-500">
                    You have unsaved changes.
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <TopicField name="topic" />
            <SubjectsField name="subjects" grade={grade} />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-3 flex w-full justify-between align-middle font-bold ${
                      inputFocus === "content" ? "text-white" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      Content
                      <FiInfo />
                    </div>
                  </FormLabel>
                  <FormProvider {...form}>
                    <FormControl className="rounded-md">
                      <div className="border border-input">
                        <TextAreaWithUpload
                          placeholder="Add any additional reference material"
                          counter
                          maxChars={MAX_CHARS}
                          required
                          hasDocUploader
                          setIsDirty={setIsDirty}
                          className="bg-base-200"
                          {...field}
                        />
                      </div>
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

/* ------------------------Tone ------------------------- */

/* <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="mb-5 flex gap-2 items-center font-bold">
                    Tone
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {tone.map((tone) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={tone}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={tone}
                              className=" active:scale-90 transition-all duration-200 hover:scale-[1.2]"
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
            /> */

/* ------------------------Language ------------------------- */

/* <FormField
              control={form.control}
              name="languageProficiency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex gap-2 items-center font-bold">
                    Language Proficiency
                    <LanguageIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {languageProficiency.map((languageProficiency) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={languageProficiency}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={languageProficiency}
                              className=" active:scale-90 transition-all duration-200 hover:scale-[1.2]"
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
            /> */
