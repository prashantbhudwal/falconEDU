import { useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import { lessonIdeasAtom, teachingAidsAtom } from "@/lib/atoms/lesson";
import { APIRoute, StreamPayload } from "@/types";
import { aidType } from "@/types";
import useLatestAid from "./useLatestAid";
const ROUTE: APIRoute = "/api/contentStreamOnEdge";
import usePreferences from "@/hooks/usePreferences";
import { useCompletion } from "ai/react";
export function useAid(aidType: aidType) {
  const { topic, subtopic, subtopics, grade, board, subject } =
    usePreferences();
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
      subtopics: subtopics,
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
    isLoading,
  };
}
