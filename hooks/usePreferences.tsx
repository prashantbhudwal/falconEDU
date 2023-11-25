import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "@/lib/atoms/preferences";
import { useAtom } from "jotai";
import { subtopicsAtom } from "@/lib/atoms/preferences";

export default function usePreferences() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [subtopics] = useAtom(subtopicsAtom);

  return { topic, subtopic, grade, board, subject, subtopics };
}
