import { IndividualResponse } from "../../../../../_components/response";
import { FullChat } from "../../../../../_components/full-chat";
import { StudentReport } from "../../../components/report/student-report";

type ReportProps = {
  params: {
    classId: string;
    taskId: string;
    attemptId: string;
  };
};

export default async function IndividualResponsePage({ params }: ReportProps) {
  const { classId, taskId, attemptId } = params;

  return (
    <IndividualResponse
      fullChatComponent={<FullChat attemptId={attemptId} />}
      reportComponent={<StudentReport taskId={taskId} attemptId={attemptId} />}
      attemptId={attemptId}
    />
  );
}
