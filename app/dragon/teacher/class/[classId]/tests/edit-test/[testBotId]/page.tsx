import TestPreferencesForm from "./test-preferences-form";
import { fetchTestBotConfig } from "@/app/dragon/teacher/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestReport } from "./test-report";
export interface BotPageProps {
  params: {
    classId: string;
    testBotId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, testBotId } = params;
  const botData = await fetchTestBotConfig(testBotId);

  return (
    <Tabs defaultValue="test">
      <TabsList className="grid w-2/5 grid-cols-2 mx-auto bg-base-100">
        <TabsTrigger value="test">Test</TabsTrigger>
        <TabsTrigger value="report">Report</TabsTrigger>
      </TabsList>
      <TabsContent value="test">
        <TestPreferencesForm
          preferences={botData?.preferences}
          botConfig={botData?.bot!}
          classId={classId}
          botId={testBotId}
        />
      </TabsContent>
      <TabsContent value="report">
        <TestReport testBotId={testBotId} classId = {classId}/>
      </TabsContent>
    </Tabs>
  );
}
