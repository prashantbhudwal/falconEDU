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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-form";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/ui/chip";
import {
  lessonPreferencesSchema,
  lessonNameSchema,
} from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { FiInfo } from "react-icons/fi";
import { FiBookOpen } from "react-icons/fi";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import { Paper } from "@/components/ui/paper";
import {
  grades,
  board,
  languageProficiency,
  tone,
  humorLevel,
  subjects,
  LIMITS_lessonPreferencesSchema,
} from "../../../../../../schema";
import subjectsArray from "../../../../../../../data/subjects.json";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import TextAreaWithUpload from "../../_components/textAreaWithUpload";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import ComboBox from "@/components/combobox";

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
    taskConfig?.name
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

  const updateSubjectsHandler = () => {
    const gradeNumber = getFormattedGrade({
      grade,
      options: { numberOnly: true },
    });
    const gradeObject = subjectsArray.filter(
      (subject) => subject.grade === gradeNumber
    )[0];
    return gradeObject.subjects;
  };

  const updateBotNameHandler = async () => {
    const isValidName = lessonNameSchema.safeParse({ name: lessonName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length."
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
          <Paper variant="gray" className="w-full max-w-5xl bg-base-200">
            <div className="flex justify-between flex-wrap p-5">
              <div className="w-[50%]">
                <Input
                  type="text"
                  value={lessonName}
                  onChange={onBotNameChange}
                  onBlur={updateBotNameHandler}
                  className="outline-none border-none md:text-3xl pl-0 font-bold tracking-wide focus-visible:ring-0 "
                />
                {error && (
                  <div className="text-red-500 text-sm mt-3">{error}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex flex-row gap-6">
                  <Button
                    type="submit"
                    disabled={(isEmpty && !isDirty) || !isDirty}
                  >
                    {loading ? "Saving" : isDirty ? "Save" : "Saved"}
                  </Button>
                </div>
                {isDirty && (
                  <div className="text-sm text-slate-500">
                    You have unsaved changes.
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            {/* ------------------------Topic ------------------------- */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex justify-between w-full align-middle font-bold ${
                      inputFocus === "topic" ? "text-white" : ""
                    }`}
                  >
                    <div className="flex gap-2">
                      Topic
                      <FiInfo />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Topic you want to teach. For multiple topics, separate them with commas."
                      {...field}
                      onFocus={() => setInputFocus("topic")}
                      onBlur={() => setInputFocus("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ------------------------Content ------------------------- */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex justify-between w-full align-middle font-bold ${
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
                        className="bg-base-200 border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormProvider>
                </FormItem>
              )}
            />

            {/* ------------------------Subjects List ------------------------- */}

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => {
                return (
                  <FormProvider {...form}>
                    <FormItem>
                      <div className="mb-5 flex flex-col gap-2">
                        <FormLabel className="flex gap-2 items-center font-bold">
                          Subjects
                          <FiBookOpen />
                        </FormLabel>
                      </div>
                      <div className="flex flex-row gap-y-5 flex-wrap gap-x-6 ">
                        <ComboBox
                          {...field}
                          items={updateSubjectsHandler()}
                          placeholder="Search subject ..."
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormProvider>
                );
              }}
            />

            {/* ------------------------Tone ------------------------- */}
            {/* <FormField
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
            /> */}
            {/* ------------------------Language ------------------------- */}
            <FormField
              control={form.control}
              name="humorLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="mb-5 flex gap-2 items-center font-bold">
                    Humor Level
                    <LightBulbIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {humorLevel.map((humorLevel) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={humorLevel}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={humorLevel}
                              className=" active:scale-90 transition-all duration-200 hover:scale-[1.2]"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {humorLevel}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ------------------------Language ------------------------- */}
            {/* <FormField
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
            /> */}
          </Paper>
        </form>
      </Form>
    </>
  );
}
