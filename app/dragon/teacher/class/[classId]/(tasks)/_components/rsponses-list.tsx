import {
  ResponseCard,
  CardChip,
} from "@/app/dragon/teacher/class/[classId]/(tasks)/_components/response-card";
import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { getTestReportUrl } from "@/lib/urls";

export const ResponsesList = function ({
  students,
  classId,
  taskId,
}: {
  students: StudentsByBotConfigId["students"];
  classId: string;
  taskId: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {students.map((student) => (
        <ResponseCard
          key={student.email}
          title={student.name!}
          avatarUrl={student.image!}
          className="w-[600px]"
          description={student.email!}
          link={getTestReportUrl({
            classId,
            testId: taskId,
            studentBotId: student.studentBotId,
          })}
        >
          <div className="flex gap-2">
            <CardChip
              value={student.isSubmitted ? "Attempted" : "Pending"}
              valueColor={student.isSubmitted ? "text-primary" : "text-accent"}
            />
          </div>
        </ResponseCard>
      ))}
    </div>
  );
};
