import { Chat } from "@/components/chat/chat-dragon";
import { getParentChatApiURL } from "@/lib/urls";
import { QuestionList } from "../../../teacher/class/[classId]/(tasks)/[taskId]/test/components/report/question-list";

export interface ParentReportPageProps {
  params: {
    taskId: string;
  };
}
export default async function ParentChatPage({
  params,
}: ParentReportPageProps) {
  const taskId = params.taskId;

  return (
    <div className="p-2 flex flex-col items-center space-y-3">
      <h1 className="text-lg font-medium">Report</h1>
      {/* <QuestionList botId={taskId} /> */}
    </div>
  );
}
