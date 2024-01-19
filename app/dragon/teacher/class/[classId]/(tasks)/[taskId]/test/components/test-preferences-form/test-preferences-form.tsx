"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveParsedQuestions } from "../../../../../../../mutations";
import { db } from "@/app/dragon/teacher/routers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { IoMdAdd } from "react-icons/io";
import {
  botNameSchema,
  testBotPreferencesSchema,
} from "../../../../../../../../schema";
import { Button } from "@/components/ui/button";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { LIMITS_testBotPreferencesSchema } from "../../../../../../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { parseTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { typeActiveParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
import TextAreaWithUpload from "../../../../_components/textAreaWithUpload";
import { AddQuestionsDialog } from "./add-questions-dialog";

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof testBotPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
  activeParsedQuestions: typeActiveParsedQuestionByBotConfigId[] | null;
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
  const [testName, setTestName] = useState<string | undefined>(config?.name);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(config);

  const timeLimit = config?.timeLimit || 0;

  if (!testBotPreferencesSchema.safeParse(config?.preferences)) {
    setError("Failed to parse bot preferences. Please try again.");
  }

  const form = useForm<z.infer<typeof testBotPreferencesSchema>>({
    // resolver: zodResolver(testBotPreferencesSchema),
    defaultValues: { fullTest: "", timeLimit }, // later change with value from db of timelimit
    mode: "onChange",
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

  return (
    <div className="w-full max-w-5xl">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* -------------------------------------- Form Header-------------------------------- */}
            <div className="w-11/12 mx-auto flex justify-between flex-wrap gap-10 py-5">
              <div className="w-7/12">
                <Input
                  type="text"
                  value={testName}
                  onChange={onTestNameChange}
                  onBlur={updateTestNameHandler}
                  required
                  className="outline-none w-full border-none pl-0 md:text-xl font-bold tracking-wide focus-visible:ring-0 "
                />
                {error && !parsedQuestionFromDb && (
                  <div className="text-error text-sm mt-3">{error}</div>
                )}
              </div>
              {!parsedQuestionFromDb ? (
                <div className="flex w-fit flex-col gap-2 items-end">
                  <Button
                    type="submit"
                    disabled={loading || !isDirty}
                    className="text-xs"
                    size={"sm"}
                  >
                    {loading ? (
                      <span className="loading loading-infinity loading-sm"></span>
                    ) : isDirty ? (
                      "Save"
                    ) : (
                      "Saved"
                    )}
                  </Button>
                  {isDirty && (
                    <div className="text-xs text-slate-500">
                      You have unsaved changes.
                    </div>
                  )}
                </div>
              ) : (
                <AddQuestionsDialog
                  loading={loading}
                  onModalSubmit={onSubmit}
                  isDirty={isDirty}
                  setIsDirty={setIsDirty}
                  error={error}
                  setError={setError}
                />
              )}
            </div>
            <div className="mb-6" />
            {/* -------------------------------------- Form Fields -------------------------------- */}
            {!parsedQuestionFromDb && (
              <FormField
                control={form.control}
                name="fullTest"
                render={({ field }) => (
                  <FormItem className="pb-10">
                    <FormProvider {...form}>
                      <FormControl>
                        <div className="relative w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm min-h-[200px] sm:min-h-[150px] text-sm">
                          <TextAreaWithUpload
                            counter
                            maxChars={MAX_CHARS}
                            required
                            placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you."
                            hasDocUploader
                            setIsDirty={setIsDirty}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormProvider>
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
      </FormProvider>
    </div>
  );
}
