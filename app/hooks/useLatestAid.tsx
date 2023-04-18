import { useAtom } from "jotai";
import { teachingAidsAtom } from "../atoms/lesson";
import { aidType } from "@/types";
interface Content {
  content: string[];
  id: string;
  name: string;
}

function findLatestContent(arr: Content[], name: string): Content | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].name === name) {
      return arr[i];
    }
  }
  return null; // If no content with the given name is found
}

export default function useLatestAid(aidType: aidType): string[] | null {
  const [teachingAids] = useAtom(teachingAidsAtom);
  const latestAid = findLatestContent(teachingAids, aidType);

  if (latestAid) {
    return latestAid.content;
  } else {
    return null;
  }
}
