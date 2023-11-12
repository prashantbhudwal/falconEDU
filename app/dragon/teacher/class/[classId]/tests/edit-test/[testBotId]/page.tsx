import TestPreferencesForm from "../../components/test-preferences-form/test-preferences-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestAnalysis } from "../../components/test-analysis";
import { cache } from "react";
import prisma from "@/prisma";
import { testBotPreferencesSchema } from "@/app/dragon/schema";
import { Paper } from "@/components/ui/paper";
import { UnwrapPromise } from "@/app/dragon/student/queries";
import { Test } from "../../components/test";

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

    console.log("Fetched successfully.");

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

  return (
    <div className="w-full min-h-[calc(100vh-180px)] max-h-full overflow-y-scroll custom-scrollbar pt-4">
      <Test
        classId={classId}
        testBotId={testBotId}
        testConfigAndPreferences={testConfigAndPreferences}
      />
    </div>
  );
}
