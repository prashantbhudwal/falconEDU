import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useContentStream } from "./useContentStream";
import { v4 as uuid } from "uuid";
import { contentStreamCompletedAtom } from "../atoms/lesson";
import { gradeAtom } from "@/app/atoms/preferences";
import { PredictionPayload, APIRoute } from "@/types";
import { shouldRegenerateAtom } from "../atoms/lesson";
import { boardAtom } from "@/app/atoms/preferences";
const ROUTE: APIRoute = "/api/predictionOnEdge";
import { subjectAtom } from "@/app/atoms/preferences";

export function usePrediction(node: string) {
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
    if (node == "") return;
    const payload: PredictionPayload = {
      action: "predictChapters",
      data: {
        subject: subject,
        grade: grade,
        board: board,
      },
    };
    console.log(payload);
    startGeneration(payload);
    setShouldRegenerate(false);
  };
  return {
    content: contentStream,
    startStreaming,
  };
}
