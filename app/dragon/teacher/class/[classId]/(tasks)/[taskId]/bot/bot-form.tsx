"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/app/dragon/teacher/routers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { botNameSchema, botPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { FiInfo } from "react-icons/fi";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import { Paper } from "@/components/ui/paper";
import { Grade } from "@prisma/client";
import { LIMITS_botPreferencesSchema } from "../../../../../../schema";
import subjectsArray from "../../../../../../../data/subjects.json";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { Slider } from "@/components/ui/slider";
import { getHumourLevelFromNumber } from "@/lib/utils";
import { BsStars } from "react-icons/bs";
import TextAreaWithUpload from "../../_components/textAreaWithUpload";

const MAX_CHARS = LIMITS_botPreferencesSchema.instructions.maxLength;

const defaultValues: z.infer<typeof botPreferencesSchema> = {
  instructions: "",
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof botPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
  grade: Grade;
};

export default function BotPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig,
  grade,
}: BotPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const [botName, setBotName] = useState<string | undefined>(botConfig?.name);

  const form = useForm<z.infer<typeof botPreferencesSchema>>({
    resolver: zodResolver(botPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const isEmpty = preferences === null || preferences === undefined;

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
    const isValidName = botNameSchema.safeParse({ name: botName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length."
      ); // set the error message
      setBotName(botConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId,
      name: botName || "Bot Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBotName(e.target.value);
    const isValidName = botNameSchema.safeParse({ name: e.target.value });
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
            className="w-full max-w-5xl bg-base-200 min-h-screen"
          >
            <div className="flex justify-between flex-wrap px-5">
              <div className="w-[50%]">
                <Input
                  type="text"
                  value={botName}
                  onChange={onBotNameChange}
                  onBlur={updateBotNameHandler}
                  className="outline-none border-none md:text-xl pl-0 font-bold tracking-wide focus-visible:ring-0 "
                />
                {error && (
                  <div className="text-red-500 text-xs mt-3">{error}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
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
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-3 flex justify-between w-full align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    <div className="flex gap-2 items-center text-xs">
                      Instructions
                      <FiInfo />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="border border-input">
                      <TextAreaWithUpload
                        placeholder="Be polite with the students. Never use negative language."
                        className="bg-base-200"
                        {...field}
                        counter
                        maxChars={MAX_CHARS}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    How do you want the bot to behave?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humorLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="mb-3 flex gap-2 items-center text-xs font-bold">
                    Humor Level
                    <LightBulbIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[50]}
                      className="w-64 cursor-pointer"
                      max={100}
                      step={1}
                      onValueChange={(value) => {
                        const humourLevel = getHumourLevelFromNumber(value[0]);
                        form.setValue("humorLevel", humourLevel);
                      }}
                    />
                  </FormControl>
                  <div className="flex items-center gap-2 text-xs">
                    <BsStars /> {field.value}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Paper>
        </form>
      </Form>
    </>
  );
}

// Old fields -----------------------------
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
