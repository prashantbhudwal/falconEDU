import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import {
  lessonStreamCompletedAtom,
  lessonToDownloadAtom,
  contentStreamAtom,
  teachingAidsAtom,
  currentLessonAtom,
} from "@/app/atoms/lesson";
import { topicAtom, subtopicAtom, gradeAtom } from "@/app/atoms/preferences";
import fetchContentStream from "@/app/utils/fetchContentStream";

export function useContentStream() {
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const [lessonStreamCompleted, setLessonStreamCompleted] = useAtom(
    lessonStreamCompletedAtom
  );
  const [currentLesson] = useAtom(currentLessonAtom);
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade] = useAtom(gradeAtom);

  useEffect(() => {
    setContentStream([]);
    setLessonStreamCompleted(false);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchContentStream(
          (message: string) => {
            setContentStream((prevContent) => [...prevContent, message]);
          },
          { topic, subtopic, grade, ideaArray: currentLesson },
          () => setLessonStreamCompleted(true),
          () => setCurrentBlockId(uuid())
        );
      } catch (error) {
        setError("Error reading stream");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subtopic]);

  useEffect(() => {
    if (
      lessonStreamCompleted === true &&
      contentStream.length > 0 &&
      currentBlockId != lastBlockId
    ) {
      const randomId = uuid();
      setTeachingAids((prevAid) => [
        ...prevAid,
        {
          content: contentStream,
          id: randomId,
          name: "lessonPlan",
        },
      ]);
      setLastBlockId(currentBlockId);
      setLessonToDownload(contentStream);
    }
  }, [lessonStreamCompleted]);

  return {
    contentStream,
    lessonStreamCompleted,
  };
}
