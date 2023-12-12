import {
  ResponseCard,
  CardChip,
} from "@/app/dragon/teacher/class/[classId]/(tasks)/_components/response-card";
import {
  StudentsByBotConfigId,
  getStudentsByBotConfigId,
} from "../[taskId]/test/queries";
import { getReportUrl } from "@/lib/urls";
import { NoStudents } from "./no-students";
import { NotPublished } from "./not-published";

export const IndividualResponsesList = async function ({
  classId,
  taskId,
  type,
}: {
  classId: string;
  taskId: string;
  type: "test" | "chat";
}) {
  const { isPublished, students } = await getStudentsByBotConfigId(taskId);

  if (students.length === 0) return <NoStudents classId={classId} />;
  if (!isPublished) return <NotPublished />;

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        Individual Responses
      </h1>
      <div className="flex flex-col gap-2">
        {students.map((student) => (
          <ResponseCard
            student={student}
            key={student.email}
            className="w-[600px]"
            link={getReportUrl({
              classId,
              testId: taskId,
              studentBotId: student.studentBotId,
              type,
            })}
          >
            <div className="flex gap-2">
              <CardChip
                value={student.isSubmitted ? "Attempted" : "Pending"}
                valueColor={
                  student.isSubmitted ? "text-primary" : "text-accent"
                }
              />
            </div>
          </ResponseCard>
        ))}
      </div>
    </div>
  );
};
