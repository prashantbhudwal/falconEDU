import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../../../atoms/preferences";
import { IdeaStreamPayload } from "@/types";
import { ideaType } from "@/types";
import { useChat } from "ai/react";
import { useContentStream } from "@/hooks/useContentStream";

const ROUTE = "/api/falconStreamOnEdge";

export default function useFalconStream() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream(ROUTE);

  const startStreaming = function (blockType: ideaType) {
    const body: IdeaStreamPayload = {
      board: board,
      topic: topic,
      subject: subject,
      subtopic: subtopic,
      grade: grade,
      promptType: blockType,
    };
    startGeneration(body);
  };

  return {
    startStreaming,
    content: contentStream,
    currentStreamId,
    prevStreamId,
  };
}
