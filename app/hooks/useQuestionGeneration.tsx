import { useAtom } from "jotai";
import { useContentStream } from "./useContentStream";
import { contentStreamCompletedAtom } from "../atoms/lesson";
import { gradeAtom } from "@/app/atoms/preferences";
import { QuestionPayload, APIRoute } from "@/types";
import { shouldRegenerateAtom } from "../atoms/lesson";
import { boardAtom } from "@/app/atoms/preferences";
import { subjectAtom } from "@/app/atoms/preferences";
import { QuestionAction } from "@/types";
import { QuestionType } from "../../types/payloadTypes";
import { currentQuestionAtom } from "../atoms/worksheet";
import { topicAtom } from "../atoms/preferences";

const getPayload = function (
  action: QuestionAction,
  grade: string,
  board: string,
  subject: string,
  questionType: QuestionType,
  bloomLevel: string,
  topic: string,
  subtopic: string
) {
  switch (action) {
    case "getQuestion":
      return {
        action: action,
        data: {
          subject: subject,
          grade: grade,
          board: board,
          questionType: questionType,
          bloomLevel: bloomLevel,
          topic: topic,
          subtopic: subtopic,
        },
      };
    default:
      return {
        action: action,
        data: {
          subject: subject,
          grade: grade,
          board: board,
          questionType: questionType,
          bloomLevel: bloomLevel,
          topic: topic,
          subtopic: subtopic,
        },
      };
  }
};

export function useQuestionGeneration(action: QuestionAction) {
  const ROUTE: APIRoute = "/api/questionGenerationOnEdge";
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [topic] = useAtom(topicAtom);

  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );

  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream(ROUTE);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  const startStreaming = () => {
    const payload: QuestionPayload = getPayload(
      action,
      grade,
      board,
      subject,
      currentQuestion.questionType,
      currentQuestion.bloomLevel,
      topic,
      currentQuestion.subtopic
    );
    startGeneration(payload);
    setShouldRegenerate(false);
  };
  return {
    content: contentStream,
    startStreaming,
  };
}
