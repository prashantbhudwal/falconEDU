import { useAtom } from "jotai";
import { useContentStream } from "../../hooks/useContentStream";
import { contentStreamCompletedAtom } from "../../atoms/lesson";
import { gradeAtom } from "@/app/atoms/preferences";
import { QuestionPayload, APIRoute, QuestionBank, QuestionItem } from "@/types";
import { shouldRegenerateAtom } from "../../atoms/lesson";
import { boardAtom } from "@/app/atoms/preferences";
import { subjectAtom } from "@/app/atoms/preferences";
import { QuestionAction, QuestionType } from "@/types";
import { currentQuestionAtom, savedQuestionsAtom } from "../../atoms/worksheet";
import { topicAtom } from "../../atoms/preferences";

export function getQuestionsByType(
  questionType: QuestionType,
  questionBank: QuestionBank
): QuestionItem[] {
  const matchingQuestions: QuestionItem[] = questionBank
    .filter((questionObject) => questionObject.type === questionType)
    .flatMap((questionObject) => questionObject.questions);
  return matchingQuestions;
}
const getPayload = function (
  action: QuestionAction,
  grade: string,
  board: string,
  subject: string,
  type: QuestionType,
  bloomLevel: string,
  topic: string,
  subtopic: string,
  generatedQuestions: QuestionItem[]
) {
  switch (action) {
    case "getQuestion":
      return {
        action: action,
        data: {
          subject: subject,
          grade: grade,
          board: board,
          type: type,
          bloomLevel: bloomLevel,
          topic: topic,
          subtopic: subtopic,
        },
        generatedQuestions: generatedQuestions,
      };
    default:
      return {
        action: action,
        data: {
          subject: subject,
          grade: grade,
          board: board,
          type: type,
          bloomLevel: bloomLevel,
          topic: topic,
          subtopic: subtopic,
        },
        generatedQuestions: generatedQuestions,
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
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );

  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream(ROUTE);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  const startStreaming = () => {
    const generatedQuestions = getQuestionsByType(
      currentQuestion.type,
      savedQuestions
    );
    const payload: QuestionPayload = getPayload(
      action,
      grade,
      board,
      subject,
      currentQuestion.type,
      currentQuestion.bloomLevel,
      topic,
      currentQuestion.subtopic,
      generatedQuestions
    );
    startGeneration(payload);
    setShouldRegenerate(false);
  };
  return {
    content: contentStream,
    startStreaming,
  };
}
