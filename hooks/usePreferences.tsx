import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "@/atoms/preferences";
import { useAtom } from "jotai";

export default function usePreferences() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);

  return { topic, subtopic, grade, board, subject };
}
