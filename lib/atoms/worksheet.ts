import { atom } from "jotai";
import { QuestionBank, QuestionType } from "../../types";

type CurrentQuestion = {
  type: QuestionType;
  bloomLevel: string;
  subtopic: string;
};

export const currentQuestionAtom = atom<CurrentQuestion>({
  type: "multipleChoiceSingleCorrect",
  bloomLevel: "",
  subtopic: "",
});

export const savedQuestionsAtom = atom<QuestionBank>([
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
export const batchSizeAtom = atom(1);

export const checkedQuestionTypesAtom = atom<QuestionType[]>([
  "multipleChoiceSingleCorrect",
]);
