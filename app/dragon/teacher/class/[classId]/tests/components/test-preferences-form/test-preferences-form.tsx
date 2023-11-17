"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveParsedQuestions } from "../../../../../mutations";
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
import {
  botNameSchema,
  testBotPreferencesSchema,
} from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { FiInfo } from "react-icons/fi";
import { LIMITS_testBotPreferencesSchema } from "../../../../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { getTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { useConfigPublishing } from "../../../../../hooks/use-config-publishing";
const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
const defaultValues: z.infer<typeof testBotPreferencesSchema> = {
  fullTest:
    "Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you. ",
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof testBotPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
};

export default function TestPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig: config,
}: BotPreferencesFormProps) {
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const [testName, setTestName] = useState<string | undefined>(config?.name);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(config);

  const {
    onPublish,
    onUnPublish,
    error: publishingError,
    config: updatedConfig,
  } = useConfigPublishing({
    classId,
    botId,
  });
  //TODO: This is a bad idea. We should not be using useEffect to update state.
  useEffect(() => {
    if (updatedConfig) {
      setBotConfig(updatedConfig);
    }
  }, [updatedConfig]);

  if (publishingError) {
    setError(publishingError);
  }

  if (!testBotPreferencesSchema.safeParse(config?.preferences)) {
    setError("Failed to parse bot preferences. Please try again.");
  }

  const form = useForm<z.infer<typeof testBotPreferencesSchema>>({
    resolver: zodResolver(testBotPreferencesSchema),
    defaultValues:
      (config?.preferences as {
        fullTest: string;
      }) || {},
  });
  const isFormEmpty =
    !form.getValues().fullTest ||
    form.getValues().fullTest === defaultValues.fullTest;

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    setLoading(true);
    const { questions, hasQuestions, hasAnswers } = await getTestQuestions(
      data.fullTest
    );
    if (!hasQuestions || !hasAnswers) {
      const errorMessage = !hasQuestions
        ? "No questions provided. Please provide the questions and answers."
        : "No answers provided. Please provide the answers.";
      setError(errorMessage);
      setLoading(false);
      return;
    }
    if (!questions) {
      setLoading(false);
      setError(
        "No questions provided. Please provide the questions and answers."
      );
      return;
    }
    setParsedQuestions(questions);
    const response = await saveParsedQuestions(questions, botId);
    const updateBotConfigResult = await db.botConfig.updateBotConfig({
      classId,
      botId,
      data,
      configType: "test",
    });
    setLoading(false);
    if (response.success && updateBotConfigResult.success) {
      setError(null); // clear any existing error
      setIsDirty(false);
    } else {
      setError("Failed to update bot config. Please try again."); // set the error message
    }
  };

  const updateTestNameHandler = async () => {
    const isValidName = botNameSchema.safeParse({ name: testName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length."
      ); // set the error message
      setTestName(botConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId,
      name: testName || "Test Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  const onTestNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTestName(e.target.value);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full max-w-5xl min-h-screen">
            <div className="flex justify-between flex-wrap p-5">
              <div>
                <Input
                  type="text"
                  value={testName}
                  onChange={onTestNameChange}
                  onBlur={updateTestNameHandler}
                  required
                  className="outline-none border-none pl-0 md:text-3xl font-bold tracking-wide focus-visible:ring-0 "
                />
                {error && (
                  <div className="text-red-500 text-sm mt-3">{error}</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-6">
                  <Button type="submit" disabled={loading || !isDirty}>
                    {loading ? "Saving" : isDirty ? "Save" : "Saved"}
                  </Button>

                  <Button
                    disabled={isFormEmpty && !isDirty}
                    variant={botConfig?.published ? "destructive" : "secondary"}
                    onClick={botConfig?.published ? onUnPublish : onPublish}
                  >
                    {botConfig?.published ? "Un-publish" : "Publish"}
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
            <FormField
              control={form.control}
              name="fullTest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex gap-2 align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    Instructions
                    <FiInfo />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none h-96"
                      {...field}
                      onFocus={() => setInputFocus("instructions")}
                      onBlur={() => setInputFocus("")}
                      hasCounter
                      maxChars={MAX_CHARS}
                      required
                      placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you. "
                    />
                  </FormControl>
                  <FormDescription>
                    {"Don't forget to provide answers."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      {/* Displaying parsed questions for testing  */}
      <Separator />
      <div className="bg-base-200">
        {parsedQuestions.map((question, index) => (
          <div key={index}>{question.question}</div>
        ))}
      </div>
    </>
  );
}
