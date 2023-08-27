import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "@/lib/atoms/preferences";
import { useAtom } from "jotai";
import { worksheetSubtopicsAtom } from "@/lib/atoms/worksheet";

export default function usePreferences() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [worksheetSubtopics] = useAtom(worksheetSubtopicsAtom);

  return { topic, subtopic, grade, board, subject, worksheetSubtopics };
}
