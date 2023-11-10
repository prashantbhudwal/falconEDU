import TestPreferencesForm from "./test-preferences-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestAnalysis } from "./test-analysis";
import { cache } from "react";
import prisma from "@/prisma";
import { testBotPreferencesSchema } from "@/app/dragon/schema";
import { Paper } from "@/components/ui/paper";
export interface BotPageProps {
  params: {
    classId: string;
    testBotId: string;
  };
}

const emptyPreferences = {}; // or whatever default you want

const fetchTestBotConfig = cache(async (botId: string) => {
  try {
    const bot = await prisma.botConfig.findUnique({
      where: { id: botId },
    });

    console.log("Fetched successfully.");

    let preferences;
    if (bot && bot.preferences) {
      preferences =
        typeof bot.preferences === "string"
          ? JSON.parse(bot.preferences)
          : bot.preferences;
    } else {
      preferences = emptyPreferences;
    }

    const result = testBotPreferencesSchema.safeParse(preferences);

    if (result.success) {
      return { preferences: result.data, bot };
    } else {
      console.error("Validation failed:", result.error);
      return { preferences: null, bot };
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
});

export default async function BotPage({ params }: BotPageProps) {
  const { classId, testBotId } = params;
  const botData = await fetchTestBotConfig(testBotId);

  return (
    <div className="w-full min-h-[calc(100vh-180px)] max-h-full overflow-y-scroll custom-scrollbar pt-4">
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
              preferences={botData?.preferences}
              botConfig={botData?.bot!}
              classId={classId}
              botId={testBotId}
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
