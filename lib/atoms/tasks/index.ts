import { atom } from "jotai";

export const currentFormAtom = atom({
  save: () => Promise.resolve(),
  hasUnsavedChanges: false,
});
