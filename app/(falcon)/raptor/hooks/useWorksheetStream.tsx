import { useAtom } from "jotai";
import { useContentStream } from "../../../../hooks/useContentStream";
import { QuestionPayload, APIRoute, QuestionBankAction } from "@/types";

import { savedQuestionsAtom } from "../../../../lib/atoms/worksheet";

export function useWorksheetStream(action: QuestionBankAction) {
  const ROUTE: APIRoute = "/api/worksheetAidsOnEdge";

  const [savedQuestions, setSavedQuestions] = useAtom(savedQuestionsAtom);

  const { contentStream, startGeneration } = useContentStream(ROUTE);

  const startStreaming = () => {
    startGeneration({ action: action, data: savedQuestions });
  };
  return {
    content: contentStream,
    startStreaming,
  };
}
