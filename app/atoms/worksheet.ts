import { atom } from "jotai";
import { QuestionType } from "@/types";
import { Question } from "@/types";
type CurrentQuestion = {
  type: QuestionType;
  bloomLevel: string;
  subtopic: string;
};

export const worksheetSubtopicsAtom = atom([""]);

export const currentQuestionAtom = atom<CurrentQuestion>({
  type: "fillInTheBlanks",
  bloomLevel: "",
  subtopic: "",
});
