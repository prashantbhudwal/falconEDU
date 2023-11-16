import {
  getAllQuestionResponsesByBotConfigId,
  getParsedQuestionByBotConfigId,
  getStudentsByBotConfigId,
} from "../queries";
import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getStudentsURL } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { SummaryStatTable } from "./summary-stat-table";
import { getTestMetadata } from "../../utils";

export async function TestAnalysis({
  testBotId,
  classId,
}: {
  testBotId: string;
  classId: string;
}) {
  const { isPublished, students } = await getStudentsByBotConfigId(testBotId);
  const totalSubmittedTest = students.filter(
    (student) => student.isSubmitted
  ).length;
  const totalPendingTest = students.length - totalSubmittedTest;

  return (
    <div className="w-full max-w-5xl min-h-screen pt-10 flex flex-col">
      {!isPublished && students.length === 0 ? (
        <NotPublished />
      ) : students.length !== 0 ? (
        <div>
          <SummaryStats
            testBotId={testBotId}
            totalSubmittedTest={totalSubmittedTest}
            totalPendingTest={totalPendingTest}
          />
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

const SummaryStats = async function ({
  testBotId,
  totalPendingTest,
  totalSubmittedTest,
}: {
  testBotId: string;
  totalPendingTest: number;
  totalSubmittedTest: number;
}) {
  const testQuestions = await getParsedQuestionByBotConfigId(testBotId);
  const allStudentResponses =
    await getAllQuestionResponsesByBotConfigId(testBotId);
  const { averageScore, highestScore, leastScore, maxScore } =
    getTestMetadata(allStudentResponses);

  return (
    <>
      {Array.isArray(allStudentResponses) && allStudentResponses.length > 0 ? (
        <div className="pb-10 text-center flex flex-col gap-2">
          <h1 className="text-3xl font-semibold mb-5 text-white">
            ---- Summary Stats ----
          </h1>
          <p>
            Total Students Submitted Test :{" "}
            <span className="text-xl font-semibold text-white">
              {totalSubmittedTest}
            </span>
          </p>
          <p>
            Pending Attempts :{" "}
            <span className="text-xl font-semibold text-white">
              {totalPendingTest}
            </span>
          </p>
          <p>
            Total Number of Questions in this Test :{" "}
            <span className="text-xl font-semibold text-white">{maxScore}</span>
          </p>
          <p>
            Average Correct Answer for this Test :{" "}
            <span className="text-xl font-semibold text-white">
              {averageScore}
            </span>
          </p>
          <p>
            Highest Number of Correct Answer for this Test :{" "}
            <span className="text-xl font-semibold text-white">
              {highestScore}
            </span>
          </p>
          <p>
            Least Number of Correct Answer for this Test :{" "}
            <span className="text-xl font-semibold text-white">
              {leastScore}
            </span>
          </p>
          <div className="w-[60%] mx-auto my-10">
            <SummaryStatTable testQuestions={testQuestions} />
          </div>
        </div>
      ) : (
        <p className="text-center pb-10">Summary Stats will appear here</p>
      )}
    </>
  );
};
