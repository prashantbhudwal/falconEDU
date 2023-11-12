import { Paper } from "@/components/ui/paper";
import { getStudentsByBotConfigId } from "../queries";
import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export async function TestAnalysis({
  testBotId,
  classId,
}: {
  testBotId: string;
  classId: string;
}) {
  const students = await getStudentsByBotConfigId(testBotId);
  return (
    <div className="w-full max-w-5xl min-h-screen pt-10 flex flex-col">
      <div className="py-10 mx-auto">Summary Stats will appear here</div>
      <Separator className="my-2" />
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
                  value={student.isSubmitted ? "Submitted" : "Not Submitted"}
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
    </div>
  );
}
