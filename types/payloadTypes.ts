import { QuestionType, QuestionItem, QuestionBank } from "./questionTypes";
import { BlockContent } from "./blockTypes";
import { ideaType } from "./ideaTypes";
import { aidType } from "./ideaTypes";
export type StreamPayload = {
  board: string;
  subject: string;
  topic: string;
  subtopic: string;
  grade: string;
  prompt: string;
  payloadType: aidType;
};

export type IdeaStreamPayload = {
  board: string;
  subject: string;
  topic: string;
  subtopic: string;
  grade: string;
  prompt: ideaType;
};

export type PredictionPayload = {
  action: PredictionAction;
  data: {
    board: string;
    grade: string;
    subject: string;
    topic?: string;
    subtopic?: string;
  };
};

export type PredictionAction = "predictChapters" | "predictSubtopics";

export type QuestionPayload = {
  action: QuestionAction;
  data: QuestionItem;
  generatedQuestions: QuestionItem[];
  batchSize: number;
};

export type QuestionAction = "getQuestion";

export type QuestionBankPayload = {
  action: QuestionBankAction;
  data: QuestionBank;
};

export type QuestionBankAction = "generateAnswers";

export type ContentStreamPayload =
  | StreamPayload
  | PredictionPayload
  | QuestionPayload
  | QuestionBankPayload
  | IdeaStreamPayload;
