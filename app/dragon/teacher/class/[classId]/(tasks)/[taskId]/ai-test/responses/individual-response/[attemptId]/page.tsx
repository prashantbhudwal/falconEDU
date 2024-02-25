import { IndividualResponse } from "../../../../../components/response";
import { FullChat } from "../../../../../components/full-chat";
import { AITestReport } from "./report";

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
    <div className="flex flex-col items-center">
      <IndividualResponse
        fullChatComponent={<FullChat attemptId={attemptId} />}
        attemptId={attemptId}
        reportComponent={<AITestReport taskId={taskId} attemptId={attemptId} />}
      />
    </div>
  );
}
