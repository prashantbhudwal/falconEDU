import { IndividualResponsesList } from "../../../components/individual-responses-list";

export default function Responses({
  params,
}: {
  params: { classId: string; taskId: string };
}) {
  const { classId, taskId } = params;

  return (
    <IndividualResponsesList
      classId={classId}
      taskId={taskId}
      type={"ai-test"}
    />
  );
}
