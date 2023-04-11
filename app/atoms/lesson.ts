import { atom } from "jotai";
import { BlockContent } from "../types";

export const currentLessonAtom = atom<BlockContent[]>([]);
export const lessonStreamCompletedAtom = atom(false);
export const lessonToDownloadAtom = atom<string[]>([]);
