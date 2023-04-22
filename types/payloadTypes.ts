import { BlockContent } from "./blockTypes";
import { ideaType } from "./ideaTypes";
import { aidType } from "./ideaTypes";
export type StreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  data: BlockContent[] | string[];
  payloadType: aidType;
};

export type IdeaStreamPayload = {
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

export type PredictionAction = "predictChapters" | "predictSubtopics";
