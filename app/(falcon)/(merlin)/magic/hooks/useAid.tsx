import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useContentStream } from "@/hooks/useContentStream";
import { v4 as uuid } from "uuid";
import {
  fetchedContentAtom,
  lessonIdeasAtom,
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "@/atoms/lesson";
import { APIRoute, StreamPayload } from "@/types";
import { aidType } from "@/types";
import useLatestAid from "./useLatestAid";
import { shouldRegenerateAtom } from "@/atoms/lesson";
const ROUTE: APIRoute = "/api/contentStreamOnEdge";
import usePreferences from "@/hooks/usePreferences";

export function useAid(aidType: aidType) {
  const { topic, subtopic, grade, board, subject } = usePreferences();
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);

  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream(ROUTE);
  const latestAid = useLatestAid(aidType);
  const latestLesson = useLatestAid("lesson");

  const startStreaming = () => {
    if ((latestAid && !shouldRegenerate) || topic == "") return;
    if (
      aidType === "lesson" ||
      "outline" ||
      "blackboard" ||
      "shortVideoScript"
    ) {
      const payload: StreamPayload = {
        board,
        subject,
        topic,
        subtopic,
        grade,
        data:
          aidType === "lesson" || aidType === "shortVideoScript"
            ? lessonIdeas
            : latestLesson,
        payloadType: aidType,
      };
      startGeneration(payload);
      setShouldRegenerate(false);
    }
  };

  useEffect(() => {
    if (
      contentStreamCompleted === true &&
      contentStream.length > 0 &&
      currentStreamId != prevStreamId
    ) {
      const randomId = uuid();
      setTeachingAids((prevAid) => [
        ...prevAid,
        {
          content: contentStream,
          id: randomId,
          name: aidType,
        },
      ]);
    }
  }, [contentStreamCompleted]);

  return {
    content: contentStream,
    startStreaming,
  };
}
