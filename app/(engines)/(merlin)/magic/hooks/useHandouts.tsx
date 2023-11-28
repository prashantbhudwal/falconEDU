import { lessonIdeasAtom } from "@/lib/atoms/lesson";
import { useAtom } from "jotai";
import { BlockContent } from "@/types";
import { handoutType } from "@/types";

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
function getUniqueValues(arr: handoutType[]) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
export default function useHandouts() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const aids = ideasToAids(lessonIdeas);
  let aidNames: handoutType[] = [];
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
    return [];
  }
  return aidNames;
}
