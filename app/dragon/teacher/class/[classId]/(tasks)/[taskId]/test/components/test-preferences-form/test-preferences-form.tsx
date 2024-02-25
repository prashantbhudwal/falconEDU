"use client";
import { type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { saveParsedQuestions } from "../../../../../../../mutations";
import { db } from "@/lib/routers";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import { parseTestQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { typeActiveParsedQuestionByBotConfigId } from "@/lib/routers/parsedQuestionRouter";
const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
import { AddQuestionsDialog } from "./add-questions-dialog";
import { SaveButton } from "../../../../_components/task-form/save-btn";
import {
  LIMITS_testBotPreferencesSchema,
  botNameSchema,
  testBotPreferencesSchema,
} from "@/lib/schema";
import { type ParsedQuestions } from "@/app/dragon/ai/test-question-parser/get-test-questions";
import { TextAreaField } from "../../../../_components/task-form/fields/magic-content/textarea";
import { Processing } from "@/components/loading/processing";
import { getGptGenerationTime } from "@/lib/utils";

const getProcessingSteps = (approxGenerationTime: number) => {
  return [
    {
      seconds: Math.ceil(approxGenerationTime * 0.3),
      step: "Sending the questions to AI.",
    },
    {
      seconds: Math.ceil(approxGenerationTime * 0.5),
      step: "AI is reading the the questions",
    },
    {
      seconds: Math.ceil(approxGenerationTime * 0.1),
      step: "AI is processing the questions",
    },
    {
      seconds: Math.ceil(approxGenerationTime * 0.1),
      step: "AI is verifying the questions",
    },
  ];
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof testBotPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
  activeParsedQuestions: typeActiveParsedQuestionByBotConfigId[] | null;
  isActive: boolean;
};

const appendTest = (existingTest: string, newTest: string) => {
  return newTest ? existingTest + "\n" + newTest : existingTest;
};

const parseQuestions = async (fullTest: string) => {
  const { parsedQuestions, hasQuestions, hasAnswers, error, message } =
    await parseTestQuestions(fullTest);

  if (error) {
    throw new Error(message);
  }

  if (!hasQuestions && !hasAnswers) {
    throw new Error(
      "No questions and answers provided. Please provide the questions and answers and save again.",
    );
  }

  if (!hasQuestions) {
    throw new Error(
      "No questions provided. Please provide the questions and save again.",
    );
  }

  if (!hasAnswers) {
    throw new Error(
      "No answers provided. Please provide the answers and save again.",
    );
  }
  if (!parsedQuestions) {
    throw new Error("Something went wrong. Please try again later.");
  }

  return parsedQuestions;
};

const addQuestionNumberToParsedQuestions = ({
  parsedQuestions,
  parsedQuestionFromDb,
}: {
  parsedQuestions: ParsedQuestions["parsedQuestions"];
  parsedQuestionFromDb: typeActiveParsedQuestionByBotConfigId[];
}) => {
  if (!parsedQuestions) {
    throw new Error("Something went wrong. Please try again later.");
  }
  return parsedQuestions.map((question, index) => {
    return {
      ...question,
      question_number: parsedQuestionFromDb.length + index + 1,
    };
  });
};

const saveTest = async (
  fullTest: string,
  botId: string,
  classId: string,
  config: any,
) => {
  let testToBeSaved = fullTest;
  const configHasFullTest = !!(
    config?.preferences &&
    typeof config.preferences === "object" &&
    "fullTest" in config.preferences
  );

  if (configHasFullTest) {
    const testInConfig = config.preferences.fullTest;
    testToBeSaved = appendTest(testInConfig, fullTest);
  }

  const updateBotConfigResult = await db.botConfig.updateBotConfig({
    classId,
    botId,
    data: {
      fullTest: testToBeSaved,
    },
    configType: "test",
  });

  if (!updateBotConfigResult.success) {
    throw new Error("Failed to update bot config.");
  }
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

  if (!testBotPreferencesSchema.safeParse(config?.preferences)) {
    setError("Failed to parse bot preferences. Please try again.");
  }

  const form = useForm<z.infer<typeof testBotPreferencesSchema>>({
    // resolver: zodResolver(testBotPreferencesSchema),
    defaultValues: { fullTest: "" }, // later change with value from db of timelimit
    mode: "onChange",
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const resetFormState = () => {
    setError(null);
    setIsDirty(false);
    form.setValue("fullTest", "");
  };

  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    setError("");
    setLoading(true);
    try {
      const parsedQuestions = await parseQuestions(data.fullTest);
      let questionsToBeSaved = parsedQuestions;

      const dbHasParsedQuestions =
        Array.isArray(parsedQuestionFromDb) && parsedQuestionFromDb.length > 0;

      if (dbHasParsedQuestions) {
        questionsToBeSaved = addQuestionNumberToParsedQuestions({
          parsedQuestions,
          parsedQuestionFromDb,
        });
      }

      await saveParsedQuestions({
        parsedQuestions: questionsToBeSaved,
        botId,
        classId,
      });
      // TODO: the save should happen before parsing the questions, so that if there is an error, the user can fix it and save again
      await saveTest(data.fullTest, botId, classId, config);
      setLoading(false);
      resetFormState();
      return { success: true };
    } catch (error) {
      setError((error as Error).message);
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
      name: testName ?? "Test Preferences",
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

  const approxGenerationTime = getGptGenerationTime(
    form.watch("fullTest").length || 1,
  );

  return (
    <div className="w-full max-w-5xl">
      {loading && (
        <Processing
          steps={[
            {
              seconds: Math.ceil(approxGenerationTime * 0.3),
              step: "Sending the questions to AI.",
            },
            {
              seconds: Math.ceil(approxGenerationTime * 0.5),
              step: "AI is reading the the questions",
            },
            {
              seconds: Math.ceil(approxGenerationTime * 0.1),
              step: "AI is processing the questions",
            },
            {
              seconds: Math.ceil(approxGenerationTime * 0.1),
              step: "AI is verifying the questions",
            },
          ]}
        />
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* -------------------------------------- Form Header-------------------------------- */}
            <div className="flex w-full flex-wrap justify-between gap-10">
              <div className="w-7/12">
                <Input
                  type="text"
                  value={testName}
                  onChange={onTestNameChange}
                  onBlur={updateTestNameHandler}
                  required
                  className="w-full border-b-2 border-none pl-0 font-bold tracking-wide outline-none focus-visible:ring-0 md:text-xl "
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
            {!parsedQuestionFromDb && (
              <TextAreaField
                name="fullTest"
                maxChars={MAX_CHARS}
                placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you."
              />
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
