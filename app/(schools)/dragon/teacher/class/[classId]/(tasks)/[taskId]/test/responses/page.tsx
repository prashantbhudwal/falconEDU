import { TestAnalysis } from "../components/test-analysis/test-analysis";

export default async function TestResponses({
  params,
}: {
  params: { classId: string; taskId: string };
}) {
  const { classId, taskId } = params;
  return (
    <div className="flex w-full flex-col items-center py-4">
      <TestAnalysis testBotId={taskId} classId={classId} />
    </div>
  );
}
