import { lessonIdeasAtom } from "../atoms/lesson";
import { useAtom } from "jotai";
import { BlockContent } from "@/types";
export const teachingAids = [
  "lesson",
  "outline",
  "slides",
  "story",
  "activity",
  "quiz",
];
type Aid = {
  id: string;
  aid: string;
  content: string | string[];
};

const ideasToAids = (ideas: BlockContent[]): Aid[] => {
  return ideas.map(({ id, type, text }) => ({
    id,
    aid: type,
    content: text,
  }));
};
function getUniqueValues(arr: string[]) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
export default function useTeachingAids() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const aids = ideasToAids(lessonIdeas);
  let aidNames: string[] = [];
  aids.forEach((aid) => {
    if (aid.aid === "story") {
      aidNames.push(aid.aid);
    }
    if (aid.aid === "quiz") {
      aidNames.push(aid.aid);
    }
    if (aid.aid === "activity") {
      aidNames.push(aid.aid);
    }
  });
  aidNames = getUniqueValues(aidNames);

  if (aidNames.length === 0) {
    return ["lesson", "outline"];
  }
  return ["lesson", "outline", ...aidNames];
}
