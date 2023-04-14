import { atom } from "jotai";
import { BlockContent } from "../../types";
type teachingAids = {
  name: string;
  content: string[];
};

type Aid = {
  id: string;
  name:
    | "lessonOutline"
    | "lessonPlan"
    | "slides"
    | "story"
    | "assessment"
    | "activity";
  content: string | string[];
};

export const lessonStreamCompletedAtom = atom(false);
export const lessonToDownloadAtom = atom<string[]>([]);
export const contentStreamAtom = atom<string[]>([]);
export const teachingAidsAtom = atom<teachingAids[]>([]);
export const visibleAidAtom = atom<string>("");
export const lessonIdeasAtom = atom<BlockContent[]>([]);
