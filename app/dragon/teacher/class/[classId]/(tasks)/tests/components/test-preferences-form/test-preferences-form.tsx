"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveParsedQuestions } from "../../../../../../mutations";
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
} from "../../../../../../../schema";
import { Button } from "@/components/ui/button";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { FiInfo } from "react-icons/fi";
import { LIMITS_testBotPreferencesSchema } from "../../../../../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { parseTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { useConfigPublishing } from "../../../../../../hooks/use-config-publishing";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { TestParsedQuestion } from "./test-parsed-questions";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
import FileUploader from "../file-uploader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof testBotPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
  activeParsedQuestions: typeGetParsedQuestionByBotConfigId["activeParsedQuestions"];
  isActive: boolean;
};

export default function TestPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig: config,
  activeParsedQuestions: parsedQuestionFromDb,
  isActive,
}: BotPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const [testName, setTestName] = useState<string | undefined>(config?.name);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(config);
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
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  // --------------------------------------------- On Parsing ----------------------------------------------------------------
  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    // setting error and loading state whenever the form is submitted
    setError("");
    setLoading(true);

    // geting parsed Question via function call
    const { parsedQuestions, hasQuestions, hasAnswers, error, message } =
      await parseTestQuestions(data.fullTest);

    // handling errors and exception case from parsing the questions
    if (error) {
      setError(message);
      setLoading(false);
      return { success: false };
    }
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

    // updating the question_number of the questions from the parsed questions and saving it to database
    const updatedParsedQuestions =
      Array.isArray(parsedQuestionFromDb) &&
      parsedQuestionFromDb.length > 0 &&
      parsedQuestions.map((question, index) => {
        return {
          ...question,
          question_number: parsedQuestionFromDb.length + index + 1,
        };
      });
    const response = await saveParsedQuestions({
      parsedQuestions: updatedParsedQuestions || parsedQuestions,
      botId,
      classId,
    });

    // updating the test in botconfig and saving it to database
    let fullTest = data.fullTest;
    if (
      config?.preferences &&
      typeof config.preferences === "object" &&
      "fullTest" in config.preferences
    ) {
      fullTest = config.preferences.fullTest + "\n" + fullTest;
    }
    const updateBotConfigResult = await db.botConfig.updateBotConfig({
      classId,
      botId,
      data: {
        fullTest: fullTest,
      },
      configType: "test",
    });

    // if both saving the parsedQuestion and botconfig are successful, then handling updating the state and reseting the form
    if (response.success && updateBotConfigResult.success) {
      setError(null); // clear any existing error
      setIsDirty(false);
      setLoading(false);
      form.setValue("fullTest", "");
      return { success: true };
    } else {
      setError("Failed to update bot config. Please try again."); // set the error message
      setLoading(false);
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

  const parsedDocsHandler = async ({ docs }: { docs: string }) => {
    if (docs) {
      const test = form.getValues("fullTest");
      const updatedTest = test ? test + "\n" + docs : docs;
      form.setValue("fullTest", updatedTest);
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
                    <ClassDialog
                      title="Un-archive Test"
                      description="This action will make the Test active to all students in the class."
                      action={() => archiveHandler("unarchive")}
                      trigger={
                        <Button type="button" className="gap-1">
                          <LuArchiveRestore /> Unarchive
                        </Button>
                      }
                    />
                  ) : (
                    <ClassDialog
                      title="Archive Test"
                      description="Completing this action will render the Test inactive."
                      action={() => archiveHandler("archive")}
                      trigger={
                        <Button
                          className="gap-1"
                          type="button"
                          variant="destructive"
                        >
                          <LuArchive />
                          Archive
                        </Button>
                      }
                    />
                  )}
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
                  {parsedQuestionFromDb && !isArchived && (
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
            <FormField
              control={form.control}
              name="fullTest"
              render={({ field }) => (
                <FormItem className="pb-10">
                  <FormLabel
                    className={`mb-5 flex gap-2 align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    Instructions
                    <FiInfo />
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm min-h-[200px] sm:min-h-[150px] text-sm">
                      {config?.preferences &&
                        typeof config.preferences === "object" &&
                        "fullTest" in config.preferences && (
                          <Accordion
                            type="single"
                            collapsible
                            className="mt-5 bg-slate-900/70 text-slate-500 cursor-pointer"
                          >
                            <AccordionItem
                              value="item-1"
                              className="border-none"
                            >
                              <AccordionTrigger className="text-lg px-4 text-slate-400">
                                Existing Test
                              </AccordionTrigger>
                              <AccordionContent>
                                <Textarea
                                  className="resize-none min-h-fit sm:min-h-fit focus-visible:ring-0 text-slate-500 outline-none border-none"
                                  value={
                                    typeof config.preferences.fullTest ===
                                    "string"
                                      ? config.preferences.fullTest
                                      : ""
                                  }
                                  readOnly
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      <Textarea
                        className="resize-none mt-5 placeholder:text-slate-400 text-slate-200 h-96 focus-visible:ring-0 outline-none border-none"
                        {...field}
                        onFocus={() => setInputFocus("instructions")}
                        onBlur={() => setInputFocus("")}
                        hasCounter
                        maxChars={MAX_CHARS}
                        required
                        placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you."
                      />
                      <FileUploader setParsedDocs={parsedDocsHandler} />
                    </div>
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
    </div>
  );
}
