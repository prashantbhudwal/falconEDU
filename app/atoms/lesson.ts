import { atom } from "jotai";
import { BlockContent, StreamPayload } from "../../types";

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

export const contentStreamAtom = atom<string[]>([]);
export const teachingAidsAtom = atom<teachingAids[]>([]);
export const visibleAidAtom = atom<StreamPayload["payloadType"]>("lesson");
export const lessonIdeasAtom = atom<BlockContent[]>([]);
export const contentStreamCompletedAtom = atom(false);
export const fetchedContentAtom = atom<string[]>([]);
