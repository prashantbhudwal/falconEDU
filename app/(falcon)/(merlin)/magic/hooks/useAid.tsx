import { useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import {
  lessonIdeasAtom,
  teachingAidsAtom,
} from "@/atoms/lesson";
import { APIRoute, StreamPayload } from "@/types";
import { aidType } from "@/types";
import useLatestAid from "./useLatestAid";
const ROUTE: APIRoute = "/api/contentStreamOnEdge";
import usePreferences from "@/hooks/usePreferences";
import { useCompletion } from "ai/react";
export function useAid(aidType: aidType) {
  const { topic, subtopic, grade, board, subject } = usePreferences();
  const [lessonIdeas] = useAtom(lessonIdeasAtom);

  const [__, setTeachingAids] = useAtom(teachingAidsAtom);
  const latestAid = useLatestAid(aidType);
  const latestLesson = useLatestAid("lesson");

  const {
    completion,
    complete: handleCompletion,
    isLoading,
  } = useCompletion({
    api: ROUTE,
    body: {
      board: board,
      topic: topic,
      subject: subject,
      subtopic: subtopic,
      grade: grade,
      payloadType: aidType,
    },
    onFinish: (prompt, completion) => {
      setTeachingAids((prevAid) => [
        ...prevAid,
        {
          content: completion,
          id: uuid(),
          name: aidType,
        },
      ]);
    },
  });
console.log(completion);
  const startStreaming = () => {
    if (latestAid || topic == "") return;
    if (
      aidType === "lesson" ||
      "outline" ||
      "blackboard" ||
      "shortVideoScript"
    ) {
      const payload =
        aidType === "lesson" || aidType === "shortVideoScript"
          ? lessonIdeas
          : latestLesson; 
      const payLoadString = JSON.stringify(payload);
      handleCompletion(payLoadString);
    }
  };

  return {
    content: completion,
    startStreaming,
    isLoading
  };
}
