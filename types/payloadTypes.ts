import { QuestionType, Question } from "./questionTypes";
import { BlockContent } from "./blockTypes";
import { ideaType } from "./ideaTypes";
import { aidType } from "./ideaTypes";
export type StreamPayload = {
  board: string;
  subject: string;
  topic: string;
  subtopic: string;
  grade: string;
  data: BlockContent[] | string[] | null;
  payloadType: aidType;
};

export type IdeaStreamPayload = {
  board: string;
  subject: string;
  topic: string;
  subtopic: string;
  grade: string;
  promptType: ideaType;
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
export type QuestionPayload = {
  action: QuestionAction;
  data: Question;
};

export type QuestionAction = "getQuestion";

export type PredictionAction = "predictChapters" | "predictSubtopics";
