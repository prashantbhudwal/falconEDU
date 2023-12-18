import { IndividualResponse } from "../../../../../_components/response";
import { FullChat } from "../../../../../_components/full-chat";
import { StudentReport } from "../../../components/report/student-report";

type ReportProps = {
  params: {
    classId: string;
    taskId: string;
    studentBotId: string;
  };
};

export default async function IndividualResponsePage({ params }: ReportProps) {
  const { classId, taskId, studentBotId } = params;

  return (
    <IndividualResponse
      fullChatComponent={<FullChat studentBotId={studentBotId} />}
      reportComponent={
        <StudentReport studentBotId={studentBotId} taskId={taskId} />
      }
      studentBotId={studentBotId}
    />
  );
}
