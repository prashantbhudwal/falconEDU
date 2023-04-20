import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useContentStream } from "./useContentStream";
import { v4 as uuid } from "uuid";
import {
  fetchedContentAtom,
  lessonIdeasAtom,
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "../atoms/lesson";
import { topicAtom, subtopicAtom, gradeAtom } from "@/app/atoms/preferences";
import { StreamPayload } from "@/types";
import { aidType } from "@/types";
import useLatestAid from "./useLatestAid";
import { shouldRegenerateAtom } from "../atoms/lesson";

export function useAid(aidType: aidType) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [fetchedContent] = useAtom(fetchedContentAtom);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);

  const { contentStream, startGeneration, currentStreamId, prevStreamId } =
    useContentStream();
  const latestAid = useLatestAid(aidType);

  const startStreaming = () => {
    if ((latestAid && !shouldRegenerate) || topic == "") return;
    if (aidType === "lesson" || "outline") {
      const payload: StreamPayload = {
        topic,
        subtopic,
        grade,
        data: aidType === "lesson" ? lessonIdeas : fetchedContent,
        payloadType: aidType,
      };
      console.log("startStreaming");
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
