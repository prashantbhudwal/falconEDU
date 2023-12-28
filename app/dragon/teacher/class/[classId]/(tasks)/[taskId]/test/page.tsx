import { cache } from "react";
import prisma from "@/prisma";
import { testBotPreferencesSchema } from "@/app/dragon/schema";
import { UnwrapPromise } from "@/app/dragon/student/queries";
import { Paper } from "@/components/ui/paper";
import TestPreferencesForm from "./components/test-preferences-form/test-preferences-form";
import { db } from "@/app/dragon/teacher/routers";
import { TestParsedQuestion } from "./components/test-preferences-form/test-parsed-questions";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

const emptyPreferences = {}; // or whatever default you want

const fetchTestBotConfigByConfigId = cache(async (configId: string) => {
  try {
    const testConfig = await prisma.botConfig.findUnique({
      where: { id: configId },
    });

    let preferences;
    if (testConfig && testConfig.preferences) {
      preferences =
        typeof testConfig.preferences === "string"
          ? JSON.parse(testConfig.preferences)
          : testConfig.preferences;
    } else {
      preferences = emptyPreferences;
    }

    const result = testBotPreferencesSchema.safeParse(preferences);
    // Preferences are returned separately because they are parsed from JSON to enable type checking

    if (result.success) {
      return { preferences: result.data, testConfig };
    } else {
      console.error("Validation failed:", result.error);
      return { preferences: null, testConfig };
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
    return { preferences: null, testConfig: null };
  }
});
export type TestBotConfigByConfigId = UnwrapPromise<
  ReturnType<typeof fetchTestBotConfigByConfigId>
>;
// https://chat.openai.com/share/021b93e8-06f6-4dd9-a687-7218a3400556
export default async function BotPage({ params }: BotPageProps) {
  const { classId, taskId: testBotId } = params;
  const testConfigAndPreferences =
    await fetchTestBotConfigByConfigId(testBotId);
  const { preferences, testConfig } = testConfigAndPreferences;
  const { archivedParsedQuestions, activeParsedQuestions } =
    await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
      botConfigId: testBotId,
    });
  const { success: isActive, message } =
    await db.botConfig.getIsBotConfigArchivedByBotConfigId({
      botConfigId: testBotId,
    });

  const isAnswersPossiblyIncorrect = (
    activeParsedQuestions: typeGetParsedQuestionByBotConfigId["activeParsedQuestions"]
  ): boolean => {
    if (!activeParsedQuestions) return false;
    const incorrectQuestions = activeParsedQuestions.filter((question) => {
      return question.isPossiblyWrong;
    });
    if (incorrectQuestions.length > 0) {
      return true;
    }
    return false;
  };
  return (
    <div className="w-full">
      <Paper className="w-full max-w-5xl py-3 px-2 min-h-screen">
        {!activeParsedQuestions ? (
          <TestPreferencesForm
            preferences={preferences}
            botConfig={testConfig}
            classId={classId}
            botId={testBotId}
            activeParsedQuestions={activeParsedQuestions}
            isActive={isActive}
          />
        ) : (
          <Accordion
            type="single"
            collapsible
            className="my-5 p-5 text-text-500 cursor-pointer border border-base-200 "
            defaultValue={!activeParsedQuestions ? "item-1" : undefined}
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-lg px-4 text-text-400">
                Question Text
              </AccordionTrigger>
              <AccordionContent className="pl-2 text-text-400 text-base">
                <TestPreferencesForm
                  preferences={preferences}
                  botConfig={testConfig}
                  classId={classId}
                  botId={testBotId}
                  activeParsedQuestions={activeParsedQuestions}
                  isActive={isActive}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {activeParsedQuestions && (
          <div className="flex flex-col space-y-4 items-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-text-500">Review</h1>
              {isAnswersPossiblyIncorrect(activeParsedQuestions) && (
                <p className="text-xs text-warning">
                  ( Some of the responses may be potentially incorrect )
                </p>
              )}
            </div>
            <TestParsedQuestion
              botId={testBotId}
              classId={classId}
              activeParsedQuestions={activeParsedQuestions}
              archivedParsedQuestions={archivedParsedQuestions}
            />
          </div>
        )}
      </Paper>
    </div>
  );
}
