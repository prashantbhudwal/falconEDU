import { atom } from "jotai";
import { BlockContent, StreamPayload } from "../types";

type teachingAids = {
  name: string;
  content: string;
  id: string;
};

export const contentStreamAtom = atom<string[]>([]);
export const teachingAidsAtom = atom<teachingAids[]>([]);
export const visibleAidAtom = atom<StreamPayload["payloadType"]>("lesson");
export const lessonIdeasAtom = atom<BlockContent[]>([]);
export const contentStreamCompletedAtom = atom(true);
export const fetchedContentAtom = atom<string[]>([]);
export const shouldRegenerateAtom = atom(false);

export const currentStreamIdAtom = atom<string>("");
export const prevStreamIdAtom = atom<string>("");
