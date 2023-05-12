import { atom } from "jotai";
import { QuestionType } from "@/types";
type CurrentQuestion = {
  questionType: QuestionType;
  bloomLevel: string;
  subtopic: string;
};

export const worksheetSubtopicsAtom = atom([""]);

export const currentQuestionAtom = atom<CurrentQuestion>({
  questionType: "fillInTheBlanks",
  bloomLevel: "",
  subtopic: "",
});
