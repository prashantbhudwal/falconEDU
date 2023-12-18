import { Paper } from "@/components/ui/paper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSingleStudentByStudentBotId } from "../[taskId]/test/queries";
import { Separator } from "@/components/ui/separator";
import { ReportModal } from "./report-modal";

export async function IndividualResponse({
  studentBotId,
  reportComponent,
  fullChatComponent,
}: {
  studentBotId: string;
  reportComponent?: React.ReactNode;
  fullChatComponent: React.ReactNode;
}) {
  const student = await getSingleStudentByStudentBotId(studentBotId);

  return (
    <ReportModal>
      <div className="w-full py-5 overflow-y-scroll custom-scrollbar h-screen bg-base-300 rounded-xl ring-1 ring-slate-700 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-center font-semibold ">
            {student?.student.User.name}
          </h1>
          <Separator />

          {reportComponent ? (
            <Tabs defaultValue="report">
              <TabsList className="grid w-2/5 grid-cols-2 mx-auto bg-base-100">
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="fullResponse">Full Response</TabsTrigger>
              </TabsList>
              <TabsContent value="report">
                <Paper
                  variant={"gray"}
                  className="w-full max-w-5xl min-h-screen pb-20"
                >
                  {reportComponent}
                </Paper>
              </TabsContent>
              <TabsContent value="fullResponse">
                <Paper
                  variant={"gray"}
                  className="w-full max-w-5xl min-h-screen pb-20"
                >
                  {fullChatComponent}
                </Paper>
              </TabsContent>
            </Tabs>
          ) : (
            <Paper
              variant={"gray"}
              className="w-full max-w-5xl min-h-screen pb-20"
            >
              {fullChatComponent}
            </Paper>
          )}
        </div>
      </div>
    </ReportModal>
  );
}
