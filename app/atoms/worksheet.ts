import { atom } from "jotai";
import { QuestionBank, QuestionType } from "@/types";
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

export const savedQuestionsAtom = atom<QuestionBank>([
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
  {
    type: "project",
    questions: [],
  },
  {
    type: "debate",
    questions: [],
  },
  {
    type: "brainstorming",
    questions: [],
  },
  {
    type: "groupDiscussion",
    questions: [],
  },
]);

export const isAdvancedModeAtom = atom(false);

export const worksheetAnswerKeyAtom = atom<string | string[]>([]);
