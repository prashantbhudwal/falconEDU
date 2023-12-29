import { IndividualResponse } from "../../../../../_components/response";
import { FullChat } from "../../../../../_components/full-chat";

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
      />
    </div>
  );
}
