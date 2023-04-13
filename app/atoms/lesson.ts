import { atom } from "jotai";
import { BlockContent } from "../../types";

export const lessonStreamCompletedAtom = atom(false);
export const lessonToDownloadAtom = atom<string[]>([]);
export const lessonIdeasAtom = atom<BlockContent[]>([]);