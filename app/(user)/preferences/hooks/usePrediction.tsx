import { useAtom } from "jotai";
import { useContentStream } from "../../../../hooks/useContentStream";
import { contentStreamCompletedAtom } from "../../../../atoms/lesson";
import { gradeAtom } from "@/atoms/preferences";
import { PredictionPayload, APIRoute } from "@/types";
import { shouldRegenerateAtom } from "../../../../atoms/lesson";
import { boardAtom } from "@/atoms/preferences";
import { subjectAtom } from "@/atoms/preferences";
import { PredictionAction } from "@/types";

const getPayload = function (
  data: string,
  action: PredictionAction,
  grade: string,
  board: string,
  subject: string
) {
  switch (action) {
    case "predictChapters":
      return {
        action: action,
        data: {
          subject: data,
          grade: grade,
          board: board,
        },
      };
    case "predictSubtopics":
      return {
        action: action,
        data: {
          subject: subject,
          grade: grade,
          board: board,
          topic: data,
        },
      };
    default:
      return {
        action: action,
        data: {
          subject: data,
          grade: grade,
          board: board,
        },
      };
  }
};

export function usePrediction(data: string, action: PredictionAction) {
  const ROUTE: APIRoute = "/api/predictionOnEdge";
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);

  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );

  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream(ROUTE);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  const startStreaming = () => {
    if (data == "") return;
    const payload: PredictionPayload = getPayload(
      data,
      action,
      grade,
      board,
      subject
    );
    startGeneration(payload);
    setShouldRegenerate(false);
  };
  return {
    content: contentStream,
    startStreaming,
  };
}
