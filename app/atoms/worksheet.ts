import { atom } from "jotai";
import { Questions, QuestionType } from "@/types";
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

export const savedQuestionsAtom = atom<Questions>([
  {
    type: "fillInTheBlanks",
    questions: [],
  },
  {
    type: "multipleChoiceSingleCorrect",
    questions: [],
  },
  {
    type: "trueFalse",
    questions: [],
  },
  {
    type: "shortAnswer",
    questions: [],
  },
  {
    type: "essay",
    questions: [],
  },
]);
