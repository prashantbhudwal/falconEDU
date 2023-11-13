import { Paper } from "@/components/ui/paper";
import { getStudentsByBotConfigId } from "../queries";
import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getStudentsURL } from "@/lib/urls";
import { Button } from "@/components/ui/button";

export async function TestAnalysis({
  testBotId,
  classId,
}: {
  testBotId: string;
  classId: string;
}) {
  const { isPublished, students } = await getStudentsByBotConfigId(testBotId);

  return (
    <div className="w-full max-w-5xl min-h-screen pt-10 flex flex-col">
      {!isPublished && students.length === 0 ? (
        <NotPublished />
      ) : students.length !== 0 ? (
        <div>
          <SummaryStats />
          <Separator className="my-2" />
          <div>
            {students.map((student) => (
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
            ))}
          </div>
        </div>
      ) : (
        <AddStudents classId={classId} />
      )}
    </div>
  );
}

const AddStudents = function ({ classId }: { classId: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        You have no students in this class.
      </h1>
      <Link href={getStudentsURL(classId)}>
        <Button variant={"outline"}>Add Students</Button>
      </Link>
    </div>
  );
};

const NotPublished = function () {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        This test is not published yet.
      </h1>
    </div>
  );
};

const SummaryStats = function () {
  return (
    <div className="py-10 text-center">Summary Stats will appear here</div>
  );
};
