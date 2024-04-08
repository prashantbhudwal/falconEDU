import { atom } from "jotai";

export const startedAtom = atom(false);
export const userFlowAtom = atom("");

export const backBarAtom = atom({
  title: "",
  url: "",
});
