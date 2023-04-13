import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { topicAtom, subjectAtom, gradeAtom } from "../atoms/preferences";
import { currentLessonAtom } from "../atoms/lesson";
import fetchContentStream from "../utils/fetchContentStream";

export default function useContentStream(
  onMessage: (message: string) => void,
  fetchNow: boolean,
  fetchComplete: () => void,
  streamComplete: () => void,
  setCurrentBlockId: () => void
) {
  const [isLoading, setIsLoading] = useState(!fetchNow);
  const [error, setError] = useState<string | null>(null);
  const onMessageRef = useRef(onMessage);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);
  const [currentLesson] = useAtom(currentLessonAtom);

  const body = {
    topic: topic,
    subtopic: subtopic,
    grade: grade,
    ideaArray: currentLesson,
  };

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    setIsLoading(fetchNow);
  }, [fetchNow]);

  useEffect(() => {
    if (fetchNow) {
      const fetchData = async () => {
        try {
          await fetchContentStream(
            onMessageRef.current,
            body,
            streamComplete,
            setCurrentBlockId
          );
        } catch (error) {
          setError("Error reading stream");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      fetchComplete();
    }
  }, [fetchNow]);

  return { isLoading, error };
}
