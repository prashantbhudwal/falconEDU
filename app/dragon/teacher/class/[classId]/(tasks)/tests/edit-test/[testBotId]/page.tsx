import { cache } from "react";
import prisma from "@/prisma";
import { testBotPreferencesSchema } from "@/app/dragon/schema";
import { UnwrapPromise } from "@/app/dragon/student/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paper } from "@/components/ui/paper";
import TestPreferencesForm from "../../components/test-preferences-form/test-preferences-form";
import { TestAnalysis } from "../../components/test-analysis/test-analysis";
import { db } from "@/app/dragon/teacher/routers";
import { TestParsedQuestion } from "../../components/test-preferences-form/test-parsed-questions";

export interface BotPageProps {
  params: {
    classId: string;
    testBotId: string;
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
  const { classId, testBotId } = params;
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
  return (
    <div className="w-full">
      <Paper
        variant={"gray"}
        className="w-full max-w-5xl py-3 px-2 min-h-screen"
      >
        <Tabs defaultValue="test">
          <TabsList className="flex w-full bg-transparent h-10 mb-10 border-b">
            <TabsTrigger
              className="w-1/2 data-[state=active]:border-b-[1px] data-[state=active]:bg-transparent text-lg border-white rounded-none"
              value="test"
            >
              Test
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="w-1/2 data-[state=active]:border-b-[1px] data-[state=active]:bg-transparent text-lg border-white rounded-none"
            >
              Submissions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="test" className="px-12 min-h-screen">
            <TestPreferencesForm
              preferences={preferences}
              botConfig={testConfig}
              classId={classId}
              botId={testBotId}
              activeParsedQuestions={activeParsedQuestions}
              isActive={isActive}
            />
            <TestParsedQuestion
              botId={testBotId}
              classId={classId}
              activeParsedQuestions={activeParsedQuestions}
              archivedParsedQuestions={archivedParsedQuestions}
            />
          </TabsContent>
          <TabsContent value="submissions">
            <TestAnalysis testBotId={testBotId} classId={classId} />
          </TabsContent>
        </Tabs>
      </Paper>
    </div>
  );
}
