import { atom } from "jotai";

export const evalDrawerAtom = atom<boolean>(false);

export const newTaskModalAtom = atom<boolean>(false);

export const submitTestModalAtom = atom<boolean>(false);

export const showVideoModalAtom = atom<boolean>(false);

export const videoUrlAtom = atom<string>("");
