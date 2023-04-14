import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useContentStream } from "./useContentStream";
import { lessonToDownloadAtom, lessonIdeasAtom } from "../atoms/lesson";
import { topicAtom, subtopicAtom, gradeAtom } from "@/app/atoms/preferences";
import { StreamPayload } from "@/types";

export function useAid(aidType: "lesson" | "outline") {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);

  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [fetchNow, setFetchNow] = useState(false);
  const [lessonToDownload] = useAtom(lessonToDownloadAtom);
  const [payload, setPayload] = useState<StreamPayload>({
    topic: "",
    subtopic: "",
    grade: "",
    data: [],
    payloadType: aidType,
  });

  useEffect(() => {
    if (aidType === "lesson" || "outline") {
      setFetchNow(true);
      setPayload({
        topic,
        subtopic,
        grade,
        data: lessonIdeas,
        payloadType: aidType,
      });
    } else {
      setFetchNow(false);
    }
  }, [lessonIdeas, grade, topic, subtopic, aidType]);

  const { contentStream, contentStreamCompleted } = useContentStream(
    fetchNow,
    payload
  );

  return {
    content: contentStreamCompleted ? lessonToDownload : contentStream,
  };
}
