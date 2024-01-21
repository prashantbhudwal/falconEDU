"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { saveParsedQuestions } from "../../../../../../../mutations";
import { db } from "@/lib/routers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { parseTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { typeActiveParsedQuestionByBotConfigId } from "@/lib/routers/parsedQuestionRouter";
const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
import TextAreaWithUpload from "../../../../_components/textarea-with-upload";
import { AddQuestionsDialog } from "./add-questions-dialog";
import { SaveButton } from "../../../../_components/task-form/save-btn";
import {
  LIMITS_testBotPreferencesSchema,
  botNameSchema,
  testBotPreferencesSchema,
} from "@/lib/schema";

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
    defaultValues: { fullTest: "" }, // later change with value from db of timelimit
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
        "No questions provided. Please provide the questions and answers.",
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
        "Failed to update , Bot names should be between 3 and 30 characters in length.",
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
            <div className="mx-auto flex w-11/12 flex-wrap justify-between gap-10 py-5">
              <div className="w-7/12">
                <Input
                  type="text"
                  value={testName}
                  onChange={onTestNameChange}
                  onBlur={updateTestNameHandler}
                  required
                  className="w-full border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-xl "
                />
                {error && !parsedQuestionFromDb && (
                  <div className="mt-3 text-sm text-error">{error}</div>
                )}
              </div>
              {!parsedQuestionFromDb ? (
                <SaveButton
                  isLoading={loading}
                  isDisabled={loading || !isDirty}
                  hasUnsavedChanges={isDirty}
                />
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
                        <div className="relative min-h-[200px] w-full rounded-md border border-input bg-transparent py-2 text-sm shadow-sm sm:min-h-[150px]">
                          <TextAreaWithUpload
                            counter
                            maxChars={MAX_CHARS}
                            required
                            placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you."
                            hasDocUploader
                            setIsDirty={setIsDirty}
                            className="bg-base-300"
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
