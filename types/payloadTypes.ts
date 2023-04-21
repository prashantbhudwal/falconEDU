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
  board: string;
  subject: string;
  grade: string;
  predictionType: string;
  predictionContent: string;
};
