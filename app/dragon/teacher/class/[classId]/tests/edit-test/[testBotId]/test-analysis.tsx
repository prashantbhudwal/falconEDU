import { Paper } from "@/components/ui/paper";
import { getStudentsByBotConfigId } from "../../queries";
import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestPreferencesForm from "./test-preferences-form";

export async function TestAnalysis({
  testBotId,
  classId,
}: {
  testBotId: string;
  classId: string;
}) {
  const students = await getStudentsByBotConfigId(testBotId);
  return (
    <Paper variant={"gray"} className="w-full max-w-5xl min-h-screen p-0">
      <Tabs defaultValue="report">
        <TabsList className="flex w-full bg-transparent h-10 ">
          <TabsTrigger
            className="w-1/2 data-[state=active]:border-b-[1px] py-3 mt-3 data-[state=active]:bg-transparent text-xl border-white rounded-none"
            value="report"
          >
            Report
          </TabsTrigger>
          <TabsTrigger
            className="w-1/2 data-[state=active]:border-b-[1px] py-3 mt-3 data-[state=active]:bg-transparent text-xl border-white rounded-none"
            value="fullResponse"
          >
            Full Response
          </TabsTrigger>
        </TabsList>
        <TabsContent value="report" className="mt-10">
          {students ? (
            students.map((student) => (
              <Link
                href={`/dragon/teacher/class/${classId}/tests/edit-test/${testBotId}/report/${student.studentBotId}`}
                key={student.email}
              >
                <ItemCard
                  title={student.name!}
                  avatarUrl={student.image!}
                  className="mx-auto"
                >
                  <div className="flex gap-2">
                    <ItemCardChip label="Email" value={student.email} />
                    <ItemCardChip
                      label="Status"
                      value={
                        student.isSubmitted ? "Submitted" : "Not Submitted"
                      }
                      valueColor={
                        student.isSubmitted ? "text-primary" : "text-secondary"
                      }
                    />
                    <ItemCardChip
                      label="Active"
                      value={student.isActive ? "Yes" : "No"}
                      valueColor={
                        student.isActive ? "text-primary" : "text-secondary"
                      }
                    />
                  </div>
                </ItemCard>
              </Link>
            ))
          ) : (
            <h1 className="text-center font-semibold text-2xl mt-10">
              You have no Students in this class.
            </h1>
          )}
        </TabsContent>
        <TabsContent value="fullResponse">
          {/* <TestAnalysis testBotId={testBotId} classId={classId} /> */}
        </TabsContent>
      </Tabs>
    </Paper>
  );
}
