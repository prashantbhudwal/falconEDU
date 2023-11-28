import { atomFamily } from "jotai/utils";
import { atom } from "jotai";

export const configPublishingStateAtom = atomFamily((testId: string) =>
  atom({
    disablePublishing: false,
  })
);
