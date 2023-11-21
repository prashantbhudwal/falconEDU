import { Paper } from "@/components/ui/paper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestPreferencesForm from "./test-preferences-form/test-preferences-form";
import { TestAnalysis } from "./test-analysis";
import { BotConfig } from "@prisma/client";
import { type TestBotConfigByConfigId } from "../edit-test/[testBotId]/page";
import { db } from "@/app/dragon/teacher/routers";

export async function Test({
  classId,
  testBotId,
  testConfigAndPreferences,
}: {
  classId: string;
  testBotId: string;
  testConfigAndPreferences: TestBotConfigByConfigId;
}) {
  const { preferences, testConfig } = testConfigAndPreferences;
  const parsedQuestions =
    await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
      botConfigId: testBotId,
    });
  return (
    <Paper variant={"gray"} className="w-full max-w-5xl py-3 px-2">
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
        <TabsContent value="test" className="px-12">
          <TestPreferencesForm
            preferences={preferences}
            botConfig={testConfig}
            classId={classId}
            botId={testBotId}
            parsedQuestions={parsedQuestions}
          />
        </TabsContent>
        <TabsContent value="submissions">
          <TestAnalysis testBotId={testBotId} classId={classId} />
        </TabsContent>
      </Tabs>
    </Paper>
  );
}
