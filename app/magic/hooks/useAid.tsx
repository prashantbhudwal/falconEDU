import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useContentStream } from "@/app/hooks/useContentStream";
import { v4 as uuid } from "uuid";
import {
  fetchedContentAtom,
  lessonIdeasAtom,
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "@/app/atoms/lesson";
import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "@/app/atoms/preferences";
import { APIRoute, StreamPayload } from "@/types";
import { aidType } from "@/types";
import useLatestAid from "./useLatestAid";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";
const ROUTE: APIRoute = "/api/contentStreamOnEdge";

export function useAid(aidType: aidType) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
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
      // console.log(latestLesson);
      // console.log(payload);
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
