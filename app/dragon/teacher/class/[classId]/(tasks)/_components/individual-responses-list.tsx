import {
  StudentsByBotConfigId,
  getStudentsByBotConfigId,
} from "../[taskId]/test/queries";
import { getReportUrl } from "@/lib/urls";
import { NoStudents } from "./no-students";
import { NotPublished } from "./not-published";
import { TaskType } from "@/types/dragon";
import { db } from "@/lib/routers";
import { Response } from "./response-accordion";

export const IndividualResponsesList = async function ({
  classId,
  taskId,
  type,
}: {
  classId: string;
  taskId: string;
  type: TaskType;
}) {
  const { isPublished, students } = await getStudentsByBotConfigId(taskId);
  const status = await db.botConfig.getReattemptStatus({ taskId });
  if (!status.success) return null;
  const canReattempt = status.canReAttempt;
  if (!isPublished) return <NotPublished />;
  if (students.length === 0) return <NoStudents classId={classId} />;

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="mt-10 text-center text-xl font-semibold ">
        Individual Responses
      </h1>
      <div className="flex flex-col gap-2">
        {students.map((student) => (
          <Response
            taskId={taskId}
            student={student}
            key={student.email}
            className="w-full"
            classId={classId}
            type={type}
            canReattempt={canReattempt}
          />
        ))}
      </div>
    </div>
  );
};
