"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Paper } from "@/components/ui/paper";
import { Grade } from "@prisma/client";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import TextAreaWithUpload from "../../_components/textAreaWithUpload";
import endent from "endent";
import { HumorLevelField } from "../../_components/form/humor-level";
import { SaveButton } from "../../_components/form/save-btn";
import {
  LIMITS_botPreferencesSchema,
  botNameSchema,
  botPreferencesSchema,
} from "@/lib/schema";

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

  //log the form values

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

  const updateBotNameHandler = async () => {
    const isValidName = botNameSchema.safeParse({ name: botName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length.",
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
            className="min-h-screen w-full max-w-5xl space-y-12 border-none pt-12 shadow-none"
          >
            <div className="flex min-h-14 flex-wrap justify-between">
              <div className="w-[50%]">
                <Input
                  type="text"
                  value={botName}
                  onChange={onBotNameChange}
                  onBlur={updateBotNameHandler}
                  className="border-none pl-0 text-xl font-bold tracking-wide outline-none focus-visible:ring-0  "
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
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-3 flex w-full justify-between align-middle${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    How do you want the bot to behave?
                  </FormLabel>
                  <FormControl>
                    <div className="border border-input">
                      <TextAreaWithUpload
                        placeholder={endent`Your name is Sporty, the sports teacher. You make students excited about sports. 
                        
                        - Be polite with the students. 
                        - Never use negative language.
                        - Use positive reinforcement.
                         `}
                        className="bg-base-200"
                        {...field}
                        counter
                        maxChars={MAX_CHARS}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
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
