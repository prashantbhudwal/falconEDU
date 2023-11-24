"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
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
import { parseTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { useConfigPublishing } from "../../../../../hooks/use-config-publishing";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { TestParsedQuestion } from "./test-parsed-questions";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
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
  parsedQuestions: typeGetParsedQuestionByBotConfigId;
  isActive: boolean;
};

export default function TestPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig: config,
  parsedQuestions: parsedQuestionFromDb,
  isActive,
}: BotPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const [testName, setTestName] = useState<string | undefined>(config?.name);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(config);
  const [questions, setQuestions] =
    useState<typeGetParsedQuestionByBotConfigId>(parsedQuestionFromDb);
  const [isArchived, setIsArchived] = useState(!isActive);

  const {
    onPublish,
    onUnPublish,
    error: publishingError,
    config: updatedConfig,
  } = useConfigPublishing({
    classId,
    botId,
  });

  const getParsedQuestions = async () => {
    const response =
      await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
        botConfigId: botId,
      });
    if (response) {
      setQuestions(response);
    }
  };

  //TODO: This is a bad idea. We should not be using useEffect to update state.
  useEffect(() => {
    if (updatedConfig) {
      setBotConfig(updatedConfig);
    }
    if (publishingError) {
      setError(publishingError);
    }
  }, [updatedConfig, botId, publishingError]);

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

  // --------------------------------------------- On Parsing ----------------------------------------------------------------
  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    setLoading(true);
    const { parsedQuestions, hasQuestions, hasAnswers } =
      await parseTestQuestions(data.fullTest);
    if (!hasQuestions || !hasAnswers) {
      const errorMessage = !hasQuestions
        ? "No questions provided. Please provide the questions and answers."
        : "No answers provided. Please provide the answers.";
      setError(errorMessage);
      setLoading(false);
      return { success: false };
    }
    if (!parsedQuestions) {
      setLoading(false);
      setError(
        "No questions provided. Please provide the questions and answers."
      );
      return { success: false };
    }
    const response = await saveParsedQuestions({
      parsedQuestions,
      botId,
      classId,
    });
    const updateBotConfigResult = await db.botConfig.updateBotConfig({
      classId,
      botId,
      data,
      configType: "test",
    });
    setLoading(false);
    if (response.success && updateBotConfigResult.success) {
      //calling this function to update the state of questions after successfully saving to database
      await getParsedQuestions();
      setError(null); // clear any existing error
      setIsDirty(false);
      return { success: true };
    } else {
      setError("Failed to update bot config. Please try again."); // set the error message
      return { success: false };
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

  const archiveHandler = async (type: string) => {
    setError("");
    if (type === "archive") {
      const { success } = await db.bot.archiveAllBotsOfBotConfig(botId);
      if (success) {
        setIsArchived(true);
        return;
      }
      setError("Can't archive Test");
    }
    if (type === "unarchive") {
      const { success } = await db.bot.unArchiveAllBotsOfBotConfig(botId);
      if (success) {
        setIsArchived(false);
        return;
      }
      setError("Can't unarchive Test");
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* -------------------------------------- Form Header-------------------------------- */}
            <div className="flex justify-between flex-wrap p-5">
              <div>
                <Input
                  type="text"
                  value={testName}
                  onChange={onTestNameChange}
                  onBlur={updateTestNameHandler}
                  required
                  className="outline-none border-none pl-0 md:text-2xl font-bold tracking-wide focus-visible:ring-0 "
                />
                {error && (
                  <div className="text-red-500 text-sm mt-3">{error}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-3">
                  {isArchived ? (
                    <Button
                      onClick={() => archiveHandler("unarchive")}
                      type="button"
                      className="gap-1"
                    >
                      <LuArchiveRestore /> Unarchive
                    </Button>
                  ) : (
                    <Button
                      onClick={() => archiveHandler("archive")}
                      className="gap-1"
                      type="button"
                      variant="destructive"
                    >
                      <LuArchive />
                      Archive
                    </Button>
                  )}
                  {!questions && (
                    <Button
                      type="submit"
                      disabled={loading || !isDirty}
                      className="min-w-[100px]"
                    >
                      {loading ? (
                        <span className="loading loading-infinity loading-sm"></span>
                      ) : isDirty ? (
                        "Save"
                      ) : (
                        "Saved"
                      )}
                    </Button>
                  )}
                  {questions && !isArchived && (
                    <>
                      {botConfig?.published ? (
                        <ClassDialog
                          title="Un-publish Test"
                          description="Completing this action will render the Test inactive."
                          action={onUnPublish}
                          trigger={
                            <Button
                              // disabled={isFormEmpty && !isDirty}
                              type="button"
                              variant="destructive"
                            >
                              Un-publish
                            </Button>
                          }
                        />
                      ) : (
                        <ClassDialog
                          title="Publish Test"
                          description="This action will make the Test available to all students in the class."
                          action={onPublish}
                          trigger={
                            <Button
                              // disabled={isFormEmpty && !isDirty}
                              type="button"
                              variant="secondary"
                            >
                              Publish
                            </Button>
                          }
                        />
                      )}
                    </>
                  )}
                </div>
                {isDirty && (
                  <div className="text-sm text-slate-500">
                    You have unsaved changes.
                  </div>
                )}
              </div>
            </div>
            <Separator className="mb-6" />
            {/* -------------------------------------- Form Fields -------------------------------- */}
            {!questions && (
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
            )}
          </div>
        </form>
      </Form>
      <TestParsedQuestion parsedQuestions={questions} />
    </div>
  );
}
